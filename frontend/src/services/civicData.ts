import { useSyncExternalStore } from 'react';
import {
  AnalysisResult,
  CivicLanguage,
  CivicRequest,
  DemandCluster,
  InfrastructureProfile,
  InvestmentRecord,
  PriorityProject,
  Ward,
} from '../types/civic';
import { BACKEND_API_URL } from './authApi';

export interface DatasetWard extends Ward {
  state: string;
  district: string;
}

export interface CivicDataset {
  name: string;
  version: string;
  city: string;
  state: string;
  country: string;
  generatedAt: string;
  wards: DatasetWard[];
  requests: CivicRequest[];
  infrastructure: InfrastructureProfile[];
  investments: InvestmentRecord[];
  clusters: DemandCluster[];
  projects: PriorityProject[];
  trends: { month: string; requests: number; demand: number; investment: number }[];
}

const translations: Record<CivicLanguage, string> = {
  en: 'There is severe waterlogging near the school and the road becomes difficult to use during rain.',
  bn: 'স্কুলের কাছে বৃষ্টির সময় প্রচুর জল জমে যায় এবং রাস্তা দিয়ে চলাচল করা কঠিন হয়ে যায়।',
  hi: 'स्कूल के पास बारिश के दौरान बहुत पानी जमा हो जाता है और सड़क पर चलना मुश्किल हो जाता है।',
};

type Listener = () => void;

const emptyDataset: CivicDataset = {
  name: '',
  version: '',
  city: '',
  state: '',
  country: '',
  generatedAt: '',
  wards: [],
  requests: [],
  infrastructure: [],
  investments: [],
  clusters: [],
  projects: [],
  trends: [],
};

let dataset: CivicDataset = emptyDataset;
let loading = true;
let error = '';
const listeners = new Set<Listener>();

const notify = () => listeners.forEach(listener => listener());

async function loadDataset() {
  loading = true;
  error = '';
  notify();

  try {
    const response = await fetch(`${BACKEND_API_URL}/api/dataset`);
    const body = await response.json().catch(() => null);

    if (!response.ok || !body?.dataset) {
      throw new Error(
        body?.message ||
          'Could not load the MongoDB civic dataset. Make sure the backend is running and the dataset is seeded.'
      );
    }

    dataset = body.dataset as CivicDataset;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Could not load the civic dataset.';
  } finally {
    loading = false;
    notify();
  }
}

export const civicData = {
  get wards() { return dataset.wards; },
  get requests() { return dataset.requests; },
  get infrastructure() { return dataset.infrastructure; },
  get investments() { return dataset.investments; },
  get clusters() { return dataset.clusters; },
  get projects() { return dataset.projects; },
  get trends() { return dataset.trends; },
  get metadata() {
    return {
      name: dataset.name,
      version: dataset.version,
      city: dataset.city,
      state: dataset.state,
      country: dataset.country,
      generatedAt: dataset.generatedAt,
    };
  },
  get loading() { return loading; },
  get error() { return error; },
  get loaded() { return !loading && !error && dataset.wards.length > 0; },

  getWard(wardId: string) {
    return dataset.wards.find(w => w.id === wardId);
  },

  getRequests(wardId?: string) {
    return wardId
      ? dataset.requests.filter(r => r.wardId === wardId)
      : dataset.requests;
  },

  analyse(text: string, language: CivicLanguage, wardId = dataset.wards[0]?.id): AnalysisResult {
    if (!dataset.wards.length) {
      throw new Error('Civic dataset is still loading. Please try again in a moment.');
    }

    const lower = text.toLowerCase();
    const hasDrainage = /drain|waterlog|জল জম|জলাবদ্ধ|जलभराव/.test(lower);
    const hasRoad = /road|pothole|রাস্তা|গর্ত|सड़क|गड्ढ/.test(lower);

    const category = hasDrainage && hasRoad
      ? 'Drainage + Roads'
      : /water|জল|पानी/.test(lower) && !hasDrainage
        ? 'Water'
        : /light|streetlight|আলো|लाइट/.test(lower)
          ? 'Lighting'
          : /waste|garbage|আবর্জনা|কচরা|कचरा/.test(lower)
            ? 'Waste'
            : /bus|transport|বাস|बस/.test(lower)
              ? 'Public Transport'
              : hasRoad
                ? 'Roads'
                : 'Drainage';

    const severity = /severe|urgent|danger|প্রচুর|জরুরি|भारी|तुरंत/.test(lower)
      ? 'high'
      : 'medium';

    const ward = dataset.wards.find(w => w.id === wardId) || dataset.wards[0];
    const similar = dataset.requests.filter(
      r => r.wardId === ward.id &&
        (r.category === category || (category === 'Drainage' && r.category === 'Roads'))
    ).length;
    const cluster = dataset.clusters.find(c => c.wardId === ward.id) || dataset.clusters[0];
    const project = dataset.projects.find(p => p.wardId === ward.id);

    return {
      requestId: 'REQ-2026-LIVE',
      language,
      translatedText: language === 'en' ? text : translations[language],
      category,
      subCategory:
        category === 'Drainage + Roads'
          ? 'Waterlogging + road access'
          : category === 'Drainage'
            ? 'Waterlogging'
            : category === 'Roads'
              ? 'Road condition'
              : 'Service reliability',
      severity,
      urgency: severity === 'high' ? 9 : 6,
      wardId: ward.id,
      wardName: ward.name,
      similarCount: similar,
      clusterId: cluster?.id || 'NO-CLUSTER',
      affectedPopulation: project?.affectedPopulation || ward.population,
      summary: `The request indicates a ${severity}-severity ${category.toLowerCase()} need in ${ward.name}, with related citizen demand already present in the same area.`,
      status: 'analysed',
    };
  },

  async reload() {
    await loadDataset();
  },
};

export function useCivicData() {
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => `${loading}|${error}|${dataset.version}|${dataset.generatedAt}|${dataset.requests.length}`,
    () => `${loading}|${error}|${dataset.version}|${dataset.generatedAt}|${dataset.requests.length}`,
  );

  return civicData;
}

// Load once when the frontend starts. The UI never uses the old demoData arrays.
void loadDataset();
