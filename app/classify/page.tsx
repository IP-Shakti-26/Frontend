"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Scale, Tag, BookOpen, Leaf, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { Stepper } from "@/components/Stepper";
import { mockClassification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ClassifyResponse, answerClarify } from "@/lib/api";

const formulationTypeMap: Record<string, string> = {
  classical: "Classical Formulation",
  modified_classical: "Modified Classical Formulation",
  proprietary: "Proprietary Non-Classical Formulation",
  new_drug: "New Ayurvedic Drug",
  food: "Food Supplement / Nutraceutical",
  food_nutraceutical: "Food Supplement / Nutraceutical",
  cosmetic: "Cosmetic Product",
};

const domainIcons: Record<string, React.ReactNode> = {
  patent: <Scale className="w-7 h-7" />,
  trademark: <Tag className="w-7 h-7" />,
  traditional_knowledge: <BookOpen className="w-7 h-7" />,
  abs: <Leaf className="w-7 h-7" />,
  biodiversity_abs: <Leaf className="w-7 h-7" />,
  regulatory: <ShieldCheck className="w-7 h-7" />,
};

const domainTitles: Record<string, string> = {
  patent: "Patentability",
  trademark: "Trademark",
  traditional_knowledge: "Traditional Knowledge",
  abs: "Biodiversity / ABS",
  biodiversity_abs: "Biodiversity / ABS",
  regulatory: "Regulatory Approval",
};

const domainDescriptions: Record<string, string> = {
  patent: "Evaluation of novel inventions and Section 3(p) compliance.",
  trademark: "Brand and identity protection.",
  traditional_knowledge: "Alignment with traditional texts & TKDL.",
  abs: "Compliance with Biological Diversity laws & NBA approvals.",
  biodiversity_abs: "Compliance with Biological Diversity laws & NBA approvals.",
  regulatory: "AYUSH/CDSCO market authorization and safety regulations.",
};

const ALL_DOMAINS = ["patent", "trademark", "traditional_knowledge", "biodiversity_abs", "regulatory"] as const;

export default function ClassifyPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [sessionId, setSessionId] = useState<string>("");
  const [classificationData, setClassificationData] = useState<ClassifyResponse | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSession = sessionStorage.getItem("ip_session_id");
      const storedClass = sessionStorage.getItem("ip_classification");

      if (storedSession) setSessionId(storedSession);
      if (storedClass) {
        try {
          const parsed = JSON.parse(storedClass) as ClassifyResponse;
          setClassificationData(parsed);
        } catch (e) {
          console.error("Failed to parse classification data from storage", e);
        }
      }
    }
  }, []);

  // Fallback to mock data if no session exists yet
  const classification = classificationData?.classification;
  const formulationType = classification?.formulation_type || classification?.classification || mockClassification.formulation_type;
  const confidence = classification?.confidence ?? classification?.confidence_score ?? mockClassification.confidence;
  const clarifyingQuestions = classificationData?.clarifying_questions || classification?.clarifying_questions || mockClassification.clarifying_questions || [];
  const detectedDomains = classification?.relevant_domains || classification?.domains || mockClassification.domains;
  const productSummary = classification?.product_summary || classification?.reasoning;

  const showQuestions = clarifyingQuestions.length > 0;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      // If user provided clarification answers, send them via POST /clarify
      const hasAnswers = Object.keys(answers).some((key) => answers[key]?.trim().length > 0);
      const activeSessionId = sessionId || classificationData?.session_id;

      if (showQuestions && hasAnswers && activeSessionId) {
        const updatedRes = await answerClarify(activeSessionId, answers);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("ip_classification", JSON.stringify(updatedRes));
        }
      }

      // Navigate to Step 3 roadmap
      router.push("/roadmap");
    } catch (err: any) {
      console.error("Error submitting clarifications:", err);
      setErrorMsg(err.message || "Failed to submit clarification answers");
      setIsGenerating(false);
    }
  };

  const getConfidenceBadge = (conf: number) => {
    if (conf >= 0.75) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          High Confidence ({(conf * 100).toFixed(0)}%)
        </span>
      );
    }
    if (conf >= 0.5) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          Medium Confidence ({(conf * 100).toFixed(0)}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200 shadow-sm">
        <AlertCircle className="w-4 h-4 text-red-600" />
        Low Confidence ({(conf * 100).toFixed(0)}%)
      </span>
    );
  };

  const isDomainActive = (d: string) => {
    return detectedDomains.some((det) => {
      if (det === d) return true;
      if ((d === "abs" || d === "biodiversity_abs") && (det === "abs" || det === "biodiversity_abs")) return true;
      return false;
    });
  };

  return (
    <div className="flex flex-col items-center w-full pb-20">
      <Stepper currentStep={2} />
      
      <div className="w-full max-w-5xl px-4 sm:px-6 mx-auto flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest">
            Product Classification
          </h2>
          <p className="text-gray-600 mt-2">
            Identified product category and applicable legal & regulatory frameworks.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Clarification Error</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Classification Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1 max-w-2xl">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Classification Verdict</p>
            <h3 className="text-2xl font-serif font-semibold text-gray-900">
              {formulationTypeMap[formulationType] || formulationType || "Ayurvedic Formulation"}
            </h3>
            {productSummary && (
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                {productSummary}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            {getConfidenceBadge(confidence)}
          </div>
        </div>

        {/* Clarifying Questions Callout */}
        {showQuestions && (
          <div className="bg-amber-50/90 rounded-2xl p-6 border border-amber-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900">Clarifying Questions for Better Accuracy</h4>
                <p className="text-amber-700 text-sm">Answering these will help refine statutory citations and domain risk assessment.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {clarifyingQuestions.map((q, idx) => {
                const qKey = `q${idx + 1}`;
                return (
                  <div key={idx} className="flex flex-col gap-2 bg-white/80 p-4 rounded-xl border border-amber-200/60">
                    <label className="text-sm font-medium text-amber-950">
                      {idx + 1}. {q}
                    </label>
                    <input
                      type="text"
                      value={answers[qKey] || answers[`${idx}`] || ""}
                      onChange={(e) => setAnswers({ ...answers, [qKey]: e.target.value, [`${idx}`]: e.target.value })}
                      className="w-full rounded-xl border border-amber-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:scale-[1.01] transition-all bg-white shadow-inner"
                      placeholder="Your answer..."
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detected Domains */}
        <div>
          <h3 className="text-xl font-serif font-bold text-forest mb-4 px-2">Applicable Legal & Regulatory Domains</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ALL_DOMAINS.map((domain) => {
              const active = isDomainActive(domain);
              
              return (
                <div
                  key={domain}
                  className={cn(
                    "flex flex-col p-5 rounded-2xl border transition-all duration-300",
                    active
                      ? "bg-white border-forest shadow-sm hover:shadow-md hover:-translate-y-1 cursor-default"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  )}
                >
                  <div
                    className={cn(
                      "mb-4 p-3 rounded-xl w-fit transition-colors",
                      active ? "bg-forest text-offwhite shadow-sm" : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {domainIcons[domain]}
                  </div>
                  <h4
                    className={cn(
                      "font-semibold mb-1",
                      active ? "text-gray-900" : "text-gray-500"
                    )}
                  >
                    {domainTitles[domain]}
                  </h4>
                  <p className={cn("text-sm leading-relaxed", active ? "text-gray-600" : "text-gray-400")}>
                    {domainDescriptions[domain]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-8">
          <button
            onClick={() => router.push("/analyze")}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-3 font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            ← Edit description
          </button>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={cn(
              "w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-md transition-all duration-300 active:scale-95",
              isGenerating
                ? "bg-saffron/80 text-white cursor-not-allowed"
                : "bg-saffron text-white hover:brightness-110 hover:shadow-lg hover:-translate-y-1"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting & Proceeding...
              </>
            ) : (
              "Generate Synthesis Roadmap →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
