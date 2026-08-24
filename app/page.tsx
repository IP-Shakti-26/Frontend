"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  Scale, Tag, BookOpen, Leaf, ShieldCheck, CheckCircle, AlertCircle, ArrowRight, XCircle, FileText
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();



  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const domains = [
    { title: "Patentability", icon: <Scale className="w-5 h-5" />, desc: "Novelty, inventiveness, and Section 3(p) compliance." },
    { title: "Trademark", icon: <Tag className="w-5 h-5" />, desc: "Brand identity and distinctiveness protection." },
    { title: "Traditional Knowledge", icon: <BookOpen className="w-5 h-5" />, desc: "TKDL alignment and classical text references." },
    { title: "Biodiversity / ABS", icon: <Leaf className="w-5 h-5" />, desc: "NBA approvals and Biological Diversity Act mandates." },
    { title: "Regulatory Approval", icon: <ShieldCheck className="w-5 h-5" />, desc: "AYUSH/CDSCO marketing and safety authorizations." },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen overflow-hidden relative text-forest-dark font-sans">

      {/* ═══════════════════════════════════════════════
          1. HERO SECTION (Asymmetric split)
          ═══════════════════════════════════════════════ */}
      <section className="relative w-full bg-offwhite z-20 overflow-hidden">
        <div className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 flex items-center min-h-[85vh]">

          {/* Left-aligned Text Column */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="w-full lg:w-[60%] flex flex-col items-start text-left z-10 relative pr-0 lg:pr-8">
            <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-forest leading-[1.05] tracking-tight">
              Know what applies to your innovation.
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl text-forest-light/90 font-sans max-w-xl leading-relaxed">
              IP-SAKTI classifies your Ayurvedic product and routes you to the exact patent, trademark, biodiversity, and regulatory pathways that apply — before you touch a government portal.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-10">
              <button
                onClick={() => router.push("/analyze")}
                className="px-7 py-3 rounded-full font-bold text-base bg-forest-light text-white hover:bg-forest active:bg-forest-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
              >
                Analyze Your Product <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 text-xs text-forest-light/50 tracking-[0.2em] uppercase font-medium">
              Ashwagandha &middot; Shallaki &middot; Tulsi &middot; Turmeric &middot; Neem
            </motion.div>
          </motion.div>

          {/* Right-aligned Hero Image (Fully contained) */}
          <div className="absolute top-0 right-0 w-[55%] h-full pointer-events-none z-0 hidden lg:block">
            <div className="relative w-full h-full">
              <Image
                src="/images/aswagandha.png"
                alt=""
                fill
                className="object-contain object-right-top opacity-[0.35]"
                priority
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. THE PROBLEM SECTION (Two-Column Alternating)
          ═══════════════════════════════════════════════ */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 sm:py-28 flex flex-col lg:flex-row items-center gap-16 lg:gap-20 z-10 relative">

        {/* Left: Text */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeInUp}
          className="w-full lg:w-1/2 flex flex-col items-start text-left"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-forest/10 border border-forest/20 flex items-center justify-center shrink-0">
              <Image src="/images/leaf.png" alt="" width={24} height={24} className="object-contain opacity-90" aria-hidden="true" />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-forest-light/70">The Challenge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-forest mb-6 leading-tight">
            Legal fragmentation, not lack of law.
          </h2>
          <p className="text-forest-light/90 text-lg sm:text-xl leading-relaxed">
            Innovators don&apos;t lack access to legal documents — they lack the ability to know which ones apply to them. IP India, TKDL, NBA, and CDSCO/AYUSH each solve one piece, but nothing connects them.
          </p>
        </motion.div>

        {/* Right: Graphic showing fragmentation */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeInUp}
          className="w-full lg:w-1/2"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-10 border border-forest/10 shadow-sm relative overflow-hidden flex flex-col gap-5">
            {/* Connection nodes representing broken routing */}
            {[
              { name: "IP India", sub: "Patents & Trademarks", icon: <Scale className="w-5 h-5" /> },
              { name: "TKDL", sub: "Traditional Knowledge", icon: <BookOpen className="w-5 h-5" /> },
              { name: "NBA", sub: "Biodiversity Access", icon: <Leaf className="w-5 h-5" /> },
              { name: "CDSCO / AYUSH", sub: "Regulatory Approval", icon: <ShieldCheck className="w-5 h-5" /> }
            ].map((node, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-offwhite/50 border border-gray-100 group transition-colors hover:bg-offwhite">
                <div className="flex items-center gap-4">
                  <div className="bg-forest/[0.05] p-3 rounded-full text-forest-light">
                    {node.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-forest text-sm sm:text-base">{node.name}</h4>
                    <p className="text-xs text-forest-light/60">{node.sub}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-red-500/70 text-xs font-semibold uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">No Routing</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. HOW IT WORKS (Connected Timeline)
          ═══════════════════════════════════════════════ */}
      <section id="how-it-works" className="w-full max-w-6xl mx-auto px-6 py-20 sm:py-28 z-10 relative">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer} className="flex flex-col gap-16">
          <motion.div variants={fadeInUp} className="text-left md:text-center max-w-2xl md:mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-forest mb-4">How it works</h2>
            <p className="text-forest-light/80 text-lg">A simple pipeline from product description to compliance roadmap.</p>
          </motion.div>

          <div className="relative flex flex-col md:flex-row justify-between gap-12 md:gap-6 pt-4">
            {/* Desktop Horizontal Connecting Line */}
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-forest/10 z-0" />
            {/* Mobile Vertical Connecting Line */}
            <div className="md:hidden absolute top-[28px] bottom-[28px] left-[28px] w-[2px] bg-forest/10 z-0" />

            {/* Step 1 */}
            <motion.div variants={fadeInUp} className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-6 relative z-10 flex-1">
              <div className="w-14 h-14 bg-white border border-forest/20 rounded-full flex items-center justify-center shadow-sm shrink-0">
                <Image src="/images/3_leafs.png" alt="Describe" width={28} height={28} className="object-contain" />
              </div>
              <div className="pt-2 md:pt-0">
                <h3 className="text-xl font-serif font-bold text-forest mb-2">1. Describe</h3>
                <p className="text-base text-forest-light/80 leading-relaxed max-w-[280px] mx-auto">Tell us about your formulation, ingredients, and target markets.</p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeInUp} className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-6 relative z-10 flex-1">
              <div className="w-14 h-14 bg-white border border-forest/20 rounded-full flex items-center justify-center shadow-sm shrink-0">
                <Image src="/images/research.png" alt="Classify" width={28} height={28} className="object-contain" />
              </div>
              <div className="pt-2 md:pt-0">
                <h3 className="text-xl font-serif font-bold text-forest mb-2">2. Classify</h3>
                <p className="text-base text-forest-light/80 leading-relaxed max-w-[280px] mx-auto">Our system identifies your product category and confidence level.</p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeInUp} className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-6 relative z-10 flex-1">
              <div className="w-14 h-14 bg-forest text-white rounded-full flex items-center justify-center shadow-md shrink-0">
                <CheckCircle className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="pt-2 md:pt-0">
                <h3 className="text-xl font-serif font-bold text-forest mb-2">3. Roadmap</h3>
                <p className="text-base text-forest-light/80 leading-relaxed max-w-[280px] mx-auto">Get a clear, actionable IP and regulatory compliance checklist.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. PRODUCT PREVIEW SECTION (New mockup)
          ═══════════════════════════════════════════════ */}
      <section className="w-full relative z-10 py-24 sm:py-32 bg-forest/[0.03] border-y border-forest/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-12">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeInUp}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-forest mb-4">See exactly what you get.</h2>
            <p className="text-forest-light/80 text-lg max-w-2xl mx-auto">No more guesswork. Get a structured roadmap detailing exactly which pathways apply to your specific product.</p>
          </motion.div>

          {/* Mockup Frame */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}
            className="w-full max-w-4xl bg-white rounded-t-xl rounded-b-lg shadow-2xl border border-gray-200 overflow-hidden text-left"
          >
            {/* Browser Header */}
            <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="mx-auto w-1/2 h-6 bg-white rounded-md border border-gray-200 flex items-center justify-center">
                <span className="text-[10px] text-gray-400 font-medium">ipsakti.gov.in/roadmap</span>
              </div>
            </div>

            {/* Mockup Body */}
            <div className="p-6 sm:p-10 bg-offwhite/50 flex flex-col gap-8">
              {/* Fake Header Area */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">Modified Classical Formulation</h3>
                  <p className="text-sm text-gray-500">Based on your description</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                  92% Match Confidence
                </span>
              </div>

              {/* Fake Tabs */}
              <div className="flex gap-6 border-b border-gray-200 pb-px text-sm font-medium">
                <div className="pb-3 border-b-2 border-forest text-forest">Patentability</div>
                <div className="pb-3 text-gray-400">Biodiversity</div>
                <div className="pb-3 text-gray-400">Regulatory</div>
              </div>

              {/* Fake Content Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900">Section 3(p) Risk Detected</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Because this formulation combines known ingredients (Ashwagandha and Turmeric), it may fall under Section 3(p) of the Patents Act unless synergistic efficacy is proven.
                </p>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-start gap-3">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-gray-500">Citation: The Patents Act, 1970 &mdash; Section 3(p): &quot;an invention which in effect is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components.&quot;</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. WHAT WE CHECK (Dense Reference Grid)
          ═══════════════════════════════════════════════ */}
      <section className="w-full relative z-10 py-20 sm:py-28 max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer} className="flex flex-col gap-12">

          <div className="text-left border-b border-forest/10 pb-6">
            <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-serif font-bold text-forest">What we check</motion.h2>
            <motion.p variants={fadeInUp} className="text-forest-light/70 text-sm sm:text-base mt-2">The core domains integrated into our analysis engine.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {domains.map((domain, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="flex items-start gap-5">
                <div className="text-forest bg-forest/[0.04] p-3 rounded-full shrink-0">
                  {domain.icon}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-forest mb-1.5 leading-none">{domain.title}</h3>
                  <p className="text-sm text-forest-light/80 leading-relaxed">{domain.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. FINAL CTA (Inverted Color)
          ═══════════════════════════════════════════════ */}
      <section className="w-full bg-forest-dark relative z-10 pt-24 pb-12 sm:pt-32 sm:pb-16 flex flex-col items-center text-center">
        {/* Subtle Shallaki overlay for texture */}
        <div className="absolute bottom-0 left-0 w-80 h-80 md:w-[450px] md:h-[450px] opacity-25 pointer-events-none overflow-hidden">
          <Image src="/images/boswellia.png" alt="" fill className="object-contain object-left-bottom" aria-hidden="true" />
        </div>

        {/* Neem overlay for right side */}
        <div className="absolute bottom-0 right-0 translate-x-24 md:translate-x-48 w-[450px] h-[450px] md:w-[715px] md:h-[715px] opacity-25 pointer-events-none overflow-hidden">
          <Image src="/images/neem.png" alt="" fill className="object-contain object-right-bottom" aria-hidden="true" />
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeInUp} className="max-w-2xl mx-auto px-6 flex flex-col items-center gap-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-offwhite leading-tight">Ready to navigate your IP journey?</h2>
          <button
            onClick={() => router.push("/analyze")}
            className="px-10 py-4 rounded-full font-bold text-lg bg-forest-light text-white hover:bg-forest active:bg-forest-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-2"
          >
            Start Analysis
          </button>
          <div className="flex flex-col items-center gap-2 mt-4">
            <p className="text-offwhite/40 text-xs uppercase tracking-[0.15em] font-medium">
              IP-SAKTI provides information, not legal advice.
            </p>
            {/* TODO(data-pipeline): Replace [N] with real stats from the backend before the demo */}
            <p className="text-offwhite/30 text-[10px] sm:text-xs font-mono px-4">
              Patents Act &middot; Biological Diversity Act &middot; Drugs &amp; Cosmetics Act &middot; Trade Marks Act &middot; GI Act &mdash; [N] provisions indexed.
            </p>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
