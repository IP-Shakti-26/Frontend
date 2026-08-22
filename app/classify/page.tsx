"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Scale, Tag, BookOpen, Leaf, ShieldCheck, AlertCircle } from "lucide-react";
import { Stepper } from "@/components/Stepper";
import { mockClassification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const formulationTypeMap: Record<string, string> = {
  classical: "Classical Formulation",
  modified_classical: "Modified Classical Formulation",
  proprietary: "Proprietary Non-Classical Formulation",
  new_drug: "New Ayurvedic Drug",
  food: "Food Supplement",
  cosmetic: "Cosmetic Product",
};

const domainIcons: Record<string, React.ReactNode> = {
  patent: <Scale className="w-7 h-7" />,
  trademark: <Tag className="w-7 h-7" />,
  traditional_knowledge: <BookOpen className="w-7 h-7" />,
  abs: <Leaf className="w-7 h-7" />,
  regulatory: <ShieldCheck className="w-7 h-7" />,
};

const domainTitles: Record<string, string> = {
  patent: "Patentability",
  trademark: "Trademark",
  traditional_knowledge: "Traditional Knowledge",
  abs: "Biodiversity / ABS",
  regulatory: "Regulatory Approval",
};

const domainDescriptions: Record<string, string> = {
  patent: "Evaluation of novel inventions and synergism.",
  trademark: "Brand and identity protection.",
  traditional_knowledge: "Alignment with traditional texts.",
  abs: "Compliance with Biological Diversity laws.",
  regulatory: "Market authorization and safety regulations.",
};

const ALL_DOMAINS = ["patent", "trademark", "traditional_knowledge", "abs", "regulatory"];

export default function ClassifyPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const { formulation_type, confidence, clarifying_questions, domains } = mockClassification;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      router.push("/roadmap");
    }, 2000);
  };

  const getConfidenceBadge = (conf: number) => {
    if (conf >= 0.75) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
          High Confidence
        </span>
      );
    }
    if (conf >= 0.5) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          Medium Confidence
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
        Low Confidence
      </span>
    );
  };

  const showQuestions = confidence < 0.7 && clarifying_questions.length > 0;

  return (
    <div className="flex flex-col items-center w-full pb-20">
      <Stepper currentStep={2} />
      
      <div className="w-full max-w-5xl px-4 sm:px-6 mx-auto flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest">
            Here&apos;s what we found.
          </h2>
        </div>

        {/* Classification Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Product Classification</p>
            <h3 className="text-2xl font-serif font-semibold text-gray-900">
              {formulationTypeMap[formulation_type] || "Unknown Formulation"}
            </h3>
          </div>
          <div className="flex-shrink-0">
            {getConfidenceBadge(confidence)}
          </div>
        </div>

        {/* Clarifying Questions Callout */}
        {showQuestions && (
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900">We need a bit more detail.</h4>
                <p className="text-amber-700 text-sm">Answering these will improve accuracy (optional).</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {clarifying_questions.map((q, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-amber-900">{q}</label>
                  <input
                    type="text"
                    value={answers[idx] || ""}
                    onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                    className="w-full rounded-xl border border-amber-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:scale-[1.01] transition-all bg-white shadow-inner"
                    placeholder="Your answer..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detected Domains */}
        <div>
          <h3 className="text-xl font-serif font-bold text-forest mb-4 px-2">Detected Domains</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ALL_DOMAINS.map((domain) => {
              const isActive = domains.includes(domain);
              
              return (
                <div
                  key={domain}
                  className={cn(
                    "flex flex-col p-5 rounded-2xl border transition-all duration-300",
                    isActive
                      ? "bg-white border-forest shadow-sm hover:shadow-md hover:-translate-y-1 cursor-default"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  )}
                >
                  <div
                    className={cn(
                      "mb-4 p-3 rounded-xl w-fit transition-colors",
                      isActive ? "bg-forest text-offwhite shadow-sm" : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {domainIcons[domain]}
                  </div>
                  <h4
                    className={cn(
                      "font-semibold mb-1",
                      isActive ? "text-gray-900" : "text-gray-500"
                    )}
                  >
                    {domainTitles[domain]}
                  </h4>
                  <p className={cn("text-sm", isActive ? "text-gray-600" : "text-gray-400")}>
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
                Retrieving relevant law...
              </>
            ) : (
              "Generate Roadmap →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

