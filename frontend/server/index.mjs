import http from 'node:http';
import { URL } from 'node:url';

const port = Number(process.env.PORT || 8787);
const key = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify(data));}
function prompt({text,language,wardId}) {
  return `You are CivicSignal AI, a public-sector decision-support assistant. Analyse this citizen development request without making an official government decision. Return strict JSON with language, translatedText, category, subCategory, severity (low|medium|high), urgency (1-10), wardId, wardName, similarCount, clusterId, affectedPopulation, summary, status. Request language: ${language}. Ward: ${wardId}. Text: ${text}`;
}
const server=http.createServer(async (req,res)=>{
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'});return res.end();}
  if(req.method!=='POST' || new URL(req.url,'http://localhost').pathname!=='/api/ai/analyse') return send(res,404,{error:'Not found'});
  if(!key) return send(res,503,{error:'GEMINI_API_KEY is not configured'});
  let body=''; req.on('data',c=>body+=c); req.on('end',async()=>{
    try{
      const input=JSON.parse(body);
      const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contents:[{parts:[{text:prompt(input)}]}],generationConfig:{responseMimeType:'application/json'}})
      });
      const data=await r.json();
      if(!r.ok) return send(res,r.status,{error:data.error?.message||'Gemini request failed'});
      const text=data.candidates?.[0]?.content?.parts?.[0]?.text;
      return send(res,200,JSON.parse(text));
    }catch(error){ return send(res,500,{error:error.message}); }
  });
});
server.listen(port,()=>console.log(`CivicSignal AI server listening on http://localhost:${port}`));
