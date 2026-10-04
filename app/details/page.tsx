"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Info, Package, Leaf, Sparkle } from "@phosphor-icons/react";
import { motion } from "motion/react";

export default function DetailsPage() {
  return (
    <main className="min-h-screen p-6 md:p-12 bg-[var(--background)]">
      <div className="max-w-[800px] mx-auto pt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] mb-12 transition-colors font-medium">
          <ArrowLeft size={20} />
          <span>Back to Store</span>
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[var(--foreground)]">Product Details</h1>
          <p className="text-[var(--muted)] text-lg mb-12 font-medium">Everything you need to know about our roasted dates seed powder.</p>
          
          <div className="grid gap-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-3xl flex gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center flex-shrink-0">
                <Leaf size={28} className="text-[var(--accent)]" weight="duotone" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">Ingredients</h3>
                <p className="text-[var(--muted)] leading-relaxed">100% natural roasted date seeds. Sourced from premium date palms, thoroughly cleaned, slowly roasted to perfection, and finely milled.</p>
              </div>
            </div>
            
            <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-3xl flex gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center flex-shrink-0">
                <Info size={28} className="text-[var(--accent)]" weight="duotone" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">Nutritional Profile</h3>
                <p className="text-[var(--muted)] leading-relaxed">Rich in antioxidants, dietary fiber, and essential minerals like potassium and magnesium. Naturally caffeine-free and zero added sugar.</p>
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-3xl flex gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center flex-shrink-0">
                <Package size={28} className="text-[var(--accent)]" weight="duotone" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[var(--foreground)]">Storage Instructions</h3>
                <p className="text-[var(--muted)] leading-relaxed">Store in a cool, dry place away from direct sunlight. Ensure the pack is tightly sealed after every use to preserve the fresh roasted aroma.</p>
              </div>
            </div>
            
            <div className="mt-12 bg-gradient-to-br from-[var(--surface-hover)] to-[var(--surface)] border border-[var(--border)] p-12 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 blur-[80px] rounded-full pointer-events-none" />
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
                <h3 className="text-2xl font-extrabold mb-3">Pure Quality Inside Out</h3>
                <p className="text-[var(--muted)] leading-relaxed mb-6 max-w-sm">
                  Our packaging is designed to keep every ounce of freshness locked in, so you experience the authentic earthy aroma every time you brew.
                </p>
                <Link href="/" className="inline-block bg-[var(--accent)] text-white px-6 py-3 rounded-full font-bold hover:bg-[var(--accent-hover)] transition-colors shadow-md">
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
