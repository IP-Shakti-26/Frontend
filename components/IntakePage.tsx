"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, ChevronDown, ChevronUp, AlertCircle, Info, Check, 
  Pill, Apple, Sparkle, HelpCircle, FileText, ArrowRight, ArrowLeft 
} from "lucide-react";
import { getExamples, DemoExample } from "@/lib/api";

export interface IntakeFormData {
  description: string;
  classicalBasis: "classical" | "modified" | "proprietary" | "unsure" | "";
  sourcing: string[];
  intendedCategory: "drug" | "food" | "cosmetic" | "unsure" | "";
  targetMarkets: string[];
  hasBrandName: boolean;
  brandName: string;
}

interface IntakePageProps {
  initialForm?: IntakeFormData;
  onSubmitEnriched: (enrichedDescription: string, rawFormData: IntakeFormData) => void;
  isSubmitting?: boolean;
}

const DEFAULT_FORM: IntakeFormData = {
  description: "",
  classicalBasis: "",
  sourcing: [],
  intendedCategory: "",
  targetMarkets: [],
  hasBrandName: false,
  brandName: "",
};

const FALLBACK_EXAMPLES: DemoExample[] = [
  {
    id: "ex1",
    title: "Liposomal Joint Pain Formulation",
    description: "I have developed a proprietary joint-pain formulation combining Ashwagandha root extract and Shallaki resin in a novel liposomal ratio that provides faster joint inflammation relief.",
    tags: ["proprietary", "abs", "international"],
    complexity: "medium",
  },
  {
    id: "ex2",
    title: "Modified Chyawanprash Granules",
    description: "A sugar-free modified classical Chyawanprash granule preparation incorporating standardized Amla extract and freeze-dried herbs to extend shelf-life to 24 months.",
    tags: ["classical", "food_nutraceutical"],
    complexity: "low",
  },
  {
    id: "ex3",
    title: "Anti-Diabetic Polyherbal Extract",
    description: "A synergistic aqueous extract of Gurmar (Gymnema sylvestre) and Vijaysar (Pterocarpus marsupium) harvested from Madhya Pradesh forests for blood sugar regulation.",
    tags: ["proprietary", "abs"],
    complexity: "high",
  },
  {
    id: "ex4",
    title: "Classical Hair Growth Oil",
    description: "An Ayurvedic hair revitalizer oil manufactured in strict compliance with Ashtanga Hridayam classical procedures using Bhringraj, Amla and sesame oil base.",
    tags: ["classical", "cosmetic"],
    complexity: "low",
  },
];

export function buildEnrichedDescription(form: IntakeFormData): string {
  const lines: string[] = [];

  lines.push(form.description.trim());
  lines.push("");
  lines.push("Additional context:");

  const classicalMap: Record<string, string> = {
    classical: "This formulation follows a classical Ayurvedic text exactly.",
    modified: "This formulation is based on a classical preparation with modifications.",
    proprietary: "This is a proprietary formulation — not derived from a classical text.",
    unsure: "The classical text basis of this formulation is uncertain.",
  };
  if (form.classicalBasis && classicalMap[form.classicalBasis]) {
    lines.push("- " + classicalMap[form.classicalBasis]);
  }

  if (form.sourcing.includes("india")) {
    lines.push("- Ingredients are sourced from India.");
  }
  if (form.sourcing.includes("imported")) {
    lines.push("- Some or all ingredients are imported from outside India.");
  }
  if (form.sourcing.includes("mixed")) {
    lines.push("- Ingredients come from both domestic Indian and imported sources.");
  }
  if (form.sourcing.includes("na")) {
    lines.push("- Biological resource sourcing is not applicable / synthetic.");
  }

  const categoryMap: Record<string, string> = {
    drug: "The product is intended as an Ayurvedic medicine or drug.",
    food: "The product is intended as a food supplement or nutraceutical.",
    cosmetic: "The product is intended as a cosmetic or personal care product.",
    unsure: "The product category (drug/food/cosmetic) has not been determined.",
  };
  if (form.intendedCategory && categoryMap[form.intendedCategory]) {
    lines.push("- " + categoryMap[form.intendedCategory]);
  }

  const marketMap: Record<string, string> = {
    india: "India",
    germany: "Germany",
    uk: "United Kingdom",
    usa: "United States",
    eu: "Other EU countries",
    other: "Other countries",
  };
  if (form.targetMarkets.length > 0) {
    const markets = form.targetMarkets.map((m) => marketMap[m] || m).join(", ");
    lines.push("- Target markets: " + markets);
  }

  if (form.hasBrandName && form.brandName.trim()) {
    lines.push("- Brand name under consideration: " + form.brandName.trim());
  }

  return lines.join("\n");
}

export default function IntakePage({
  initialForm,
  onSubmitEnriched,
  isSubmitting = false,
}: IntakePageProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<IntakeFormData>(initialForm || DEFAULT_FORM);

  const [examplesOpen, setExamplesOpen] = useState(false);
  const [examples, setExamples] = useState<DemoExample[]>(FALLBACK_EXAMPLES);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function fetchScenarios() {
      try {
        const data = await getExamples();
        if (data && data.examples && data.examples.length > 0) {
          setExamples(data.examples);
        }
      } catch (err) {
        console.warn("Using fallback demo scenarios:", err);
      }
    }
    fetchScenarios();
  }, []);

  const handleUseExample = (ex: DemoExample) => {
    const newForm: IntakeFormData = {
      ...form,
      description: ex.description,
    };

    // Auto-select reasonable defaults based on tags
    if (ex.tags.includes("classical")) {
      newForm.classicalBasis = "classical";
    } else if (ex.tags.includes("proprietary")) {
      newForm.classicalBasis = "proprietary";
    }

    if (ex.tags.includes("abs") || ex.tags.includes("india")) {
      newForm.sourcing = ["india"];
    }

    if (ex.tags.includes("food_nutraceutical") || ex.tags.includes("food")) {
      newForm.intendedCategory = "food";
    } else if (ex.tags.includes("cosmetic")) {
      newForm.intendedCategory = "cosmetic";
    } else if (ex.tags.includes("drug")) {
      newForm.intendedCategory = "drug";
    }

    if (ex.tags.includes("international")) {
      newForm.targetMarkets = ["india", "germany"];
    } else if (newForm.targetMarkets.length === 0) {
      newForm.targetMarkets = ["india"];
    }

    setForm(newForm);
    setToastMsg(`Loaded "${ex.title}" — review and customize before analyzing`);
    setTimeout(() => setToastMsg(null), 5000);

    if (textareaRef.current) {
      textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      textareaRef.current.focus();
    }
  };

  const toggleSourcing = (val: string) => {
    setForm((prev) => {
      const exists = prev.sourcing.includes(val);
      const updated = exists
        ? prev.sourcing.filter((s) => s !== val)
        : [...prev.sourcing, val];
      return { ...prev, sourcing: updated };
    });
  };

  const toggleMarket = (val: string) => {
    setForm((prev) => {
      const exists = prev.targetMarkets.includes(val);
      const updated = exists
        ? prev.targetMarkets.filter((m) => m !== val)
        : [...prev.targetMarkets, val];
      return { ...prev, targetMarkets: updated };
    });
  };

  // Validation logic
  const descValid = form.description.trim().length >= 50 && form.description.trim().length <= 2000;
  const classicalValid = Boolean(form.classicalBasis);
  const sourcingValid = form.sourcing.length > 0;
  const categoryValid = Boolean(form.intendedCategory);
  const marketValid = form.targetMarkets.length > 0;

  const missingFields: string[] = [];
  if (!descValid) missingFields.push("Product Description (min 50 chars)");
  if (!classicalValid) missingFields.push("Classical Text Basis");
  if (!sourcingValid) missingFields.push("Biological Resource Sourcing");
  if (!categoryValid) missingFields.push("Intended Product Category");
  if (!marketValid) missingFields.push("Target Markets");

  const isStep1Valid = missingFields.length === 0;

  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStep1Valid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalSubmit = () => {
    const enriched = buildEnrichedDescription(form);
    onSubmitEnriched(enriched, form);
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-[720px] text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-1" style={{ color: "var(--color-primary)" }}>
          IP-SAKTI
        </h1>
        <p className="text-sm font-sans tracking-wide uppercase font-semibold" style={{ color: "var(--color-muted)" }}>
          Ayurvedic Innovation & IP Navigator
        </p>
        <div className="mt-4 border-b w-full" style={{ borderColor: "var(--color-border)" }} />
      </div>

      {toastMsg && (
        <div className="w-full max-w-[720px] mb-6 p-4 rounded-xl text-sm font-medium border flex items-center gap-3 shadow-sm bg-white animate-in fade-in slide-in-from-top-2" style={{ borderColor: "var(--color-accent)", color: "var(--color-primary)" }}>
          <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-accent)" }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* STEP 1 FORM */}
      {step === 1 && (
        <div className="w-full max-w-[720px] bg-white rounded-2xl border p-6 sm:p-10 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
          
          {/* Example Library Collapsible */}
          <div className="mb-8 border rounded-xl overflow-hidden bg-white" style={{ borderColor: "var(--color-border)" }}>
            <button
              type="button"
              onClick={() => setExamplesOpen(!examplesOpen)}
              className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm transition-colors hover:bg-gray-50"
              style={{ color: "var(--color-primary)" }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                <span>Try an example scenario (Instant Pre-fill)</span>
              </div>
              {examplesOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>

            {examplesOpen && (
              <div className="p-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}>
                {examples.map((ex) => (
                  <div key={ex.id} className="p-4 rounded-xl border bg-white flex flex-col justify-between gap-3 shadow-2xs hover:border-forest/40 transition-colors" style={{ borderColor: "var(--color-border)" }}>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="font-serif font-bold text-sm text-gray-900 leading-snug">{ex.title}</h4>
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-bold"
                          style={{
                            backgroundColor: ex.complexity === "high" ? "#FEF3C7" : ex.complexity === "medium" ? "#F3F4F6" : "#DCFCE7",
                            color: ex.complexity === "high" ? "var(--color-accent)" : ex.complexity === "medium" ? "var(--color-muted)" : "var(--color-success)",
                          }}
                        >
                          {ex.complexity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{ex.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
                      <div className="flex flex-wrap gap-1">
                        {ex.tags.slice(0, 2).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-600 border border-gray-200">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUseExample(ex)}
                        className="text-xs font-bold transition-all hover:underline flex items-center gap-1"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Use example →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleProceedToStep2} className="flex flex-col gap-8">
            
            {/* FIELD 1 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="font-semibold text-sm text-gray-900">
                Describe your product or formulation <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-gray-500">
                Include ingredients, preparation method, and what makes it unique.
              </p>
              <textarea
                ref={textareaRef}
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                className="w-full rounded-xl border p-3.5 text-sm font-sans focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-2xs"
                style={{
                  borderColor: form.description.length > 0 && form.description.length < 50 ? "var(--color-warning)" : "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
                placeholder="Example: I have developed a proprietary joint-pain formulation combining Ashwagandha root extract and Shallaki resin in a novel ratio that provides faster absorption..."
              />
              <div className="flex justify-between items-center text-xs">
                <span style={{ color: form.description.length > 0 && form.description.length < 50 ? "var(--color-warning)" : "var(--color-muted)" }}>
                  {form.description.length < 50 && form.description.length > 0
                    ? `Minimum 50 characters required (${50 - form.description.length} more needed)`
                    : "Live character count"}
                </span>
                <span className="font-mono font-medium text-gray-500">
                  {form.description.length} / 2000 chars
                </span>
              </div>
            </div>

            {/* FIELD 2 */}
            <div className="flex flex-col gap-3">
              <label className="font-semibold text-sm text-gray-900">
                Is this based on a classical Ayurvedic text? <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-gray-500">
                e.g. Charaka Samhita, Sushruta Samhita, Ashtanga Hridayam
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Yes — it follows a classical formulation exactly", val: "classical" },
                  { label: "Partially — I modified a classical formulation", val: "modified" },
                  { label: "No — it is my own proprietary formulation", val: "proprietary" },
                  { label: "I am not sure", val: "unsure" },
                ].map((opt) => (
                  <label
                    key={opt.val}
                    className="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all hover:bg-gray-50"
                    style={{
                      borderColor: form.classicalBasis === opt.val ? "var(--color-primary)" : "var(--color-border)",
                      backgroundColor: form.classicalBasis === opt.val ? "#F0FDF4" : "white",
                    }}
                  >
                    <input
                      type="radio"
                      name="classicalBasis"
                      value={opt.val}
                      checked={form.classicalBasis === opt.val}
                      onChange={() => setForm({ ...form, classicalBasis: opt.val as any })}
                      className="mt-0.5 accent-forest"
                    />
                    <span className="text-xs font-medium text-gray-800 leading-snug">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* FIELD 3 */}
            <div className="flex flex-col gap-3">
              <label className="font-semibold text-sm text-gray-900">
                Where are your ingredients/biological materials sourced from? <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "India (domestic sourcing)", val: "india" },
                  { label: "Outside India (imported)", val: "imported" },
                  { label: "Both Indian and imported sources", val: "mixed" },
                  { label: "Not applicable / synthetic", val: "na" },
                ].map((opt) => {
                  const checked = form.sourcing.includes(opt.val);
                  return (
                    <label
                      key={opt.val}
                      className="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all hover:bg-gray-50"
                      style={{
                        borderColor: checked ? "var(--color-primary)" : "var(--color-border)",
                        backgroundColor: checked ? "#F0FDF4" : "white",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSourcing(opt.val)}
                        className="mt-0.5 accent-forest"
                      />
                      <span className="text-xs font-medium text-gray-800 leading-snug">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* FIELD 4 */}
            <div className="flex flex-col gap-3">
              <label className="font-semibold text-sm text-gray-900">
                What type of product is this? <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-gray-500">
                This determines which regulatory framework applies.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Ayurvedic Medicine / Drug", val: "drug", icon: <Pill className="w-4 h-4 text-forest" /> },
                  { label: "Food Supplement / Nutraceutical", val: "food", icon: <Apple className="w-4 h-4 text-amber-600" /> },
                  { label: "Cosmetic / Personal Care", val: "cosmetic", icon: <Sparkle className="w-4 h-4 text-pink-600" /> },
                  { label: "I am not sure yet", val: "unsure", icon: <HelpCircle className="w-4 h-4 text-gray-500" /> },
                ].map((opt) => (
                  <label
                    key={opt.val}
                    className="flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all hover:bg-gray-50"
                    style={{
                      borderColor: form.intendedCategory === opt.val ? "var(--color-primary)" : "var(--color-border)",
                      backgroundColor: form.intendedCategory === opt.val ? "#F0FDF4" : "white",
                    }}
                  >
                    <input
                      type="radio"
                      name="intendedCategory"
                      value={opt.val}
                      checked={form.intendedCategory === opt.val}
                      onChange={() => setForm({ ...form, intendedCategory: opt.val as any })}
                      className="accent-forest"
                    />
                    <div className="flex items-center gap-2">
                      {opt.icon}
                      <span className="text-xs font-medium text-gray-800">{opt.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* FIELD 5 */}
            <div className="flex flex-col gap-3">
              <label className="font-semibold text-sm text-gray-900">
                Where do you plan to sell this product? <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-gray-500">Select all that apply.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "India", val: "india" },
                  { label: "Germany", val: "germany" },
                  { label: "United Kingdom", val: "uk" },
                  { label: "United States", val: "usa" },
                  { label: "Other EU countries", val: "eu" },
                  { label: "Other countries", val: "other" },
                ].map((opt) => {
                  const checked = form.targetMarkets.includes(opt.val);
                  return (
                    <label
                      key={opt.val}
                      className="flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all hover:bg-gray-50"
                      style={{
                        borderColor: checked ? "var(--color-primary)" : "var(--color-border)",
                        backgroundColor: checked ? "#F0FDF4" : "white",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMarket(opt.val)}
                        className="accent-forest"
                      />
                      <span className="text-xs font-medium text-gray-800">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* FIELD 6 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl border bg-gray-50/50" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-semibold text-sm text-gray-900 block">
                    Do you have a brand name in mind?
                  </label>
                  <span className="text-xs text-gray-500">This helps us evaluate trademark protection needs.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, hasBrandName: !form.hasBrandName })}
                  className="px-4 py-1.5 rounded-full text-xs font-bold transition-all border"
                  style={{
                    backgroundColor: form.hasBrandName ? "var(--color-primary)" : "white",
                    color: form.hasBrandName ? "white" : "var(--color-muted)",
                    borderColor: form.hasBrandName ? "var(--color-primary)" : "var(--color-border)",
                  }}
                >
                  {form.hasBrandName ? "Yes" : "No"}
                </button>
              </div>

              {form.hasBrandName && (
                <div className="mt-2 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                  <label htmlFor="brandName" className="block text-xs font-medium text-gray-700 mb-1">
                    What is the brand name or working title?
                  </label>
                  <input
                    type="text"
                    id="brandName"
                    value={form.brandName}
                    onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                    placeholder="e.g. RheumaAyur, Jivana Gel..."
                    className="w-full rounded-lg border p-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                </div>
              )}
            </div>

            {/* Step 1 Validation Alert if incomplete */}
            {!isStep1Valid && missingFields.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">Please complete the required fields to proceed:</p>
                  <ul className="list-disc list-inside space-y-0.5 font-medium">
                    {missingFields.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Step 1 CTA */}
            <button
              type="submit"
              disabled={!isStep1Valid}
              className="w-full py-3.5 px-6 rounded-md font-bold text-white text-base shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-primary)",
              }}
            >
              <span>Review & Analyze →</span>
            </button>
          </form>
        </div>
      )}

      {/* STEP 2 REVIEW PANEL */}
      {step === 2 && (
        <div className="w-full max-w-[960px] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Edit Intake Information
            </button>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-forest/10 text-forest">
              Step 2 of 2 — Review & Confirm
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Intake Summary */}
            <div className="bg-white rounded-2xl border p-6 flex flex-col gap-5 shadow-2xs" style={{ borderColor: "var(--color-border)" }}>
              <div className="border-b pb-3" style={{ borderColor: "var(--color-border)" }}>
                <h3 className="font-serif font-bold text-lg text-gray-900">Intake Information Summary</h3>
                <p className="text-xs text-gray-500">Read-only verification of your inputs.</p>
              </div>

              <div className="flex flex-col gap-4 text-xs">
                <div>
                  <span className="font-semibold text-gray-400 uppercase tracking-wider block mb-1">Description</span>
                  <p className="text-gray-800 font-sans leading-relaxed whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {form.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-400 uppercase tracking-wider block mb-1">Classical Text Basis</span>
                    <span className="font-medium text-gray-900 capitalize">{form.classicalBasis}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400 uppercase tracking-wider block mb-1">Product Category</span>
                    <span className="font-medium text-gray-900 capitalize">{form.intendedCategory}</span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-gray-400 uppercase tracking-wider block mb-1">Sourcing</span>
                  <span className="font-medium text-gray-900">{form.sourcing.join(", ")}</span>
                </div>

                <div>
                  <span className="font-semibold text-gray-400 uppercase tracking-wider block mb-1">Target Markets</span>
                  <span className="font-medium text-gray-900">{form.targetMarkets.join(", ")}</span>
                </div>

                {form.hasBrandName && (
                  <div>
                    <span className="font-semibold text-gray-400 uppercase tracking-wider block mb-1">Brand Name</span>
                    <span className="font-medium text-gray-900">{form.brandName || "Not provided"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Enriched Description Preview */}
            <div className="bg-white rounded-2xl border p-6 flex flex-col justify-between gap-5 shadow-2xs" style={{ borderColor: "var(--color-border)" }}>
              <div>
                <div className="flex items-center gap-2 border-b pb-3 mb-4" style={{ borderColor: "var(--color-border)" }}>
                  <Info className="w-4 h-4 text-forest" />
                  <h3 className="font-serif font-bold text-lg text-gray-900">Enriched Description Preview</h3>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  This combined text will be sent to the IP-SAKTI legal analysis engine:
                </p>

                <pre className="p-4 rounded-xl border font-mono text-xs text-gray-800 leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[360px] bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
                  {buildEnrichedDescription(form)}
                </pre>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-md font-bold text-white text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:scale-[0.99]"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  {isSubmitting ? "Initiating Analysis..." : "Start Analysis →"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 text-center text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  ← Edit details before analyzing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
