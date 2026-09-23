export type CivicLanguage = 'en' | 'bn' | 'hi';
export type CivicSeverity = 'low' | 'medium' | 'high';
export interface Ward { id:string; name:string; zone:string; centroid:[number,number]; population:number; }
export interface CivicRequest { id:string; wardId:string; ward:string; category:string; language:CivicLanguage; text:string; severity:CivicSeverity; urgency:number; affectedPopulation:number; date:string; }
export interface InfrastructureProfile { wardId:string; roadQuality:number; drainageCoverage:number; waterAccess:number; electricityAccess:number; internetAccess:number; hospitalDensity:number; schoolDensity:number; publicTransportAccess:number; provenance:'simulated'; }
export interface InvestmentRecord { wardId:string; sector:string; allocatedBudget:number; activeProjects:number; completionPercentage:number; provenance:'simulated'; }
export interface DemandCluster { id:string; wardId:string; label:string; requestCount:number; categories:string[]; severityScore:number; confidence:number; }
export interface PriorityProject { wardId:string; wardName:string; title:string; category:string; score:number; demand:number; severity:number; populationImpact:number; infrastructureGap:number; vulnerability:number; investmentGap:number; affectedPopulation:number; evidence:string[]; confidence:number; limitations:string; }
export interface AnalysisResult { requestId:string; language:CivicLanguage; translatedText:string; category:string; subCategory:string; severity:CivicSeverity; urgency:number; wardId:string; wardName:string; similarCount:number; clusterId:string; affectedPopulation:number; summary:string; status:string; }
