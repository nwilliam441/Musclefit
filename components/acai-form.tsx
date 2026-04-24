"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, Plus, ShoppingCart } from "lucide-react";
import { siteData } from "@/lib/site-data";
import type { CartEntry } from "@/lib/cart-types";
import { updateStoredCartItem } from "@/lib/cart-storage";

type AcaiFormState = {
  name: string;
  email: string;
  phone: string;
  quantity: number;
  pickupType: "asap" | "scheduled";
  pickupDate: string;
  pickupTime: string;
  includeHoney: boolean;
  toppings: string[];
  notes: string;
};

const acaiData = siteData.acai;

type AcaiFormProps = {
  cartMode?: boolean;
  onCartUpdate?: (entry: CartEntry) => void;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export function AcaiForm({ cartMode, onCartUpdate }: AcaiFormProps = {}) {
  const [submitMessage, setSubmitMessage] = useState("");
  const [form, setForm] = useState<AcaiFormState>({
    name: "",
    email: "",
    phone: "",
    quantity: 1,
    pickupType: "asap",
    pickupDate: "",
    pickupTime: "",
    includeHoney: true,
    toppings: [],
    notes: "",
  });

  const selectedCount = form.toppings.length;
  const extraToppingsCount = Math.max(0, selectedCount - acaiData.includedToppings);

  const perBowlTotal = useMemo(
    () => acaiData.basePrice + extraToppingsCount * acaiData.extraToppingPrice,
    [extraToppingsCount],
  );

  const orderTotal = useMemo(() => perBowlTotal * form.quantity, [perBowlTotal, form.quantity]);

  const toggleTopping = (item: string) => {
    setSubmitMessage("");
    setForm((prev) => {
      const exists = prev.toppings.includes(item);
      const toppings = exists ? prev.toppings.filter((value) => value !== item) : [...prev.toppings, item];
      return { ...prev, toppings };
    });
  };

  const onSavePreview = () => {
    if (!cartMode) {
      if (form.pickupType === "scheduled" && (!form.pickupDate || !form.pickupTime)) {
        setSubmitMessage("Choose a pickup date and time.");
        return;
      }
    }

    if (form.pickupType === "scheduled" && (!form.pickupDate || !form.pickupTime)) {
      setSubmitMessage("Choose a pickup date and time.");
      return;
    }

    const pickupSummary =
      form.pickupType === "asap"
        ? "Earliest available pickup"
        : `Scheduled pickup: ${form.pickupDate} at ${form.pickupTime}`;

    const lineItems: Array<{ label: string; amount: number }> = [
      { label: "Acai bowl", amount: acaiData.basePrice },
    ];
    if (extraToppingsCount > 0) {
      lineItems.push({
        label: `Extra toppings x${extraToppingsCount}`,
        amount: extraToppingsCount * acaiData.extraToppingPrice,
      });
    }

    const cartEntry: CartEntry = {
      subtotal: orderTotal,
      lineItems,
      details: {
        toppings: form.toppings,
        includeHoney: form.includeHoney,
        quantity: form.quantity,
        pickup: pickupSummary,
        notes: form.notes,
      },
    };

    updateStoredCartItem("acai", cartEntry);
    onCartUpdate?.(cartEntry);

    setSubmitMessage(cartMode ? "Acai bowl added to order." : "Acai bowl added to cart. Review it on the order page.");
  };

  return (
    <form className="card form-grid" onSubmit={(event) => event.preventDefault()}>
      <h2>Build Your Acai Bowl</h2>
      <p className="muted">
        Includes {acaiData.includedToppings} toppings. Extra toppings are {formatCurrency(acaiData.extraToppingPrice)} each.
      </p>

      {!cartMode ? (
        <>
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Your name"
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Phone Number
            <input
              required
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="(555) 555-5555"
            />
          </label>
        </>
      ) : null}

      <label>
        Quantity
        <input
          min={1}
          type="number"
          value={form.quantity}
          onChange={(event) => setForm((prev) => ({ ...prev, quantity: Math.max(1, Number(event.target.value || 1)) }))}
        />
      </label>

      <fieldset className="inline-options">
        <legend>Pickup Option</legend>
        <label>
          <input
            type="radio"
            name="pickup"
            checked={form.pickupType === "asap"}
            onChange={() => setForm((prev) => ({ ...prev, pickupType: "asap" }))}
          />
          <Clock3 size={15} aria-hidden="true" /> Pickup now
        </label>
        <label>
          <input
            type="radio"
            name="pickup"
            checked={form.pickupType === "scheduled"}
            onChange={() => setForm((prev) => ({ ...prev, pickupType: "scheduled" }))}
          />
          <Clock3 size={15} aria-hidden="true" /> Set a time
        </label>
      </fieldset>

      {form.pickupType === "scheduled" ? (
        <div className="pickup-grid">
          <label>
            Pickup Date
            <input
              type="date"
              value={form.pickupDate}
              onChange={(event) => setForm((prev) => ({ ...prev, pickupDate: event.target.value }))}
              required
            />
          </label>
          <label>
            Pickup Time
            <input
              type="time"
              value={form.pickupTime}
              onChange={(event) => setForm((prev) => ({ ...prev, pickupTime: event.target.value }))}
              required
            />
          </label>
        </div>
      ) : null}

      <fieldset className="inline-options">
        <legend>Finish</legend>
        <label>
          <input
            type="checkbox"
            checked={form.includeHoney}
            onChange={(event) => setForm((prev) => ({ ...prev, includeHoney: event.target.checked }))}
          />
          Honey drizzle
        </label>
      </fieldset>

      <div className="selection-group">
        <p className="selection-title">
          <span className="item-icon">
            <Plus size={16} aria-hidden="true" />
          </span>
          Toppings
        </p>
        <div className="selection-grid" role="group" aria-label="acai toppings">
          {acaiData.toppings.map((item) => {
            const selected = form.toppings.includes(item);
            const extra = selected && selectedCount > acaiData.includedToppings && form.toppings.indexOf(item) >= acaiData.includedToppings;

            return (
              <button
                key={item}
                type="button"
                className={`selection-card${selected ? " selected" : ""}`}
                onClick={() => toggleTopping(item)}
                aria-pressed={selected}
              >
                <span>{item}{extra ? " (+$0.25)" : ""}</span>
                {selected ? <Check size={15} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      <label>
        Notes
        <textarea
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          placeholder="Optional notes"
          rows={3}
        />
      </label>

      <section className="cart-review" aria-live="polite">
        <h3>
          <ShoppingCart size={16} aria-hidden="true" /> Review Bowl
        </h3>
        <ul>
          <li>
            <span>Base bowl</span>
            <span>{formatCurrency(acaiData.basePrice)}</span>
          </li>
          <li>
            <span>Included toppings</span>
            <span>{Math.min(selectedCount, acaiData.includedToppings)}</span>
          </li>
          <li>
            <span>Extra toppings</span>
            <span>{extraToppingsCount} x {formatCurrency(acaiData.extraToppingPrice)}</span>
          </li>
          <li>
            <span>Quantity</span>
            <span>x{form.quantity}</span>
          </li>
          <li>
            <span>Pickup</span>
            <span>{form.pickupType === "asap" ? "Pickup now" : form.pickupDate && form.pickupTime ? `${form.pickupDate} ${form.pickupTime}` : "Set a time"}</span>
          </li>
          <li>
            <span>Honey</span>
            <span>{form.includeHoney ? "Add honey" : "No honey"}</span>
          </li>
        </ul>
        <div className="cart-totals">
          <p>Per bowl: {formatCurrency(perBowlTotal)}</p>
          <p className="total">Order Total: {formatCurrency(orderTotal)}</p>
        </div>
      </section>

      <div className="cart-actions">
        <button type="button" className="btn btn-primary" onClick={onSavePreview}>
          {cartMode ? (
            <><ShoppingCart size={16} aria-hidden="true" /> Add to Order</>
          ) : (
            <><ShoppingCart size={16} aria-hidden="true" /> Add to Cart</>
          )}
        </button>
      </div>

      {submitMessage ? <p className="submit-message">{submitMessage}</p> : null}
    </form>
  );
}
