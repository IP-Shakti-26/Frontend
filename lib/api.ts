export const BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  "http://localhost:8082";

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
  total_sources?: number;
  domains_covered?: number;
  classification_confidence?: number;
  disclaimer: string;
}

export interface AnalyzeResponse {
  session_id: string;
  roadmap: IPRoadmap;
  generated_at: string;
}

export interface DemoExample {
  id: string;
  title: string;
  description: string;
  tags: string[];
  complexity: 'low' | 'medium' | 'high';
}

export interface SummaryResponse {
  session_id: string;
  headline: string;
  summary: string;
  top_action: string;
  confidence_label: 'High' | 'Medium' | 'Low';
  confidence_value: number;
}

/**
 * Internal fetch wrapper with fallback to alternate port if endpoint is unavailable.
 */
async function fetchWithFallback(
  path: string,
  options: RequestInit = {},
  timeoutMs: number = 30000
): Promise<Response> {
  const ports = [BASE_URL, "http://localhost:8082", "http://localhost:8080"];
  const uniqueUrls = Array.from(new Set(ports.map(p => p.replace(/\/$/, ""))));

  let lastError: unknown = null;

  for (const baseUrl of uniqueUrls) {
    const fullUrl = path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      if (response.ok || response.status === 409 || response.status === 400) {
        return response;
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      lastError = err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`Request timed out after ${timeoutMs / 1000} seconds`);
      }
    }
  }

  throw lastError || new Error(`Failed to connect to IP-SAKTI server at ${BASE_URL}`);
}

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetchWithFallback("/api/v1/health", { method: "GET" }, 5000);
  if (!res.ok) throw new Error(`Health check failed (${res.status})`);
  return res.json();
}

export async function classifyProduct(description: string): Promise<ClassifyResponse> {
  const res = await fetchWithFallback("/api/v1/classify", {
    method: "POST",
    body: JSON.stringify({ description }),
  }, 30000);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Classify failed (${res.status})`);
  }
  return res.json();
}

export async function analyzeSession(sessionId: string): Promise<AnalyzeResponse> {
  const res = await fetchWithFallback("/api/v1/analyze", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId }),
  }, 90000);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Analyze failed (${res.status})`);
  }
  return res.json();
}

// Alias for backward compatibility
export const analyzeProduct = analyzeSession;

export async function clarifySession(sessionId: string, answers: Record<string, string>): Promise<ClassifyResponse> {
  const res = await fetchWithFallback("/api/v1/clarify", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, answers }),
  }, 30000);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Clarify failed (${res.status})`);
  }
  return res.json();
}

// Alias for backward compatibility
export const answerClarify = clarifySession;

export async function getSummary(sessionId: string): Promise<SummaryResponse> {
  const res = await fetchWithFallback(`/api/v1/summary/${sessionId}`, { method: "GET" }, 15000);
  if (!res.ok) {
    if (res.status === 409) throw new Error("Analysis not complete yet.");
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Summary failed (${res.status})`);
  }
  return res.json();
}

export async function getExamples(): Promise<{ examples: DemoExample[] }> {
  const res = await fetchWithFallback("/api/v1/examples", { method: "GET" }, 10000);
  if (!res.ok) throw new Error(`Examples failed (${res.status})`);
  return res.json();
}

export function getReportUrl(sessionId: string): string {
  return `${BASE_URL}/api/v1/report/${sessionId}`;
}

export async function downloadReport(sessionId: string): Promise<void> {
  const res = await fetchWithFallback(`/api/v1/report/${sessionId}`, { method: "GET" }, 30000);
  if (!res.ok) {
    if (res.status === 409) {
      throw new Error("Analysis not complete yet. Please wait until roadmap generation completes.");
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Report generation failed (${res.status})`);
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ipsakti-report-${sessionId.slice(0, 8)}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}
