"use client";

import { FormEvent, useMemo, useState } from "react";
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
  notes: string;
};

const mealData = siteData.mealPrep;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export function MealPrepForm() {
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
    notes: "",
  });

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
        `Estimated total: ${formatCurrency(orderTotal)}`,
        `Notes: ${form.notes || "N/A"}`,
      ].join("\n")
    );

    window.location.href = `mailto:${siteData.orderEmail}?subject=${subject}&body=${body}`;
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

      <label>
        Protein
        <select value={form.protein} onChange={(event) => setForm((prev) => ({ ...prev, protein: event.target.value }))}>
          {mealData.proteins.map((protein) => (
            <option key={protein} value={protein}>
              {protein}
            </option>
          ))}
        </select>
      </label>

      <label>
        Carb
        <select value={form.carb} onChange={(event) => setForm((prev) => ({ ...prev, carb: event.target.value }))}>
          {mealData.carbs.map((carb) => (
            <option key={carb} value={carb}>
              {carb}
            </option>
          ))}
        </select>
      </label>

      <label>
        Veggies
        <select value={form.veggies} onChange={(event) => setForm((prev) => ({ ...prev, veggies: event.target.value }))}>
          {mealData.veggies.map((veggie) => (
            <option key={veggie} value={veggie}>
              {veggie}
            </option>
          ))}
        </select>
      </label>

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
          Earliest available
        </label>
        <label>
          <input
            type="radio"
            name="pickup"
            checked={form.pickupType === "scheduled"}
            onChange={() => setForm((prev) => ({ ...prev, pickupType: "scheduled" }))}
          />
          Pick a day/time
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
          Extra meat (+{formatCurrency(mealData.modifiers.extraMeat)})
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.extraVeggieOrCarb}
            onChange={(event) => setForm((prev) => ({ ...prev, extraVeggieOrCarb: event.target.checked }))}
          />
          Extra veggie/carb (+{formatCurrency(mealData.modifiers.extraVeggieOrCarb)})
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

      <button type="submit" className="btn btn-primary">
        Submit Order by Email
      </button>
    </form>
  );
}
