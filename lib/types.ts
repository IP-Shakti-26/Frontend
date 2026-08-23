export type {
  HealthResponse,
  ClassifyRequest,
  ClassificationResult,
  ClassifyResponse,
  ClarifyRequest,
  AnalyzeRequest,
  Citation,
  DomainAnalysis,
  JurisdictionNote,
  EscalationItem,
  IPRoadmap,
  AnalyzeResponse,
  DemoExample,
  SummaryResponse,
} from "./api";

export interface ProductClassification {
  formulation_type: string;
  classification?: string;
  product_summary?: string;
  biological_resources?: boolean;
  indian_bio_resources?: boolean;
  tk_involved?: boolean;
  target_markets?: string[];
  domains?: string[];
  relevant_domains?: string[];
  clarifying_questions?: string[];
  confidence: number;
}
