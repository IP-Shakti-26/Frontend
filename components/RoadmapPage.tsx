"use client";

import React, { useState, useEffect } from "react";
import { 
  Scale, Tag, BookOpen, Leaf, ShieldCheck, ExternalLink, 
  AlertTriangle, CheckSquare, Square, Download, RotateCcw, 
  Sparkles, Shield, AlertCircle, FileText, CheckCircle2, XCircle, Loader2 
} from "lucide-react";
import { IPRoadmap, SummaryResponse, getSummary, downloadReport } from "@/lib/api";

interface RoadmapPageProps {
  sessionId: string;
  roadmap: IPRoadmap;
  initialSummary?: SummaryResponse | null;
  onReset: () => void;
}

const DOMAIN_NAME_MAP: Record<string, string> = {
  patent: "Patent Protection",
  traditional_knowledge: "Traditional Knowledge",
  abs: "Biodiversity & ABS",
  biodiversity_abs: "Biodiversity & ABS",
  regulatory: "Regulatory Approval",
  trademark: "Trademark Protection",
};

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  patent: <Scale className="w-5 h-5 text-forest" />,
  traditional_knowledge: <BookOpen className="w-5 h-5 text-forest" />,
  abs: <Leaf className="w-5 h-5 text-forest" />,
  biodiversity_abs: <Leaf className="w-5 h-5 text-forest" />,
  regulatory: <ShieldCheck className="w-5 h-5 text-forest" />,
  trademark: <Tag className="w-5 h-5 text-forest" />,
};

const PROF_TYPE_MAP: Record<string, string> = {
  patent_agent: "Registered Patent Agent",
  ip_attorney: "IP Attorney",
  nba_expert: "Biodiversity / ABS Expert",
  regulatory_expert: "Regulatory Expert",
  trademark_agent: "Trademark Agent",
};

const MARKET_FLAG_MAP: Record<string, string> = {
  germany: "🇩🇪 Germany",
  uk: "🇬🇧 United Kingdom",
  usa: "🇺🇸 United States",
  eu: "🇪🇺 European Union",
  india: "🇮🇳 India",
};

export default function RoadmapPage({
  sessionId,
  roadmap,
  initialSummary,
  onReset,
}: RoadmapPageProps) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  
  const [summary, setSummary] = useState<SummaryResponse | null>(initialSummary || null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!summary && sessionId) {
      getSummary(sessionId)
        .then((res) => setSummary(res))
        .catch((err) => console.warn("Summary fetch note:", err));
    }
  }, [sessionId, summary]);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      await downloadReport(sessionId);
    } catch (err: any) {
      console.error("PDF download error:", err);
      setDownloadError(err.message || "Failed to download PDF report.");
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const domains = roadmap.domains || [];
  const activeDomain = domains[activeTabIdx] || domains[0];
  const overallConf = roadmap.overall_confidence ?? 0.85;

  const confPercent = Math.round(overallConf * 100);
  const confColor = overallConf >= 0.7 ? "#166534" : overallConf >= 0.5 ? "#D97706" : "#991B1B";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "relevant":
      case "ok":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-700" /> Relevant
          </span>
        );
      case "insufficient_evidence":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-amber-900 border border-amber-300" style={{ backgroundColor: "#FEF3C7" }}>
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" /> Limited Evidence
          </span>
        );
      case "not_applicable":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            <XCircle className="w-3.5 h-3.5 text-gray-400" /> Not Applicable
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 flex flex-col items-center pb-32" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="w-full max-w-[960px] flex flex-col gap-8">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <h1 className="text-3xl font-serif font-bold" style={{ color: "var(--color-primary)" }}>
              IP & Regulatory Analysis Report
            </h1>
            <p className="text-xs font-sans text-gray-500 mt-1 font-mono">
              Session ID: {sessionId}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2.5 rounded-md font-bold text-xs text-white shadow-sm transition-all flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Download Report (PDF)
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2.5 rounded-md font-bold text-xs text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Start New Analysis
            </button>
          </div>
        </div>

        {downloadError && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <span>{downloadError}</span>
            <button onClick={() => setDownloadError(null)} className="font-bold underline text-amber-950">Dismiss</button>
          </div>
        )}

        {/* SECTION 9.1 — PLAIN ENGLISH SUMMARY */}
        {summary && (
          <div className="rounded-2xl border p-6 sm:p-8 flex flex-col gap-4 shadow-sm" style={{ borderColor: "var(--color-primary)", backgroundColor: "#F0FDF4" }}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3" style={{ borderColor: "#DCFCE7" }}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  Executive Legal Summary
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border shadow-2xs" style={{ color: "var(--color-primary)", borderColor: "var(--color-border)" }}>
                {summary.confidence_label || "High"} Confidence Analysis
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-2 leading-snug">
                {summary.headline}
              </h2>
              <p className="text-sm font-sans text-gray-700 leading-relaxed">
                {summary.summary}
              </p>
            </div>

            {summary.top_action && (
              <div className="p-4 rounded-xl bg-white border flex items-start gap-3 shadow-2xs mt-1" style={{ borderColor: "var(--color-border)" }}>
                <span className="text-sm font-bold text-forest whitespace-nowrap">→ Primary Directive:</span>
                <span className="text-sm font-semibold text-gray-900">{summary.top_action}</span>
              </div>
            )}
          </div>
        )}

        {/* SECTION 9.2 — CLASSIFICATION BANNER */}
        <div className="w-full bg-white rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs" style={{ borderColor: "var(--color-border)" }}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Product Classification</span>
            <h3 className="text-xl font-serif font-bold text-gray-900">
              {roadmap.classification || roadmap.product_summary || "Ayurvedic Formulation"}
            </h3>
          </div>

          <div className="w-full sm:w-64 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-600">Overall Confidence</span>
              <span className="font-bold font-mono" style={{ color: confColor }}>{confPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${confPercent}%`, backgroundColor: confColor }}
              />
            </div>
            <span className="text-[11px] text-gray-500 text-right">
              Based on statutory acts & Qdrant RAG sources
            </span>
          </div>
        </div>

        {/* SECTION 9.3 — DOMAIN TABS OR ACCORDION */}
        {domains.length > 0 && (
          <div className="bg-white rounded-2xl border overflow-hidden shadow-2xs" style={{ borderColor: "var(--color-border)" }}>
            {/* Tab Navigation Bar */}
            <div className="flex border-b overflow-x-auto bg-gray-50/50" style={{ borderColor: "var(--color-border)" }}>
              {domains.map((dom, idx) => {
                const isActive = activeTabIdx === idx;
                const domName = DOMAIN_NAME_MAP[dom.domain] || dom.domain;
                const needsEsc = dom.needs_escalation || dom.escalation_required;

                return (
                  <button
                    key={dom.domain || idx}
                    onClick={() => setActiveTabIdx(idx)}
                    className="flex items-center gap-2 px-5 py-4 font-semibold text-xs transition-colors whitespace-nowrap border-b-2 outline-none hover:bg-white"
                    style={{
                      borderBottomColor: isActive ? "var(--color-primary)" : "transparent",
                      color: isActive ? "var(--color-primary)" : "var(--color-muted)",
                      backgroundColor: isActive ? "white" : "transparent",
                    }}
                  >
                    {DOMAIN_ICONS[dom.domain] || <Scale className="w-4 h-4" />}
                    <span>{domName}</span>
                    {needsEsc && <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
                    {getStatusBadge(dom.status)}
                  </button>
                );
              })}
            </div>

            {/* Active Tab Content */}
            {activeDomain && (
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: "var(--color-border)" }}>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-serif font-bold text-gray-900">
                      {DOMAIN_NAME_MAP[activeDomain.domain] || activeDomain.domain}
                    </h3>
                    {getStatusBadge(activeDomain.status)}
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-gray-100 border text-gray-600">
                    Confidence: {Math.round((activeDomain.confidence || 0.8) * 100)}%
                  </span>
                </div>

                {/* Finding */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Legal Finding</h4>
                  <p className="text-base sm:text-lg font-serif text-gray-900 leading-relaxed">
                    {activeDomain.finding}
                  </p>
                </div>

                {/* Key Risks */}
                {activeDomain.key_risks && activeDomain.key_risks.length > 0 && (
                  <div className="p-5 rounded-xl border flex flex-col gap-2.5" style={{ backgroundColor: "#FEF3C7", borderColor: "#FDE68A" }}>
                    <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "var(--color-warning)" }}>
                      <AlertTriangle className="w-4 h-4" /> Key Risks Identified
                    </h4>
                    <ul className="flex flex-col gap-1.5 text-xs sm:text-sm font-medium" style={{ color: "var(--color-warning)" }}>
                      {activeDomain.key_risks.map((risk, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <span className="mt-0.5">⚠️</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Citations */}
                {activeDomain.citations && activeDomain.citations.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Statutory Citations & Precedents</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeDomain.citations.map((cit, cIdx) => (
                        <div key={cIdx} className="p-4 rounded-xl border bg-gray-50/70 flex flex-col justify-between gap-3 text-xs" style={{ borderColor: "var(--color-border)" }}>
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-forest" />
                              <span>{cit.doc_title}</span>
                            </div>
                            {cit.section && cit.section !== "unknown" && (
                              <span className="inline-block mt-2 font-mono text-[11px] bg-white border px-2 py-0.5 rounded font-semibold text-forest">
                                Section: {cit.section}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t text-[11px]" style={{ borderColor: "var(--color-border)" }}>
                            <span className="text-gray-400">{cit.retrieved_at ? `Retrieved: ${cit.retrieved_at}` : `ID: ${cit.chunk_id}`}</span>
                            {cit.source_url && (
                              <a
                                href={cit.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-forest hover:underline flex items-center gap-1"
                              >
                                View Act <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Escalation Callout Box */}
                {(activeDomain.needs_escalation || activeDomain.escalation_required) && (
                  <div className="p-5 rounded-xl bg-red-50/60 border-l-4 border-red-700 flex flex-col gap-2" style={{ borderColor: "var(--color-error)" }}>
                    <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 text-red-700" />
                      <span>Professional Review Required</span>
                    </div>
                    <p className="text-xs text-red-900 leading-relaxed">
                      Due to statutory complexity under Section 3 / NBA regulatory triggers, direct consultation with a registered agent or attorney is strongly advised prior to public filing or commercial deployment.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SECTION 9.4 — JURISDICTION NOTES */}
        {roadmap.jurisdiction_notes && roadmap.jurisdiction_notes.length > 0 && (
          <div className="bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-2xs" style={{ borderColor: "var(--color-border)" }}>
            <h3 className="font-serif font-bold text-lg text-gray-900">Jurisdiction & Overseas Considerations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roadmap.jurisdiction_notes.map((jn, jIdx) => (
                <div key={jIdx} className="p-4 rounded-xl border bg-gray-50/50 flex flex-col justify-between gap-3 text-xs" style={{ borderColor: "var(--color-border)" }}>
                  <div>
                    <span className="font-bold text-sm text-gray-900 block mb-1">
                      {MARKET_FLAG_MAP[jn.market?.toLowerCase() || ""] || jn.market || jn.jurisdiction || "Overseas Market"}
                    </span>
                    <p className="text-gray-700 leading-relaxed">{jn.note}</p>
                  </div>
                  {jn.requires_separate_analysis && (
                    <span className="inline-flex items-center gap-1 font-bold text-[11px] text-amber-900 bg-amber-100 px-2.5 py-1 rounded w-fit border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-700" /> Requires separate international analysis
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 9.5 — NEXT STEPS CHECKLIST */}
        {roadmap.next_steps && roadmap.next_steps.length > 0 && (
          <div className="bg-white rounded-2xl border p-6 sm:p-8 flex flex-col gap-5 shadow-2xs" style={{ borderColor: "var(--color-border)" }}>
            <h3 className="font-serif font-bold text-xl text-gray-900">Your Action Plan</h3>
            <div className="flex flex-col gap-3">
              {roadmap.next_steps.map((stepText, sIdx) => {
                const isChecked = !!checkedSteps[sIdx];
                return (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => toggleStep(sIdx)}
                    className="flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all hover:bg-gray-50 bg-white"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <span className="font-mono font-bold text-xs text-forest mt-0.5 flex-shrink-0 w-6">
                      {sIdx + 1}.
                    </span>
                    <div className="mt-0.5 text-forest flex-shrink-0">
                      {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-gray-400" />}
                    </div>
                    <span className={`text-xs sm:text-sm text-gray-800 leading-relaxed ${isChecked ? "line-through text-gray-400" : ""}`}>
                      {stepText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 9.6 — PROFESSIONAL CONSULTATION SECTION */}
        {roadmap.human_escalation && roadmap.human_escalation.length > 0 && (
          <div className="bg-white rounded-2xl border p-6 sm:p-8 flex flex-col gap-5 shadow-2xs" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "var(--color-border)" }}>
              <Shield className="w-5 h-5 text-red-700" />
              <h3 className="font-serif font-bold text-xl text-gray-900">Recommended Professional Consultations</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roadmap.human_escalation.map((esc, eIdx) => {
                const urgency = esc.urgency || "recommended";
                const badgeColor = urgency === "before_filing" ? "bg-red-100 text-red-800 border-red-200" : urgency === "before_commercialization" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-gray-100 text-gray-700 border-gray-200";

                return (
                  <div key={eIdx} className="p-4 rounded-xl border bg-gray-50/40 flex flex-col justify-between gap-3 text-xs" style={{ borderColor: "var(--color-border)" }}>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-bold text-sm text-gray-900">
                          {PROF_TYPE_MAP[esc.prof_type || ""] || esc.prof_type || esc.professional_category || "IP Attorney"}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${badgeColor}`}>
                          {urgency.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{esc.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-8" style={{ borderColor: "var(--color-border)" }}>
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Start New Analysis
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download Report (PDF)
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 9.8 — DISCLAIMER FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-[960px] mx-auto flex items-center gap-3 text-xs" style={{ color: "var(--color-muted)" }}>
          <Shield className="w-4 h-4 flex-shrink-0 text-forest" />
          <p className="leading-tight">
            <span className="font-bold text-gray-900">Disclaimer: </span>
            {roadmap.disclaimer || "This output is generated by IP-SAKTI for informational purposes only and does not constitute formal legal advice."}
          </p>
        </div>
      </footer>
    </div>
  );
}
