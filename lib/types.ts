export interface ProductClassification {
  formulation_type: 'classical' | 'modified_classical' | 'proprietary' | 'new_drug' | 'food' | 'cosmetic';
  biological_resources: boolean;
  indian_bio_resources: boolean;
  tk_involved: boolean;
  target_markets: string[];
  domains: ('patent' | 'trademark' | 'abs' | 'regulatory' | 'traditional_knowledge')[];
  clarifying_questions: string[];
  confidence: number;
}

export interface Citation {
  chunk_id: string;
  doc_title: string;
  section: string;
  source_url: string;
  retrieved_at: string;
}

export interface DomainAnalysis {
  domain: 'patent' | 'trademark' | 'abs' | 'regulatory' | 'traditional_knowledge';
  status: 'ok' | 'insufficient_evidence';
  finding: string;
  confidence: number;
  citations: Citation[];
  escalation_required: boolean;
}

export interface EscalationItem {
  reason: string;
  professional_category: string;
  severity: 'medium' | 'high';
}

export interface IPRoadmap {
  product_assessment: { summary: string; formulation_type: string };
  domains: DomainAnalysis[];
  jurisdiction_notes: { jurisdiction: string; note: string }[];
  next_steps: string[];
  human_escalation: EscalationItem[];
  overall_confidence: number;
  disclaimer: string;
}
