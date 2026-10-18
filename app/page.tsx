"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingCart, ArrowRight, CaretDown, Check,
  Leaf, ShieldCheck, Lightning, Fire,
  Coffee, Drop, CheckCircle, Package,
  Truck,
  Star, Article, Info, Sparkle, X, User,
  FacebookLogo, TwitterLogo, YoutubeLogo, InstagramLogo, LinkedinLogo,
  WhatsappLogo, EnvelopeSimple, MapPin, PaperPlaneTilt, CaretUp, SealCheck
} from "@phosphor-icons/react";

const ANIMATION_EASING = [0.32, 0.72, 0, 1] as any;

import { defaultConfig as _defaultConfig, defaultProducts } from "./lib/store";
import type { StoreConfig, Product, CartLine, Order } from "./lib/store";
import { KEYS, loadJSON, loadProducts, cartCount, cartTotal, productDiscount, fetchShared, saveJSON } from "./lib/store";

// Re-exported for backward compat (admin + old imports).
export type { StoreConfig } from "./lib/store";
export const defaultConfig = _defaultConfig;

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

const LazyVideo = ({ src, className }: { src: string, className?: string }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" } // load before it comes into view
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative w-full h-full ${className || ''}`}>
      {inView ? (
        <video src={src} className="w-full h-full object-cover" autoPlay loop muted playsInline controls />
      ) : (
        <div className="absolute inset-0 bg-[var(--surface)] animate-pulse" />
      )}
    </div>
  );
};

export default function Home() {
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  const [config, setConfig] = useState(_defaultConfig);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [cartOpen, setCartOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load storefront: local cache first (instant), then shared cloud store
  // (admin publishes) so every visitor sees the latest products/content.
  useEffect(() => {
    setConfig(loadJSON(KEYS.config, _defaultConfig));
    setProducts(loadProducts());
    fetchShared().then((d) => {
      if (!d) return;
      if (d.config) {
        const c = { ..._defaultConfig, ...d.config };
        setConfig(c);
        saveJSON(KEYS.config, c);
      }
      if (d.products && Array.isArray(d.products) && d.products.length > 0) {
        setProducts(d.products);
        saveJSON(KEYS.products, d.products);
      }
    }).catch(() => {});
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.config && e.newValue) {
        try { setConfig({ ..._defaultConfig, ...JSON.parse(e.newValue) }); } catch {}
      }
      if (e.key === KEYS.products && e.newValue) {
        try {
          const list = JSON.parse(e.newValue);
          if (Array.isArray(list)) setProducts(list);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const liveProducts = products.filter((p) => p.isLive);
  const featured = liveProducts.find((p) => p.stock > 0) ?? liveProducts[0] ?? products[0];
  const showAnnouncement = !!(config.showAnnouncement && config.announcement);
  // Featured must itself be visible+stocked: if admin hid every product,
  // `featured` falls back to a hidden one — never offer to buy it.
  const featuredBuyable = !!featured && config.isLive && featured.isLive && featured.stock > 0;
  const units = cartCount(cart);
  const subtotal = cartTotal(cart, products);

  const addToCart = (id: string, qty = 1) => {
    const p = products.find((x) => x.id === id);
    if (!p || !p.isLive || p.stock <= 0) return;
    setCart((prev) => {
      const line = prev.find((l) => l.id === id);
      const cur = line ? line.qty : 0;
      const next = Math.min(cur + qty, p.stock);
      if (next <= 0) return prev;
      if (line) return prev.map((l) => (l.id === id ? { ...l, qty: next } : l));
      return [...prev, { id, qty: next }];
    });
  };

  const setLineQty = (id: string, qty: number) => {
    const p = products.find((x) => x.id === id);
    const max = p ? Math.max(p.stock, 1) : 99;
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, max) } : l))
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % 2;
      container.scrollTo({
        left: index * container.clientWidth,
        behavior: 'smooth'
      });
    }, 6000);
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
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.reply || data.error || "Sorry, I couldn't process that request."
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Error connecting to AI."
      }]);
    }
    
    setIsTyping(false);
  };

  const handleOrder = () => {
    if (cart.length === 0) return;
    const lines = cart.map((l) => {
      const p = products.find((x) => x.id === l.id);
      return p ? `- ${p.name} (${p.subtitle}) x${l.qty} — ₹${p.price * l.qty}` : null;
    }).filter(Boolean);
    // Log order locally so Admin → Orders tab can fulfil it.
    try {
      const prev = loadJSON<Order[]>(KEYS.orders, []);
      prev.unshift({
        id: Date.now().toString(),
        qty: units,
        total: subtotal,
        date: new Date().toLocaleString(),
        status: "new",
        note: `${lines.length} item(s)`,
        items: cart.map((l) => {
          const p = products.find((x) => x.id === l.id);
          return { id: l.id, name: p ? p.name : l.id, qty: l.qty, price: p ? p.price : 0 };
        }),
      });
      localStorage.setItem(KEYS.orders, JSON.stringify(prev));
      // Decrement stock so the shopper + admin both see live inventory.
      const updated = products.map((p) => {
        const l = cart.find((x) => x.id === p.id);
        return l ? { ...p, stock: Math.max(0, p.stock - l.qty) } : p;
      });
      setProducts(updated);
      localStorage.setItem(KEYS.products, JSON.stringify(updated));
    } catch {}
    setCart([]);
    const text = `Hi! I want to order from BM Green House 🌱\n\n${lines.join("\n")}\n\nTotal: ₹${subtotal}\n\nCan you share the payment and delivery details? Thanks!`;
    window.open(`https://wa.me/${config.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] selection:bg-[var(--accent)] selection:text-white pb-24">
      {showAnnouncement ? (
        <div className="bg-[var(--accent)] text-white text-center text-xs sm:text-sm font-bold tracking-wide px-4 py-2.5 relative z-[60]">
          {config.announcement}
        </div>
      ) : null}
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23000000\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

      {/* Dynamic Island Header — drops below the announcement bar when visible */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: ANIMATION_EASING }}
        className={`fixed left-0 right-0 z-50 px-6 pointer-events-none flex justify-center ${showAnnouncement ? "top-[52px]" : "top-6"}`}
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
            <span>{units}</span>
          </button>
        </div>
      </motion.nav>

      {/* Hero Slider Section */}
      <section className="pt-40 pb-16 px-6 relative z-10">
        <div className="container mx-auto max-w-[1200px] flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <FadeUp>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--foreground)] mb-4 sm:mb-6 leading-[1.1]">
                {config.heroTitle} <br className="hidden sm:block"/><span className="text-[var(--accent)]">{config.heroHighlight}</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-xl text-[var(--muted)] mb-8 font-medium italic">
                {config.heroTagline}
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[var(--accent)] blur-xl opacity-40 animate-pulse rounded-full" />
                <button onClick={() => { if (featuredBuyable && featured) { addToCart(featured.id, 1); setCartOpen(true); } }} disabled={!featuredBuyable} className="btn-primary relative px-10 py-4 rounded-full text-lg shadow-lg flex items-center gap-3 hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:hover:scale-100">
                  <span>{!featuredBuyable ? (!config.isLive ? "Currently Offline" : "Out of Stock") : `Buy Now — ₹${featured.price}`}</span>
                  <ArrowRight size={20} weight="bold" />
                </button>
              </div>
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
              {/* Minimalist Indicators */}
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -right-4 md:-right-12 flex items-center gap-3 z-20"
              >
                <div className="w-8 h-[1px] bg-[var(--foreground)] hidden md:block opacity-20" />
                <span className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--foreground)] opacity-60">100% Organic</span>
              </motion.div>
              
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-1/4 -left-4 md:-left-12 flex items-center gap-3 z-20 flex-row-reverse"
              >
                <div className="w-8 h-[1px] bg-[var(--foreground)] hidden md:block opacity-20" />
                <span className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--foreground)] opacity-60">Zero Sugar</span>
              </motion.div>
              
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory w-full h-full relative rounded-3xl"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
                {["/product-png1.png", "/product-png2.png"].map((img, i) => (
                  <div key={i} className="min-w-full h-full relative snap-center flex-shrink-0 hide-scroll flex items-center justify-center p-4">
                    <motion.div 
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                      className="w-full h-full relative"
                    >
                      <Image 
                        src={img} 
                        alt={`Product Image ${i + 1}`} 
                        fill
                        className="object-contain drop-shadow-[0_25px_25px_rgba(62,90,59,0.35)] hover:scale-110 transition-transform duration-[1s]" 
                        priority={i === 0}
                      />
                    </motion.div>
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

      {/* Shop — every product from Admin → Products shows here automatically */}
      <section id="products" className="py-24 px-6 relative z-10 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="container mx-auto max-w-[1200px]">
          <FadeUp className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4">Shop the collection</h2>
            <p className="text-lg text-[var(--muted)]">Managed live from the admin panel — prices & stock update instantly.</p>
          </FadeUp>
          {liveProducts.length === 0 ? (
            <p className="text-center text-[var(--muted)] font-medium">No products available right now — check back soon.</p>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveProducts.map((p, i) => (
              <FadeUp key={p.id} delay={Math.min(i * 0.1, 0.3)} className="bg-[var(--background)] rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
                <div className="relative bg-white p-8 flex items-center justify-center min-h-[260px]">
                  {p.tag ? <span className="absolute top-4 left-4 bg-[var(--accent)] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{p.tag}</span> : null}
                  {productDiscount(p) > 0 && <span className="absolute top-4 right-4 bg-[#F5A623] text-white text-[10px] font-bold px-3 py-1 rounded-full">-{productDiscount(p)}%</span>}
                  {/* Plain <img>: product images are admin-supplied URLs (Blob/any host) which next/image would reject */}
                  <img src={p.image || "/product-png2.png"} alt={p.name} width={180} height={260} className="object-contain drop-shadow-xl max-h-[240px] w-auto" loading="lazy" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-extrabold text-[var(--foreground)]">{p.name}</h3>
                  <p className="text-sm text-[var(--muted)] font-medium mt-1 mb-1">{p.subtitle}</p>
                  {p.description ? <p className="text-sm text-[var(--muted)] line-clamp-2 mb-3">{p.description}</p> : null}
                  <div className="flex items-center gap-2 mb-1">
                    <b className="text-2xl text-[var(--foreground)]">₹{p.price}</b>
                    {p.comparePrice > p.price && <s className="text-[var(--muted)]">₹{p.comparePrice}</s>}
                  </div>
                  <p className={`text-xs font-bold mb-4 ${p.stock <= 0 ? "text-red-500" : p.stock <= config.lowStockThreshold ? "text-[#F5A623]" : "text-[var(--accent)]"}`}>
                    {p.stock <= 0 ? "Out of stock" : p.stock <= config.lowStockThreshold ? `Only ${p.stock} left!` : "In stock"}
                  </p>
                  <button onClick={() => { addToCart(p.id, 1); setCartOpen(true); }} disabled={p.stock <= 0}
                    className="btn-primary w-full py-3 rounded-full text-sm mt-auto disabled:opacity-50">
                    {p.stock <= 0 ? "SOLD OUT" : "ADD TO BASKET"}
                  </button>
                </div>
              </FadeUp>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Product Video 1 */}
      <section className="py-20 px-6 relative z-10 overflow-hidden">
        {/* Background glow for decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[var(--accent)]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="container mx-auto max-w-[1100px]">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <FadeUp className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-4 text-[var(--accent)] font-bold tracking-widest uppercase text-xs">
                <Sparkle size={16} weight="duotone" />
                <span>Premium Quality</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[var(--foreground)] leading-tight">
                Experience the <br className="hidden md:block"/> Roasting Process
              </h2>
              <p className="text-[var(--muted)] text-lg leading-relaxed mb-8">
                From the finest hand-picked dates to your morning cup, we ensure every step of our automated processing preserves the deep, earthy flavor and natural minerals. No shortcuts, just pure dedication.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#212529] bg-white px-4 py-2 rounded-full border border-[var(--border)] shadow-sm">
                  <CheckCircle size={18} weight="fill" className="text-[var(--accent)]" /> Carefully Sorted
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#212529] bg-white px-4 py-2 rounded-full border border-[var(--border)] shadow-sm">
                  <CheckCircle size={18} weight="fill" className="text-[var(--accent)]" /> Perfect Roast
                </div>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.2} className="flex-1 w-full">
              <div className="rounded-[2rem] overflow-hidden border-[8px] border-white shadow-2xl bg-[var(--surface-hover)] aspect-video relative group transform md:rotate-2 hover:rotate-0 transition-all duration-500">
                <LazyVideo src="/product-video-1.mp4" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 bg-[var(--surface)] border-y border-[var(--border)] relative z-10">
        <div className="container mx-auto max-w-[800px] text-center">
          <FadeUp>
            <Image src="/bm-logo.png" alt="Logo" width={64} height={64} className="mx-auto mb-8 rounded-2xl shadow-sm" />
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">{config.aboutTitle}</h2>
            <p className="text-[var(--muted)] text-lg leading-relaxed mb-8">
              {config.aboutText}
            </p>
            <Link href="/details" className="text-[var(--accent)] font-bold uppercase tracking-wider text-sm hover:underline">
              Read Our Story →
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Product Video 2 (Reel Style) */}
      <section className="py-16 px-6 relative z-10 overflow-hidden">
        <div className="container mx-auto max-w-[1000px]">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Description Side */}
            <FadeUp className="order-2 md:order-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4 text-[var(--accent)] font-bold tracking-widest uppercase text-xs">
                <Leaf size={16} weight="duotone" />
                <span>The BM Green House Story</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight text-[var(--foreground)]">
                Brewed to <br />
                <span className="italic text-[var(--muted)] font-serif">Perfection.</span>
              </h2>
              <p className="text-[var(--muted)] text-lg leading-relaxed mb-8">
                Watch how our finely roasted date seeds transform into a rich, full-bodied beverage that comforts the soul. Every cup promises a completely caffeine-free, natural energy boost that you can enjoy at any time of the day.
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 bg-[var(--surface-hover)] p-4 rounded-2xl border border-[var(--border)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--accent)] shrink-0">
                    <ShieldCheck size={24} weight="duotone" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)]">100% Pure</h4>
                    <p className="text-sm text-[var(--muted)]">No additives or artificial colors.</p>
                  </div>
                </div>
              </div>
            </FadeUp>
            
            {/* Video Side */}
            <FadeUp delay={0.2} className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="w-full max-w-[320px] rounded-[2rem] overflow-hidden border-[6px] border-[var(--surface-hover)] shadow-2xl relative aspect-[9/16] bg-black">
                <LazyVideo src="/product-video-2.mp4" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-b from-[var(--surface)] to-[var(--surface-hover)] border-t border-[var(--border)] z-10">
        {/* Animated top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] via-[#E4B363] to-[var(--accent)] overflow-hidden">
          <motion.div animate={{ x: ["-100%", "150%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-1/3 h-full bg-white/40 blur-sm" />
        </div>
        {/* Decorative dots + leaves */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, var(--accent) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        <motion.div animate={{ y: [0, -14, 0], rotate: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-16 right-[6%] text-[var(--accent)] opacity-[0.07] pointer-events-none hidden md:block"><Leaf size={120} weight="duotone" /></motion.div>
        <motion.div animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10 left-[4%] text-[var(--accent)] opacity-[0.06] pointer-events-none hidden md:block"><Leaf size={90} weight="duotone" /></motion.div>

        <div className="container mx-auto max-w-[1200px] px-6 pt-16 pb-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1.4fr] gap-10 md:gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/bm-logo.png" alt="BM Logo" width={40} height={40} className="rounded-xl shadow-sm" />
                <span className="flex items-center gap-1 font-extrabold text-xl tracking-tight whitespace-nowrap">
                  <span className="bg-gradient-to-r from-[var(--accent)] to-[#839b5c] bg-clip-text text-transparent">BM GREEN</span>
                  <Leaf size={18} weight="fill" className="text-[var(--accent)]" />
                </span>
              </div>
              <p className="text-sm text-[var(--muted)] font-medium leading-relaxed mb-6 max-w-[280px]">
                Traditional recipes, modern purity. Bringing families together over healthy, caffeine-free cups.
              </p>
              <div className="flex items-center gap-2.5">
                <Link href={`https://wa.me/${config.whatsapp}`} target="_blank" className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-[#128C4B] hover:text-white hover:-translate-y-0.5 transition-all shadow-sm" aria-label="WhatsApp"><WhatsappLogo size={19} weight="fill" /></Link>
                <Link href={config.instagram || "https://instagram.com/bmgreenhouse"} target="_blank" className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-[#C1355E] hover:text-white hover:-translate-y-0.5 transition-all shadow-sm" aria-label="Instagram"><InstagramLogo size={19} weight="fill" /></Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-[#1877F2] hover:text-white hover:-translate-y-0.5 transition-all shadow-sm" aria-label="Facebook"><FacebookLogo size={19} weight="fill" /></Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-[#FF0000] hover:text-white hover:-translate-y-0.5 transition-all shadow-sm" aria-label="YouTube"><YoutubeLogo size={19} weight="fill" /></Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-black hover:text-white hover:-translate-y-0.5 transition-all shadow-sm" aria-label="X"><TwitterLogo size={19} weight="fill" /></Link>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[var(--foreground)] mb-4 flex items-center gap-2">
                <Sparkle size={13} weight="fill" className="text-[var(--accent)]" /> Explore
              </h4>
              <ul className="flex flex-col gap-3 text-sm font-medium text-[var(--muted)]">
                <li><Link href="/#products" className="hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all">Shop all</Link></li>
                <li><Link href="/reviews" className="hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all">Customer reviews</Link></li>
                <li><Link href="/blogs" className="hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all">The Journal</Link></li>
                <li><Link href="/#about" className="hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all">Our story</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[var(--foreground)] mb-4 flex items-center gap-2">
                <SealCheck size={13} weight="fill" className="text-[var(--accent)]" /> Support
              </h4>
              <ul className="flex flex-col gap-3 text-sm font-medium text-[var(--muted)]">
                <li><Link href="/shipping" className="hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all">Shipping info</Link></li>
                <li><Link href="/privacy" className="hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all">Privacy policy</Link></li>
                <li><Link href="/terms" className="hover:text-[var(--accent)] hover:translate-x-1 inline-block transition-all">Terms of service</Link></li>
              </ul>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[var(--surface)] border border-[var(--border)] rounded-full px-2.5 py-1 text-[var(--muted)]"><CheckCircle size={11} weight="fill" className="text-[var(--accent)]" /> 100% natural</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[var(--surface)] border border-[var(--border)] rounded-full px-2.5 py-1 text-[var(--muted)]"><Truck size={11} weight="fill" className="text-[var(--accent)]" /> Fast shipping</span>
              </div>
            </div>

            {/* Contact card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[var(--accent)] to-[#2D422B] text-white rounded-3xl p-6 shadow-lg">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-4 -right-4 opacity-15"><Leaf size={80} weight="duotone" /></motion.div>
              <div className="relative z-10">
                <h4 className="font-extrabold text-base mb-1.5">Need help choosing?</h4>
                <p className="text-white/75 text-xs font-medium mb-5 leading-relaxed">Chat with us on WhatsApp — we reply fast with order &amp; bulk pricing.</p>
                <Link href={`https://wa.me/${config.whatsapp}`} target="_blank" className="flex items-center justify-center gap-2 bg-white text-[var(--accent)] font-bold px-5 py-3 rounded-full text-sm hover:bg-white/90 transition-colors shadow-md mb-2.5">
                  <WhatsappLogo size={17} weight="fill" /> Message us
                </Link>
                <div className="flex flex-col gap-1.5 text-[11px] text-white/70 font-medium">
                  <span className="flex items-center gap-2"><EnvelopeSimple size={13} /> Orders via WhatsApp &amp; Instagram</span>
                  <span className="flex items-center gap-2"><MapPin size={13} /> Made fresh in small batches</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--muted)] font-medium text-center md:text-left">
              © {year} BM Green House. All rights reserved. Crafted with <Leaf size={12} weight="fill" className="inline text-[var(--accent)] -mt-0.5" /> for healthier mornings.
            </p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors group">
              Back to top <span className="w-7 h-7 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group-hover:-translate-y-0.5 group-hover:bg-[var(--accent)] group-hover:text-white transition-all"><CaretUp size={14} weight="bold" /></span>
            </button>
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

            {cart.length === 0 ? (
              <p className="text-center text-[#6C757D] py-8">Your basket is empty.<br />Add something from the shop below 👇</p>
            ) : (
            <div className="flex flex-col gap-4 mb-8 max-h-[320px] overflow-y-auto pr-1">
              {cart.map((l) => {
                const p = products.find((x) => x.id === l.id);
                if (!p) return null;
                return (
                <div key={l.id} className="flex gap-4 bg-[#F8F9FA] p-4 rounded-2xl border border-[#E9ECEF]">
                  <div className="w-20 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
                    <img src={p.image || "/product-png2.png"} alt={p.name} className="object-contain p-2 drop-shadow-lg max-h-full w-auto" />
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h3 className="font-bold text-[#212529] mb-1 truncate">{p.name}</h3>
                    <p className="text-sm text-[#6C757D] mb-2 truncate">{p.subtitle}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-[#F5A623]">₹{p.price}</span>
                      {p.comparePrice > p.price && <span className="text-xs text-[#ADB5BD] line-through">₹{p.comparePrice}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setLineQty(l.id, l.qty - 1)} className="w-7 h-7 rounded-full bg-white border border-[#E9ECEF] flex items-center justify-center font-bold text-sm">-</button>
                      <span className="text-sm font-bold w-4 text-center">{l.qty}</span>
                      <button onClick={() => setLineQty(l.id, l.qty + 1)} className="w-7 h-7 rounded-full bg-white border border-[#E9ECEF] flex items-center justify-center font-bold text-sm">+</button>
                      <button onClick={() => setLineQty(l.id, 0)} className="text-xs text-[#ADB5BD] hover:text-red-500 ml-auto font-bold">Remove</button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
            )}

            <div className="border-t border-[var(--border)] pt-6 mb-6 flex justify-between items-center text-xl font-black text-[var(--foreground)]">
              <span>Total</span>
              <span className="text-[var(--accent)]">₹{subtotal}</span>
            </div>

            <button onClick={handleOrder} disabled={cart.length === 0} className="btn-primary w-full py-4 rounded-full text-base tracking-widest shadow-lg disabled:opacity-50">
              CHECKOUT VIA WHATSAPP
            </button>
            {config.deliveryNote ? <p className="text-center text-xs text-[#6C757D] mt-3">{config.deliveryNote}</p> : null}
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
                    {msg.role === "user" ? <User size={20} weight="fill" /> : <Leaf size={20} weight="fill" />}
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
