import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Languages, MapPin, Mic, Send, Sparkles, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyseCitizenRequest, transcribeVoiceRequest } from '../services/ai';
import { reportsApi, SubmittedReport } from '../services/reportsApi';
import { AnalysisResult, CivicLanguage, CivicSeverity } from '../types/civic';
import { VoiceRecorder } from '../components/request/VoiceRecorder';
import { MediaUpload, SelectedMedia } from '../components/request/MediaUpload';
import { useAuth } from '../context/AuthContext';

const labels:Record<CivicLanguage,string>={en:'English',bn:'বাংলা',hi:'हिन्दी'};
const examples:Record<CivicLanguage,string>={en:'There is severe waterlogging near our school and the road becomes difficult to use during rain.',bn:'আমাদের এলাকায় বৃষ্টির সময় প্রচুর জল জমে যায় এবং রাস্তা দিয়ে চলাচল করা কঠিন।',hi:'हमारे इलाके में बारिश के दौरान बहुत पानी जमा हो जाता है और सड़क पर चलना मुश्किल हो जाता है।'};

interface WardMeta { id:string; label:string; state:string; district:string; }
const wards:WardMeta[]=[
  {id:'WARD-12',label:'Ballygunge · Ward 12',state:'West Bengal',district:'Kolkata'},
  {id:'WARD-01',label:'Salt Lake · Ward 01',state:'West Bengal',district:'Kolkata'},
  {id:'WARD-02',label:'New Town · Ward 02',state:'West Bengal',district:'Kolkata'},
  {id:'WARD-07',label:'Behala East · Ward 07',state:'West Bengal',district:'Kolkata'},
  {id:'WARD-10',label:'Garia · Ward 10',state:'West Bengal',district:'Kolkata'},
];

const urgencyScore:Record<SubmittedReport['urgency'],number>={low:3,medium:5,high:8,critical:10};
const urgencySeverity:Record<SubmittedReport['urgency'],CivicSeverity>={low:'low',medium:'medium',high:'high',critical:'high'};

// Adapts a persisted backend Report into the shape SubmissionStatusPage
// already knows how to render, so the live path can reuse it as-is.
function reportToAnalysisResult(report:SubmittedReport, ward:WardMeta, fallbackLang:CivicLanguage):AnalysisResult{
  const language=(['en','bn','hi'] as const).includes(report.originalLanguage as CivicLanguage)?(report.originalLanguage as CivicLanguage):fallbackLang;
  return {
    requestId: report._id,
    language,
    translatedText: report.englishText,
    category: report.category,
    subCategory: report.subcategory,
    severity: urgencySeverity[report.urgency],
    urgency: urgencyScore[report.urgency],
    wardId: ward.id,
    wardName: ward.label.split(' · ')[0],
    similarCount: 0,
    clusterId: report._id.slice(-6).toUpperCase(),
    affectedPopulation: 0,
    summary: report.summary,
    status: report.processingStatus,
  };
}

const isRealMode = (import.meta.env.VITE_AI_MODE || 'demo') === 'real';

export const CitizenRequestPage:React.FC=()=>{
 const nav=useNavigate(); const {user,loading:authLoading,logout}=useAuth();
 const [lang,setLang]=useState<CivicLanguage>('bn'); const [text,setText]=useState(examples.bn); const [mode,setMode]=useState<'text'|'voice'>('text'); const [wardId,setWardId]=useState('WARD-12'); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
 const [transcribing,setTranscribing]=useState(false); const [hasVoiceTranscript,setHasVoiceTranscript]=useState(false); const [voiceBlob,setVoiceBlob]=useState<Blob|null>(null); const [mediaFiles,setMediaFiles]=useState<SelectedMedia[]>([]);

 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();
  if(mode==='voice'&&isRealMode){
    if(!voiceBlob){setError('Please record your request first.');return;}
  }else if(!text.trim()){
    setError(mode==='voice'?'Please record your request first.':'Please describe the development need.');
    return;
  }
  if(isRealMode&&!user){setError('Please sign in to submit to the live system.');return;}
  setBusy(true);setError('');
  try{
    const ward=wards.find(w=>w.id===wardId) || wards[0];
    if(isRealMode){
      // POST /api/reports/text or POST /api/reports/voice
      const report = mode==='voice' && voiceBlob
        ? await reportsApi.submitVoice(voiceBlob,{state:ward.state,district:ward.district})
        : await reportsApi.submitText(text,{state:ward.state,district:ward.district});

      if (mediaFiles.length) {
        await reportsApi.uploadMedia(
          report._id,
          mediaFiles.map(item => item.file)
        );
      }

      const result=reportToAnalysisResult(report,ward,lang);
      sessionStorage.setItem('civicsignal:lastAnalysis',JSON.stringify(result));
      nav('/submit/'+report._id);
    }else{
      const result=await analyseCitizenRequest(text,lang,wardId);
      sessionStorage.setItem('civicsignal:lastAnalysis',JSON.stringify(result));
      nav('/submit/'+result.requestId);
    }
  }catch(err){
    setError(err instanceof Error?err.message:'Submission failed.');
  }finally{
    setBusy(false);
  }
 };

 const handleAudioRecorded=async(blob:Blob)=>{
  setError('');setVoiceBlob(blob);setTranscribing(true);
  try{
    // Live preview only: /api/reports/voice re-transcribes the audio itself
    // on submit, so edits here are for the citizen's own confidence check.
    const transcript=await transcribeVoiceRequest(blob,lang);
    setText(transcript);setHasVoiceTranscript(true);
  }catch(err){
    setError(err instanceof Error?err.message:'Could not transcribe the recording.');
  }finally{
    setTranscribing(false);
  }
 };
 const handleClearAudio=()=>{setHasVoiceTranscript(false);setVoiceBlob(null);setText('');setError('');};

 return <div className="citizen-page">
  <header className="citizen-header">
   <Link to="/" className="brand"><span className="brand-mark">CS</span><span><strong>CivicSignal AI</strong><small>Citizen Portal</small></span></Link>
   <div className="demo-chip">{isRealMode?'LIVE BACKEND':'DEMO ENVIRONMENT'}</div>
   <div style={{display:'flex',alignItems:'center',gap:14}}>
    {isRealMode&&!authLoading&&(user
      ? <span className="text-link" style={{display:'flex',alignItems:'center',gap:6}}>{user.name}<button type="button" onClick={()=>logout()} title="Sign out" style={{display:'inline-flex',alignItems:'center'}}><LogOut size={13}/></button></span>
      : <Link to={`/login?next=/submit`} className="text-link">Sign in</Link>
    )}
    <Link to="/government" className="text-link">Government Command Center →</Link>
   </div>
  </header>
  <main className="citizen-shell">
   <div className="back-row"><Link to="/" className="back-link"><ArrowLeft size={15}/> Back to CivicSignal</Link></div>
   <div className="citizen-layout">
    <section className="citizen-intro"><div className="eyebrow">CITIZEN VOICE</div><h1>Tell us what your community needs.</h1><p>Your message is transformed into a structured development signal so patterns across neighbourhoods can be understood.</p><div className="mini-proof"><div><CheckCircle2/><span><b>{isRealMode?'Sign-in required':'No login required'}</b>{isRealMode?'Live submissions are saved to your account':'Demo submission only'}</span></div><div><Languages/><span><b>Multilingual</b>English · বাংলা · हिन्दी</span></div><div><Sparkles/><span><b>AI-assisted analysis</b>Recommendations are not official decisions</span></div></div></section>
    <section className="intake-card">
      <div className="card-top"><div><span className="section-label">SUBMIT A DEVELOPMENT NEED</span><h2>What is happening?</h2></div><span className="step-pill">1 / 2</span></div>
      {isRealMode&&!authLoading&&!user&&(
        <div className="form-error" style={{marginTop:14}}>
          You need to sign in to submit to the live backend. <Link to="/login?next=/submit" className="text-link">Sign in or create an account →</Link>
        </div>
      )}
      <div className="mode-switch"><button className={mode==='text'?'active':''} onClick={()=>{setMode('text');setError('');if(!text.trim())setText(examples[lang]);}}><span>Type</span></button><button className={mode==='voice'?'active':''} onClick={()=>{setMode('voice');setError('');if(!hasVoiceTranscript)setText('');}}><Mic size={15}/> Speak</button></div>
      <form onSubmit={submit}>
       {mode==='text'?<textarea value={text} onChange={e=>setText(e.target.value)} placeholder={examples[lang]} rows={7} aria-label="Describe your development need"/>:
       <div className="voice-box space-y-3">
         <VoiceRecorder
           onAudioRecorded={handleAudioRecorded}
           onClearAudio={handleClearAudio}
           onFallbackToText={()=>{setMode('text');setError('');}}
           disabled={busy||transcribing}
         />
         {transcribing&&<p className="text-xs text-brand-text-muted text-center">Transcribing your recording…</p>}
         {hasVoiceTranscript&&!transcribing&&(
           <div>
             <label htmlFor="voice-transcript" className="text-xs font-semibold text-brand-text-muted">Transcribed text{isRealMode?' preview':' — edit if needed'}</label>
             <textarea id="voice-transcript" value={text} onChange={e=>setText(e.target.value)} rows={4} readOnly={isRealMode} className="w-full mt-1 p-3 text-sm bg-white border border-brand-border rounded-lg text-brand-text"/>
             {isRealMode&&<p className="text-xs text-brand-text-muted mt-1">This is a preview only — the final transcription happens on the backend when you submit.</p>}
           </div>
         )}
       </div>}
       <MediaUpload
         files={mediaFiles}
         onChange={setMediaFiles}
         disabled={busy || transcribing || (isRealMode && !user)}
       />
       <div className="input-grid"><label>Language<select value={lang} onChange={e=>{const l=e.target.value as CivicLanguage;setLang(l);if(mode==='text')setText(examples[l]);}}>{Object.entries(labels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><label>{isRealMode?'Location':'Demo location'}<select value={wardId} onChange={e=>setWardId(e.target.value)}>{wards.map(w=><option key={w.id} value={w.id}>{w.label}</option>)}</select></label></div>
       <div className="privacy-note"><MapPin size={15}/><span>{isRealMode?'Location maps to a state/district pair sent to the backend.':'Location is a simulated demo selection. No personal identifier is collected.'}</span></div>
       {error&&<div className="form-error">{error}</div>}
       <button className="btn btn-primary btn-lg full" disabled={busy||transcribing||(isRealMode&&!authLoading&&!user)||(mode==='voice'&&!isRealMode&&!text.trim())||(mode==='voice'&&isRealMode&&!voiceBlob)}>{busy?'Submitting…':<>Analyse My Request <Send size={16}/></>}</button>
      </form>
    </section>
   </div>
  </main>
 </div>
}
