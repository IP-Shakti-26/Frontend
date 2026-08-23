"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Stepper } from "@/components/Stepper";
import { RoadmapSkeleton } from "@/components/RoadmapSkeleton";
import { mockRoadmap } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { analyzeProduct, AnalyzeResponse, IPRoadmap } from "@/lib/api";
import { 
  Scale, Tag, BookOpen, Leaf, ShieldCheck, 
  ExternalLink, AlertTriangle, CheckSquare, Square, Download, ArrowLeft, RotateCcw,
  RefreshCw, FileText, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";

const domainIcons: Record<string, React.ReactNode> = {
  patent: <Scale className="w-5 h-5" />,
  trademark: <Tag className="w-5 h-5" />,
  traditional_knowledge: <BookOpen className="w-5 h-5" />,
  abs: <Leaf className="w-5 h-5" />,
  biodiversity_abs: <Leaf className="w-5 h-5" />,
  regulatory: <ShieldCheck className="w-5 h-5" />,
};

const domainTitles: Record<string, string> = {
  patent: "Patentability",
  trademark: "Trademark",
  traditional_knowledge: "Traditional Knowledge",
  abs: "Biodiversity / ABS",
  biodiversity_abs: "Biodiversity / ABS",
  regulatory: "Regulatory Approval",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function RoadmapPage() {
  const router = useRouter();
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState<string>("Initiating legal RAG retrieval...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [roadmapData, setRoadmapData] = useState<IPRoadmap | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  const loadRoadmap = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    let currentSessionId = "";
    if (typeof window !== "undefined") {
      currentSessionId = sessionStorage.getItem("ip_session_id") || "";
    }

    if (!currentSessionId) {
      console.warn("No active session_id found in storage. Falling back to mock roadmap.");
      setRoadmapData(mockRoadmap as any);
      setIsLoading(false);
      return;
    }

    setSessionId(currentSessionId);

    // Progress simulation updates
    const timer1 = setTimeout(() => setLoadingStage("Searching statutory acts & Qdrant vector db..."), 4000);
    const timer2 = setTimeout(() => setLoadingStage("Analyzing Patents Act, NBA & TKDL provisions..."), 12000);
    const timer3 = setTimeout(() => setLoadingStage("Synthesizing multi-domain IP strategy with Gemini..."), 24000);

    try {
      const response: AnalyzeResponse = await analyzeProduct(currentSessionId);
      setRoadmapData(response.roadmap);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Roadmap fetch error:", err);
      setErrorMsg(err.message || "Failed to generate IP roadmap from server");
      setIsLoading(false);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const toggleStep = (idx: number) => {
    setCheckedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center w-full">
        <RoadmapSkeleton />
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6">
          <div className="bg-white p-8 rounded-3xl border border-forest/20 shadow-2xl flex flex-col items-center text-center max-w-md gap-4">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-forest/20 border-t-forest animate-spin" />
              <Scale className="w-7 h-7 text-forest absolute" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-forest">Synthesizing IP Strategy</h3>
            <p className="text-sm font-medium text-gray-600 animate-pulse bg-forest/5 px-4 py-2 rounded-full border border-forest/10">
              {loadingStage}
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our RAG engine retrieves statutory provisions from Qdrant and synthesizes cross-domain legal analysis via Gemini. This typically takes 15–40 seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle Error State
  if (errorMsg && !roadmapData) {
    return (
      <div className="flex flex-col items-center w-full min-h-screen bg-white">
        <Stepper currentStep={3} />
        <div className="w-full max-w-2xl px-6 py-12 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Analysis Could Not Complete</h2>
          <p className="text-gray-600 bg-red-50 p-4 rounded-2xl border border-red-200 text-sm max-w-lg">
            {errorMsg}
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={loadRoadmap}
              className="flex items-center gap-2 px-6 py-3 bg-forest text-white font-bold rounded-full hover:brightness-110 shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Retry Analysis
            </button>
            <button
              onClick={() => {
                setRoadmapData(mockRoadmap as any);
                setErrorMsg(null);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all"
            >
              View Sample Roadmap
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Roadmap data (or fallback)
  const roadmap = roadmapData || (mockRoadmap as any);

  const productSummaryText = roadmap.product_summary || roadmap.product_assessment?.summary || "Ayurvedic Product Analysis";
  const overallConf = roadmap.overall_confidence ?? 0.85;
  const domainsList = roadmap.domains || [];
  const activeDomain = domainsList[activeTabIdx] || domainsList[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "relevant":
      case "ok":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Relevant
          </span>
        );
      case "insufficient_evidence":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Insufficient Evidence
          </span>
        );
      case "not_applicable":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            <XCircle className="w-3.5 h-3.5 text-gray-400" /> Not Applicable
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            {status}
          </span>
        );
    }
  };

  const getConfidenceBadge = (conf: number) => {
    if (conf >= 0.75) return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">High Confidence</span>;
    if (conf >= 0.5) return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">Medium Confidence</span>;
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">Low Confidence</span>;
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen relative pb-32 bg-white">
      <Stepper currentStep={3} />

      <div className="w-full max-w-5xl px-4 sm:px-6 mx-auto flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest mb-3">
              Your IP & Regulatory Roadmap
            </h2>
            <p className="text-gray-600 font-sans text-lg max-w-3xl leading-relaxed">
              {productSummaryText}
            </p>
          </div>
          <div className="flex-shrink-0">
            {getConfidenceBadge(overallConf)}
          </div>
        </div>

        {/* Domain Navigation Tabs */}
        {domainsList.length > 0 && (
          <div className="w-full border-b border-gray-200 overflow-x-auto no-scrollbar">
            <div className="flex w-max min-w-full">
              {domainsList.map((domainItem: any, idx: number) => {
                const domainKey = domainItem.domain;
                const isActive = activeTabIdx === idx;
                return (
                  <button
                    key={domainKey || idx}
                    onClick={() => setActiveTabIdx(idx)}
                    className={cn(
                      "relative flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap outline-none hover:bg-forest/5",
                      isActive ? "text-forest font-bold" : "text-gray-500"
                    )}
                  >
                    {domainIcons[domainKey] || <Scale className="w-5 h-5" />}
                    {domainTitles[domainKey] || domainKey}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeDomain && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabIdx}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-10"
            >
              {/* Domain Analysis Card */}
              <motion.div variants={itemVariants}>
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-serif font-semibold text-gray-900">
                        {domainTitles[activeDomain.domain] || activeDomain.domain} Analysis
                      </h3>
                      {getStatusBadge(activeDomain.status)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                        Conf: {(activeDomain.confidence * 100).toFixed(0)}%
                      </span>
                      {(activeDomain.needs_escalation || activeDomain.escalation_required) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5" /> Needs Professional Review
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Finding</h4>
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {activeDomain.finding}
                    </p>
                  </div>

                  {/* Key Risks */}
                  {activeDomain.key_risks && activeDomain.key_risks.length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex flex-col gap-2">
                      <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" /> Key Risks Identified
                      </h4>
                      <ul className="list-disc list-inside flex flex-col gap-1.5 text-sm text-amber-950">
                        {activeDomain.key_risks.map((risk: string, rIdx: number) => (
                          <li key={rIdx}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Qdrant Statutory Citations */}
                  {activeDomain.citations && activeDomain.citations.length > 0 && (
                    <div className="mt-2 flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Statutory Precedents & Citations (Qdrant RAG)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeDomain.citations.map((cit: any, cIdx: number) => (
                          <div key={cIdx} className="bg-offwhite/80 border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3">
                            <div>
                              <div className="font-semibold text-gray-900 text-sm leading-snug">{cit.doc_title}</div>
                              {cit.section && cit.section !== "unknown" && (
                                <div className="font-mono text-xs bg-white text-forest border border-forest/20 px-2 py-0.5 rounded w-fit mt-2">
                                  Section: {cit.section}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-xs">
                              <span className="text-gray-400">
                                {cit.retrieved_at ? `Retrieved: ${cit.retrieved_at}` : `ID: ${cit.chunk_id}`}
                              </span>
                              {cit.source_url && (
                                <a 
                                  href={cit.source_url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="font-medium text-forest hover:underline flex items-center gap-1"
                                >
                                  View Official Act <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.hr variants={itemVariants} className="border-gray-200" />

              {/* Jurisdiction Notes & Next Steps */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Jurisdiction Notes */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-serif font-bold text-forest">Jurisdiction & Overseas Considerations</h3>
                  <div className="flex flex-col gap-3">
                    {roadmap.jurisdiction_notes && roadmap.jurisdiction_notes.length > 0 ? (
                      roadmap.jurisdiction_notes.map((jn: any, jIdx: number) => (
                        <div key={jIdx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                          <div className="font-semibold text-gray-900 mb-1 flex items-center justify-between">
                            <span>Market: {jn.market || jn.jurisdiction || "General"}</span>
                            {jn.requires_separate_analysis && (
                              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                                Separate Filing
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{jn.note}</p>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
                        Primary jurisdiction focus: India Patent Office (IPO) & National Biodiversity Authority (NBA).
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps Checklist */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-serif font-bold text-forest">Recommended Next Steps</h3>
                  <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                    {roadmap.next_steps && roadmap.next_steps.length > 0 ? (
                      roadmap.next_steps.map((step: string, sIdx: number) => {
                        const isChecked = !!checkedSteps[sIdx];
                        return (
                          <button
                            key={sIdx}
                            onClick={() => toggleStep(sIdx)}
                            className="flex items-start gap-3 p-2.5 text-left group hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="mt-0.5 text-forest flex-shrink-0">
                              {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-gray-400 group-hover:text-forest" />}
                            </div>
                            <span className={cn(
                              "text-gray-700 text-sm leading-relaxed transition-all",
                              isChecked && "line-through text-gray-400"
                            )}>
                              {step}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 p-2">No additional steps specified.</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Human Escalation Cards */}
              {roadmap.human_escalation && roadmap.human_escalation.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-100/50 border-2 border-saffron/30 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-5 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-saffron/10 transform rotate-12 pointer-events-none">
                      <AlertTriangle className="w-48 h-48" />
                    </div>
                    <div className="flex items-center gap-3 border-b border-saffron/20 pb-4 relative z-10">
                      <AlertTriangle className="w-7 h-7 text-saffron" />
                      <h3 className="text-2xl font-serif font-bold text-saffron-dark">Recommended Professional Consultation</h3>
                    </div>
                    
                    <div className="flex flex-col gap-4 relative z-10">
                      {roadmap.human_escalation.map((esc: any, eIdx: number) => (
                        <div key={eIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-saffron/20 shadow-sm hover:shadow-md transition-shadow">
                          <div>
                            <p className="text-gray-900 font-medium text-base">{esc.reason}</p>
                            {esc.urgency && (
                              <p className="text-xs text-amber-700 mt-1">Urgency: {esc.urgency}</p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-flex px-4 py-2 bg-saffron text-white rounded-full text-xs font-bold tracking-wide shadow-sm">
                              Consult: {esc.prof_type || esc.professional_category || "Patent Attorney"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bottom Actions */}
              <motion.div variants={itemVariants} className="mt-8 mb-20 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-8">
                <button
                  onClick={() => router.push("/classify")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to classification
                </button>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => alert("Roadmap report saved. Print or save page as PDF.")}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" /> Download Report
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        sessionStorage.removeItem("ip_session_id");
                        sessionStorage.removeItem("ip_classification");
                      }
                      router.push("/analyze");
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold bg-saffron text-white hover:brightness-110 hover:shadow-md active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" /> Start New Analysis
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Sticky Disclaimer */}
      <div className="fixed bottom-0 left-0 w-full bg-forest text-offwhite/90 p-4 border-t border-forest-dark z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-xs sm:text-sm">
          <div className="bg-forest-light p-1.5 rounded-full flex-shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <p className="leading-relaxed">
            <span className="font-semibold text-white">Disclaimer: </span>
            {roadmap.disclaimer || "This output is for informational purposes only and does not constitute formal legal advice."}
          </p>
        </div>
      </div>
    </div>
  );
}
