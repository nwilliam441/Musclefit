"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, ShoppingCart } from "lucide-react";
import { siteData } from "@/lib/site-data";
import type { CartEntry } from "@/lib/cart-types";

const smoothieData = siteData.smoothies;
const allSmoothies = smoothieData.categories.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, category: cat.name })),
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

type SmoothieFormProps = {
  onCartUpdate: (entry: CartEntry) => void;
};

export function SmoothieForm({ onCartUpdate }: SmoothieFormProps) {
  const [selected, setSelected] = useState(allSmoothies[0].name);
  const [quantity, setQuantity] = useState(1);
  const [addonsOne, setAddonsOne] = useState<string[]>([]);
  const [addonsTwo, setAddonsTwo] = useState<string[]>([]);
  const [pickupType, setPickupType] = useState<"asap" | "scheduled">("asap");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [addedMessage, setAddedMessage] = useState("");

  const addonOneCost = addonsOne.length * 1;
  const addonTwoCost = addonsTwo.length * 2;
  const perSmoothieTotal = smoothieData.price + addonOneCost + addonTwoCost;
  const orderTotal = perSmoothieTotal * quantity;

  const lineItems = useMemo(() => {
    const items: Array<{ label: string; amount: number }> = [
      { label: `${selected} (${smoothieData.size})`, amount: smoothieData.price },
    ];
    addonsOne.forEach((a) => items.push({ label: a, amount: 1 }));
    addonsTwo.forEach((a) => items.push({ label: a, amount: 2 }));
    return items;
  }, [selected, addonsOne, addonsTwo]);

  const toggleAddonOne = (addon: string) => {
    setAddedMessage("");
    setAddonsOne((prev) => (prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]));
  };

  const toggleAddonTwo = (addon: string) => {
    setAddedMessage("");
    setAddonsTwo((prev) => (prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]));
  };

  const onAddToCart = () => {
    if (pickupType === "scheduled" && (!pickupDate || !pickupTime)) {
      alert("Please select a pickup date and time.");
      return;
    }

    const pickupSummary =
      pickupType === "asap"
        ? "Earliest available pickup"
        : `Scheduled pickup: ${pickupDate} at ${pickupTime}`;

    onCartUpdate({
      subtotal: orderTotal,
      lineItems,
      details: {
        smoothie: selected,
        addonsOne,
        addonsTwo,
        quantity,
        pickup: pickupSummary,
        notes,
      },
    });

    setAddedMessage("Smoothies added to order.");
  };

  return (
    <form className="card form-grid" onSubmit={(event) => event.preventDefault()}>
      <h2>Order Smoothies</h2>
      <p className="muted">
        {smoothieData.size} — {formatCurrency(smoothieData.price)} each.
      </p>

      <div className="selection-group">
        <p className="selection-title">Choose a Smoothie</p>
        <div className="selection-grid" role="radiogroup" aria-label="smoothie selection">
          {allSmoothies.map((s) => {
            const isSelected = selected === s.name;
            return (
              <button
                key={s.name}
                type="button"
                className={`selection-card${isSelected ? " selected" : ""}`}
                onClick={() => {
                  setSelected(s.name);
                  setAddedMessage("");
                }}
                aria-pressed={isSelected}
              >
                <span>{s.name}</span>
                {isSelected ? <Check size={15} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      <label>
        Quantity
        <input
          min={1}
          type="number"
          value={quantity}
          onChange={(event) => {
            setQuantity(Math.max(1, Number(event.target.value || 1)));
            setAddedMessage("");
          }}
        />
      </label>

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
            <span>Quantity</span>
            <span>x{quantity}</span>
          </li>
        </ul>
        <div className="cart-totals">
          <p>Per smoothie: {formatCurrency(perSmoothieTotal)}</p>
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
