import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
}

export function Stepper({ currentStep }: StepperProps) {
  const steps = [
    { id: 1, name: "Describe" },
    { id: 2, name: "Classify" },
    { id: 3, name: "Roadmap" },
  ];

  return (
    <div className="w-full py-6 pb-12">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isPast = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center relative">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors duration-300",
                    isActive
                      ? "border-forest bg-forest text-offwhite ring-4 ring-forest/20"
                      : isPast
                      ? "border-forest bg-forest text-offwhite"
                      : "border-gray-300 bg-white text-gray-500"
                  )}
                >
                  {isPast ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <span
                  className={cn(
                    "absolute top-12 text-sm font-medium whitespace-nowrap transition-colors duration-300",
                    isActive ? "text-forest" : isPast ? "text-forest" : "text-gray-400"
                  )}
                >
                  {step.name}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "h-1 w-16 sm:w-24 md:w-32 mx-2 rounded transition-colors duration-300",
                    isPast ? "bg-forest" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
