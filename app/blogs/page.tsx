"use client";

import Link from "next/link";
import {
  ArrowLeft, Leaf, Sparkle, CalendarBlank, Clock, WhatsappLogo,
  InstagramLogo, XLogo, FacebookLogo, LinkIcon, ShareNetwork, X, BookOpen,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { type BlogPost } from "../admin/page";
import { KEYS, fetchShared, loadJSON, saveJSON } from "../lib/store";

function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function excerpt(text: string, n = 140): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n).trimEnd() + "…" : clean;
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8%" },
  transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [active, setActive] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setBlogs(loadJSON<BlogPost[]>(KEYS.blogs, []));
    // Shared cloud store (admin publishes) → same posts on every device.
    fetchShared().then((d) => {
      if (d?.blogs && Array.isArray(d.blogs)) {
        setBlogs(d.blogs);
        saveJSON(KEYS.blogs, d.blogs);
      }
    }).catch(() => {});
  }, []);

  const shareUrl = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin + "/blogs" : "https://bmgreenhouse.com/blogs"),
    []
  );

  const shareText = (b: BlogPost) =>
    `🌱 ${b.title} — from BM Green House\n\n${excerpt(b.content, 120)}\n\n${shareUrl}`;

  const shareWhatsApp = (b: BlogPost) =>
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText(b))}`, "_blank", "noopener,noreferrer");

  const shareX = (b: BlogPost) =>
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(b.title + " 🌱")}&url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");

  const shareFacebook = () =>
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");

  const shareInstagram = async (b: BlogPost) => {
    // Instagram has no web share URL — copy the caption, then open Instagram.
    try {
      await navigator.clipboard.writeText(shareText(b));
      setCopied(b.id + "-ig");
      setTimeout(() => setCopied(""), 2000);
    } catch {}
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const copyLink = async (b: BlogPost) => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(b.id + "-link");
      setTimeout(() => setCopied(""), 2000);
    } catch {}
  };

  const nativeShare = async (b: BlogPost) => {
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (d: { title: string; text: string; url: string }) => Promise<void> }).share) {
      try {
        await (navigator as Navigator & { share?: (d: { title: string; text: string; url: string }) => Promise<void> }).share!({ title: b.title, text: excerpt(b.content, 100), url: shareUrl });
      } catch {}
    } else {
      shareWhatsApp(b);
    }
  };

  const [featured, ...rest] = blogs;

  return (
    <main className="min-h-screen bg-[var(--background)] pb-24">
      {/* ── Decorative hero ─────────────────────────────── */}
      <header className="relative overflow-hidden bg-[var(--accent)] text-white pt-20 pb-24 px-6">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2740%27 height=%2740%27 viewBox=%270 0 40 40%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5z%27 fill=%27%23ffffff%27 fill-rule=%27evenodd%27/%3E%3C/svg%3E')" }} />
        <motion.div animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-16 right-[12%] opacity-30"><Leaf size={72} weight="duotone" /></motion.div>
        <motion.div animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10 left-[8%] opacity-20"><Sparkle size={56} weight="duotone" /></motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-24 left-[20%] opacity-20"><Leaf size={40} weight="duotone" /></motion.div>

        <div className="max-w-[900px] mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-10 transition-colors font-medium text-sm">
            <ArrowLeft size={18} /> Back to store
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5">
              <BookOpen size={14} weight="fill" /> The BM Green House Journal
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4">
              Stories worth <span className="italic font-serif">brewing</span> over.
            </h1>
            <p className="text-white/80 text-lg font-medium max-w-xl">
              Recipes, farm notes, and the science behind your caffeine-free cup — new reads from our team.
            </p>
            {blogs.length > 0 && (
              <div className="flex items-center gap-4 mt-6 text-sm font-bold text-white/70">
                <span className="flex items-center gap-1.5"><CalendarBlank size={16} /> {blogs.length} article{blogs.length > 1 ? "s" : ""}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="flex items-center gap-1.5"><Clock size={16} /> quick 2-5 min reads</span>
              </div>
            )}
          </motion.div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-8 bg-[var(--background)] rounded-t-[48px]" />
      </header>

      <div className="max-w-[900px] mx-auto px-6">
        {/* ── Featured post ─────────────────────────────── */}
        {featured && (
          <motion.article {...fadeUp} className="relative -mt-2 mb-14 bg-[var(--surface)] rounded-[32px] border border-[var(--border)] shadow-lg overflow-hidden group">
            <span className="absolute top-5 left-5 z-10 bg-[var(--accent)] text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5"><Sparkle size={12} weight="fill" /> Latest</span>
            {featured.mediaUrl && (
              <div className="w-full aspect-[16/8] bg-[var(--surface-hover)] overflow-hidden">
                {featured.mediaType === "video" ? (
                  <video src={featured.mediaUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={featured.mediaUrl} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
              </div>
            )}
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 text-xs font-bold text-[var(--accent)] mb-4">
                <span className="bg-[var(--surface-hover)] px-3 py-1 rounded-full">{featured.date}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {readingTime(featured.content)}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight text-[var(--foreground)]">{featured.title}</h2>
              <p className="text-[var(--muted)] text-lg leading-relaxed mb-8">{excerpt(featured.content, 220)}</p>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => setActive(featured)} className="btn-primary px-7 py-3 rounded-full text-sm">Read article</button>
                <button onClick={() => shareWhatsApp(featured)} className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors text-[#128C4B]">
                  <WhatsappLogo size={18} weight="fill" /> WhatsApp
                </button>
                <button onClick={() => shareInstagram(featured)} className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors text-[#C1355E]">
                  <InstagramLogo size={18} weight="fill" /> Instagram
                </button>
              </div>
            </div>
          </motion.article>
        )}

        {/* ── Grid of posts ─────────────────────────────── */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
            {rest.map((blog, i) => (
              <motion.article key={blog.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: Math.min(i * 0.08, 0.3) }}
                className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all overflow-hidden flex flex-col group cursor-pointer" onClick={() => setActive(blog)}>
                {blog.mediaUrl && (
                  <div className="w-full aspect-[16/9] bg-[var(--surface-hover)] overflow-hidden">
                    {blog.mediaType === "video" ? (
                      <video src={blog.mediaUrl} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={blog.mediaUrl} alt={blog.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] mb-3">
                    <span className="bg-[var(--surface-hover)] px-2.5 py-1 rounded-full">{blog.date}</span>
                    <span className="flex items-center gap-1 text-[var(--muted)]"><Clock size={12} /> {readingTime(blog.content)}</span>
                  </div>
                  <h3 className="text-xl font-extrabold leading-snug mb-2 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{blog.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">{excerpt(blog.content)}</p>
                  <div className="flex items-center gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => shareWhatsApp(blog)} title="Share on WhatsApp" className="w-9 h-9 rounded-full bg-[var(--surface-hover)] hover:bg-[#128C4B] hover:text-white text-[var(--muted)] flex items-center justify-center transition-colors"><WhatsappLogo size={17} weight="fill" /></button>
                    <button onClick={() => shareInstagram(blog)} title="Share to Instagram" className="w-9 h-9 rounded-full bg-[var(--surface-hover)] hover:bg-[#C1355E] hover:text-white text-[var(--muted)] flex items-center justify-center transition-colors"><InstagramLogo size={17} weight="fill" /></button>
                    <button onClick={() => shareX(blog)} title="Share on X" className="w-9 h-9 rounded-full bg-[var(--surface-hover)] hover:bg-black hover:text-white text-[var(--muted)] flex items-center justify-center transition-colors"><XLogo size={15} weight="fill" /></button>
                    <button onClick={() => copyLink(blog)} title="Copy link" className="w-9 h-9 rounded-full bg-[var(--surface-hover)] hover:bg-[var(--accent)] hover:text-white text-[var(--muted)] flex items-center justify-center transition-colors">
                      {copied === blog.id + "-link" ? <span className="text-[9px] font-bold">COPIED</span> : <LinkIcon size={15} />}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* ── Empty state ─────────────────────────────── */}
        {blogs.length === 0 && (
          <motion.div {...fadeUp} className="text-center py-20 px-8 bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-[32px] mb-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center text-[var(--accent)]"><BookOpen size={32} weight="duotone" /></div>
            <h3 className="text-xl font-extrabold mb-2">No stories yet</h3>
            <p className="text-[var(--muted)] font-medium mb-6">Fresh articles are brewing — check back soon.</p>
            <Link href="/" className="btn-primary px-7 py-3 rounded-full text-sm inline-flex">Browse the shop</Link>
          </motion.div>
        )}

        {/* ── Share-the-journal CTA ─────────────────────────────── */}
        {blogs.length > 0 && (
          <motion.div {...fadeUp} className="relative overflow-hidden bg-gradient-to-br from-[var(--accent)] to-[#2D422B] text-white rounded-[32px] p-10 md:p-14 text-center mb-8">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-6 right-10 opacity-20"><Leaf size={90} weight="duotone" /></motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-8 left-10 opacity-15"><Leaf size={70} weight="duotone" /></motion.div>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-3 relative z-10">Enjoyed a read? Pass it on.</h3>
            <p className="text-white/80 font-medium mb-8 max-w-md mx-auto relative z-10">Send the journal to a friend who still drinks regular coffee — they'll thank you later.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
              {featured && <button onClick={() => shareWhatsApp(featured)} className="flex items-center gap-2 bg-white text-[var(--accent)] font-bold px-6 py-3 rounded-full text-sm hover:bg-white/90 transition-colors shadow-md"><WhatsappLogo size={18} weight="fill" /> Share on WhatsApp</button>}
              {featured && <button onClick={() => shareInstagram(featured)} className="flex items-center gap-2 bg-white/15 backdrop-blur font-bold px-6 py-3 rounded-full text-sm hover:bg-white/25 transition-colors"><InstagramLogo size={18} weight="fill" /> Instagram</button>}
              {featured && <button onClick={() => shareFacebook()} className="flex items-center gap-2 bg-white/15 backdrop-blur font-bold px-6 py-3 rounded-full text-sm hover:bg-white/25 transition-colors"><FacebookLogo size={18} weight="fill" /> Facebook</button>}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Reader modal ─────────────────────────────── */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#212529]/70 backdrop-blur-sm" onClick={() => setActive(null)} />
            <motion.div initial={{ y: 32, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 24, opacity: 0, scale: 0.98 }}
              className="relative bg-[var(--surface)] w-full max-w-[760px] max-h-[88vh] rounded-[28px] overflow-hidden shadow-2xl flex flex-col">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button onClick={() => nativeShare(active)} title="Share" className="w-10 h-10 rounded-full bg-black/45 backdrop-blur text-white flex items-center justify-center hover:bg-black/65 transition-colors"><ShareNetwork size={18} weight="fill" /></button>
                <button onClick={() => setActive(null)} className="w-10 h-10 rounded-full bg-black/45 backdrop-blur text-white flex items-center justify-center hover:bg-black/65 transition-colors"><X size={18} weight="bold" /></button>
              </div>
              <div className="overflow-y-auto">
                {active.mediaUrl && (
                  <div className="w-full aspect-[16/8] bg-black">
                    {active.mediaType === "video" ? (
                      <video src={active.mediaUrl} controls autoPlay muted loop playsInline className="w-full h-full object-cover" />
                    ) : (
                      <img src={active.mediaUrl} alt={active.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
                <div className="p-7 md:p-10">
                  <div className="flex items-center gap-3 text-xs font-bold text-[var(--accent)] mb-4">
                    <span className="bg-[var(--surface-hover)] px-3 py-1 rounded-full">{active.date}</span>
                    <span className="flex items-center gap-1"><Clock size={13} /> {readingTime(active.content)}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-6 text-[var(--foreground)]">{active.title}</h2>
                  <div className="text-[var(--muted)] text-[15px] md:text-base leading-[1.85] whitespace-pre-wrap">
                    {active.content}
                  </div>
                  <div className="mt-10 pt-6 border-t border-[var(--border)]">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-4">Share this story</p>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => shareWhatsApp(active)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-[#128C4B] text-white hover:opacity-90 transition-opacity"><WhatsappLogo size={17} weight="fill" /> WhatsApp</button>
                      <button onClick={() => shareInstagram(active)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-[#C1355E] text-white hover:opacity-90 transition-opacity"><InstagramLogo size={17} weight="fill" /> Instagram{copied === active.id + "-ig" ? " ✓" : ""}</button>
                      <button onClick={() => shareX(active)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-black text-white hover:opacity-80 transition-opacity"><XLogo size={14} weight="fill" /> Post</button>
                      <button onClick={() => copyLink(active)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors text-[var(--muted)]"><LinkIcon size={16} /> {copied === active.id + "-link" ? "Link copied!" : "Copy link"}</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
