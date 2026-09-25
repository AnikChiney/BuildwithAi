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

const demoTranscripts: Record<CivicLanguage, string> = {
  en: 'There is severe waterlogging near our school and the road becomes difficult to use during rain.',
  bn: 'আমাদের এলাকায় বৃষ্টির সময় প্রচুর জল জমে যায় এবং রাস্তা দিয়ে চলাচল করা কঠিন।',
  hi: 'हमारे इलाके में बारिश के दौरान बहुत पानी जमा हो जाता है और सड़क पर चलना मुश्किल हो जाता है।',
};

// Turns a recorded voice clip into editable text.
// Demo mode simulates speech-to-text (no key/backend required) so the
// citizen intake flow can be tried end-to-end without any setup.
// Real mode sends the audio to the backend, which transcribes it with Gemini.
export async function transcribeVoiceRequest(audioBlob: Blob, language: CivicLanguage): Promise<string> {
  const mode = import.meta.env.VITE_AI_MODE || 'demo';

  if (mode !== 'real') {
    await new Promise(resolve => setTimeout(resolve, 700));
    return demoTranscripts[language];
  }

  const formData = new FormData();
  formData.append('audio', audioBlob, `recording.${audioBlob.type.split('/')[1]?.split(';')[0] || 'webm'}`);

  const response = await fetch(`${import.meta.env.VITE_VOICE_API_URL || 'http://localhost:5000'}/api/voice/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || 'Could not transcribe the recording. Please try again or switch to text input.');
  }

  const data = await response.json();
  if (!data.transcript || !String(data.transcript).trim()) {
    throw new Error('The recording could not be transcribed. Please try again or switch to text input.');
  }
  return data.transcript;
}

