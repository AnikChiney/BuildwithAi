import { AnalysisResult, CivicLanguage } from '../types/civic';
import { civicData } from './civicData';

export async function analyseCitizenRequest(text:string, language:CivicLanguage, wardId:string): Promise<AnalysisResult> {
  const mode = import.meta.env.VITE_AI_MODE || 'demo';
  if (mode !== 'real') return civicData.analyse(text, language, wardId);
  const response = await fetch(`${import.meta.env.VITE_AI_API_URL || 'http://localhost:8787'}/api/ai/analyse`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({text, language, wardId})
  });
  if (!response.ok) throw new Error('Real AI service is unavailable. Switch to Demo Mode.');
  return response.json();
}
