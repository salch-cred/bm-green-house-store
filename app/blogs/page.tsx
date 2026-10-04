"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { type BlogPost } from "../admin/page";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    const b = localStorage.getItem("bm-store-blogs");
    if(b) setBlogs(JSON.parse(b));
  }, []);

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[var(--background)]">
      <div className="max-w-[800px] mx-auto pt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] mb-12 transition-colors font-medium">
          <ArrowLeft size={20} />
          <span>Back to Store</span>
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[var(--foreground)]">Latest Notes</h1>
          <p className="text-[var(--muted)] text-lg mb-12 font-medium">Thoughts, recipes, and updates from the BM Green House team.</p>
          
          {blogs.length === 0 ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] p-12 text-center rounded-3xl shadow-sm">
              <p className="text-[var(--muted)] text-lg font-medium">No articles published yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {blogs.map((blog, i) => (
                <motion.article 
                  key={blog.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {blog.mediaUrl && (
                    <div className="w-full aspect-video bg-[var(--surface-hover)] relative">
                      {blog.mediaType === "video" ? (
                        <video src={blog.mediaUrl} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={blog.mediaUrl} alt={blog.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 text-sm font-bold text-[var(--accent)] mb-4">
                      <span>{blog.date}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--foreground)]">{blog.title}</h2>
                    <p className="text-[var(--muted)] leading-relaxed whitespace-pre-wrap">{blog.content}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
