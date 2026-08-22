import React from "react";
import { Stepper } from "./Stepper";

export function RoadmapSkeleton() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen relative pb-32 animate-pulse bg-white">
      <Stepper currentStep={3} />

      <div className="w-full max-w-5xl px-4 sm:px-6 mx-auto flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full max-w-3xl">
            <div className="h-10 bg-gray-200 rounded-lg w-3/4 sm:w-96 mb-4"></div>
            <div className="h-5 bg-gray-200 rounded-md w-full mb-2"></div>
            <div className="h-5 bg-gray-200 rounded-md w-5/6"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-full w-32 flex-shrink-0"></div>
        </div>

        {/* Tabs */}
        <div className="w-full border-b border-gray-200 flex gap-4 overflow-hidden pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-md w-32 flex-shrink-0"></div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded-md w-full max-w-[65ch]"></div>
            <div className="h-4 bg-gray-200 rounded-md w-11/12 max-w-[60ch]"></div>
            <div className="h-4 bg-gray-200 rounded-md w-4/5 max-w-[55ch]"></div>
            
            <div className="mt-6 flex flex-col gap-3">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Jurisdiction & Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="h-7 bg-gray-200 rounded-lg w-48"></div>
              <div className="h-24 bg-gray-100 rounded-xl"></div>
              <div className="h-24 bg-gray-100 rounded-xl"></div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-7 bg-gray-200 rounded-lg w-32"></div>
              <div className="h-56 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
          
          <div className="h-32 bg-orange-50/50 border border-orange-100 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}
