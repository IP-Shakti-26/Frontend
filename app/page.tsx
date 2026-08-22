"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FileText, ScanSearch, ListChecks, 
  Scale, Tag, BookOpen, Leaf, ShieldCheck 
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById("how-it-works");
    elem?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const domains = [
    { title: "Patentability", icon: <Scale className="w-6 h-6" />, desc: "Novelty, inventiveness, and Section 3(p) compliance." },
    { title: "Trademark", icon: <Tag className="w-6 h-6" />, desc: "Brand identity and distinctiveness protection." },
    { title: "Traditional Knowledge", icon: <BookOpen className="w-6 h-6" />, desc: "TKDL alignment and classical text references." },
    { title: "Biodiversity / ABS", icon: <Leaf className="w-6 h-6" />, desc: "NBA approvals and Biological Diversity Act mandates." },
    { title: "Regulatory Approval", icon: <ShieldCheck className="w-6 h-6" />, desc: "AYUSH/CDSCO marketing and safety authorizations." },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-offwhite overflow-hidden relative">
      
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[40rem] h-[40rem] bg-gradient-to-br from-forest/5 to-saffron/10 rounded-full blur-3xl pointer-events-none opacity-70" />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-24 flex flex-col items-center text-center z-10">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center gap-6 max-w-4xl">
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-forest leading-tight tracking-tight">
            Know what applies to your innovation.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-700 font-sans max-w-3xl leading-relaxed">
            IP-SAKTI classifies your Ayurvedic product and routes you to the exact patent, trademark, biodiversity, and regulatory pathways that apply — before you touch a government portal.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-4 flex flex-col items-center gap-6">
            <button
              onClick={() => router.push("/analyze")}
              className="px-10 py-4 rounded-full font-bold text-lg bg-saffron text-white hover:brightness-110 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all shadow-md"
            >
              Analyze Your Product →
            </button>
            <a 
              href="#how-it-works" 
              onClick={handleScroll}
              className="text-gray-500 hover:text-forest font-medium text-sm sm:text-base transition-colors"
            >
              See how it works ↓
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* The Problem Section */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
        className="w-full bg-white py-16 sm:py-24 border-y border-gray-100 z-10"
      >
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col gap-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest">
            Legal fragmentation, not lack of law.
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
            Innovators don't lack access to legal documents — they lack the ability to know which ones apply to them. IP India, TKDL, NBA, and CDSCO/AYUSH each solve one piece, but nothing connects them.
          </p>
        </div>
      </motion.section>

      {/* How it works */}
      <section id="how-it-works" className="w-full max-w-7xl mx-auto px-6 py-20 sm:py-28 z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="flex flex-col gap-12">
          <div className="text-center">
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-serif font-bold text-forest">How it works</motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FileText className="w-8 h-8" />, title: "1. Describe", desc: "Tell us about your formulation, ingredients, and target markets." },
              { icon: <ScanSearch className="w-8 h-8" />, title: "2. Classify", desc: "Our system identifies your product category and confidence level." },
              { icon: <ListChecks className="w-8 h-8" />, title: "3. Roadmap", desc: "Get a clear, actionable IP and regulatory compliance checklist." }
            ].map((step, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="bg-forest/10 text-forest p-4 rounded-2xl mb-2">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* What we check */}
      <section className="w-full bg-white py-20 sm:py-28 border-t border-gray-100 z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
          <div className="text-center">
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-serif font-bold text-forest">What we check</motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {domains.map((domain, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-offwhite rounded-2xl p-6 border border-gray-200 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="bg-white text-forest p-3 rounded-xl w-fit shadow-sm">
                  {domain.icon}
                </div>
                <h3 className="font-bold text-gray-900">{domain.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{domain.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 py-24 sm:py-32 flex flex-col items-center text-center gap-8 z-10">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest">Ready to navigate your IP journey?</h2>
        <button
          onClick={() => router.push("/analyze")}
          className="px-10 py-4 rounded-full font-bold text-lg bg-saffron text-white hover:brightness-110 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all shadow-md"
        >
          Analyze Your Product →
        </button>
        <p className="text-sm text-gray-400 mt-2">
          IP-SAKTI provides information, not legal advice.
        </p>
      </section>
      
    </div>
  );
}
