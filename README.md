# BM Green House Store

Premium animated storefront for Dates Seeds Powder, built with Next.js, TypeScript, Motion and Hugeicons.

## Run locally

```bash
npm install
cp .env.example .env.local
# Set your WhatsApp number with country code, no + or spaces
npm run dev
```

Open `http://localhost:3000`. Admin settings are at `/admin` and persist in the current browser for this demo.

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repository in Vercel.
3. Add `NEXT_PUBLIC_WHATSAPP_NUMBER` in Vercel Environment Variables.
4. Deploy.

For shared, production-grade admin persistence, connect the admin form to Supabase or another hosted database.
