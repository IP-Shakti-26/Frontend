"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Stepper } from "@/components/Stepper";
import { classifyProduct } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  
  const [description, setDescription] = useState("");
  const [market, setMarket] = useState<"india" | "international">("india");
  const [countries, setCountries] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [source, setSource] = useState("");
  const [classicalText, setClassicalText] = useState("");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isSubmitDisabled = description.length < 20 || isAnalyzing;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    
    setIsAnalyzing(true);
    setErrorMsg(null);

    // Build rich description payload
    let fullDesc = description.trim();
    if (market === "international" && countries.trim()) {
      fullDesc += ` Target markets include India and ${countries.trim()}.`;
    }
    if (ingredients.trim()) {
      fullDesc += ` Key active ingredients: ${ingredients.trim()}.`;
    }
    if (source.trim()) {
      fullDesc += ` Biological source: ${source.trim()}.`;
    }
    if (classicalText.trim()) {
      fullDesc += ` Classical Ayurvedic text reference: ${classicalText.trim()}.`;
    }
    
    try {
      const response = await classifyProduct(fullDesc);
      
      // Save session info and classification response in sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ip_session_id", response.session_id);
        sessionStorage.setItem("ip_classification", JSON.stringify(response));
        sessionStorage.setItem("ip_raw_description", fullDesc);
      }
      
      router.push("/classify");
    } catch (err: any) {
      console.error("Classification error:", err);
      setErrorMsg(err.message || "Failed to connect to IP-SAKTI server at http://localhost:8082.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <Stepper currentStep={1} />
      
      <div className="w-full max-w-[720px] bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-10 mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest mb-3">
            Describe your product
          </h2>
          <p className="text-gray-600 font-sans text-base sm:text-lg">
            Tell us about your Ayurvedic formula or method to determine IP eligibility.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to process formulation</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="font-semibold text-gray-800 text-sm">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-gray-300 p-4 font-sans text-base focus:outline-none focus:ring-2 focus:ring-forest/50 focus:border-forest focus:scale-[1.01] transition-all resize-y bg-offwhite shadow-inner"
              placeholder="e.g. An Ayurvedic herbal formulation containing Ashwagandha and Shallaki for joint pain relief with synergistically extracted active compounds..."
            />
            <div className="text-xs text-gray-500 text-right">
              {description.length} / 20 min characters
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-semibold text-gray-800 text-sm">Target Market</label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setMarket("india")}
                className={cn(
                  "px-6 py-2.5 rounded-full font-medium text-sm transition-all border active:scale-95",
                  market === "india"
                    ? "bg-forest text-offwhite border-forest shadow-sm"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                )}
              >
                India only
              </button>
              <button
                type="button"
                onClick={() => setMarket("international")}
                className={cn(
                  "px-6 py-2.5 rounded-full font-medium text-sm transition-all border active:scale-95",
                  market === "international"
                    ? "bg-forest text-offwhite border-forest shadow-sm"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                )}
              >
                India + International
              </button>
            </div>
            
            {market === "international" && (
              <div className="mt-2 transition-all">
                <label htmlFor="countries" className="block text-sm font-medium text-gray-700 mb-1">
                  Which countries?
                </label>
                <input
                  type="text"
                  id="countries"
                  value={countries}
                  onChange={(e) => setCountries(e.target.value)}
                  placeholder="e.g. Germany, USA, UK..."
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/50 focus:border-forest bg-offwhite focus:scale-[1.01] transition-all"
                />
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-4 font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span>Add more detail (optional)</span>
              {showDetails ? (
                <ChevronUp className="w-5 h-5 text-gray-500 transition-transform" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 transition-transform" />
              )}
            </button>
            
            {showDetails && (
              <div className="p-5 border-t border-gray-200 flex flex-col gap-5 bg-offwhite/30">
                <div>
                  <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Key Ingredients
                  </label>
                  <input
                    type="text"
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. Ashwagandha, Shallaki, Turmeric..."
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/50 focus:border-forest focus:scale-[1.01] transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Source of biological material
                  </label>
                  <input
                    type="text"
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Western Ghats, local wild-harvested..."
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/50 focus:border-forest focus:scale-[1.01] transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="classicalText" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Classical text reference
                  </label>
                  <input
                    type="text"
                    id="classicalText"
                    value={classicalText}
                    onChange={(e) => setClassicalText(e.target.value)}
                    placeholder="e.g. Charaka Samhita, Sushruta Samhita..."
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/50 focus:border-forest focus:scale-[1.01] transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={cn(
              "mt-2 w-full sm:w-auto sm:self-end flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-md transition-all duration-300 active:scale-95",
              isSubmitDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-saffron text-white hover:brightness-110 hover:shadow-lg hover:-translate-y-1"
            )}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Classifying product...
              </>
            ) : (
              "Classify Product →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
