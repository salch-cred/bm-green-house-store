"use client";

import Link from "next/link";
import { ArrowLeft, Info, Package, Leaf } from "@phosphor-icons/react";
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
          </div>
        </motion.div>
      </div>
    </main>
  );
}
