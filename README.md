# BM Green House Store

Premium animated storefront for Dates Seeds Powder, built with Next.js, TypeScript, Motion and Hugeicons.

## Run locally

```bash
npm install
cp .env.example .env.local
# Set your WhatsApp number with country code, no + or spaces
npm run dev
```

Open `http://localhost:3000`. Admin console is at `/admin` (tabs: Dashboard,
Products, Storefront, Blogs, Reviews, Orders, Media, Settings, Procedure) and persists
in the current browser for this demo — see `ADMIN_GUIDE.md` for the full
working procedure. Yes — admin edits (products, prices, stock, blogs, content)
show on the shopper pages instantly in the same browser.

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repository in Vercel.
3. Add `NEXT_PUBLIC_WHATSAPP_NUMBER` in Vercel Environment Variables.
4. Deploy.

For shared, production-grade admin persistence, connect the admin form to Supabase or another hosted database.
