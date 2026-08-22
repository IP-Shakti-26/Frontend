"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Stepper } from "@/components/Stepper";
import { RoadmapSkeleton } from "@/components/RoadmapSkeleton";
import { mockRoadmap } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { 
  Scale, Tag, BookOpen, Leaf, ShieldCheck, 
  ExternalLink, AlertTriangle, CheckSquare, Square, Download, ArrowLeft, RotateCcw
} from "lucide-react";

const domainIcons: Record<string, React.ReactNode> = {
  patent: <Scale className="w-5 h-5" />,
  trademark: <Tag className="w-5 h-5" />,
  traditional_knowledge: <BookOpen className="w-5 h-5" />,
  abs: <Leaf className="w-5 h-5" />,
  regulatory: <ShieldCheck className="w-5 h-5" />,
};

const domainTitles: Record<string, string> = {
  patent: "Patentability",
  trademark: "Trademark",
  traditional_knowledge: "Traditional Knowledge",
  abs: "Biodiversity / ABS",
  regulatory: "Regulatory Approval",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function RoadmapPage() {
  const router = useRouter();
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Simulate streaming data load
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const toggleStep = (idx: number) => {
    setCheckedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (isLoading) return <RoadmapSkeleton />;

  const activeDomain = mockRoadmap.domains[activeTabIdx];

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
            <p className="text-gray-600 font-sans text-lg max-w-3xl">
              {mockRoadmap.product_assessment.summary}
            </p>
          </div>
          <div className="flex-shrink-0">
            {getConfidenceBadge(mockRoadmap.overall_confidence)}
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full border-b border-gray-200 overflow-x-auto no-scrollbar">
          <div className="flex w-max min-w-full">
            {mockRoadmap.domains.map((domain, idx) => {
              const isActive = activeTabIdx === idx;
              return (
                <button
                  key={domain.domain}
                  onClick={() => setActiveTabIdx(idx)}
                  className={cn(
                    "relative flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap outline-none hover:bg-forest/5",
                    isActive ? "text-forest" : "text-gray-500"
                  )}
                >
                  {domainIcons[domain.domain]}
                  {domainTitles[domain.domain]}
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

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTabIdx}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-10"
          >
            {/* Domain Analysis */}
            <motion.div variants={itemVariants}>
              {activeDomain.status === "ok" ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-serif font-semibold text-gray-900">Analysis Finding</h3>
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                      Conf: {Math.round(activeDomain.confidence * 100)}%
                    </span>
                    {activeDomain.escalation_required && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3" /> Needs Escalation
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed max-w-[65ch]">
                    {activeDomain.finding}
                  </p>
                  
                  {activeDomain.citations.length > 0 && (
                    <div className="mt-6 flex flex-col gap-3">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sources</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeDomain.citations.map((cit, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-2">
                            <div className="font-semibold text-gray-900">{cit.doc_title}</div>
                            <div className="font-mono text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded w-fit">
                              {cit.section}
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                              <span className="text-xs text-gray-400">Retrieved: {new Date(cit.retrieved_at).toLocaleDateString()}</span>
                              <a href={cit.source_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-forest hover:underline flex items-center gap-1">
                                View source <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
                  <div className="bg-gray-200 text-gray-500 p-3 rounded-full">
                    <Scale className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Insufficient Evidence</h3>
                  <p className="text-gray-500 max-w-md">
                    This could not be determined from available authoritative sources. Please consult a professional for definitive guidance.
                  </p>
                  <p className="text-gray-600 mt-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm">
                    {activeDomain.finding}
                  </p>
                </div>
              )}
            </motion.div>

            <motion.hr variants={itemVariants} className="border-gray-200" />

            {/* Jurisdiction Notes & Next Steps */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-serif font-bold text-forest">Jurisdiction Notes</h3>
                <div className="flex flex-col gap-3">
                  {mockRoadmap.jurisdiction_notes.map((jn, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="font-semibold text-gray-900 mb-1">{jn.jurisdiction}</div>
                      <p className="text-gray-600 text-sm">{jn.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-serif font-bold text-forest">Next Steps</h3>
                <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-2 shadow-sm">
                  {mockRoadmap.next_steps.map((step, idx) => {
                    const isChecked = !!checkedSteps[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className="flex items-start gap-3 p-2 text-left group hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="mt-0.5 text-forest flex-shrink-0">
                          {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-gray-400 group-hover:text-forest" />}
                        </div>
                        <span className={cn(
                          "text-gray-700 transition-all",
                          isChecked && "line-through text-gray-400"
                        )}>
                          {step}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Human Escalation */}
            {mockRoadmap.human_escalation.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-br from-orange-50 to-amber-100/50 border-2 border-saffron/30 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-5 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 text-saffron/10 transform rotate-12 pointer-events-none">
                    <AlertTriangle className="w-48 h-48" />
                  </div>
                  <div className="flex items-center gap-3 border-b border-saffron/20 pb-4 relative z-10">
                    <AlertTriangle className="w-7 h-7 text-saffron" />
                    <h3 className="text-2xl font-serif font-bold text-saffron-dark">Human Escalation Required</h3>
                  </div>
                  
                  <div className="flex flex-col gap-4 relative z-10">
                    {mockRoadmap.human_escalation.map((esc, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-saffron/20 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-gray-800 font-medium">{esc.reason}</p>
                        <div className="flex-shrink-0">
                          <span className="inline-flex px-4 py-1.5 bg-saffron text-white rounded-full text-sm font-semibold shadow-sm tracking-wide">
                            Consult: {esc.professional_category}
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
                  onClick={() => alert("PDF Download functionality to be implemented.")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" /> Download as PDF
                </button>
                <button
                  onClick={() => router.push("/analyze")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold bg-saffron text-white hover:brightness-110 hover:shadow-md active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Start New Analysis
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Disclaimer */}
      <div className="fixed bottom-0 left-0 w-full bg-forest text-offwhite/90 p-4 border-t border-forest-dark z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-xs sm:text-sm">
          <div className="bg-forest-light p-1.5 rounded-full flex-shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <p className="leading-relaxed">
            <span className="font-semibold text-white">Disclaimer: </span>
            {mockRoadmap.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}

