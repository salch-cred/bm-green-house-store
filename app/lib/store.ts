"use client";
// Single source of truth for store data. Everything persists in localStorage
// (demo mode). Keys are versioned but backward-compatible with the old app.

export type StoreConfig = {
  name: string;
  subtitle: string;
  price: number;
  comparePrice: number;
  stock: number;
  whatsapp: string;
  // --- new options (all optional in storage, defaulted on load) ---
  heroTitle: string;
  heroHighlight: string;
  heroTagline: string;
  announcement: string;
  showAnnouncement: boolean;
  instagram: string;
  aboutTitle: string;
  aboutText: string;
  isLive: boolean;
  lowStockThreshold: number;
  deliveryNote: string;
};

export const defaultConfig: StoreConfig = {
  name: "Roasted Dates Seed Powder",
  subtitle: "100g Original Blend",
  price: 160,
  comparePrice: 299,
  stock: 48,
  whatsapp: "918746077173",
  heroTitle: "Bringing families together,",
  heroHighlight: "one delicious cup at a time.",
  heroTagline: "#BrewWithBMGreenHouse",
  announcement: "Free shipping above ₹499 · 100% natural · Caffeine-free",
  showAnnouncement: true,
  instagram: "https://instagram.com/bmgreenhouse",
  aboutTitle: "Traditional Recipes, Modern Purity",
  aboutText:
    "Since our inception, BM Green House has been dedicated to bringing families together over healthy, natural meals. Our Roasted Dates Seed Powder is meticulously crafted using automated processing to ensure 100% purity without any preservatives.",
  isLive: true,
  lowStockThreshold: 10,
  deliveryNote: "Standard shipping 3-5 business days. Tracking shared on WhatsApp.",
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  mediaType: "image" | "video" | "none";
  mediaUrl: string;
  date: string;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  photoUrl?: string;
  date: string;
};

export type Order = {
  id: string;
  qty: number;
  total: number;
  date: string;
  status: "new" | "packed" | "delivered" | "cancelled";
  note?: string;
};

export const KEYS = {
  config: "bm-store-config",
  blogs: "bm-store-blogs",
  reviews: "bm-store-reviews",
  orders: "bm-store-orders",
  auth: "bm-store-admin-auth",
  passOverride: "bm-store-admin-pass",
} as const;

export function loadConfig(): StoreConfig {
  if (typeof window === "undefined") return defaultConfig;
  try {
    const raw = localStorage.getItem(KEYS.config);
    if (!raw) return defaultConfig;
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch {
    return defaultConfig;
  }
}

export function saveConfig(c: StoreConfig) {
  localStorage.setItem(KEYS.config, JSON.stringify(c));
}

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function expectedPassword(): string {
  if (typeof window === "undefined") return "suhail123";
  return (
    localStorage.getItem(KEYS.passOverride) ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "suhail123"
  );
}

export function discountPct(c: StoreConfig): number {
  if (!c.comparePrice || c.comparePrice <= c.price) return 0;
  return Math.round(((c.comparePrice - c.price) / c.comparePrice) * 100);
}

export function stockValue(c: StoreConfig): number {
  return c.price * c.stock;
}

export function toCSV(orders: Order[]): string {
  const head = "id,date,qty,total,status,note";
  const rows = orders.map((o) =>
    [o.id, `"${o.date}"`, o.qty, o.total, o.status, `"${(o.note || "").replace(/"/g, '""')}"`].join(",")
  );
  return [head, ...rows].join("\n");
}
