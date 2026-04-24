"use client";

import { useState } from "react";
import { CircleDollarSign, ShoppingCart } from "lucide-react";
import { MealPrepForm } from "@/components/meal-prep-form";
import { AcaiForm } from "@/components/acai-form";
import { SmoothieForm } from "@/components/smoothie-form";
import { siteData } from "@/lib/site-data";
import type { CartEntry, UnifiedCart } from "@/lib/cart-types";

type Tab = "meal-prep" | "acai" | "smoothie";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const hasCheckoutUrl = Boolean(siteData.clover.orderUrl);

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState<Tab>("meal-prep");
  const [cart, setCart] = useState<UnifiedCart>({});
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const updateCart = (key: keyof UnifiedCart) => (entry: CartEntry) => {
    setCart((prev) => ({ ...prev, [key]: entry }));
    setSubmitMessage("");
  };

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

  const tabs: Array<{ id: Tab; label: string; cartKey: keyof UnifiedCart }> = [
    { id: "meal-prep", label: "Meal Prep", cartKey: "mealPrep" },
    { id: "acai", label: "Acai Bowl", cartKey: "acai" },
    { id: "smoothie", label: "Smoothies", cartKey: "smoothie" },
  ];

  const summaryRows: Array<{ label: string; entry: CartEntry | undefined }> = [
    { label: "Meal Prep", entry: cart.mealPrep },
    { label: "Acai Bowl", entry: cart.acai },
    { label: "Smoothies", entry: cart.smoothie },
  ];

  return (
    <main className="page-shell">
      <section className="hero compact">
        <p className="eyebrow">Order</p>
        <h1>Build Your Order</h1>
        <p>Add items from each tab, review your total, then check out in one step.</p>
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

      {/* Tab navigation */}
      <nav className="order-tabs" aria-label="Order categories">
        {tabs.map(({ id, label, cartKey }) => {
          const hasItem = Boolean(cart[cartKey]);
          return (
            <button
              key={id}
              type="button"
              className={`tab-btn${activeTab === id ? " active" : ""}${hasItem ? " has-item" : ""}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
              {hasItem ? <span className="tab-check" aria-label="added">✓</span> : null}
            </button>
          );
        })}
      </nav>

      {/* Tab panels */}
      <div className="tab-panel">
        {activeTab === "meal-prep" && (
          <MealPrepForm cartMode onCartUpdate={updateCart("mealPrep")} />
        )}
        {activeTab === "acai" && (
          <AcaiForm cartMode onCartUpdate={updateCart("acai")} />
        )}
        {activeTab === "smoothie" && (
          <SmoothieForm onCartUpdate={updateCart("smoothie")} />
        )}
      </div>

      {/* Order summary */}
      <section className="card order-summary" aria-live="polite">
        <h2>
          <ShoppingCart size={18} aria-hidden="true" /> Order Summary
        </h2>

        {summaryRows.every((r) => !r.entry) ? (
          <p className="muted">Add items from the tabs above to see your total.</p>
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

      {/* Checkout */}
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
