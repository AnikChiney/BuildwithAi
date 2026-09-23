import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, MapPinned, Mic, ShieldCheck, BarChart3, Languages } from 'lucide-react';

const steps=[['01','Citizens speak','Voice, text and language-aware intake'],['02','AI understands','Classify, translate and structure development demand'],['03','Demand clusters emerge','Related reports become geographic signals'],['04','Infrastructure gaps surface','Demand is compared with context and investment'],['05','Evidence reaches decision-makers','Explainable project recommendations, not opaque decisions']];

export const LandingPage: React.FC=()=>(
  <div className="landing">
    <div className="demo-banner">DEMO ENVIRONMENT <span>• Data shown is simulated for demonstration.</span></div>
    <section className="hero shell">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot"/> AI FOR DIGITAL PUBLIC INFRASTRUCTURE & GOVERNANCE</div>
        <h1>Turning citizen voice into <span>evidence</span> for better public infrastructure.</h1>
        <p>A multilingual civic demand intelligence platform that transforms fragmented citizen development requests into geographic demand signals, infrastructure-gap analysis and explainable planning insights.</p>
        <div className="hero-actions">
          <Link to="/submit" className="btn btn-primary btn-lg">Report a Need <ArrowRight size={17}/></Link>
          <Link to="/government" className="btn btn-secondary btn-lg"><BarChart3 size={17}/> Explore Government Dashboard</Link>
        </div>
        <div className="trust-row"><ShieldCheck size={17}/> Decision-support only · transparent methodology · simulated demo data</div>
      </div>
      <div className="hero-panel">
        <div className="panel-kicker">CITIZEN VOICE → PUBLIC INVESTMENT INTELLIGENCE</div>
        <div className="signal-flow">
          {['Citizen voice','Multilingual AI','Demand clusters','Gap analysis','Priority evidence'].map((x,i)=><React.Fragment key={x}><div className="flow-node"><span>0{i+1}</span>{x}</div>{i<4&&<ArrowRight className="flow-arrow" size={16}/>}</React.Fragment>)}
        </div>
        <div className="hero-stat-grid"><div><strong>128+</strong><span>synthetic requests</span></div><div><strong>20</strong><span>demo wards</span></div><div><strong>3</strong><span>languages</span></div></div>
      </div>
    </section>

    <section className="section shell">
      <div className="section-heading"><div><div className="eyebrow">HOW IT WORKS</div><h2>From fragmented voice to a defensible planning signal.</h2></div><p>The product is designed around aggregation, geography, context and explainability—not a generic complaint inbox.</p></div>
      <div className="step-grid">{steps.map(([n,title,desc])=><div className="step-card" key={n}><span className="step-no">{n}</span><h3>{title}</h3><p>{desc}</p></div>)}</div>
    </section>

    <section className="section section-soft">
      <div className="shell feature-grid">
        <div className="feature-card"><div className="icon-box"><Mic/></div><h3>Multilingual citizen portal</h3><p>Text or voice intake with English, Bengali and Hindi in the demo. The data model is language-extensible for BRICS-scale deployments.</p></div>
        <div className="feature-card"><div className="icon-box"><MapPinned/></div><h3>Geographic demand intelligence</h3><p>Requests aggregate into ward-level demand clusters and map hotspots so decision-makers can see where signals concentrate.</p></div>
        <div className="feature-card"><div className="icon-box"><BrainCircuit/></div><h3>Explainable priority model</h3><p>Citizen demand, severity, population impact, infrastructure gap, vulnerability and investment gap are shown as separate factors.</p></div>
        <div className="feature-card"><div className="icon-box"><Languages/></div><h3>Evidence, not opaque automation</h3><p>AI supplies analysis and recommendations. The interface makes assumptions, simulated data and limitations visible.</p></div>
      </div>
    </section>

    <footer className="landing-footer"><div className="shell footer-inner"><div><strong>CivicSignal AI</strong><span>Turning citizen voice into evidence for better public infrastructure.</span></div><Link to="/government">Open Command Center →</Link></div></footer>
  </div>
);
