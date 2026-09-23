import React from 'react';
import { Link } from 'react-router-dom';
export const NotFoundPage:React.FC=()=> <main style={{padding:'80px 24px',maxWidth:700,margin:'auto'}}><span className="section-label">404</span><h1>Page not found</h1><p className="muted">The CivicSignal route you requested does not exist.</p><Link to="/" className="btn btn-primary">Return to CivicSignal</Link></main>;
