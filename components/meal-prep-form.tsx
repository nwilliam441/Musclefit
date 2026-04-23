"use client";

import { FormEvent, useMemo, useState } from "react";
import { Beef, Check, CircleDollarSign, Clock3, Leaf, Plus, ShoppingCart, Wheat } from "lucide-react";
import { siteData } from "@/lib/site-data";

type OrderFormState = {
  name: string;
  phone: string;
  protein: string;
  carb: string;
  veggies: string;
  quantity: number;
  pickupType: "asap" | "scheduled";
  pickupDate: string;
  pickupTime: string;
  extraMeat: boolean;
  extraVeggieOrCarb: boolean;
  paymentConfirmed: boolean;
  paymentReference: string;
  notes: string;
};

const mealData = siteData.mealPrep;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export function MealPrepForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<OrderFormState>({
    name: "",
    phone: "",
    protein: mealData.proteins[0],
    carb: mealData.carbs[0],
    veggies: mealData.veggies[0],
    quantity: 1,
    pickupType: "asap",
    pickupDate: "",
    pickupTime: "",
    extraMeat: false,
    extraVeggieOrCarb: false,
    paymentConfirmed: false,
    paymentReference: "",
    notes: "",
  });

  const isPaymentReady = form.paymentConfirmed && Boolean(form.paymentReference.trim());

  const perBowlTotal = useMemo(() => {
    const salmonCost = form.protein === "Salmon" ? mealData.modifiers.salmonUpcharge : 0;
    const meatCost = form.extraMeat ? mealData.modifiers.extraMeat : 0;
    const veggieOrCarbCost = form.extraVeggieOrCarb ? mealData.modifiers.extraVeggieOrCarb : 0;

    return mealData.basePrice + salmonCost + meatCost + veggieOrCarbCost;
  }, [form.protein, form.extraMeat, form.extraVeggieOrCarb]);

  const orderTotal = useMemo(() => perBowlTotal * form.quantity, [perBowlTotal, form.quantity]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.pickupType === "scheduled" && (!form.pickupDate || !form.pickupTime)) {
      alert("Please select pickup date and time.");
      return;
    }

    if (!form.paymentConfirmed || !form.paymentReference.trim()) {
      alert("Payment must be completed first. Add your payment reference before submitting.");
      return;
    }

    const pickupSummary =
      form.pickupType === "asap"
        ? "Earliest available pickup"
        : `Scheduled pickup: ${form.pickupDate} at ${form.pickupTime}`;

    const subject = encodeURIComponent(`Meal Prep Order - ${form.name || "Customer"}`);
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        `Protein: ${form.protein}`,
        `Carb: ${form.carb}`,
        `Veggies: ${form.veggies}`,
        `Extra meat: ${form.extraMeat ? "Yes" : "No"}`,
        `Extra veggie/carb: ${form.extraVeggieOrCarb ? "Yes" : "No"}`,
        `Quantity: ${form.quantity}`,
        pickupSummary,
        `Payment confirmed: ${form.paymentConfirmed ? "Yes" : "No"}`,
        `Payment reference: ${form.paymentReference}`,
        `Estimated total: ${formatCurrency(orderTotal)}`,
        `Notes: ${form.notes || "N/A"}`,
      ].join("\n")
    );

    setIsSubmitting(true);
    window.location.href = `mailto:${siteData.orderEmail}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1200);
  };

  const renderSelectionCards = (
    group: "protein" | "carb" | "veggies",
    items: readonly string[],
    icon: React.ReactNode
  ) => {
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
    <form className="card form-grid" onSubmit={onSubmit}>
      <h2>Build Your Bowl</h2>
      <p className="muted">{mealData.cutoffText}</p>

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
        Phone Number
        <input
          required
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          placeholder="(555) 555-5555"
        />
      </label>

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

      <fieldset className="inline-options">
        <legend>Payment (Required Before Submit)</legend>
        {siteData.clover.orderUrl ? (
          <p>
            <a href={siteData.clover.orderUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
              <CircleDollarSign size={16} aria-hidden="true" /> Pay with Clover
            </a>
          </p>
        ) : (
          <p className="muted">Add your Clover payment/order URL in site-data to enable direct payment link.</p>
        )}

        <label>
          Payment Reference / Receipt ID
          <input
            required
            value={form.paymentReference}
            onChange={(event) => setForm((prev) => ({ ...prev, paymentReference: event.target.value }))}
            placeholder="Enter payment confirmation number"
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.paymentConfirmed}
            onChange={(event) => setForm((prev) => ({ ...prev, paymentConfirmed: event.target.checked }))}
            required
          />
          I completed payment before placing this order.
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

      <div className="price-box" aria-live="polite">
        <p>Per bowl: {formatCurrency(perBowlTotal)}</p>
        <p className="total">Total: {formatCurrency(orderTotal)}</p>
      </div>

      {!isPaymentReady ? (
        <p className="muted">Complete payment and add your receipt/reference to unlock final order submit.</p>
      ) : null}

      <button
        type="submit"
        disabled={!isPaymentReady}
        className={`btn btn-primary submit-btn${isSubmitting ? " is-loading" : ""}`}
        aria-disabled={!isPaymentReady}
      >
        <ShoppingCart size={16} aria-hidden="true" />
        {isSubmitting ? "Preparing Order..." : isPaymentReady ? "Submit Paid Order by Email" : "Pay First to Submit"}
      </button>
    </form>
  );
}
