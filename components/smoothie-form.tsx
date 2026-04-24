"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, ShoppingCart } from "lucide-react";
import { siteData } from "@/lib/site-data";
import type { CartEntry } from "@/lib/cart-types";
import { updateStoredCartItem } from "@/lib/cart-storage";

const smoothieData = siteData.smoothies;
const allSmoothies = smoothieData.categories.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, category: cat.name })),
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

type SmoothieFormProps = {
  onCartUpdate?: (entry: CartEntry) => void;
};

export function SmoothieForm({ onCartUpdate }: SmoothieFormProps) {
  const [smoothieQuantities, setSmoothieQuantities] = useState<Record<string, number>>({
    [allSmoothies[0].name]: 1,
  });
  const [addonsOne, setAddonsOne] = useState<string[]>([]);
  const [addonsTwo, setAddonsTwo] = useState<string[]>([]);
  const [pickupType, setPickupType] = useState<"asap" | "scheduled">("asap");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [addedMessage, setAddedMessage] = useState("");

  const selectedSmoothies = useMemo(
    () => Object.entries(smoothieQuantities).filter(([, qty]) => qty > 0),
    [smoothieQuantities],
  );

  const totalQuantity = useMemo(
    () => selectedSmoothies.reduce((sum, [, qty]) => sum + qty, 0),
    [selectedSmoothies],
  );

  const baseSmoothieCost = totalQuantity * smoothieData.price;
  const addonOneCost = addonsOne.length * totalQuantity * 1;
  const addonTwoCost = addonsTwo.length * totalQuantity * 2;
  const orderTotal = baseSmoothieCost + addonOneCost + addonTwoCost;

  const lineItems = useMemo(() => {
    const items: Array<{ label: string; amount: number }> = selectedSmoothies.map(([name, qty]) => ({
      label: `${name} (${smoothieData.size}) x${qty}`,
      amount: smoothieData.price * qty,
    }));

    addonsOne.forEach((a) => items.push({ label: `${a} x${totalQuantity}`, amount: totalQuantity }));
    addonsTwo.forEach((a) => items.push({ label: `${a} x${totalQuantity}`, amount: totalQuantity * 2 }));
    return items;
  }, [selectedSmoothies, addonsOne, addonsTwo, totalQuantity]);

  const setSmoothieQty = (name: string, quantity: number) => {
    setAddedMessage("");
    setSmoothieQuantities((prev) => ({
      ...prev,
      [name]: Math.max(0, quantity),
    }));
  };

  const toggleSmoothie = (name: string) => {
    const current = smoothieQuantities[name] ?? 0;
    setSmoothieQty(name, current > 0 ? 0 : 1);
  };

  const toggleAddonOne = (addon: string) => {
    setAddedMessage("");
    setAddonsOne((prev) => (prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]));
  };

  const toggleAddonTwo = (addon: string) => {
    setAddedMessage("");
    setAddonsTwo((prev) => (prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]));
  };

  const onAddToCart = () => {
    if (totalQuantity === 0) {
      setAddedMessage("Select at least one smoothie.");
      return;
    }

    if (pickupType === "scheduled" && (!pickupDate || !pickupTime)) {
      alert("Please select a pickup date and time.");
      return;
    }

    const pickupSummary =
      pickupType === "asap"
        ? "Earliest available pickup"
        : `Scheduled pickup: ${pickupDate} at ${pickupTime}`;

    const cartEntry: CartEntry = {
      subtotal: orderTotal,
      lineItems,
      details: {
        smoothies: selectedSmoothies.map(([name, qty]) => ({ name, quantity: qty })),
        addonsOne,
        addonsTwo,
        totalQuantity,
        pickup: pickupSummary,
        notes,
      },
    };

    updateStoredCartItem("smoothie", cartEntry);
    onCartUpdate?.(cartEntry);

    setAddedMessage("Smoothies added to order.");
  };

  return (
    <form className="card form-grid" onSubmit={(event) => event.preventDefault()}>
      <h2>Order Smoothies</h2>
      <p className="muted">
        {smoothieData.size} — {formatCurrency(smoothieData.price)} each.
      </p>

      <div className="selection-group">
        <p className="selection-title">Choose One or More Smoothies</p>
        <div className="selection-grid" role="radiogroup" aria-label="smoothie selection">
          {allSmoothies.map((s) => {
            const qty = smoothieQuantities[s.name] ?? 0;
            const isSelected = qty > 0;
            return (
              <button
                key={s.name}
                type="button"
                className={`selection-card${isSelected ? " selected" : ""}`}
                onClick={() => toggleSmoothie(s.name)}
                aria-pressed={isSelected}
              >
                <span>{s.name}{isSelected ? ` x${qty}` : ""}</span>
                {isSelected ? <Check size={15} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      {selectedSmoothies.length > 0 ? (
        <div className="selection-group">
          <p className="selection-title">Selected Quantities</p>
          <div className="pickup-grid">
            {selectedSmoothies.map(([name, qty]) => (
              <label key={name}>
                {name}
                <input
                  min={1}
                  type="number"
                  value={qty}
                  onChange={(event) => setSmoothieQty(name, Math.max(1, Number(event.target.value || 1)))}
                />
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <fieldset className="inline-options">
        <legend>Pickup Option</legend>
        <label>
          <input
            type="radio"
            name="smoothie-pickup"
            checked={pickupType === "asap"}
            onChange={() => setPickupType("asap")}
          />
          <Clock3 size={15} aria-hidden="true" /> Pickup now
        </label>
        <label>
          <input
            type="radio"
            name="smoothie-pickup"
            checked={pickupType === "scheduled"}
            onChange={() => setPickupType("scheduled")}
          />
          <Clock3 size={15} aria-hidden="true" /> Set a time
        </label>
      </fieldset>

      {pickupType === "scheduled" ? (
        <div className="pickup-grid">
          <label>
            Pickup Date
            <input
              type="date"
              value={pickupDate}
              onChange={(event) => setPickupDate(event.target.value)}
              required
            />
          </label>
          <label>
            Pickup Time
            <input
              type="time"
              value={pickupTime}
              onChange={(event) => setPickupTime(event.target.value)}
              required
            />
          </label>
        </div>
      ) : null}

      <fieldset className="inline-options">
        <legend>Add-ons +$1</legend>
        {smoothieData.addons.oneDollar.map((addon) => (
          <label key={addon}>
            <input
              type="checkbox"
              checked={addonsOne.includes(addon)}
              onChange={() => toggleAddonOne(addon)}
            />
            {addon}
          </label>
        ))}
      </fieldset>

      <fieldset className="inline-options">
        <legend>Add-ons +$2</legend>
        {smoothieData.addons.twoDollar.map((addon) => (
          <label key={addon}>
            <input
              type="checkbox"
              checked={addonsTwo.includes(addon)}
              onChange={() => toggleAddonTwo(addon)}
            />
            {addon}
          </label>
        ))}
      </fieldset>

      <label>
        Notes
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional notes"
          rows={2}
        />
      </label>

      <section className="cart-review" aria-live="polite">
        <h3>
          <ShoppingCart size={16} aria-hidden="true" /> Order Preview
        </h3>
        <ul>
          {lineItems.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <span>{formatCurrency(item.amount)}</span>
            </li>
          ))}
          <li>
            <span>Total Smoothies</span>
            <span>x{totalQuantity}</span>
          </li>
        </ul>
        <div className="cart-totals">
          <p>Base smoothies: {formatCurrency(baseSmoothieCost)}</p>
          <p className="total">Subtotal: {formatCurrency(orderTotal)}</p>
        </div>
      </section>

      <div className="cart-actions">
        <button type="button" className="btn btn-primary" onClick={onAddToCart}>
          <ShoppingCart size={16} aria-hidden="true" /> Add to Order
        </button>
      </div>

      {addedMessage ? <p className="submit-message">{addedMessage}</p> : null}
    </form>
  );
}
