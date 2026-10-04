import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[var(--background)] py-24 px-6">
      <div className="container mx-auto max-w-[800px]">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline mb-8 font-bold">
          <ArrowLeft weight="bold" /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-6">Terms of Service</h1>
        <div className="prose prose-lg text-[var(--muted)]">
          <p className="mb-4">Welcome to BM Green House. By accessing or using our website, you agree to be bound by these Terms of Service.</p>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-4">1. Products and Pricing</h2>
          <p className="mb-4">All products listed on the website are subject to availability. We reserve the right to modify prices without prior notice.</p>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-4">2. Orders and Payment</h2>
          <p className="mb-4">Orders are processed via WhatsApp. We will confirm your order details and payment methods before shipping.</p>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-4">3. Limitation of Liability</h2>
          <p className="mb-4">BM Green House is not liable for any direct, indirect, incidental, or consequential damages arising from the use of our products.</p>
        </div>
      </div>
    </main>
  );
}
