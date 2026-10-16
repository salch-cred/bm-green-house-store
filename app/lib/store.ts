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

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  comparePrice: number;
  stock: number;
  image: string;
  tag: string;
  isLive: boolean;
  description: string;
};

export const defaultProducts: Product[] = [
  {
    id: "dates-seed-100g",
    name: "Roasted Dates Seed Powder",
    subtitle: "100g Original Blend",
    price: 160,
    comparePrice: 299,
    stock: 48,
    image: "/product-png2.png",
    tag: "Bestseller",
    isLive: true,
    description:
      "100% natural roasted date seeds — caffeine-free, zero added sugar, rich in antioxidants and minerals.",
  },
];

export type OrderItem = { id: string; name: string; qty: number; price: number };

export type Order = {
  id: string;
  qty: number;
  total: number;
  date: string;
  status: "new" | "packed" | "delivered" | "cancelled";
  note?: string;
  items?: OrderItem[];
};

export const KEYS = {
  config: "bm-store-config",
  products: "bm-store-products",
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
  // Never throws: storage-full (huge base64 photos) must not crash React.
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[store] localStorage write failed for ${key}`, err);
  }
}

// Quota-safe write: base64 review photos can exceed the ~5MB localStorage
// limit and throw. Returns false so callers can warn instead of crashing.
export function trySave(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
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
  const head = "id,date,qty,total,status,note,items";
  const rows = orders.map((o) => {
    const items = (o.items || []).map((i) => `${i.name} x${i.qty}`).join("; ");
    return [o.id, `"${o.date}"`, o.qty, o.total, o.status, `"${(o.note || "").replace(/"/g, '""')}"`, `"${items.replace(/"/g, '""')}"`].join(",");
  });
  return [head, ...rows].join("\n");
}

// ---- multi-product catalog ----
// Migrates the old single-product config into the catalog on first run so
// existing admin edits are preserved.
export function loadProducts(): Product[] {
  if (typeof window === "undefined") return defaultProducts;
  try {
    const raw = localStorage.getItem(KEYS.products);
    if (raw) {
      const list = JSON.parse(raw) as Product[];
      if (Array.isArray(list) && list.length > 0) return list;
    }
    const cfg = loadConfig();
    const looksCustom =
      cfg.name !== defaultConfig.name ||
      cfg.price !== defaultConfig.price ||
      cfg.stock !== defaultConfig.stock;
    if (looksCustom) {
      const migrated: Product[] = [{
        id: "dates-seed-100g",
        name: cfg.name,
        subtitle: cfg.subtitle,
        price: cfg.price,
        comparePrice: cfg.comparePrice,
        stock: cfg.stock,
        image: "/product-png2.png",
        tag: "Bestseller",
        isLive: cfg.isLive,
        description: "",
      }];
      localStorage.setItem(KEYS.products, JSON.stringify(migrated));
      return migrated;
    }
    return defaultProducts;
  } catch {
    return defaultProducts;
  }
}

export function productDiscount(p: Product): number {
  if (!p.comparePrice || p.comparePrice <= p.price) return 0;
  return Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100);
}

export type CartLine = { id: string; qty: number };

export function cartCount(cart: CartLine[]): number {
  return cart.reduce((s, l) => s + l.qty, 0);
}

export function cartTotal(cart: CartLine[], products: Product[]): number {
  return cart.reduce((s, l) => {
    const p = products.find((x) => x.id === l.id);
    return s + (p ? p.price * l.qty : 0);
  }, 0);
}

// ---- shared cloud store (Vercel Blob via /api/store) ----
// Admin publishes here; every visitor reads it → edits show on ALL devices.
// Silent no-op when Blob/API is unavailable (local-only demo mode).
export type SharedData = {
  config?: StoreConfig;
  products?: Product[];
  blogs?: BlogPost[];
  reviews?: Review[];
  updatedAt?: string;
};

export function getAdminKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem("bm-admin-key") || "";
  } catch {
    return "";
  }
}

export function setAdminKey(k: string) {
  try {
    if (k) sessionStorage.setItem("bm-admin-key", k);
    else sessionStorage.removeItem("bm-admin-key");
  } catch {}
}

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pending: SharedData | null = null;

export function pushShared(data: SharedData) {
  if (typeof window === "undefined") return;
  const key = getAdminKey();
  if (!key) {
    // No publish key in this tab → cloud never gets the update. Recorded so
    // the admin UI can surface it instead of failing silently.
    recordPush(false, "not-logged-in-this-tab");
    return;
  }
  pending = { ...(pending || {}), ...data, updatedAt: new Date().toISOString() };
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    const body = pending;
    pending = null;
    pushTimer = null;
    if (!body) return;
    try {
      const res = await fetch("/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": getAdminKey(),
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        recordPush(true);
      } else {
        recordPush(false, `HTTP ${res.status}`);
      }
    } catch (err) {
      recordPush(false, err instanceof Error ? err.message : "network error");
    }
  }, 800);
}

export async function fetchShared(): Promise<SharedData | null> {
  try {
    const res = await fetch("/api/store", { cache: "no-store" });
    if (!res.ok) return null;
    const j = await res.json();
    return j.shared ? (j.data as SharedData) : null;
  } catch {
    return null;
  }
}

// Last cloud-publish result (for the admin status pill). Never throws.
export function getLastPush(): { ok: boolean; error?: string; at?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("bm-store-last-push");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function recordPush(ok: boolean, error?: string) {
  try {
    localStorage.setItem(
      "bm-store-last-push",
      JSON.stringify({ ok, error: error || "", at: new Date().toLocaleString() })
    );
  } catch {}
}
