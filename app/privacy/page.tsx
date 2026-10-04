import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[var(--background)] py-24 px-6">
      <div className="container mx-auto max-w-[800px]">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline mb-8 font-bold">
          <ArrowLeft weight="bold" /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-6">Privacy Policy</h1>
        <div className="prose prose-lg text-[var(--muted)]">
          <p className="mb-4">At BM Green House, we take your privacy seriously. This Privacy Policy describes how we collect, use, and handle your personal information when you use our website.</p>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us when you make a purchase, create an account, or contact us. This includes your name, email address, phone number, and shipping address.</p>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use your information to process transactions, communicate with you about your order, and improve our services. We do not sell your personal information to third parties.</p>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-4">3. Contact Us</h2>
          <p className="mb-4">If you have any questions about this Privacy Policy, please contact us via WhatsApp.</p>
        </div>
      </div>
    </main>
  );
}
