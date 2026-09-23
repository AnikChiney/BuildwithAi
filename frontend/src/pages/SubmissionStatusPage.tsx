import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, CircleDot, Globe2, Sparkles } from 'lucide-react';
import { civicData } from '../services/civicData';
import { AnalysisResult } from '../types/civic';

export const SubmissionStatusPage:React.FC=()=>{
 const {requestId}=useParams(); const stored=sessionStorage.getItem('civicsignal:lastAnalysis'); const result:AnalysisResult=stored?JSON.parse(stored):civicData.analyse('Waterlogging near school','bn','WARD-12');
 const stages=['Submitted','Analysed','Clustered','Under Review','Planned','Resolved']; const active=2;
 return <div className="citizen-page"><header className="citizen-header"><Link to="/" className="brand"><span className="brand-mark">CS</span><span><strong>CivicSignal AI</strong><small>Citizen Portal</small></span></Link><div className="demo-chip">DEMO ENVIRONMENT</div><Link to="/government" className="text-link">Government Command Center →</Link></header>
 <main className="status-shell"><div className="status-success"><CheckCircle2/><div><span>REQUEST RECEIVED</span><h1>Your voice has been converted into a development signal.</h1><p>Reference <b>{requestId||result.requestId}</b> · Status: {result.status}</p></div></div>
 <div className="status-grid"><section className="status-card"><div className="card-top"><div><span className="section-label">WHAT THE SYSTEM UNDERSTOOD</span><h2>AI request analysis</h2></div><span className="demo-chip">DEMO AI</span></div>
 <div className="analysis-original"><span>Original request · {result.language==='bn'?'Bengali':result.language==='hi'?'Hindi':'English'}</span><p>{result.language==='bn'?'আমাদের এলাকায় বৃষ্টির সময় প্রচুর জল জমে যায় এবং রাস্তা দিয়ে চলাচল করা কঠিন।':result.translatedText}</p></div>
 <div className="analysis-grid"><div><span>Category</span><strong>{result.category}</strong><small>{result.subCategory}</small></div><div><span>Severity</span><strong className="severity-high">{result.severity.toUpperCase()}</strong><small>Urgency {result.urgency}/10</small></div><div><span>Location</span><strong>{result.wardName}</strong><small>Ward {result.wardId.replace('WARD-','')}</small></div><div><span>Related reports</span><strong>{result.similarCount}</strong><small>same-area signals</small></div></div>
 <div className="evidence-callout"><Sparkles size={17}/><div><strong>Why it matters</strong><p>{result.summary}</p></div></div></section>
 <aside className="status-card timeline-card"><span className="section-label">TRANSPARENCY</span><h2>Request journey</h2><div className="timeline">{stages.map((s,i)=><div className={i<=active?'timeline-step done':'timeline-step'} key={s}><span>{i<active?<CheckCircle2 size={16}/>:i===active?<CircleDot size={16}/>:<span className="timeline-dot"/>}</span><div><b>{s}</b>{i===active&&<small>Demand cluster {result.clusterId} identified</small>}</div></div>)}</div><div className="notice"><Globe2 size={16}/><span>The AI analysis supports evidence gathering. It does not guarantee government action.</span></div></aside></div>
 <div className="status-actions"><Link to="/submit" className="btn btn-secondary">Submit another request</Link><Link to="/government" className="btn btn-primary">Explore demand hotspots <ArrowRight size={16}/></Link></div></main></div>
}
