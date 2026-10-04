"use client";

import Link from "next/link";
import { ArrowLeft, Star, Image as ImageIcon, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";

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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReview, setNewReview] = useState<Partial<Review>>({ rating: 5, text: "", name: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("bm-store-reviews");
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      setReviews(initialReviews);
    }
  }, []);

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
    localStorage.setItem("bm-store-reviews", JSON.stringify(updated));
    
    setNewReview({ rating: 5, text: "", name: "", photoUrl: "" });
    setIsFormOpen(false);
  };

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[var(--background)]">
      <div className="max-w-[800px] mx-auto pt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] mb-12 transition-colors font-medium">
          <ArrowLeft size={20} />
          <span>Back to Store</span>
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">Customer Reviews</h1>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 btn-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all self-start md:self-auto"
            >
              Write a Review
            </button>
          </div>

          <div className="flex items-center gap-4 mb-12">
            <div className="flex text-[#F5A623]">
              {[...Array(5)].map((_, i) => <Star key={i} weight="fill" size={24} />)}
            </div>
            <span className="text-[var(--muted)] font-medium text-lg">4.9/5 from {reviews.length + 126} early adopters</span>
          </div>
          
          <AnimatePresence>
            {isFormOpen && (
              <motion.form 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 48 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-[var(--surface)] border border-[var(--border)] shadow-sm p-8 rounded-3xl overflow-hidden"
                onSubmit={submitReview}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[var(--foreground)]">Leave your review</h3>
                  <button type="button" onClick={() => setIsFormOpen(false)} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex text-[#F5A623] gap-2 cursor-pointer">
                    {[1,2,3,4,5].map((star) => (
                      <Star 
                        key={star} 
                        weight={star <= (newReview.rating || 5) ? "fill" : "regular"} 
                        size={32} 
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="transition-transform hover:scale-110"
                      />
                    ))}
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
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors font-medium"
                    >
                      <ImageIcon size={20} />
                      <span className="text-sm">Attach a photo</span>
                    </button>
                  </div>

                  {newReview.photoUrl && (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
                      <img src={newReview.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setNewReview({...newReview, photoUrl: ""})}
                        className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-black/80"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <button type="submit" className="w-full py-4 btn-primary rounded-xl font-bold mt-2 shadow-lg">
                    Post Review
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="grid gap-6">
            {reviews.map((review) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow p-8 rounded-3xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex text-[#F5A623]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} weight={i < review.rating ? "fill" : "regular"} size={16} />
                    ))}
                  </div>
                  <span className="text-[var(--muted)] text-xs font-bold">{review.date}</span>
                </div>
                <p className="text-lg mb-6 leading-relaxed text-[var(--foreground)]">"{review.text}"</p>
                
                {review.photoUrl && (
                  <div className="mb-6 rounded-xl overflow-hidden max-w-[300px] border border-[var(--border)] shadow-sm">
                    <img src={review.photoUrl} alt="Customer photo" className="w-full h-auto object-cover" />
                  </div>
                )}
                
                <p className="text-[var(--muted)] text-sm font-bold">— {review.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
