"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Beef, Check, Clock3, Leaf, Plus, ShoppingCart, Wheat } from "lucide-react";
import { siteData } from "@/lib/site-data";
import type { CartEntry } from "@/lib/cart-types";
import { updateStoredCartItem } from "@/lib/cart-storage";

type OrderFormState = {
  protein: string;
  carb: string;
  veggies: string;
  quantity: number;
  pickupType: "asap" | "scheduled";
  pickupDate: string;
  pickupTime: string;
  extraMeat: boolean;
  extraVeggieOrCarb: boolean;
  notes: string;
  bowl: {
    protein: string;
    carb: string;
    veggies: string;
    extraMeat: boolean;
    extraVeggieOrCarb: boolean;
    quantity: number;
  };
  pickup: string;
  pricing: {
    perBowlTotal: number;
    orderTotal: number;
    lineItems: Array<{ label: string; amount: number }>;
  };
  notes: string;
};

const mealData = siteData.mealPrep;

type MealPrepFormProps = {
  cartMode?: boolean;
  onCartUpdate?: (entry: CartEntry) => void;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export function MealPrepForm({ cartMode, onCartUpdate }: MealPrepFormProps = {}) {
  const [submitMessage, setSubmitMessage] = useState("");
  const [form, setForm] = useState<OrderFormState>({
    protein: mealData.proteins[0],
    carb: mealData.carbs[0],
    veggies: mealData.veggies[0],
    quantity: 1,
    pickupType: "asap",
    pickupDate: "",
    pickupTime: "",
    extraMeat: false,
    extraVeggieOrCarb: false,
    notes: "",
  });

  const perBowlTotal = useMemo(() => {
    const salmonCost = form.protein === "Salmon" ? mealData.modifiers.salmonUpcharge : 0;
    const meatCost = form.extraMeat ? mealData.modifiers.extraMeat : 0;
    const veggieOrCarbCost = form.extraVeggieOrCarb ? mealData.modifiers.extraVeggieOrCarb : 0;

    return mealData.basePrice + salmonCost + meatCost + veggieOrCarbCost;
  }, [form.protein, form.extraMeat, form.extraVeggieOrCarb]);

  const orderTotal = useMemo(() => perBowlTotal * form.quantity, [perBowlTotal, form.quantity]);

  const cartItems = useMemo(() => {
    const items: Array<{ label: string; amount: number }> = [{ label: "Base bowl", amount: mealData.basePrice }];

    if (form.protein === "Salmon") {
      items.push({ label: "Salmon upgrade", amount: mealData.modifiers.salmonUpcharge });
    }

    if (form.extraMeat) {
      items.push({ label: "Extra meat", amount: mealData.modifiers.extraMeat });
    }

    if (form.extraVeggieOrCarb) {
      items.push({ label: "Extra veggie/carb", amount: mealData.modifiers.extraVeggieOrCarb });
    }

    return items;
  }, [form.protein, form.extraMeat, form.extraVeggieOrCarb]);

  const buildCartEntry = (): CartEntry | null => {
    setSubmitMessage("");

    if (form.pickupType === "scheduled" && (!form.pickupDate || !form.pickupTime)) {
      alert("Please select pickup date and time.");
      return null;
    }

    const pickupSummary =
      form.pickupType === "asap"
        ? "Earliest available pickup"
        : `Scheduled pickup: ${form.pickupDate} at ${form.pickupTime}`;

    return {
      subtotal: orderTotal,
      lineItems: cartItems,
      details: {
        bowl: {
          protein: form.protein,
          carb: form.carb,
          veggies: form.veggies,
          extraMeat: form.extraMeat,
          extraVeggieOrCarb: form.extraVeggieOrCarb,
          quantity: form.quantity,
        },
        pickup: pickupSummary,
        notes: form.notes,
      },
    };
  };

  const onAddToCart = () => {
    const cartEntry = buildCartEntry();
    if (!cartEntry) {
      return;
    }

    updateStoredCartItem("mealPrep", cartEntry);

    if (cartMode && onCartUpdate) {
      onCartUpdate(cartEntry);
      setSubmitMessage("Meal prep added to order.");
    } else {
      setSubmitMessage("Meal prep added to cart. Review it on the order page.");
    }
  };

  const renderSelectionCards = (group: "protein" | "carb" | "veggies", items: readonly string[], icon: ReactNode) => {
    return (
      <div className="selection-group">
        <p className="selection-title">
          <span className="item-icon">{icon}</span>
          {group === "protein" ? "Protein" : group === "carb" ? "Carb" : "Veggies"}
        </p>
        <div className="selection-grid" role="radiogroup" aria-label={group}>
          {items.map((item) => {
            const selected = form[group] === item;
            const displayName = item === "Salmon" ? `${item} (+${formatCurrency(mealData.modifiers.salmonUpcharge)})` : item;

            return (
              <button
                key={item}
                type="button"
                className={`selection-card${selected ? " selected" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, [group]: item }))}
                aria-pressed={selected}
              >
                <span>{displayName}</span>
                {selected ? <Check size={15} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <form className="card form-grid" onSubmit={(event) => event.preventDefault()}>
      <h2>Build Your Bowl</h2>
      <p className="muted">{mealData.cutoffText}</p>

      {renderSelectionCards("protein", mealData.proteins, <Beef size={16} aria-hidden="true" />)}
      {renderSelectionCards("carb", mealData.carbs, <Wheat size={16} aria-hidden="true" />)}
      {renderSelectionCards("veggies", mealData.veggies, <Leaf size={16} aria-hidden="true" />)}

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
          <Clock3 size={15} aria-hidden="true" /> Earliest available
        </label>
        <label>
          <input
            type="radio"
            name="pickup"
            checked={form.pickupType === "scheduled"}
            onChange={() => setForm((prev) => ({ ...prev, pickupType: "scheduled" }))}
          />
          <Clock3 size={15} aria-hidden="true" /> Pick a day/time
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
        <legend>Add-ons</legend>
        <label>
          <input
            type="checkbox"
            checked={form.extraMeat}
            onChange={(event) => setForm((prev) => ({ ...prev, extraMeat: event.target.checked }))}
          />
          <Plus size={15} aria-hidden="true" /> Extra meat (+{formatCurrency(mealData.modifiers.extraMeat)})
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.extraVeggieOrCarb}
            onChange={(event) => setForm((prev) => ({ ...prev, extraVeggieOrCarb: event.target.checked }))}
          />
          <Plus size={15} aria-hidden="true" /> Extra veggie/carb (+{formatCurrency(mealData.modifiers.extraVeggieOrCarb)})
        </label>
      </fieldset>

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
          <ShoppingCart size={16} aria-hidden="true" /> Review Cart
        </h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <span>{formatCurrency(item.amount)}</span>
            </li>
          ))}
          <li>
            <span>Quantity</span>
            <span>x{form.quantity}</span>
          </li>
        </ul>
        <div className="cart-totals">
          <p>Per bowl: {formatCurrency(perBowlTotal)}</p>
          <p className="total">Order Total: {formatCurrency(orderTotal)}</p>
        </div>
      </section>

      <div className="cart-actions">
        <button type="button" className="btn btn-primary" onClick={onAddToCart}>
          <ShoppingCart size={16} aria-hidden="true" /> {cartMode ? "Add to Order" : "Add to Cart"}
        </button>
      </div>

      {submitMessage ? <p className="submit-message">{submitMessage}</p> : null}
    </form>
  );
}
