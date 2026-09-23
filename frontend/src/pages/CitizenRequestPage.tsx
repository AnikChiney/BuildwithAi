import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Languages, MapPin, Mic, Send, Sparkles, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyseCitizenRequest } from '../services/ai';
import { CivicLanguage } from '../types/civic';

const labels:Record<CivicLanguage,string>={en:'English',bn:'বাংলা',hi:'हिन्दी'};
const examples:Record<CivicLanguage,string>={en:'There is severe waterlogging near our school and the road becomes difficult to use during rain.',bn:'আমাদের এলাকায় বৃষ্টির সময় প্রচুর জল জমে যায় এবং রাস্তা দিয়ে চলাচল করা কঠিন।',hi:'हमारे इलाके में बारिश के दौरान बहुत पानी जमा हो जाता है और सड़क पर चलना मुश्किल हो जाता है।'};

export const CitizenRequestPage:React.FC=()=>{
 const nav=useNavigate(); const [lang,setLang]=useState<CivicLanguage>('bn'); const [text,setText]=useState(examples.bn); const [mode,setMode]=useState<'text'|'voice'>('text'); const [ward,setWard]=useState('WARD-12'); const [recording,setRecording]=useState(false); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
 const submit=async(e:React.FormEvent)=>{e.preventDefault();if(!text.trim()){setError('Please describe the development need.');return;}setBusy(true);setError('');try{const result=await analyseCitizenRequest(text,lang,ward);sessionStorage.setItem('civicsignal:lastAnalysis',JSON.stringify(result));nav('/submit/'+result.requestId);}catch(err){setError(err instanceof Error?err.message:'Analysis failed.');}finally{setBusy(false);}};
 return <div className="citizen-page">
  <header className="citizen-header"><Link to="/" className="brand"><span className="brand-mark">CS</span><span><strong>CivicSignal AI</strong><small>Citizen Portal</small></span></Link><div className="demo-chip">DEMO ENVIRONMENT</div><Link to="/government" className="text-link">Government Command Center →</Link></header>
  <main className="citizen-shell">
   <div className="back-row"><Link to="/" className="back-link"><ArrowLeft size={15}/> Back to CivicSignal</Link></div>
   <div className="citizen-layout">
    <section className="citizen-intro"><div className="eyebrow">CITIZEN VOICE</div><h1>Tell us what your community needs.</h1><p>Your message is transformed into a structured development signal so patterns across neighbourhoods can be understood.</p><div className="mini-proof"><div><CheckCircle2/><span><b>No login required</b>Demo submission only</span></div><div><Languages/><span><b>Multilingual</b>English · বাংলা · हिन्दी</span></div><div><Sparkles/><span><b>AI-assisted analysis</b>Recommendations are not official decisions</span></div></div></section>
    <section className="intake-card">
      <div className="card-top"><div><span className="section-label">SUBMIT A DEVELOPMENT NEED</span><h2>What is happening?</h2></div><span className="step-pill">1 / 2</span></div>
      <div className="mode-switch"><button className={mode==='text'?'active':''} onClick={()=>setMode('text')}><span>Type</span></button><button className={mode==='voice'?'active':''} onClick={()=>setMode('voice')}><Mic size={15}/> Speak</button></div>
      <form onSubmit={submit}>
       {mode==='text'?<textarea value={text} onChange={e=>setText(e.target.value)} placeholder={examples[lang]} rows={7} aria-label="Describe your development need"/>:
       <div className="voice-box"><button type="button" className={recording?'recording voice-btn':'voice-btn'} onClick={()=>setRecording(!recording)}>{recording?<Square size={22}/>:<Mic size={26}/>}<strong>{recording?'Stop recording':'Start voice recording'}</strong><span>{recording?'Recording in demo mode…':'Microphone permission is not required in demo mode.'}</span></button></div>}
       <div className="input-grid"><label>Language<select value={lang} onChange={e=>{const l=e.target.value as CivicLanguage;setLang(l);setText(examples[l]);}}>{Object.entries(labels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><label>Demo location<select value={ward} onChange={e=>setWard(e.target.value)}><option value="WARD-12">Ballygunge · Ward 12</option><option value="WARD-01">Salt Lake · Ward 01</option><option value="WARD-02">New Town · Ward 02</option><option value="WARD-07">Behala East · Ward 07</option><option value="WARD-10">Garia · Ward 10</option></select></label></div>
       <div className="privacy-note"><MapPin size={15}/><span>Location is a simulated demo selection. No personal identifier is collected.</span></div>
       {error&&<div className="form-error">{error}</div>}
       <button className="btn btn-primary btn-lg full" disabled={busy}>{busy?'Analysing…':<>Analyse My Request <Send size={16}/></>}</button>
      </form>
    </section>
   </div>
  </main>
 </div>
}
