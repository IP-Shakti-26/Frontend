export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082";

export interface HealthResponse {
  status: string;
  env?: string;
  time?: string;
  timestamp?: string;
}

export interface ClassifyRequest {
  description: string;
  session_id?: string;
}

export interface ClassificationResult {
  formulation_type?: string;
  classification?: string;
  product_summary?: string;
  indian_bio_resources?: boolean;
  biological_resources?: boolean;
  tk_involved?: boolean;
  target_markets?: string[];
  relevant_domains?: string[];
  domains?: string[];
  clarifying_questions?: string[];
  confidence?: number;
  confidence_score?: number;
  reasoning?: string;
  raw_description?: string;
}

export interface ClassifyResponse {
  session_id: string;
  classification: ClassificationResult;
  needs_clarification?: boolean;
  clarifying_questions?: string[];
}

export interface ClarifyRequest {
  session_id: string;
  answers: Record<string, string>;
}

export interface AnalyzeRequest {
  session_id: string;
}

export interface Citation {
  chunk_id: string;
  doc_title: string;
  section: string;
  source_url: string;
  retrieved_at: string;
}

export interface DomainAnalysis {
  domain: string; // 'patent' | 'trademark' | 'biodiversity_abs' | 'abs' | 'regulatory' | 'traditional_knowledge'
  status: 'relevant' | 'insufficient_evidence' | 'not_applicable' | 'ok';
  finding: string;
  key_risks?: string[];
  citations: Citation[];
  confidence: number;
  needs_escalation?: boolean;
  escalation_required?: boolean;
}

export interface JurisdictionNote {
  market?: string;
  jurisdiction?: string;
  note: string;
  requires_separate_analysis?: boolean;
}

export interface EscalationItem {
  reason: string;
  prof_type?: string;
  professional_category?: string;
  urgency?: string;
  severity?: string;
}

export interface IPRoadmap {
  product_summary?: string;
  product_assessment?: { summary: string; formulation_type: string };
  classification?: string;
  domains: DomainAnalysis[];
  jurisdiction_notes: JurisdictionNote[];
  next_steps: string[];
  human_escalation: EscalationItem[];
  overall_confidence: number;
  disclaimer: string;
}

export interface AnalyzeResponse {
  session_id: string;
  roadmap: IPRoadmap;
  generated_at: string;
}

/**
 * Helper to execute fetch requests with configurable timeouts.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    return response;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs / 1000} seconds`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Health check endpoint: GET /health
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/health`, { method: "GET" }, 5000);
    if (!res.ok) {
      throw new Error(`Health check failed with status ${res.status}`);
    }
    return await res.json();
  } catch {
    // Fallback to /api/v1/health
    const res = await fetchWithTimeout(`${BASE_URL}/api/v1/health`, { method: "GET" }, 5000);
    if (!res.ok) {
      throw new Error(`Health check failed with status ${res.status}`);
    }
    return await res.json();
  }
}

/**
 * Classify Product Formulation: POST /classify
 */
export async function classifyProduct(
  description: string,
  sessionId?: string
): Promise<ClassifyResponse> {
  const payload: ClassifyRequest = { description, session_id: sessionId };
  
  let res: Response;
  try {
    res = await fetchWithTimeout(`${BASE_URL}/classify`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, 30000);
  } catch {
    res = await fetchWithTimeout(`${BASE_URL}/api/v1/classify`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, 30000);
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Classification failed (${res.status})`);
  }

  return await res.json();
}

/**
 * Answer Clarifying Questions: POST /clarify
 */
export async function answerClarify(
  sessionId: string,
  answers: Record<string, string>
): Promise<ClassifyResponse> {
  const payload: ClarifyRequest = { session_id: sessionId, answers };

  let res: Response;
  try {
    res = await fetchWithTimeout(`${BASE_URL}/clarify`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, 30000);
  } catch {
    res = await fetchWithTimeout(`${BASE_URL}/api/v1/clarify`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, 30000);
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Clarification update failed (${res.status})`);
  }

  return await res.json();
}

/**
 * Generate Synthesis Roadmap: POST /analyze
 * Configured with 90 seconds (90000 ms) timeout as specified.
 */
export async function analyzeProduct(sessionId: string): Promise<AnalyzeResponse> {
  const payload: AnalyzeRequest = { session_id: sessionId };

  let res: Response;
  try {
    res = await fetchWithTimeout(`${BASE_URL}/analyze`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, 90000); // 90 seconds timeout
  } catch (err: any) {
    if (err.message?.includes("timed out")) throw err;
    res = await fetchWithTimeout(`${BASE_URL}/api/v1/analyze`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, 90000);
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Roadmap synthesis failed (${res.status})`);
  }

  return await res.json();
}
