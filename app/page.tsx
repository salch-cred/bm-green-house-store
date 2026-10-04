"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingCart, ArrowRight, CaretDown, Check,
  Leaf, ShieldCheck, Lightning, Fire,
  Coffee, Drop, CheckCircle, Package,
  Star, Article, Info, Sparkle, X,
  FacebookLogo, TwitterLogo, YoutubeLogo, InstagramLogo, LinkedinLogo
} from "@phosphor-icons/react";

const ANIMATION_EASING = [0.32, 0.72, 0, 1] as any;

export type StoreConfig = {
  name: string; price: number; comparePrice: number; stock: number;
  subtitle: string; whatsapp: string;
};

export const defaultConfig = {
  name: "Roasted Dates Seed Powder",
  price: 160,
  comparePrice: 299,
  stock: 48,
  subtitle: "100g Original Blend",
  whatsapp: "+91 8746077173"
};

const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ y: 64, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 1, delay, ease: ANIMATION_EASING }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const [config, setConfig] = useState(defaultConfig);
  const [cartOpen, setCartOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % 3;
      container.scrollTo({
        left: index * container.clientWidth,
        behavior: 'smooth'
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm here to help you get the most out of our roasted date seeds powder. How can I assist you today?" },
    { role: "user", content: "What are the main benefits and how do I use it?" },
    { role: "assistant", content: "**Key Benefits:**\n- Provides sustained, jitter-free energy.\n- Naturally caffeine-free with zero added sugar.\n- Rich in antioxidants, potassium, and magnesium.\n\n**How to Use:**\n- Brew: Treat it like coffee! Use a French press, filter, or moka pot (1-2 tsp per cup).\n- Blend: Add to smoothies or protein shakes for a deep roasted flavor.\n- Bake: Mix into brownies or chocolate cakes to enhance earthy notes." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = { role: "user", content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "This is a simulated response. Once you plug in your NVIDIA API key in the `handleSendMessage` function, I will be able to generate real answers!"
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const subtotal = config.price * quantity;

  const handleOrder = () => {
    const text = `Hi! I want to grab some BM Green House Dates Seed Powder. 🌱\n\nOrder Details:\n- Quantity: ${quantity} x 100g\n- Total: ₹${subtotal}\n\nCan you share the payment and delivery details? Thanks!`;
    window.open(`https://wa.me/${config.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] selection:bg-[var(--accent)] selection:text-white pb-24">
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23000000\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

      {/* Dynamic Island Header */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: ANIMATION_EASING }}
        className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none flex justify-center"
      >
        <div 
          className="bg-[var(--surface)] border border-[var(--border)] rounded-full p-2 flex items-center pointer-events-auto shadow-md transition-all duration-500 hover:shadow-lg cursor-pointer overflow-hidden"
          onMouseEnter={() => setIsNavExpanded(true)}
          onMouseLeave={() => setIsNavExpanded(false)}
          onClick={() => setIsNavExpanded(!isNavExpanded)}
        >
          <Link href="/" className="flex items-center px-2 shrink-0">
            <Image src="/bm-logo.png" alt="BM Logo" width={28} height={28} className="rounded-md" />
            <span className={`flex items-center gap-1 font-extrabold text-sm tracking-tight transition-all duration-500 whitespace-nowrap overflow-hidden ${isNavExpanded ? 'w-[105px] opacity-100 ml-3' : 'w-0 opacity-0'}`}>
              <span className="bg-gradient-to-r from-[var(--accent)] to-[#839b5c] bg-clip-text text-transparent">BM GREEN</span>
              <Leaf size={14} weight="fill" className="text-[var(--accent)] animate-pulse" />
            </span>
          </Link>
          
          <div className={`flex items-center transition-all duration-500 whitespace-nowrap overflow-hidden text-sm font-medium text-[var(--muted)] gap-6 ${isNavExpanded ? 'w-[160px] opacity-100 mx-2 px-4 border-l border-[var(--border)]' : 'w-0 opacity-0 border-l-0'}`}>
            <a href="#products" className="hover:text-[var(--accent)] transition-colors duration-300">Products</a>
            <a href="#about" className="hover:text-[var(--accent)] transition-colors duration-300">About Us</a>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); setCartOpen(true); }}
            className="flex items-center shrink-0 gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-3 py-2 rounded-full text-sm font-bold transition-colors duration-300 shadow-sm ml-2"
          >
            <ShoppingCart weight="bold" />
            <span>{quantity}</span>
          </button>
        </div>
      </motion.nav>

      {/* Hero Slider Section */}
      <section className="pt-40 pb-16 px-6 relative z-10">
        <div className="container mx-auto max-w-[1200px] flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <FadeUp>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--foreground)] mb-4 sm:mb-6 leading-[1.1]">
                Bringing families together, <br className="hidden sm:block"/><span className="text-[var(--accent)]">one delicious cup at a time.</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-xl text-[var(--muted)] mb-8 font-medium italic">
                #BrewWithBMGreenHouse
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <button onClick={() => setCartOpen(true)} className="btn-primary px-10 py-4 rounded-full text-lg shadow-lg">
                Buy Now — ₹{config.price}
              </button>
            </FadeUp>
          </div>
          <div className="flex-1 relative aspect-square w-full max-w-[500px]">
            <FadeUp delay={0.3} className="w-full h-full relative">
              <div className="absolute inset-0 bg-[var(--accent)]/10 rounded-full blur-3xl transform scale-75" />
              {/* Floating Leaf Decorations */}
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-10 text-[var(--accent)] opacity-60"
              >
                <Leaf size={48} weight="duotone" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 -right-5 text-[var(--accent)] opacity-40"
              >
                <Leaf size={64} weight="duotone" />
              </motion.div>
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/4 -right-8 bg-white/90 backdrop-blur-md border border-[var(--border)] px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-20"
              >
                <span className="text-xl">✨</span>
                <span className="font-bold text-xs sm:text-sm text-[#212529]">100% Organic</span>
              </motion.div>
              
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory w-full h-full relative rounded-3xl"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
                {["/product-pack.png", "/product-2.png", "/product-3.png"].map((img, i) => (
                  <div key={i} className="min-w-full h-full relative snap-center flex-shrink-0 hide-scroll">
                    <Image 
                      src={img} 
                      alt={`Product Image ${i + 1}`} 
                      fill
                      className="object-contain hover:scale-105 transition-transform duration-[1s]" 
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12 relative z-10">
          <div className="w-8 h-2 rounded-full bg-[var(--accent)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--border)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--border)]" />
        </div>
      </section>

      {/* Decorative Marquee */}
      <div className="w-full overflow-hidden bg-[var(--surface-hover)] border-y border-[var(--border)] py-4 flex items-center relative z-10">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          className="flex items-center whitespace-nowrap gap-8 min-w-max text-[var(--accent)] font-bold text-sm tracking-widest uppercase"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-8">
              <span>Caffeine Free</span>
              <Leaf weight="duotone" />
              <span>100% Natural</span>
              <Leaf weight="duotone" />
              <span>Rich in Minerals</span>
              <Leaf weight="duotone" />
              <span>Zero Sugar</span>
              <Leaf weight="duotone" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Tagline Reveal Section */}
      <section className="py-20 px-6 bg-[var(--accent)] text-white text-center relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5z\\' fill=\\'%23ffffff\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')" }}></div>
        <div className="container mx-auto max-w-[800px] relative z-10">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Nature's hidden energy booster.<br/>100% natural, caffeine-free.
            </h2>
          </FadeUp>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-[1200px]">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4">Why switch to Date Seeds?</h2>
            <p className="text-lg text-[var(--muted)]">The perfect healthy alternative to your daily brew.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeUp delay={0.1} className="bg-[var(--surface)] p-8 rounded-3xl shadow-sm border border-[var(--border)] hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 bg-[var(--surface-hover)] rounded-2xl flex items-center justify-center text-[var(--accent)] mb-6">
                <Lightning size={32} weight="duotone" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Sustained Energy</h3>
              <p className="text-[var(--muted)] leading-relaxed">Get a steady energy boost throughout the day without the jittery spikes and crashes associated with normal coffee.</p>
            </FadeUp>
            <FadeUp delay={0.2} className="bg-[var(--surface)] p-8 rounded-3xl shadow-sm border border-[var(--border)] hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 bg-[var(--surface-hover)] rounded-2xl flex items-center justify-center text-[var(--accent)] mb-6">
                <Coffee size={32} weight="duotone" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Zero Caffeine</h3>
              <p className="text-[var(--muted)] leading-relaxed">Naturally caffeine-free, making it the perfect warm beverage for any time of the day, even right before bed.</p>
            </FadeUp>
            <FadeUp delay={0.3} className="bg-[var(--surface)] p-8 rounded-3xl shadow-sm border border-[var(--border)] hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 bg-[var(--surface-hover)] rounded-2xl flex items-center justify-center text-[var(--accent)] mb-6">
                <ShieldCheck size={32} weight="duotone" />
              </div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Rich in Antioxidants</h3>
              <p className="text-[var(--muted)] leading-relaxed">Packed with minerals like magnesium, calcium, and iron. It supports digestion and boosts your immune system natively.</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Product Video 1 */}
      <section className="py-12 px-6 relative z-10">
        <div className="container mx-auto max-w-[1000px]">
          <FadeUp className="rounded-3xl overflow-hidden border border-[var(--border)] shadow-sm bg-[var(--surface-hover)] aspect-video relative group">
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 group-hover:bg-black/0 transition-colors pointer-events-none">
              <span className="bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">Product Video 1</span>
            </div>
            <video src="/product-video-1.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline controls />
          </FadeUp>
        </div>
      </section>

      <section id="about" className="py-24 px-6 bg-[var(--surface)] border-y border-[var(--border)] relative z-10">
        <div className="container mx-auto max-w-[800px] text-center">
          <FadeUp>
            <Image src="/bm-logo.png" alt="Logo" width={64} height={64} className="mx-auto mb-8 rounded-2xl shadow-sm" />
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">Traditional Recipes, Modern Purity</h2>
            <p className="text-[var(--muted)] text-lg leading-relaxed mb-8">
              Since our inception, BM Green House has been dedicated to bringing families together over healthy, natural meals. Our Roasted Dates Seed Powder is meticulously crafted using automated processing to ensure 100% purity without any preservatives.
            </p>
            <Link href="/details" className="text-[var(--accent)] font-bold uppercase tracking-wider text-sm hover:underline">
              Read Our Story →
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Product Video 2 */}
      <section className="py-12 px-6 relative z-10">
        <div className="container mx-auto max-w-[1000px]">
          <FadeUp className="rounded-3xl overflow-hidden border border-[var(--border)] shadow-sm bg-[var(--surface-hover)] aspect-video relative group">
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 group-hover:bg-black/0 transition-colors pointer-events-none">
              <span className="bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">Product Video 2</span>
            </div>
            <video src="/product-video-2.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline controls />
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border)] text-center md:text-left bg-[var(--surface)] relative z-10">
        <div className="container mx-auto max-w-[1200px] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image src="/bm-logo.png" alt="BM Logo" width={32} height={32} className="rounded-lg" />
            <span className="flex items-center gap-1 font-extrabold text-lg tracking-tight whitespace-nowrap">
              <span className="bg-gradient-to-r from-[var(--accent)] to-[#839b5c] bg-clip-text text-transparent">BM GREEN</span>
              <Leaf size={16} weight="fill" className="text-[var(--accent)] animate-pulse" />
            </span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-[var(--muted)]">
            <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--accent)] transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-[var(--accent)] transition-colors">Shipping & Returns</Link>
          </div>
        </div>
      </footer>

      {/* Bottom Floating Navigation (Small Round Pill) */}
      <motion.div 
        initial={{ y: 100, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        transition={{ duration: 0.8, delay: 0.5, ease: ANIMATION_EASING }}
        className="fixed bottom-6 left-1/2 z-50 pointer-events-none"
      >
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-full p-2 flex items-center gap-2 shadow-lg pointer-events-auto transition-all duration-500 w-max">
          <button onClick={() => setAiOpen(true)} className="w-12 h-12 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105" title="Green AI">
            <Leaf size={24} weight="fill" />
          </button>
          <div className="w-px h-8 bg-[var(--border)] mx-1" />
          <Link href="/reviews" className="w-10 h-10 bg-[var(--surface-hover)] hover:bg-[#E8E4D9] text-[var(--muted)] hover:text-[var(--foreground)] rounded-full flex items-center justify-center transition-transform hover:scale-105" title="Reviews">
            <Star size={20} weight="fill" />
          </Link>
          <Link href="/details" className="w-10 h-10 bg-[var(--surface-hover)] hover:bg-[#E8E4D9] text-[var(--muted)] hover:text-[var(--foreground)] rounded-full flex items-center justify-center transition-transform hover:scale-105" title="Details">
            <Info size={20} weight="fill" />
          </Link>
          <Link href="/blogs" className="w-10 h-10 bg-[var(--surface-hover)] hover:bg-[#E8E4D9] text-[var(--muted)] hover:text-[var(--foreground)] rounded-full flex items-center justify-center transition-transform hover:scale-105" title="Blogs">
            <Article size={20} weight="fill" />
          </Link>
        </div>
      </motion.div>

      {/* Light Mode Cart Modal */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#212529]/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <motion.div 
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            className="relative bg-white border border-[#E9ECEF] rounded-3xl p-8 w-full max-w-[420px] shadow-2xl"
          >
            <div className="flex justify-between items-start mb-8 border-b border-[#E9ECEF] pb-4">
              <h2 className="text-2xl font-bold text-[#212529]">Your Basket</h2>
              <button onClick={() => setCartOpen(false)} className="text-[#ADB5BD] hover:text-[#212529]">✕</button>
            </div>

            <div className="flex gap-4 mb-8 bg-[#F8F9FA] p-4 rounded-2xl border border-[#E9ECEF]">
              <div className="w-20 h-24 bg-white rounded-xl relative overflow-hidden flex-shrink-0 shadow-sm">
                <Image src="/product-pack.png" alt="Product" fill className="object-contain p-2" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-bold text-[#212529] mb-1">{config.name}</h3>
                <p className="text-sm text-[#6C757D] mb-2">{config.subtitle}</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#F5A623]">₹{config.price}</span>
                  <span className="text-xs text-[#ADB5BD] line-through">₹{config.comparePrice}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-bold text-[var(--foreground)]">Quantity</span>
              <div className="flex items-center gap-4 border border-[var(--border)] rounded-full p-1 bg-[var(--surface-hover)]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface)] text-[var(--foreground)] font-bold shadow-sm">-</button>
                <span className="w-4 text-center text-sm font-bold text-[var(--foreground)]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface)] text-[var(--foreground)] font-bold shadow-sm">+</button>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6 mb-6 flex justify-between items-center text-xl font-black text-[var(--foreground)]">
              <span>Total</span>
              <span className="text-[var(--accent)]">₹{subtotal}</span>
            </div>

            <button onClick={handleOrder} className="btn-primary w-full py-4 rounded-full text-base tracking-widest shadow-lg">
              CHECKOUT VIA WHATSAPP
            </button>
          </motion.div>
        </div>
      )}

      {/* Light Mode AI Modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#212529]/60 backdrop-blur-sm"
            onClick={() => setAiOpen(false)}
          />
          <motion.div 
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            className="relative bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 w-full max-w-[480px] shadow-2xl flex flex-col max-h-[80vh]"
          >
            <div className="flex justify-between items-start mb-6 border-b border-[var(--border)] pb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
                  <Leaf className="text-[var(--accent)]" weight="fill" /> Green AI
                </h2>
                <p className="text-[var(--muted)] text-sm mt-1">Ask about recipes & usage.</p>
              </div>
              <button onClick={() => setAiOpen(false)} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                <X size={24} weight="bold" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm font-bold ${msg.role === "user" ? "bg-[var(--foreground)] text-[var(--surface)]" : "bg-[var(--accent)] text-white"}`}>
                    {msg.role === "user" ? "U" : <Leaf size={20} weight="fill" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-[var(--surface-hover)] border border-[var(--border)] rounded-tr-sm text-[var(--foreground)]" : "bg-[var(--accent)] rounded-tl-sm text-white"}`}>
                    {msg.content.split('\n').map((line, j) => (
                      <p key={j} className="min-h-[1rem]">{line.includes('**') ? <strong dangerouslySetInnerHTML={{__html: line.replace(/\*\*/g, '')}}></strong> : line}</p>
                    ))}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <Leaf size={20} weight="fill" />
                  </div>
                  <div className="bg-[var(--surface-hover)] border border-[var(--border)] p-4 rounded-2xl rounded-tl-sm text-sm leading-relaxed text-[var(--muted)] italic">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="mt-6 pt-4 border-t border-[var(--border)] relative flex items-center">
              <input 
                type="text" 
                placeholder="Ask Green AI..." 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-full px-6 py-4 pr-14 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors font-medium shadow-inner placeholder-[var(--muted)]"
              />
              <button type="submit" disabled={!chatInput.trim() || isTyping} className="absolute right-4 bg-[var(--accent)] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors shadow-md">
                <ArrowRight size={20} weight="bold" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  );
}
