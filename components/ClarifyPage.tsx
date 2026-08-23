"use client";

import React, { useState } from "react";
import { HelpCircle, ArrowLeft, Loader2 } from "lucide-react";

interface ClarifyPageProps {
  questions: string[];
  onSubmitAnswers: (answers: Record<string, string>) => void;
  onReset: () => void;
  isSubmitting?: boolean;
}

export default function ClarifyPage({
  questions,
  onSubmitAnswers,
  onReset,
  isSubmitting = false,
}: ClarifyPageProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (idx: number, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [idx.toString()]: text,
    }));
  };

  const isFormValid = questions.every((_, idx) => (answers[idx.toString()] || "").trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isSubmitting) {
      onSubmitAnswers(answers);
    }
  };

  return (
    <div className="w-full min-h-screen py-12 px-4 flex flex-col items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="w-full max-w-[600px] bg-white rounded-3xl border p-6 sm:p-10 shadow-sm flex flex-col gap-6" style={{ borderColor: "var(--color-border)" }}>
        
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--color-border)" }}>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Start over
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Clarification Required
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-600" /> A few more details needed
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            To provide an accurate legal analysis, we need clarification on the following aspects of your formulation:
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {questions.map((qText, idx) => (
            <div key={idx} className="flex flex-col gap-2 p-4 rounded-xl border bg-amber-50/30" style={{ borderColor: "var(--color-border)" }}>
              <label className="text-sm font-semibold text-gray-900 leading-snug">
                {idx + 1}. {qText} <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={answers[idx.toString()] || ""}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                placeholder="Provide details..."
                className="w-full rounded-lg border p-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full py-4 px-6 rounded-md font-bold text-white text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting Clarifications...
              </>
            ) : (
              "Continue Analysis →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
