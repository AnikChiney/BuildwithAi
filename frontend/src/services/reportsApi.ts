import { BACKEND_API_URL } from './authApi';

export interface ReportLocation {
  state: string;
  district: string;
  latitude?: number;
  longitude?: number;
}

export interface SubmittedReport {
  _id: string;
  inputType: 'text' | 'voice';
  originalLanguage: string;
  originalText: string;
  transcription: string | null;
  englishText: string;
  audioUrl: string | null;
  category: string;
  subcategory: string;
  summary: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  keywords: string[];
  location: ReportLocation;
  processingStatus: string;
  createdAt: string;
}

async function parseJson(res: Response) {
  return res.json().catch(() => null);
}

export const reportsApi = {
  // POST /api/reports/text (requires an authenticated session)
  async submitText(text: string, location: ReportLocation): Promise<SubmittedReport> {
    const res = await fetch(`${BACKEND_API_URL}/api/reports/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text, location }),
    });
    const data = await parseJson(res);
    if (res.status === 401) throw new Error('Please sign in to submit to the live system.');
    if (!res.ok) throw new Error(data?.message || 'Could not submit your request.');
    return data.report;
  },

  // POST /api/reports/voice (requires an authenticated session)
  async submitVoice(audioBlob: Blob, location: ReportLocation): Promise<SubmittedReport> {
    const formData = new FormData();
    const ext = audioBlob.type.split('/')[1]?.split(';')[0] || 'webm';
    formData.append('audio', audioBlob, `recording.${ext}`);
    formData.append('location', JSON.stringify(location));

    const res = await fetch(`${BACKEND_API_URL}/api/reports/voice`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await parseJson(res);
    if (res.status === 401) throw new Error('Please sign in to submit to the live system.');
    if (!res.ok) throw new Error(data?.message || 'Could not submit your recording.');
    return data.report;
  },
};
