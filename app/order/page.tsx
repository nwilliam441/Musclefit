"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, ShoppingCart } from "lucide-react";
import { siteData } from "@/lib/site-data";
import type { CartEntry, UnifiedCart } from "@/lib/cart-types";
import { readStoredCart } from "@/lib/cart-storage";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const hasCheckoutUrl = Boolean(siteData.clover.orderUrl);

export default function OrderPage() {
  const [cart, setCart] = useState<UnifiedCart>({});
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const syncCart = () => setCart(readStoredCart());

    syncCart();
    window.addEventListener("focus", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("focus", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const grandTotal =
    (cart.mealPrep?.subtotal ?? 0) + (cart.acai?.subtotal ?? 0) + (cart.smoothie?.subtotal ?? 0);

  const onCheckout = async () => {
    if (!customer.name || !customer.email || !customer.phone) {
      setSubmitMessage("Fill in your name, email, and phone before checking out.");
      return;
    }

    if (grandTotal === 0) {
      setSubmitMessage("Add at least one item before checking out.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/orders/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, cart, grandTotal }),
      });

      if (!response.ok) {
        const err = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(err?.error ?? "Checkout preparation failed");
      }

      const data = (await response.json()) as { checkoutUrl?: string };
      if (!data.checkoutUrl) throw new Error("Missing checkout URL");
      window.location.href = data.checkoutUrl;
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : "Could not start checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const summaryRows: Array<{ label: string; entry: CartEntry | undefined }> = [
    { label: "Meal Prep", entry: cart.mealPrep },
    { label: "Acai Bowl", entry: cart.acai },
    { label: "Smoothies", entry: cart.smoothie },
  ];

  return (
    <main className="page-shell">
      <section className="hero compact">
        <p className="eyebrow">Order</p>
        <h1>Review Your Order</h1>
        <p>This page is your cart review. Build meal prep, acai, and smoothie items on their own pages, then check out here.</p>
      </section>

      {/* Customer info */}
      <section className="card form-grid">
        <h2>Your Info</h2>
        <label>
          Name
          <input
            required
            value={customer.name}
            onChange={(event) => setCustomer((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Your name"
          />
        </label>
        <label>
          Email
          <input
            required
            type="email"
            value={customer.email}
            onChange={(event) => setCustomer((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Phone Number
          <input
            required
            value={customer.phone}
            onChange={(event) => setCustomer((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="(555) 555-5555"
          />
        </label>
      </section>

      <section className="card order-summary" aria-live="polite">
        <div className="summary-header">
          <h2>
            <ShoppingCart size={18} aria-hidden="true" /> Order Summary
          </h2>
          <p className="muted">Summary is read-only to avoid accidental taps.</p>
        </div>

        {summaryRows.every((r) => !r.entry) ? (
          <div className="summary-empty-state">
            <p className="muted">Your cart is empty. Add items from meal prep, acai bowls, or smoothies first.</p>
          </div>
        ) : (
          summaryRows.map(({ label, entry }) =>
            entry ? (
              <div key={label} className="summary-section">
                <p className="summary-label">{label}</p>
                <ul className="summary-line-items">
                  {entry.lineItems.map((item) => (
                    <li key={item.label}>
                      <span>{item.label}</span>
                      <span>{formatCurrency(item.amount)}</span>
                    </li>
                  ))}
                </ul>
                <p className="summary-subtotal">Subtotal: {formatCurrency(entry.subtotal)}</p>
              </div>
            ) : null,
          )
        )}

        {grandTotal > 0 ? (
          <div className="grand-total">
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        ) : null}
      </section>

      <div className="cart-actions">
        <button
          type="button"
          className={`btn btn-primary submit-btn${isSubmitting ? " is-loading" : ""}`}
          disabled={grandTotal === 0 || !hasCheckoutUrl || isSubmitting}
          aria-disabled={grandTotal === 0 || !hasCheckoutUrl || isSubmitting}
          onClick={() => void onCheckout()}
        >
          <CircleDollarSign size={16} aria-hidden="true" />
          {isSubmitting ? "Redirecting to Checkout..." : hasCheckoutUrl ? "Proceed to Checkout" : "Checkout Coming Soon"}
        </button>
      </div>

      {!hasCheckoutUrl ? (
        <p className="muted">Live payment will be enabled once the Clover URL is configured.</p>
      ) : null}

      {submitMessage ? <p className="submit-message">{submitMessage}</p> : null}
    </main>
  );
}
