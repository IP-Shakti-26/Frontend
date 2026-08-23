"use client";

import React, { useState, useEffect } from "react";
import { Scale, RefreshCw, AlertCircle } from "lucide-react";

interface AnalyzingPageProps {
  onCheckStatus?: () => void;
  error?: string | null;
}

const STEP_MESSAGES = [
  "Classifying your formulation...",
  "Retrieving relevant legislation...",
  "Analyzing patent considerations...",
  "Evaluating biodiversity obligations...",
  "Generating your IP roadmap...",
  "Verifying citations...",
];

export default function AnalyzingPage({ onCheckStatus, error }: AnalyzingPageProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    // Cycle step text every 4 seconds
    const stepInterval = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % STEP_MESSAGES.length);
    }, 4000);

    // Track total seconds
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(timer);
    };
  }, []);

  const isTimedOut = secondsElapsed >= 90;

  return (
    <div className="w-full min-h-screen py-16 px-4 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-[480px] bg-white rounded-3xl border p-8 sm:p-10 shadow-sm flex flex-col items-center gap-6" style={{ borderColor: "var(--color-border)" }}>
        {/* Logo */}
        <div>
          <h2 className="text-2xl font-serif font-bold" style={{ color: "var(--color-primary)" }}>
            IP-SAKTI
          </h2>
          <p className="text-xs font-sans tracking-wide uppercase font-semibold text-gray-500 mt-0.5">
            Ayurvedic Innovation & IP Navigator
          </p>
        </div>

        {/* Pulse Progress Indicator */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-forest/10 animate-ping absolute opacity-75" />
          <div className="w-16 h-16 rounded-full bg-forest/20 flex items-center justify-center relative z-10">
            <Scale className="w-8 h-8 text-forest" />
          </div>
        </div>

        {/* Dynamic Step Text */}
        <div className="min-h-[48px] flex flex-col justify-center">
          <p className="text-base font-serif font-semibold text-gray-900 animate-pulse">
            {STEP_MESSAGES[stepIdx]}
          </p>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
          This analysis typically takes 30–60 seconds. Our RAG engine searches Qdrant vector database and synthesizes legal statutory precedents.
        </p>

        {error && (
          <div className="w-full p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-left flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Analysis Warning</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Timeout State */}
        {isTimedOut && (
          <div className="mt-2 w-full pt-4 border-t flex flex-col items-center gap-3" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              This is taking longer than expected.
            </p>
            {onCheckStatus && (
              <button
                type="button"
                onClick={onCheckStatus}
                className="px-6 py-2.5 rounded-full font-bold text-xs bg-forest text-white hover:brightness-110 shadow-sm transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Check status
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
