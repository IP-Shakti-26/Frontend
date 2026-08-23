"use client";

import React, { useState, useEffect } from "react";
import IntakePage, { IntakeFormData } from "@/components/IntakePage";
import AnalyzingPage from "@/components/AnalyzingPage";
import ClarifyPage from "@/components/ClarifyPage";
import RoadmapPage from "@/components/RoadmapPage";
import { 
  classifyProduct, 
  analyzeSession, 
  clarifySession, 
  getSummary, 
  IPRoadmap, 
  SummaryResponse 
} from "@/lib/api";

export type AppView = "intake" | "analyzing" | "clarify" | "roadmap";

export default function MainApp() {
  const [view, setView] = useState<AppView>("intake");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IntakeFormData | undefined>(undefined);
  // classification state removed since it's unused
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);
  const [roadmap, setRoadmap] = useState<IPRoadmap | null>(null);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const savedSession = sessionStorage.getItem("ipsakti_session_id");
      const savedRoadmap = sessionStorage.getItem("ipsakti_roadmap");
      if (savedSession && savedRoadmap) {
        setSessionId(savedSession);
        setRoadmap(JSON.parse(savedRoadmap));
        setView("roadmap");
      }
    } catch {
      // ignore parsing errors
    }
  }, []);

  const handleReset = () => {
    setView("intake");
    setSessionId(null);
    setFormData(undefined);
    // clear classification state
    setClarifyingQuestions([]);
    setRoadmap(null);
    setSummary(null);
    setError(null);
    setIsSubmitting(false);

    try {
      sessionStorage.removeItem("ipsakti_session_id");
      sessionStorage.removeItem("ipsakti_roadmap");
      sessionStorage.removeItem("ipsakti_summary");
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartAnalysis = async (enrichedDescription: string, rawForm: IntakeFormData) => {
    setFormData(rawForm);
    setView("analyzing");
    setError(null);
    setIsSubmitting(true);

    try {
      const classifyRes = await classifyProduct(enrichedDescription);
      setSessionId(classifyRes.session_id);

      if (classifyRes.needs_clarification && classifyRes.clarifying_questions && classifyRes.clarifying_questions.length > 0) {
        setClarifyingQuestions(classifyRes.clarifying_questions);
        setView("clarify");
        setIsSubmitting(false);
        return;
      }

      // unused classification assignment removed

      const analyzeRes = await analyzeSession(classifyRes.session_id);
      setRoadmap(analyzeRes.roadmap);

      try {
        sessionStorage.setItem("ipsakti_session_id", classifyRes.session_id);
        sessionStorage.setItem("ipsakti_roadmap", JSON.stringify(analyzeRes.roadmap));
      } catch {
        // ignore
      }

      getSummary(classifyRes.session_id)
        .then((sRes) => setSummary(sRes))
        .catch(() => {});

      setView("roadmap");
    } catch (err: unknown) {
      console.error("Analysis Pipeline Error:", err);
      setError(err instanceof Error ? err.message : "Failed to complete formulation analysis. Please verify server connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitClarifications = async (answers: Record<string, string>) => {
    if (!sessionId) return;
    setView("analyzing");
    setError(null);
    setIsSubmitting(true);

    try {
      await clarifySession(sessionId, answers);
      const analyzeRes = await analyzeSession(sessionId);
      setRoadmap(analyzeRes.roadmap);

      try {
        sessionStorage.setItem("ipsakti_session_id", sessionId);
        sessionStorage.setItem("ipsakti_roadmap", JSON.stringify(analyzeRes.roadmap));
      } catch {
        // ignore
      }

      getSummary(sessionId)
        .then((sRes) => setSummary(sRes))
        .catch(() => {});

      setView("roadmap");
    } catch (err: unknown) {
      console.error("Clarification Submission Error:", err);
      setError(err instanceof Error ? err.message : "Failed to process clarifications.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!sessionId) return;
    setError(null);
    try {
      const analyzeRes = await analyzeSession(sessionId);
      setRoadmap(analyzeRes.roadmap);

      try {
        sessionStorage.setItem("ipsakti_session_id", sessionId);
        sessionStorage.setItem("ipsakti_roadmap", JSON.stringify(analyzeRes.roadmap));
      } catch {
        // ignore
      }

      getSummary(sessionId)
        .then((sRes) => setSummary(sRes))
        .catch(() => {});

      setView("roadmap");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Roadmap synthesis is still in progress. Please check again in a few moments.");
    }
  };

  return (
    <main className="w-full min-h-screen relative flex flex-col">
      <div className="relative z-10 w-full min-h-screen">
        {view === "intake" && (
          <IntakePage
            initialForm={formData}
            onSubmitEnriched={handleStartAnalysis}
            isSubmitting={isSubmitting}
          />
        )}

        {view === "analyzing" && (
          <AnalyzingPage
            onCheckStatus={sessionId ? handleCheckStatus : undefined}
            error={error}
          />
        )}

        {view === "clarify" && (
          <ClarifyPage
            questions={clarifyingQuestions}
            onSubmitAnswers={handleSubmitClarifications}
            onReset={handleReset}
            isSubmitting={isSubmitting}
          />
        )}

        {view === "roadmap" && sessionId && roadmap && (
          <RoadmapPage
            sessionId={sessionId}
            roadmap={roadmap}
            initialSummary={summary}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
