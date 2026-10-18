"use client";

import Link from "next/link";
import { ArrowLeft, Star, Image as ImageIcon, X, Leaf, Quote, SealCheck, Sparkle, CheckCircle } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useMemo } from "react";
import { KEYS, fetchShared, loadJSON, saveJSON } from "../lib/store";

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  photoUrl?: string;
  date: string;
};

const initialReviews: Review[] = [
  {
    id: "1",
    name: "Rahul S.",
    rating: 5,
    text: "Completely replaced my morning coffee. The roasted flavor is incredibly deep and I don't get the afternoon crash anymore.",
    date: "10/1/2026"
  },
  {
    id: "2",
    name: "Priya M.",
    rating: 5,
    text: "I add a teaspoon to my protein shake every morning. It adds a rich, earthy taste that I love.",
    date: "10/2/2026"
  }
];

const AVATAR_GRADIENTS = [
  "from-[#3E5A3B] to-[#839b5c]",
  "from-[#C58B3D] to-[#E4B363]",
  "from-[#9C6B4E] to-[#C8946C]",
  "from-[#4E7A63] to-[#7FB094]",
  "from-[#7A6BA8] to-[#A99CD8]",
];

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8%" },
  transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReview, setNewReview] = useState<Partial<Review>>({ rating: 5, text: "", name: "" });
  const [posted, setPosted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = loadJSON<Review[] | null>(KEYS.reviews, null);
    setReviews(saved ?? initialReviews);
    // Shared cloud store (admin publishes) → same reviews on every device.
    fetchShared().then((d) => {
      if (d?.reviews && Array.isArray(d.reviews) && d.reviews.length > 0) {
        setReviews(d.reviews);
        saveJSON(KEYS.reviews, d.reviews);
      }
    }).catch(() => {});
  }, []);

  const stats = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    const avg = total ? sum / total : 0;
    const dist = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => Math.round(r.rating) === star).length,
    }));
    return { total, avg, dist };
  }, [reviews]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewReview(prev => ({ ...prev, photoUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;

    const review: Review = {
      id: Date.now().toString(),
      name: newReview.name,
      rating: newReview.rating || 5,
      text: newReview.text,
      photoUrl: newReview.photoUrl,
      date: new Date().toLocaleDateString()
    };

    const updated = [review, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem("bm-store-reviews", JSON.stringify(updated));
    } catch {
      alert("Review saved for this session, but browser storage is full (photo too large?). Try a smaller photo.");
    }

    setNewReview({ rating: 5, text: "", name: "", photoUrl: "" });
    setIsFormOpen(false);
    setPosted(true);
    setTimeout(() => setPosted(false), 2600);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] pb-24">
      {/* ── Decorative hero ─────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[var(--accent)] via-[#3a5238] to-[#2D422B] text-white pt-20 pb-28 px-6">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <motion.div animate={{ y: [0, -16, 0], rotate: [0, 10, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 right-[10%] opacity-25"><Leaf size={80} weight="duotone" /></motion.div>
        <motion.div animate={{ y: [0, 14, 0], rotate: [0, -8, 0] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-12 left-[7%] opacity-20"><Quote size={72} weight="fill" /></motion.div>
        <motion.div animate={{ y: [0, -11, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute top-28 left-[22%] opacity-20"><Sparkle size={46} weight="duotone" /></motion.div>

        <div className="max-w-[860px] mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-10 transition-colors font-medium text-sm">
            <ArrowLeft size={18} /> Back to store
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5">
              <Star size={14} weight="fill" /> Loved by our community
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4">
              Real words from <span className="italic font-serif">real sippers.</span>
            </h1>
            <p className="text-white/80 text-lg font-medium max-w-xl">
              Thousands of mornings upgraded. Here's what our customers say after making the switch.
            </p>
          </motion.div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-8 bg-[var(--background)] rounded-t-[48px]" />
      </header>

      <div className="max-w-[860px] mx-auto px-6 -mt-6">
        {/* ── Rating summary card ─────────────────────────────── */}
        <motion.div {...fadeUp} className="bg-[var(--surface)] border border-[var(--border)] rounded-[32px] shadow-lg p-8 md:p-10 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-8 items-center mb-12">
          <div className="text-center md:text-left md:pr-8 md:border-r border-[var(--border)]">
            <div className="text-5xl md:text-6xl font-extrabold text-[var(--foreground)] leading-none">{(stats.avg || 4.9).toFixed(1)}</div>
            <div className="flex text-[#F5A623] justify-center md:justify-start mt-3 gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} weight={i < Math.round(stats.avg || 4.9) ? "fill" : "regular"} size={20} />)}
            </div>
            <p className="text-[var(--muted)] text-xs font-bold mt-2 uppercase tracking-wider">{stats.total + 126} reviews</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {stats.dist.map((d) => {
              const pct = stats.total ? (d.count / stats.total) * 100 : (d.star === 5 ? 92 : d.star === 4 ? 8 : 0);
              return (
                <div key={d.star} className="flex items-center gap-3 text-xs font-bold text-[var(--muted)]">
                  <span className="w-3 text-right">{d.star}</span>
                  <Star size={13} weight="fill" className="text-[#F5A623]" />
                  <div className="flex-1 h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[#F5A623] to-[#E4B363] rounded-full" />
                  </div>
                  <span className="w-6 text-right tabular-nums">{d.count || (d.star >= 4 ? Math.round((pct / 100) * (stats.total + 126)) : 0)}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center text-[var(--accent)]"><SealCheck size={30} weight="duotone" /></div>
            <span className="text-[11px] font-bold text-[var(--muted)] text-center leading-tight">Verified<br />purchasers</span>
          </div>
        </motion.div>

        <div className="flex justify-center mb-12">
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-primary px-8 py-4 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all inline-flex items-center gap-2"
          >
            <Sparkle size={18} weight="fill" /> Write a review
          </button>
        </div>

        {/* ── Write-review form ─────────────────────────────── */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 48 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-[var(--surface)] border border-[var(--border)] shadow-lg p-8 rounded-[28px] overflow-hidden relative"
              onSubmit={submitReview}
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--accent)] via-[#839b5c] to-[#E4B363]" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-extrabold text-[var(--foreground)]">Share your experience</h3>
                <button type="button" onClick={() => setIsFormOpen(false)} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex text-[#F5A623] gap-2 cursor-pointer">
                    {[1,2,3,4,5].map((star) => (
                      <Star
                        key={star}
                        weight={star <= (newReview.rating || 5) ? "fill" : "regular"}
                        size={34}
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="transition-transform hover:scale-125"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-[var(--muted)]">{(newReview.rating || 5)}/5</span>
                </div>

                <input
                  required
                  placeholder="Your Name"
                  value={newReview.name}
                  onChange={e => setNewReview({...newReview, name: e.target.value})}
                  className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors placeholder-[var(--muted)]"
                />

                <textarea
                  required
                  placeholder="Tell us what you think..."
                  rows={4}
                  value={newReview.text}
                  onChange={e => setNewReview({...newReview, text: e.target.value})}
                  className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors resize-none placeholder-[var(--muted)]"
                />

                <div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors font-medium">
                    <ImageIcon size={20} />
                    <span className="text-sm">Attach a photo</span>
                  </button>
                </div>

                {newReview.photoUrl && (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
                    <img src={newReview.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setNewReview({...newReview, photoUrl: ""})} className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/80">
                      <X size={14} />
                    </button>
                  </div>
                )}

                <button type="submit" className="w-full py-4 btn-primary rounded-xl font-bold mt-2 shadow-lg">Post review</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ── Posted toast ─────────────────────────────── */}
        <AnimatePresence>
          {posted && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[var(--accent)] text-white font-bold px-6 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm">
              <CheckCircle size={20} weight="fill" /> Thank you! Your review is live.
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Review cards ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: Math.min(i * 0.06, 0.3) }}
              className="bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-7 rounded-[26px] relative flex flex-col"
            >
              <Quote size={38} weight="fill" className="absolute top-5 right-6 text-[var(--accent)] opacity-10" />
              <div className="flex text-[#F5A623] mb-4 gap-0.5">
                {[...Array(5)].map((_, j) => <Star key={j} weight={j < review.rating ? "fill" : "regular"} size={16} />)}
              </div>
              <p className="text-[var(--foreground)] leading-relaxed mb-6 flex-1 before:content-[''] after:content-['']">"{review.text}"</p>

              {review.photoUrl && (
                <div className="mb-5 rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm">
                  <img src={review.photoUrl} alt="Customer photo" className="w-full h-auto object-cover" />
                </div>
              )}

              <div className="flex items-center gap-3 pt-5 border-t border-[var(--border)] mt-auto">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm`}>
                  {initials(review.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-[var(--foreground)] truncate">{review.name}</p>
                    <SealCheck size={15} weight="fill" className="text-[#F5A623] shrink-0" />
                  </div>
                  <p className="text-[var(--muted)] text-xs font-medium">{review.date} · Verified buyer</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ─────────────────────────────── */}
        <motion.div {...fadeUp} className="relative overflow-hidden bg-gradient-to-br from-[var(--accent)] to-[#2D422B] text-white rounded-[32px] p-10 md:p-14 text-center mt-14">
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-6 right-12 opacity-20"><Leaf size={88} weight="duotone" /></motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-8 left-12 opacity-15"><Star size={64} weight="duotone" /></motion.div>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3 relative z-10">Ready to taste what they're raving about?</h3>
          <p className="text-white/80 font-medium mb-8 max-w-md mx-auto relative z-10">Join the caffeine-free movement — your best mornings start here.</p>
          <Link href="/#products" className="relative z-10 inline-flex items-center gap-2 bg-white text-[var(--accent)] font-bold px-8 py-4 rounded-full text-sm hover:bg-white/90 transition-colors shadow-md">
            Shop the collection <ArrowLeft size={16} weight="bold" className="rotate-180" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
