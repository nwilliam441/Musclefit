import Link from "next/link";
import { AcaiForm } from "@/components/acai-form";
import { siteData } from "@/lib/site-data";

export default function AcaiBowlsPage() {
  const hasCheckout = siteData.clover.enabled && Boolean(siteData.clover.orderUrl || siteData.clover.embedUrl);

  return (
    <main className="page-shell">
      <section className="hero compact">
        <p className="eyebrow">Acai Bowls</p>
        <h1>Build it. Fuel it. Love it.</h1>
        <p>{siteData.acai.tagline}</p>
      </section>

      <section className="section-grid two-col meal-prep-layout">
        <aside className="card info-panel meal-prep-pricing">
          <h2>Pricing</h2>
          <ul>
            <li>Acai bowl: ${siteData.acai.basePrice.toFixed(2)}</li>
            <li>Includes {siteData.acai.includedToppings} toppings</li>
            <li>Extra topping: +${siteData.acai.extraToppingPrice.toFixed(2)} each</li>
          </ul>

          <h3>Available Toppings</h3>
          <p>{siteData.acai.toppings.join(", ")}</p>

          <p className="muted">{siteData.acai.includesText}</p>
          <p className="muted">Available daily at Muscle Fit Irwin.</p>

          {hasCheckout ? (
            <p>
              Ready to pay now? <Link href="/order">Open checkout page</Link>.
            </p>
          ) : (
            <p className="muted">Online checkout coming soon.</p>
          )}
        </aside>

        <div className="meal-prep-form-wrap">
          <AcaiForm />
        </div>
      </section>
    </main>
  );
}
