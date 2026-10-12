# BM Green House Store — Admin Guide

Full working procedure for the `/admin` console (see also the in-app **Procedure** tab).

## 1. Login
- Open `/admin`. Password = `NEXT_PUBLIC_ADMIN_PASSWORD` env var.
- Fallback (dev only): `suhail123`. You can set a per-browser override in
  **Settings → Change admin password**; the global password is changed via the
  Vercel env var + redeploy.
- Login persists in this browser until **Logout**.

## 2. Dashboard
Health at a glance: Live status, stock vs low-stock threshold, discount %,
logged revenue, new orders, blog/review counts. Red banner = low stock or
offline store.

## 3. Storefront tab
Everything the homepage reads from `localStorage (bm-store-config)`:
- **Product**: name, subtitle, price, compare price, stock, low-stock threshold,
  `isLive` toggle (disables Buy Now when offline), delivery note.
- **Hero + announcement**: hero title / highlight / tagline, announcement bar
  on/off + text.
- **Brand + contact**: WhatsApp number (checkout destination), Instagram URL,
  About title/text.
- **Save storefront** → homepage updates instantly in the same browser.
  Use **Test WhatsApp checkout** to verify the number.

> Bug fixed: the old homepage never read `bm-store-config`, so admin edits had
> no effect. It now loads + live-syncs via the `storage` event.

## 4. Orders tab (daily)
- Every homepage **Checkout via WhatsApp** is auto-logged here (qty, total,
  date) in `bm-store-orders`.
- Filter new/packed/delivered/cancelled, advance status as you pack/ship,
  **Export CSV** for accounts, **Clear done** weekly.

## 5. Blogs tab (weekly)
- Title + content + optional photo/video (upload → Vercel Blob URL, or paste any
  `https://` URL). **Publish** → appears at `/blogs` (`bm-store-blogs`).
- **Edit** fixes typos, **Delete** removes, search box filters.

## 6. Reviews tab (daily)
- Reviews posted at `/reviews` (`bm-store-reviews`) appear here.
- Delete spam, add offline/WhatsApp feedback manually with star rating, track
  the average rating.

## 7. Media tab
- Upload campaign photos/videos to Vercel Blob (`/api/upload`, needs
  `BLOB_READ_WRITE_TOKEN` on Vercel) and **Copy** the URL into a blog.
- Permanent brand assets (`public/` logo, product PNGs, hero videos) are
  replaced via git + redeploy, not here.

## 8. Settings tab
- **Download backup** (one JSON: config + blogs + reviews + orders) weekly or
  before sales. **Import backup** clones the store to another laptop/browser.
- Local password override, env status, and **Erase all demo data** (danger).

## 9. Deploy & env
```bash
npm install
cp .env.example .env.local   # fill values below
npm run dev                  # test http://localhost:3000 + /admin
git push                     # Vercel auto-deploys; add same env vars there
```
Required env vars: `NEXT_PUBLIC_ADMIN_PASSWORD`,
`NEXT_PUBLIC_WHATSAPP_NUMBER`, `GROQ_API_KEY` (Green AI, server-only),
`BLOB_READ_WRITE_TOKEN` (uploads).

## 10. Production upgrade path
Move `bm-store-*` from localStorage to Supabase tables (config singleton,
blogs, reviews, orders) with server-side admin auth; keep this UI and swap the
`loadJSON/saveJSON` helpers in `app/lib/store.ts` for `fetch` calls.
