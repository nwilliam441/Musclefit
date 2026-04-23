import { MealPrepForm } from "@/components/meal-prep-form";
import { siteData } from "@/lib/site-data";

export default function MealPrepPage() {
  return (
    <main className="page-shell">
      <section className="hero compact">
        <p className="eyebrow">Meal Prep</p>
        <h1>Build clean meals for your week.</h1>
        <p>{siteData.mealPrep.cutoffText}</p>
      </section>

      <section className="section-grid two-col">
        <MealPrepForm />
        <aside className="card info-panel">
          <h2>Pricing</h2>
          <ul>
            <li>Base bowl: ${siteData.mealPrep.basePrice.toFixed(2)}</li>
            <li>Salmon: +${siteData.mealPrep.modifiers.salmonUpcharge.toFixed(2)}</li>
            <li>Extra meat: +${siteData.mealPrep.modifiers.extraMeat.toFixed(2)}</li>
            <li>Extra veggie/carb: +${siteData.mealPrep.modifiers.extraVeggieOrCarb.toFixed(2)}</li>
          </ul>

          <h3>Protein</h3>
          <p>{siteData.mealPrep.proteins.join(", ")}</p>

          <h3>Carb</h3>
          <p>{siteData.mealPrep.carbs.join(", ")}</p>

          <h3>Veggies</h3>
          <p>{siteData.mealPrep.veggies.join(", ")}</p>

          <p className="muted">Orders submit through your email app for now. Update order email in the editable data file.</p>
        </aside>
      </section>
    </main>
  );
}
