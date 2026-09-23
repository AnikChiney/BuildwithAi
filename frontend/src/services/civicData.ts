import { DEMO_CLUSTERS, DEMO_INFRASTRUCTURE, DEMO_INVESTMENTS, DEMO_PROJECTS, DEMO_REQUESTS, DEMO_TRENDS, DEMO_WARDS } from '../data/demoData';
import { AnalysisResult, CivicLanguage } from '../types/civic';

const translations: Record<CivicLanguage,string> = {
  en: 'There is severe waterlogging near the school and the road becomes difficult to use during rain.',
  bn: 'স্কুলের কাছে বৃষ্টির সময় প্রচুর জল জমে যায় এবং রাস্তা দিয়ে চলাচল করা কঠিন।',
  hi: 'स्कूल के पास बारिश के दौरान बहुत पानी जमा हो जाता है और सड़क पर चलना मुश्किल हो जाता है।',
};

export const civicData = {
  wards: DEMO_WARDS,
  requests: DEMO_REQUESTS,
  infrastructure: DEMO_INFRASTRUCTURE,
  investments: DEMO_INVESTMENTS,
  clusters: DEMO_CLUSTERS,
  projects: DEMO_PROJECTS,
  trends: DEMO_TRENDS,
  getWard(wardId:string) {
    return DEMO_WARDS.find(w => w.id === wardId);
  },
  getRequests(wardId?:string) {
    return wardId ? DEMO_REQUESTS.filter(r => r.wardId === wardId) : DEMO_REQUESTS;
  },
  analyse(text:string, language:CivicLanguage, wardId='WARD-12'): AnalysisResult {
    const lower=text.toLowerCase();
    const hasDrainage = /drain|waterlog|জল জম|জলাবদ্ধ|जलभराव/.test(lower);
    const hasRoad = /road|pothole|রাস্তা|গর্ত|सड़क|गड्ढ/.test(lower);
    const category = hasDrainage && hasRoad ? 'Drainage + Roads' : /water|জল|पानी/.test(lower) && !hasDrainage ? 'Water' :
      /light|streetlight|আলো|लाइट/.test(lower) ? 'Lighting' :
      /waste|garbage|আবর্জনা|कचरा/.test(lower) ? 'Waste' :
      /bus|transport|বাস|बस/.test(lower) ? 'Public Transport' : hasRoad ? 'Roads' : 'Drainage';
    const severity = /severe|urgent|danger|প্রচুর|জরুরি|भारी|तुरंत/.test(lower) ? 'high' : 'medium';
    const ward=this.getWard(wardId)!;
    const similar = DEMO_REQUESTS.filter(r => r.wardId===wardId && (r.category===category || category==='Drainage' && r.category==='Roads')).length;
    const cluster = DEMO_CLUSTERS.find(c=>c.wardId===wardId) || DEMO_CLUSTERS[0];
    return {
      requestId:'REQ-2026-LIVE',
      language,
      translatedText: language==='en' ? text : translations[language],
      category,
      subCategory: category==='Drainage + Roads' ? 'Waterlogging + road access' : category==='Drainage' ? 'Waterlogging' : category==='Roads' ? 'Road condition' : 'Service reliability',
      severity,
      urgency: severity==='high'?9:6,
      wardId:ward.id,
      wardName:ward.name,
      similarCount:similar,
      clusterId:cluster.id,
      affectedPopulation:18400,
      summary: `The request indicates a ${severity}-severity ${category.toLowerCase()} need in ${ward.name}, with related citizen demand already present in the same area.`,
      status:'analysed'
    };
  }
};
