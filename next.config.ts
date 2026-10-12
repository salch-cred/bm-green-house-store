import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [
      // Admin-uploaded product/blog media via Vercel Blob
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};
export default nextConfig;
