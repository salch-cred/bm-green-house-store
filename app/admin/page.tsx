"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, Package, Article, CheckCircle, Image as ImageIcon, Video,
  Star, Truck, Gear, SquaresFour, SignOut, BookOpen, UploadSimple, DownloadSimple,
} from "@phosphor-icons/react";
import {
  defaultConfig, KEYS, discountPct, expectedPassword, loadJSON, saveJSON, stockValue, toCSV,
  type BlogPost, type Order, type Review, type StoreConfig,
} from "../lib/store";

// Kept for backward compat: app/blogs/page.tsx imports this type from here.
export type { BlogPost } from "../lib/store";

type Tab = "dashboard" | "store" | "blogs" | "reviews" | "orders" | "media" | "settings" | "guide";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <SquaresFour size={20} /> },
  { id: "store", label: "Storefront", icon: <Package size={20} /> },
  { id: "blogs", label: "Blogs", icon: <Article size={20} /> },
  { id: "reviews", label: "Reviews", icon: <Star size={20} /> },
  { id: "orders", label: "Orders", icon: <Truck size={20} /> },
  { id: "media", label: "Media", icon: <ImageIcon size={20} /> },
  { id: "settings", label: "Settings", icon: <Gear size={20} /> },
  { id: "guide", label: "Procedure", icon: <BookOpen size={20} /> },
];

const inputCls =
  "w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 font-medium outline-none focus:border-[var(--accent)] transition-colors";
const labelCls = "block text-sm font-bold text-[var(--muted)] mb-2";
const cardCls = "bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm";

export default function Admin() {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig);
  const [saved, setSaved] = useState<string>("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [newBlog, setNewBlog] = useState<Partial<BlogPost>>({ mediaType: "none" });
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSearch, setReviewSearch] = useState("");
  const [manualReview, setManualReview] = useState({ name: "", text: "", rating: 5 });

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<"all" | Order["status"]>("all");

  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaUploading, setMediaUploading] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [newPass, setNewPass] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  // ---- load all demo data ----
  useEffect(() => {
    setConfig({ ...defaultConfig, ...loadJSON(KEYS.config, defaultConfig) });
    setBlogs(loadJSON<BlogPost[]>(KEYS.blogs, []));
    setReviews(loadJSON<Review[]>(KEYS.reviews, []));
    setOrders(loadJSON<Order[]>(KEYS.orders, []));
    if (localStorage.getItem(KEYS.auth) === "1") setIsAuthenticated(true);
  }, []);

  const flash = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(""), 2200);
  };

  const field = (key: keyof StoreConfig, value: string | number | boolean) =>
    setConfig((c) => ({ ...c, [key]: value }));

  const numField = (key: keyof StoreConfig, value: string) => {
    const n = Number(value);
    setConfig((c) => ({ ...c, [key]: Number.isFinite(n) ? n : 0 }));
  };

  const saveStore = () => {
    saveJSON(KEYS.config, config);
    flash("Storefront saved ✓ visible on homepage");
  };
  const resetStore = () => {
    if (!confirm("Reset storefront to defaults?")) return;
    setConfig(defaultConfig);
    saveJSON(KEYS.config, defaultConfig);
    flash("Storefront reset to defaults");
  };

  // ---- blogs ----
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewBlog((p) => ({ ...p, mediaType: file.type.startsWith("video/") ? "video" : "image" }));
    setIsUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { method: "POST", body: file });
      const blob = await res.json();
      if (!res.ok) throw new Error(blob.error || "upload failed");
      setNewBlog((p) => ({ ...p, mediaUrl: blob.url }));
    } catch (err) {
      console.error(err);
      alert("Upload failed. Set BLOB_READ_WRITE_TOKEN on Vercel, or paste an image URL manually.");
    } finally {
      setIsUploading(false);
    }
  };

  const saveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) return;
    if (editingBlogId) {
      const updated = blogs.map((b) =>
        b.id === editingBlogId
          ? { ...b, title: newBlog.title!, content: newBlog.content!, mediaType: newBlog.mediaType || "none", mediaUrl: newBlog.mediaUrl || "" }
          : b
      );
      setBlogs(updated);
      saveJSON(KEYS.blogs, updated);
      setEditingBlogId(null);
      flash("Blog updated");
    } else {
      const post: BlogPost = {
        id: Date.now().toString(),
        title: newBlog.title,
        content: newBlog.content,
        mediaType: newBlog.mediaType || "none",
        mediaUrl: newBlog.mediaUrl || "",
        date: new Date().toLocaleDateString(),
      };
      const updated = [post, ...blogs];
      setBlogs(updated);
      saveJSON(KEYS.blogs, updated);
      flash("Blog published ✓ visible at /blogs");
    }
    setNewBlog({ mediaType: "none", title: "", content: "", mediaUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEditBlog = (b: BlogPost) => {
    setEditingBlogId(b.id);
    setNewBlog({ title: b.title, content: b.content, mediaType: b.mediaType, mediaUrl: b.mediaUrl });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteBlog = (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const updated = blogs.filter((b) => b.id !== id);
    setBlogs(updated);
    saveJSON(KEYS.blogs, updated);
  };

  const filteredBlogs = useMemo(
    () => blogs.filter((b) => (b.title + b.content).toLowerCase().includes(blogSearch.toLowerCase())),
    [blogs, blogSearch]
  );

  // ---- reviews ----
  const avgRating = useMemo(
    () => (reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—"),
    [reviews]
  );
  const deleteReview = (id: string) => {
    if (!confirm("Delete this review?")) return;
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    saveJSON(KEYS.reviews, updated);
  };
  const addManualReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualReview.name || !manualReview.text) return;
    const r: Review = {
      id: Date.now().toString(),
      name: manualReview.name,
      rating: manualReview.rating,
      text: manualReview.text,
      date: new Date().toLocaleDateString(),
    };
    const updated = [r, ...reviews];
    setReviews(updated);
    saveJSON(KEYS.reviews, updated);
    setManualReview({ name: "", text: "", rating: 5 });
    flash("Review added ✓ visible at /reviews");
  };
  const filteredReviews = useMemo(
    () => reviews.filter((r) => (r.name + r.text).toLowerCase().includes(reviewSearch.toLowerCase())),
    [reviews, reviewSearch]
  );

  // ---- orders ----
  const setOrderStatus = (id: string, status: Order["status"]) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
    saveJSON(KEYS.orders, updated);
  };
  const deleteOrder = (id: string) => {
    const updated = orders.filter((o) => o.id !== id);
    setOrders(updated);
    saveJSON(KEYS.orders, updated);
  };
  const clearDoneOrders = () => {
    if (!confirm("Remove all delivered/cancelled orders?")) return;
    const updated = orders.filter((o) => o.status === "new" || o.status === "packed");
    setOrders(updated);
    saveJSON(KEYS.orders, updated);
  };
  const exportOrders = () => {
    const blob = new Blob([toCSV(orders)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bm-orders.csv";
    a.click();
  };
  const visibleOrders = orderFilter === "all" ? orders : orders.filter((o) => o.status === orderFilter);
  const newOrders = orders.filter((o) => o.status === "new").length;
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  // ---- media ----
  const uploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaUploading(true);
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { method: "POST", body: file });
      const blob = await res.json();
      if (!res.ok) throw new Error(blob.error || "upload failed");
      setMediaUrl(blob.url);
      flash("Media uploaded — copy the URL");
    } catch {
      alert("Upload failed. Check Vercel Blob token.");
    } finally {
      setMediaUploading(false);
    }
  };

  // ---- settings: export / import / reset ----
  const exportAll = () => {
    const data = {
      config: loadJSON(KEYS.config, defaultConfig),
      blogs: loadJSON(KEYS.blogs, []),
      reviews: loadJSON(KEYS.reviews, []),
      orders: loadJSON(KEYS.orders, []),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bm-store-backup.json";
    a.click();
  };
  const importAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.config) { setConfig({ ...defaultConfig, ...data.config }); saveJSON(KEYS.config, data.config); }
      if (data.blogs) { setBlogs(data.blogs); saveJSON(KEYS.blogs, data.blogs); }
      if (data.reviews) { setReviews(data.reviews); saveJSON(KEYS.reviews, data.reviews); }
      if (data.orders) { setOrders(data.orders); saveJSON(KEYS.orders, data.orders); }
      flash("Backup imported ✓");
    } catch {
      alert("Invalid backup file.");
    }
  };
  const resetAll = () => {
    if (!confirm("Erase ALL demo data (config, blogs, reviews, orders)?")) return;
    localStorage.removeItem(KEYS.config);
    localStorage.removeItem(KEYS.blogs);
    localStorage.removeItem(KEYS.reviews);
    localStorage.removeItem(KEYS.orders);
    setConfig(defaultConfig);
    setBlogs([]); setReviews([]); setOrders([]);
    flash("All demo data cleared");
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === expectedPassword()) {
      setIsAuthenticated(true);
      localStorage.setItem(KEYS.auth, "1");
    } else alert("Incorrect password");
  };
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(KEYS.auth);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <div className="bg-[var(--surface)] p-8 rounded-3xl shadow-sm border border-[var(--border)] max-w-sm w-full text-center">
          <Image src="/bm-logo.png" alt="Logo" width={64} height={64} className="mx-auto mb-6 rounded-xl shadow-sm" />
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Admin Access</h1>
          <p className="text-sm text-[var(--muted)] mb-6">Password = <code>NEXT_PUBLIC_ADMIN_PASSWORD</code> (fallback <code>suhail123</code>). You can override it in Settings.</p>
          <form onSubmit={login}>
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Enter password"
              className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 font-medium outline-none focus:border-[var(--accent)] transition-colors mb-4 text-center" />
            <button type="submit" className="w-full bg-[var(--accent)] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">Login</button>
          </form>
        </div>
      </div>
    );
  }

  const lowStock = config.stock <= config.lowStockThreshold;

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row text-[var(--foreground)]">
      <div className="md:hidden flex items-center justify-between p-4 bg-[var(--surface)] border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/bm-logo.png" alt="BM" width={32} height={32} className="rounded-lg" />
          <span className="font-extrabold text-sm tracking-tight text-[var(--accent)]">BM Green House</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[var(--accent)] p-2 bg-[var(--surface-hover)] rounded-md font-bold text-sm">
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      <aside className={`${mobileOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-[var(--surface)] border-r border-[var(--border)] p-6 shrink-0`}>
        <Link href="/" className="hidden md:flex items-center gap-3 mb-8">
          <Image src="/bm-logo.png" alt="BM" width={42} height={42} className="rounded-xl shadow-sm" />
          <span className="font-extrabold text-sm leading-tight">BM Green House<br /><span className="text-[var(--muted)] font-medium">Commerce</span></span>
        </Link>
        <nav className="flex flex-col gap-2 mb-8">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); setMobileOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${tab === t.id ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"}`}>
              {t.icon} {t.label}
              {t.id === "orders" && newOrders > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{newOrders}</span>}
            </button>
          ))}
        </nav>
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] font-medium text-sm transition-colors">
            <ArrowLeft size={18} /> Back to store
          </Link>
          <button onClick={logout} className="flex items-center gap-2 text-[var(--muted)] hover:text-red-500 font-medium text-sm transition-colors">
            <SignOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <section className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <span className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase mb-2 block">{tab} control</span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 capitalize">{tab === "guide" ? "Working procedure." : tab === "dashboard" ? "Good afternoon." : `Manage ${tab}.`}</h1>
            <p className="text-[var(--muted)] font-medium text-sm">
              {tab === "dashboard" && "Store health at a glance."}
              {tab === "store" && "Product, hero, announcement, brand — everything the homepage reads."}
              {tab === "blogs" && "Create, edit, search and delete posts (/blogs)."}
              {tab === "reviews" && "Moderate customer reviews (/reviews)."}
              {tab === "orders" && "WhatsApp checkouts land here. Update status, export CSV."}
              {tab === "media" && "Upload to Vercel Blob and copy URLs for blogs."}
              {tab === "settings" && "Backup, restore, password, danger zone."}
              {tab === "guide" && "Full step-by-step operating manual."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="flex items-center gap-1 text-[var(--accent)] font-bold text-sm bg-[var(--surface-hover)] px-3 py-1.5 rounded-full"><CheckCircle size={16} weight="fill" /> {saved}</span>}
            <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold shadow-md shrink-0">BM</div>
          </div>
        </header>

        {/* ============ DASHBOARD ============ */}
        {tab === "dashboard" && (
          <div className="max-w-5xl">
            {lowStock && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 font-bold text-sm rounded-2xl px-5 py-4">⚠ Low stock: only {config.stock} packs left (threshold {config.lowStockThreshold}). Update stock in Storefront tab.</div>}
            {!config.isLive && <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm rounded-2xl px-5 py-4">Store is OFFLINE — Buy button is disabled on the homepage. Re-enable in Storefront tab.</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { l: "Store status", v: config.isLive ? "● Live" : "○ Offline", s: "homepage buy button" },
                { l: "Stock", v: `${config.stock} packs`, s: `₹${stockValue(config).toLocaleString()} value` },
                { l: "Discount", v: `${discountPct(config)}% off`, s: `₹${config.price} vs ₹${config.comparePrice}` },
                { l: "Revenue (logged)", v: `₹${revenue.toLocaleString()}`, s: `${orders.length} orders · ${newOrders} new` },
                { l: "Blogs", v: `${blogs.length}`, s: "posts at /blogs" },
                { l: "Reviews", v: `${reviews.length} · ${avgRating}★`, s: "at /reviews" },
                { l: "WhatsApp", v: config.whatsapp || "—", s: "checkout number" },
                { l: "Announcement", v: config.showAnnouncement ? "On" : "Off", s: (config.announcement || "").slice(0, 28) },
              ].map((c) => (
                <div key={c.l} className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
                  <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">{c.l}</span>
                  <b className="text-xl block mb-1 truncate">{c.v}</b>
                  <small className="text-[var(--muted)] font-medium truncate block">{c.s}</small>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={cardCls}>
                <h3 className="font-extrabold text-lg mb-4">Quick actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setTab("store")} className="btn-primary px-5 py-2.5 rounded-xl text-xs">Edit storefront</button>
                  <button onClick={() => setTab("blogs")} className="px-5 py-2.5 rounded-xl text-xs font-bold border border-[var(--border)] hover:bg-[var(--surface-hover)]">New blog</button>
                  <button onClick={() => setTab("orders")} className="px-5 py-2.5 rounded-xl text-xs font-bold border border-[var(--border)] hover:bg-[var(--surface-hover)]">View orders ({newOrders} new)</button>
                  <button onClick={exportAll} className="px-5 py-2.5 rounded-xl text-xs font-bold border border-[var(--border)] hover:bg-[var(--surface-hover)]">Backup JSON</button>
                </div>
                <p className="text-xs text-[var(--muted)] mt-5 leading-relaxed">Demo persistence: everything is stored in this browser&apos;s localStorage (<code>bm-store-*</code>). For shared multi-device admin, connect Supabase (see Procedure tab).</p>
              </div>
              <div className={cardCls}>
                <h3 className="font-extrabold text-lg mb-4">Latest orders</h3>
                {orders.length === 0 ? <p className="text-sm text-[var(--muted)]">No orders yet — click “Checkout via WhatsApp” on the homepage to log one here.</p> : (
                  <div className="flex flex-col gap-3">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="flex items-center justify-between text-sm bg-[var(--surface-hover)] rounded-xl px-4 py-3 border border-[var(--border)]">
                        <span className="font-bold">#{o.id.slice(-6)} · {o.qty}× · ₹{o.total}</span>
                        <span className="text-xs font-bold uppercase text-[var(--muted)]">{o.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============ STORE ============ */}
        {tab === "store" && (
          <div className="max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
                <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Product status</span>
                <b className="text-xl text-[var(--accent)] block mb-1">{config.isLive ? "Live" : "Offline"}</b>
                <small className="text-[var(--muted)] font-medium">{config.isLive ? "Visible in storefront" : "Buy button disabled"}</small>
              </div>
              <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
                <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Available stock</span>
                <b className="text-xl block mb-1">{config.stock}</b>
                <small className="text-[var(--muted)] font-medium">100g packs · warn under {config.lowStockThreshold}</small>
              </div>
              <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
                <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Discount</span>
                <b className="text-xl block mb-1">{discountPct(config)}% off</b>
                <small className="text-[var(--muted)] font-medium">₹{config.price} vs ₹{config.comparePrice}</small>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <form onSubmit={(e) => { e.preventDefault(); saveStore(); }} className="lg:col-span-2 flex flex-col gap-8">
                <div className={`${cardCls}`}>
                  <h2 className="text-xl font-extrabold mb-1">Product settings</h2>
                  <p className="text-xs text-[var(--muted)] mb-6">Shown in hero, cart and WhatsApp order text.</p>
                  <div className="grid gap-5">
                    <label className="block"><span className={labelCls}>Product name</span><input value={config.name} onChange={(e) => field("name", e.target.value)} className={inputCls} /></label>
                    <label className="block"><span className={labelCls}>Short description</span><input value={config.subtitle} onChange={(e) => field("subtitle", e.target.value)} className={inputCls} /></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <label className="block"><span className={labelCls}>Price (₹)</span><input type="number" min={0} value={config.price} onChange={(e) => numField("price", e.target.value)} className={inputCls} /></label>
                      <label className="block"><span className={labelCls}>Compare price (₹)</span><input type="number" min={0} value={config.comparePrice} onChange={(e) => numField("comparePrice", e.target.value)} className={inputCls} /></label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <label className="block"><span className={labelCls}>Available stock</span><input type="number" min={0} value={config.stock} onChange={(e) => numField("stock", e.target.value)} className={inputCls} /></label>
                      <label className="block"><span className={labelCls}>Low-stock warning under</span><input type="number" min={1} value={config.lowStockThreshold} onChange={(e) => numField("lowStockThreshold", e.target.value)} className={inputCls} /></label>
                    </div>
                    <label className="flex items-center gap-3 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 cursor-pointer">
                      <input type="checkbox" checked={config.isLive} onChange={(e) => field("isLive", e.target.checked)} className="w-5 h-5 accent-[#3E5A3B]" />
                      <span className="font-bold text-sm">Store is live (enables Buy Now + checkout)</span>
                    </label>
                    <label className="block"><span className={labelCls}>Delivery note (shown at checkout)</span><input value={config.deliveryNote} onChange={(e) => field("deliveryNote", e.target.value)} className={inputCls} /></label>
                  </div>
                </div>

                <div className={cardCls}>
                  <h2 className="text-xl font-extrabold mb-1">Hero + announcement</h2>
                  <p className="text-xs text-[var(--muted)] mb-6">Top of the homepage.</p>
                  <div className="grid gap-5">
                    <label className="block"><span className={labelCls}>Hero title (line 1)</span><input value={config.heroTitle} onChange={(e) => field("heroTitle", e.target.value)} className={inputCls} /></label>
                    <label className="block"><span className={labelCls}>Hero highlight (line 2, green)</span><input value={config.heroHighlight} onChange={(e) => field("heroHighlight", e.target.value)} className={inputCls} /></label>
                    <label className="block"><span className={labelCls}>Hero tagline</span><input value={config.heroTagline} onChange={(e) => field("heroTagline", e.target.value)} className={inputCls} /></label>
                    <label className="flex items-center gap-3 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 cursor-pointer">
                      <input type="checkbox" checked={config.showAnnouncement} onChange={(e) => field("showAnnouncement", e.target.checked)} className="w-5 h-5 accent-[#3E5A3B]" />
                      <span className="font-bold text-sm">Show announcement bar</span>
                    </label>
                    <label className="block"><span className={labelCls}>Announcement text</span><input value={config.announcement} onChange={(e) => field("announcement", e.target.value)} className={inputCls} /></label>
                  </div>
                </div>

                <div className={cardCls}>
                  <h2 className="text-xl font-extrabold mb-1">Brand + contact</h2>
                  <p className="text-xs text-[var(--muted)] mb-6">WhatsApp receives orders; Instagram is the footer link.</p>
                  <div className="grid gap-5">
                    <label className="block"><span className={labelCls}>WhatsApp number (country code, no +/spaces)</span><input value={config.whatsapp} onChange={(e) => field("whatsapp", e.target.value)} placeholder="918746077173" className={inputCls} /></label>
                    <label className="block"><span className={labelCls}>Instagram URL</span><input value={config.instagram} onChange={(e) => field("instagram", e.target.value)} className={inputCls} /></label>
                    <label className="block"><span className={labelCls}>About title</span><input value={config.aboutTitle} onChange={(e) => field("aboutTitle", e.target.value)} className={inputCls} /></label>
                    <label className="block"><span className={labelCls}>About text</span><textarea rows={4} value={config.aboutText} onChange={(e) => field("aboutText", e.target.value)} className={inputCls} /></label>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-8">
                    <button type="submit" className="btn-primary px-8 py-3.5 rounded-xl text-sm">Save storefront</button>
                    <button type="button" onClick={resetStore} className="px-8 py-3.5 rounded-xl text-sm font-bold border border-[var(--border)] hover:bg-[var(--surface-hover)]">Reset defaults</button>
                  </div>
                </div>
              </form>

              <div className={`${cardCls} h-fit lg:sticky lg:top-6`}>
                <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block mb-6">Live preview</span>
                <div className="bg-[var(--surface-hover)] rounded-2xl p-4 flex flex-col items-center text-center border border-[var(--border)] relative overflow-hidden">
                  <div className="absolute top-3 right-3 bg-[var(--accent)] text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm"><span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span> LIVE</div>
                  <Image src="/product-png2.png" alt="Product" width={140} height={220} className="drop-shadow-xl my-4" />
                  <h3 className="font-extrabold text-lg mt-2">{config.name}</h3>
                  <p className="text-[var(--muted)] text-xs font-medium mt-1 mb-3">{config.subtitle}</p>
                  <div className="flex items-center gap-2 mb-2"><b className="text-xl">₹{config.price}</b><s className="text-[var(--muted)] text-sm">₹{config.comparePrice}</s></div>
                  <p className="text-[11px] text-[var(--muted)]">{config.heroTagline}</p>
                </div>
                <a href={`https://wa.me/${config.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi BM Green House! Test message from admin.")}`} target="_blank" rel="noreferrer"
                  className="mt-4 block text-center text-sm font-bold text-[var(--accent)] hover:underline">Test WhatsApp checkout →</a>
              </div>
            </div>
          </div>
        )}

        {/* ============ BLOGS ============ */}
        {tab === "blogs" && (
          <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form onSubmit={saveBlog} className={cardCls}>
              <h2 className="text-2xl font-bold mb-1">{editingBlogId ? "Edit post" : "Create blog"}</h2>
              <p className="text-xs text-[var(--muted)] mb-6">Published instantly to <Link href="/blogs" className="underline">/blogs</Link>.</p>
              <div className="grid gap-5">
                <label className="block"><span className={labelCls}>Title</span><input required value={newBlog.title || ""} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} placeholder="e.g. 5 ways to brew date seeds" className={inputCls} /></label>
                <label className="block"><span className={labelCls}>Content</span><textarea required rows={6} value={newBlog.content || ""} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} placeholder="Write your article here..." className={`${inputCls} resize-y`} /></label>
                <div className="block">
                  <span className={labelCls}>Media (photo/video → Vercel Blob)</span>
                  <div className="relative">
                    <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading} />
                    <div className={`flex items-center gap-3 w-full bg-[var(--surface-hover)] border border-dashed border-[var(--border)] rounded-xl px-4 py-4 text-[var(--muted)] text-sm ${isUploading ? "animate-pulse" : ""}`}>
                      <ImageIcon size={24} /> <Video size={24} /> {isUploading ? "Uploading…" : "Click to upload, or paste URL below"}
                    </div>
                  </div>
                  <input value={newBlog.mediaUrl || ""} onChange={(e) => setNewBlog({ ...newBlog, mediaUrl: e.target.value, mediaType: newBlog.mediaType === "none" ? "image" : newBlog.mediaType })} placeholder="…or paste https:// image/video URL" className={`${inputCls} mt-3`} />
                  {newBlog.mediaUrl && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-[var(--border)] bg-black max-w-[220px] relative">
                      {newBlog.mediaType === "video" ? <video src={newBlog.mediaUrl} autoPlay muted loop playsInline className="w-full h-auto" /> : <img src={newBlog.mediaUrl} alt="Preview" className="w-full h-auto" />}
                      <button type="button" onClick={() => setNewBlog({ ...newBlog, mediaUrl: "", mediaType: "none" })} className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">✕</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="submit" className="btn-primary px-8 py-3.5 rounded-xl text-sm">{editingBlogId ? "Update post" : "Publish blog"}</button>
                {editingBlogId && <button type="button" onClick={() => { setEditingBlogId(null); setNewBlog({ mediaType: "none", title: "", content: "", mediaUrl: "" }); }} className="px-6 py-3.5 rounded-xl text-sm font-bold border border-[var(--border)]">Cancel</button>}
              </div>
            </form>

            <div className={`${cardCls} h-fit max-h-[800px] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Published ({blogs.length})</span>
              </div>
              <input value={blogSearch} onChange={(e) => setBlogSearch(e.target.value)} placeholder="Search posts…" className={`${inputCls} mb-4`} />
              <div className="flex flex-col gap-4">
                {filteredBlogs.length === 0 && <div className="text-center p-8 bg-[var(--surface-hover)] rounded-2xl border text-[var(--muted)] text-sm">No posts found.</div>}
                {filteredBlogs.map((blog) => (
                  <div key={blog.id} className="p-5 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border)]">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h3 className="font-bold leading-tight">{blog.title}</h3>
                      <div className="flex gap-3 shrink-0 text-xs font-bold uppercase">
                        <button onClick={() => startEditBlog(blog)} className="text-[var(--accent)] hover:underline">Edit</button>
                        <button onClick={() => deleteBlog(blog.id)} className="text-[var(--muted)] hover:text-red-500">Delete</button>
                      </div>
                    </div>
                    <p className="text-[var(--accent)] text-xs font-bold mb-2">{blog.date}</p>
                    <p className="text-[var(--muted)] text-sm line-clamp-3 mb-3">{blog.content}</p>
                    {blog.mediaUrl && <div className="rounded-xl overflow-hidden h-28 border bg-black">{blog.mediaType === "video" ? <video src={blog.mediaUrl} className="w-full h-full object-cover" /> : <img src={blog.mediaUrl} className="w-full h-full object-cover" alt="" />}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============ REVIEWS ============ */}
        {tab === "reviews" && (
          <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-8">
              <form onSubmit={addManualReview} className={cardCls}>
                <h2 className="text-xl font-extrabold mb-1">Add review manually</h2>
                <p className="text-xs text-[var(--muted)] mb-6">For WhatsApp / in-person feedback. Avg rating: {avgRating}★ across {reviews.length}.</p>
                <div className="grid gap-4">
                  <div className="flex gap-2">{[1, 2, 3, 4, 5].map((s) => <button type="button" key={s} onClick={() => setManualReview({ ...manualReview, rating: s })}><Star size={28} weight={s <= manualReview.rating ? "fill" : "regular"} className="text-[#F5A623]" /></button>)}</div>
                  <input required placeholder="Customer name" value={manualReview.name} onChange={(e) => setManualReview({ ...manualReview, name: e.target.value })} className={inputCls} />
                  <textarea required placeholder="Review text…" rows={3} value={manualReview.text} onChange={(e) => setManualReview({ ...manualReview, text: e.target.value })} className={inputCls} />
                </div>
                <button className="btn-primary px-6 py-3 rounded-xl text-sm mt-6">Add review</button>
              </form>
              <div className={cardCls}>
                <h3 className="font-extrabold mb-3">Bulk actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => { if (confirm("Delete ALL reviews?")) { setReviews([]); saveJSON(KEYS.reviews, []); } }} className="px-5 py-2.5 text-xs font-bold rounded-xl border border-red-200 text-red-600 hover:bg-red-50">Delete all</button>
                  <Link href="/reviews" className="px-5 py-2.5 text-xs font-bold rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)]">View /reviews →</Link>
                </div>
              </div>
            </div>
            <div className={`${cardCls} h-fit max-h-[800px] overflow-y-auto`}>
              <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block mb-4">All reviews ({reviews.length})</span>
              <input value={reviewSearch} onChange={(e) => setReviewSearch(e.target.value)} placeholder="Search reviews…" className={`${inputCls} mb-4`} />
              <div className="flex flex-col gap-4">
                {filteredReviews.length === 0 && <p className="text-sm text-[var(--muted)] text-center p-6">No reviews yet.</p>}
                {filteredReviews.map((r) => (
                  <div key={r.id} className="p-5 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border)]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="flex text-[#F5A623]">{[...Array(5)].map((_, i) => <Star key={i} size={14} weight={i < r.rating ? "fill" : "regular"} />)}</span>
                      <button onClick={() => deleteReview(r.id)} className="text-xs font-bold uppercase text-[var(--muted)] hover:text-red-500">Delete</button>
                    </div>
                    <p className="text-sm mb-2">“{r.text}”</p>
                    <p className="text-xs text-[var(--muted)] font-bold">— {r.name} · {r.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============ ORDERS ============ */}
        {tab === "orders" && (
          <div className="max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              {[["Total", orders.length], ["New", newOrders], ["Revenue", `₹${revenue.toLocaleString()}`], ["Avg basket", orders.length ? `₹${Math.round(revenue / orders.length)}` : "—"]].map(([l, v]) => (
                <div key={l as string} className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)]"><span className="text-xs font-bold text-[var(--muted)] uppercase block mb-1">{l}</span><b className="text-xl">{v}</b></div>
              ))}
            </div>
            <div className={`${cardCls} mb-6 flex flex-col md:flex-row gap-4 md:items-center`}>
              <div className="flex gap-2 flex-wrap">
                {(["all", "new", "packed", "delivered", "cancelled"] as const).map((s) => (
                  <button key={s} onClick={() => setOrderFilter(s)} className={`px-4 py-2 rounded-full text-xs font-bold capitalize ${orderFilter === s ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--muted)]"}`}>{s}</button>
                ))}
              </div>
              <div className="md:ml-auto flex gap-3">
                <button onClick={exportOrders} className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)]"><DownloadSimple size={16} /> CSV</button>
                <button onClick={clearDoneOrders} className="px-5 py-2.5 text-xs font-bold rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)]">Clear done</button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {visibleOrders.length === 0 && <div className={`${cardCls} text-center text-sm text-[var(--muted)]`}>No orders in this view. Orders appear here automatically when a customer clicks “Checkout via WhatsApp”.</div>}
              {visibleOrders.map((o) => (
                <div key={o.id} className={`${cardCls} !p-5 flex flex-col md:flex-row md:items-center gap-4`}>
                  <div className="flex-1">
                    <b>#{o.id.slice(-6)} · {o.qty} × 100g · ₹{o.total}</b>
                    <p className="text-xs text-[var(--muted)] mt-1">{o.date}{o.note ? ` · ${o.note}` : ""}</p>
                  </div>
                  <select value={o.status} onChange={(e) => setOrderStatus(o.id, e.target.value as Order["status"])} className="bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm font-bold">
                    <option value="new">new</option><option value="packed">packed</option><option value="delivered">delivered</option><option value="cancelled">cancelled</option>
                  </select>
                  <button onClick={() => deleteOrder(o.id)} className="text-xs font-bold uppercase text-[var(--muted)] hover:text-red-500">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============ MEDIA ============ */}
        {tab === "media" && (
          <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={cardCls}>
              <h2 className="text-xl font-extrabold mb-1">Upload media</h2>
              <p className="text-xs text-[var(--muted)] mb-6">Files go to Vercel Blob (<code>/api/upload</code>). Requires <code>BLOB_READ_WRITE_TOKEN</code> on Vercel. Static files in <code>public/</code> (logo, product PNGs, videos) must be committed via git.</p>
              <div className="relative mb-4">
                <input type="file" accept="image/*,video/*" ref={mediaInputRef} onChange={uploadMedia} className="absolute inset-0 opacity-0 cursor-pointer" disabled={mediaUploading} />
                <div className={`flex items-center gap-3 border border-dashed border-[var(--border)] rounded-xl px-4 py-5 text-sm text-[var(--muted)] ${mediaUploading ? "animate-pulse" : ""}`}>
                  <UploadSimple size={22} /> {mediaUploading ? "Uploading…" : "Click to upload photo/video"}
                </div>
              </div>
              {mediaUrl && (
                <div>
                  <p className="text-xs font-bold text-[var(--muted)] mb-2">Uploaded URL (paste into a blog):</p>
                  <div className="flex gap-2"><input readOnly value={mediaUrl} className={inputCls} /><button onClick={() => navigator.clipboard.writeText(mediaUrl)} className="btn-primary px-4 rounded-xl text-xs shrink-0">Copy</button></div>
                </div>
              )}
            </div>
            <div className={cardCls}>
              <h3 className="font-extrabold mb-4">Media currently used in blogs ({blogs.filter((b) => b.mediaUrl).length})</h3>
              {blogs.filter((b) => b.mediaUrl).length === 0 && <p className="text-sm text-[var(--muted)]">No blog media yet.</p>}
              <div className="flex flex-col gap-3">
                {blogs.filter((b) => b.mediaUrl).map((b) => (
                  <div key={b.id} className="flex items-center gap-3 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl p-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0">{b.mediaType === "video" ? <video src={b.mediaUrl} className="w-full h-full object-cover" /> : <img src={b.mediaUrl} alt="" className="w-full h-full object-cover" />}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate">{b.title}</p><p className="text-[11px] text-[var(--muted)] truncate">{b.mediaUrl}</p></div>
                    <button onClick={() => navigator.clipboard.writeText(b.mediaUrl)} className="text-xs font-bold text-[var(--accent)] hover:underline shrink-0">Copy</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============ SETTINGS ============ */}
        {tab === "settings" && (
          <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={cardCls}>
              <h2 className="text-xl font-extrabold mb-1">Backup & restore</h2>
              <p className="text-xs text-[var(--muted)] mb-6">Download one JSON with config + blogs + reviews + orders. Import it on another device/browser.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={exportAll} className="btn-primary px-6 py-3 rounded-xl text-sm">Download backup</button>
                <button onClick={() => importRef.current?.click()} className="px-6 py-3 rounded-xl text-sm font-bold border border-[var(--border)]">Import backup</button>
                <input type="file" accept="application/json" ref={importRef} onChange={importAll} className="hidden" />
              </div>
              <hr className="my-6 border-[var(--border)]" />
              <h3 className="font-extrabold mb-2">Change admin password (this browser)</h3>
              <p className="text-xs text-[var(--muted)] mb-3">Overrides <code>NEXT_PUBLIC_ADMIN_PASSWORD</code> locally. To change it for everyone, set the env var in Vercel → redeploy.</p>
              <div className="flex gap-2">
                <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New local password" className={inputCls} />
                <button onClick={() => { if (!newPass) return; localStorage.setItem(KEYS.passOverride, newPass); setNewPass(""); flash("Local password updated"); }} className="btn-primary px-5 rounded-xl text-sm shrink-0">Set</button>
              </div>
            </div>
            <div className={cardCls}>
              <h2 className="text-xl font-extrabold mb-1">Environment & danger zone</h2>
              <div className="text-xs font-mono bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl p-4 mb-6 leading-relaxed">
                NEXT_PUBLIC_ADMIN_PASSWORD: {process.env.NEXT_PUBLIC_ADMIN_PASSWORD ? "● set" : "○ not set (fallback active)"}<br />
                GROQ_API_KEY (Green AI): {process.env.GROQ_API_KEY ? "● set" : "○ not set — server only, never expose"}<br />
                BLOB_READ_WRITE_TOKEN: needed for uploads
              </div>
              <button onClick={resetAll} className="w-full py-3 rounded-xl text-sm font-bold border border-red-200 text-red-600 hover:bg-red-50">Erase all demo data</button>
              <p className="text-[11px] text-[var(--muted)] mt-3">Security note: this demo uses client-side password + localStorage. Anyone with the password (or DevTools) can edit this browser&apos;s data. For production, move data to Supabase with Row-Level Security + server auth.</p>
            </div>
          </div>
        )}

        {/* ============ GUIDE ============ */}
        {tab === "guide" && (
          <div className="max-w-4xl">
            <div className={cardCls}>
              <h2 className="text-2xl font-extrabold mb-2">Full working procedure</h2>
              <p className="text-sm text-[var(--muted)] mb-8">How to run the store day-to-day, end to end.</p>
              <ol className="flex flex-col gap-6 text-sm leading-relaxed">
                {[
                  ["1 · Login", "Open /admin. Enter the admin password (env NEXT_PUBLIC_ADMIN_PASSWORD, fallback suhail123, or your local override from Settings). Login persists in this browser until Logout."],
                  ["2 · Dashboard", "Check Live status, stock vs threshold, discount %, revenue, new orders, blog/review counts. Red banner = low stock or offline store."],
                  ["3 · Storefront", "Edit product (name, price, compare price, stock), toggle isLive, write hero + announcement + about + WhatsApp/Instagram. Save storefront → homepage updates instantly in the same browser (localStorage bm-store-config). Test WhatsApp link before festivals/sales."],
                  ["4 · Orders (daily)", "Every homepage WhatsApp checkout is auto-logged here with qty + total + date. Filter by new/packed/delivered/cancelled, advance the status as you pack/ship, export CSV for your accounts. Clear done orders weekly."],
                  ["5 · Blogs (weekly)", "Create post: title + content + optional photo/video (upload → Vercel Blob URL, or paste any https URL). Publish → appears at /blogs. Edit fixes typos; Delete removes. Search when the list grows."],
                  ["6 · Reviews (daily)", "Customer reviews from /reviews appear here. Delete spam, add offline/WhatsApp feedback manually with star rating, track average rating. Delete-all is available for a fresh start."],
                  ["7 · Media", "Upload campaign photos/videos to Vercel Blob and Copy the URL into blogs. Permanent brand assets (logo, product PNGs, hero videos in public/) must be replaced via git + redeploy, not here."],
                  ["8 · Settings / backup", "Download backup JSON weekly (or before any sale). Import it to clone the store to another laptop/browser. Change local password here; change the global password via Vercel env var + redeploy. Erase demo data only when you mean it."],
                  ["9 · Deploy & env", "npm install → cp .env.example .env.local → set NEXT_PUBLIC_ADMIN_PASSWORD, NEXT_PUBLIC_WHATSAPP_NUMBER, GROQ_API_KEY, BLOB_READ_WRITE_TOKEN → npm run dev to test, push to GitHub, import in Vercel, add the same env vars, Deploy. Share /admin password only with staff."],
                  ["10 · Production upgrade path", "When ready: move bm-store-* from localStorage to Supabase tables (config singleton, blogs, reviews, orders) with server-side admin auth; keep this UI — only swap loadJSON/saveJSON for fetch calls."],
                ].map(([t, d]) => (
                  <li key={t} className="bg-[var(--surface-hover)] border border-[var(--border)] rounded-2xl p-5">
                    <b className="block mb-1">{t}</b><span className="text-[var(--muted)]">{d}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
