import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function ShippingAndReturns() {
  return (
    <main className="min-h-screen bg-[var(--background)] py-24 px-6">
      <div className="container mx-auto max-w-[800px]">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline mb-8 font-bold">
          <ArrowLeft weight="bold" /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-6">Shipping & Returns</h1>
        <div className="prose prose-lg text-[var(--muted)]">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-4">Shipping Policy</h2>
          <p className="mb-4">We ship orders across the country. Standard shipping takes 3-5 business days. Once your order is dispatched, you will receive a tracking link via WhatsApp.</p>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-4">Return & Refund Policy</h2>
          <p className="mb-4">Since our products are consumables, we do not accept returns. However, if you receive a damaged or incorrect product, please contact us within 48 hours of delivery, and we will arrange a replacement or refund.</p>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-4">Cancellations</h2>
          <p className="mb-4">Orders can be canceled before they are dispatched. Please reach out to us on WhatsApp immediately to cancel an order.</p>
        </div>
      </div>
    </main>
  );
}
