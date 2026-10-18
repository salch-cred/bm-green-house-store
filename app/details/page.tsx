"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Info, Package, Leaf, Sparkle, Coffee, Drop, Fire,
  ShieldCheck, Lightning, Star, CheckCircle,
} from "@phosphor-icons/react";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8%" },
  transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
};

const quickFacts = [
  { icon: Leaf, label: "100% natural" },
  { icon: Coffee, label: "Caffeine-free" },
  { icon: ShieldCheck, label: "No preservatives" },
  { icon: Package, label: "100g pack" },
];

const infoCards = [
  {
    icon: Leaf,
    title: "Ingredients",
    text: "100% natural roasted date seeds. Sourced from premium date palms, thoroughly cleaned, slowly roasted to perfection, and finely milled.",
    chip: "Single ingredient",
  },
  {
    icon: Info,
    title: "Nutritional Profile",
    text: "Rich in antioxidants, dietary fiber, and essential minerals like potassium and magnesium. Naturally caffeine-free and zero added sugar.",
    chip: "Nutrient dense",
  },
  {
    icon: Package,
    title: "Storage Instructions",
    text: "Store in a cool, dry place away from direct sunlight. Ensure the pack is tightly sealed after every use to preserve the fresh roasted aroma.",
    chip: "Keeps 6+ months",
  },
];

const nutrition = [
  { icon: ShieldCheck, label: "Antioxidants", desc: "Fight everyday oxidative stress" },
  { icon: Drop, label: "Dietary fiber", desc: "Supports happy digestion" },
  { icon: Lightning, label: "Potassium", desc: "For steady energy & balance" },
  { icon: Fire, label: "Magnesium", desc: "Muscle & nerve support" },
];

const brewSteps = [
  { icon: Drop, title: "Add", text: "Stir one teaspoon into a cup of hot water or warm milk." },
  { icon: Coffee, title: "Brew", text: "Mix well until the roasted aroma blooms — no brewing machine needed." },
  { icon: Star, title: "Enjoy", text: "Sip slow. Zero caffeine, zero crash — just a warm earthy cup." },
];

export default function DetailsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] pb-24">
      {/* ── Decorative hero ─────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[var(--accent)] via-[#3a5238] to-[#2D422B] text-white pt-20 pb-28 px-6">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <motion.div animate={{ y: [0, -16, 0], rotate: [0, 10, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 right-[10%] opacity-25"><Leaf size={80} weight="duotone" /></motion.div>
        <motion.div animate={{ y: [0, 14, 0], rotate: [0, -8, 0] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-12 left-[7%] opacity-20"><Coffee size={68} weight="duotone" /></motion.div>
        <motion.div animate={{ y: [0, -11, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute top-28 left-[22%] opacity-20"><Sparkle size={46} weight="duotone" /></motion.div>

        <div className="max-w-[860px] mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-10 transition-colors font-medium text-sm">
            <ArrowLeft size={18} /> Back to store
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5">
              <Package size={14} weight="fill" /> Product guide
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4">
              Inside the <span className="italic font-serif">pack.</span>
            </h1>
            <p className="text-white/80 text-lg font-medium max-w-xl">
              Everything you need to know about our roasted dates seed powder — from seed to cup.
            </p>
          </motion.div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-8 bg-[var(--background)] rounded-t-[48px]" />
      </header>

      <div className="max-w-[860px] mx-auto px-6 -mt-6">
        {/* ── Quick facts strip ─────────────────────────────── */}
        <motion.div {...fadeUp} className="bg-[var(--surface)] border border-[var(--border)] rounded-[28px] shadow-lg p-5 mb-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickFacts.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 justify-center md:justify-start">
              <span className="w-9 h-9 rounded-xl bg-[var(--surface-hover)] flex items-center justify-center text-[var(--accent)] shrink-0"><f.icon size={18} weight="duotone" /></span>
              <span className="text-xs font-extrabold text-[var(--foreground)] leading-tight">{f.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Info cards ─────────────────────────────── */}
        <div className="grid gap-6 mb-16">
          {infoCards.map((card, i) => (
            <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: Math.min(i * 0.08, 0.2) }}
              className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-[26px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--accent)] opacity-[0.05] blur-3xl rounded-full group-hover:opacity-[0.1] transition-opacity" />
              <div className="flex gap-6 relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#5a7a4a] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <card.icon size={26} weight="duotone" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-extrabold text-[var(--foreground)]">{card.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--surface-hover)] text-[var(--accent)] px-2.5 py-1 rounded-full">{card.chip}</span>
                  </div>
                  <p className="text-[var(--muted)] leading-relaxed">{card.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Nutrition grid ─────────────────────────────── */}
        <motion.div {...fadeUp} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] mb-2 flex items-center gap-3">
            <Drop size={26} weight="duotone" className="text-[var(--accent)]" /> What one cup gives you
          </h2>
          <p className="text-[var(--muted)] font-medium mb-6">Naturally present in every roasted date seed — nothing added, nothing removed.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {nutrition.map((n, i) => (
              <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: Math.min(i * 0.06, 0.24) }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center text-[var(--accent)]"><n.icon size={24} weight="duotone" /></div>
                <p className="font-extrabold text-sm text-[var(--foreground)] mb-1">{n.label}</p>
                <p className="text-[11px] text-[var(--muted)] font-medium leading-snug">{n.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── How to brew ─────────────────────────────── */}
        <motion.div {...fadeUp} className="relative bg-gradient-to-br from-[var(--surface-hover)] to-[var(--surface)] border border-[var(--border)] rounded-[32px] shadow-sm p-8 md:p-12 mb-16 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--accent)] via-[#839b5c] to-[#E4B363]" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] mb-8 text-center">Your cup in three steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
            {/* connecting line (desktop) */}
            <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-[var(--border)]" />
            {brewSteps.map((s, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg">
                    <s.icon size={24} weight="duotone" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white border border-[var(--border)] text-[var(--accent)] text-[11px] font-extrabold flex items-center justify-center shadow-sm">{i + 1}</span>
                </div>
                <h3 className="font-extrabold text-lg text-[var(--foreground)] mb-1.5">{s.title}</h3>
                <p className="text-sm text-[var(--muted)] font-medium leading-relaxed max-w-[240px]">{s.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Product showcase ─────────────────────────────── */}
        <motion.div {...fadeUp} className="bg-gradient-to-br from-[var(--surface-hover)] to-[var(--surface)] border border-[var(--border)] p-10 md:p-12 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-12 mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 blur-[80px] rounded-full pointer-events-none" />
          <motion.div animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-2 left-[8%] text-[var(--accent)] opacity-[0.07] pointer-events-none hidden md:block"><Leaf size={110} weight="duotone" /></motion.div>
          <div className="relative w-64 h-64 flex-shrink-0">
            <div className="absolute inset-0 bg-white/40 border border-white backdrop-blur-xl rounded-full scale-110 shadow-xl" />
            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="w-full h-full relative z-10">
              <Image src="/product-png2.png" alt="Product Pack" fill className="object-contain drop-shadow-2xl p-4 hover:scale-110 transition-transform duration-500" />
            </motion.div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-4 -right-4 text-[var(--accent)] z-20">
              <Sparkle size={32} weight="duotone" />
            </motion.div>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-4 -left-4 bg-white px-3 py-1 rounded-full shadow-md border border-[var(--border)] z-20 font-bold text-xs">
              Premium
            </motion.div>
          </div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl font-extrabold mb-3 text-[var(--foreground)]">Pure quality inside out</h3>
            <p className="text-[var(--muted)] leading-relaxed mb-6 max-w-sm">
              Our packaging is designed to keep every ounce of freshness locked in, so you experience the authentic earthy aroma every time you brew.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {["Slow roasted", "Finely milled", "Small batches"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-[11px] font-bold bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5 text-[var(--muted)]">
                  <CheckCircle size={12} weight="fill" className="text-[var(--accent)]" /> {t}
                </span>
              ))}
            </div>
            <Link href="/#products" className="inline-block bg-[var(--accent)] text-white px-7 py-3.5 rounded-full font-bold hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 transition-all shadow-md">
              Order now
            </Link>
          </div>
        </motion.div>

        {/* ── CTA ─────────────────────────────── */}
        <motion.div {...fadeUp} className="relative overflow-hidden bg-gradient-to-br from-[var(--accent)] to-[#2D422B] text-white rounded-[32px] p-10 md:p-14 text-center">
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-6 right-12 opacity-20"><Leaf size={88} weight="duotone" /></motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-8 left-12 opacity-15"><Coffee size={64} weight="duotone" /></motion.div>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3 relative z-10">Taste the difference yourself.</h3>
          <p className="text-white/80 font-medium mb-8 max-w-md mx-auto relative z-10">One 100g pack makes around 50 cups of your new favorite ritual.</p>
          <Link href="/#products" className="relative z-10 inline-flex items-center gap-2 bg-white text-[var(--accent)] font-bold px-8 py-4 rounded-full text-sm hover:bg-white/90 transition-colors shadow-md">
            Shop the collection <ArrowLeft size={16} weight="bold" className="rotate-180" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
