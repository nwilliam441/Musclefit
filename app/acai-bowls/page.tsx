import Link from "next/link";
import { AcaiForm } from "@/components/acai-form";
import { siteData } from "@/lib/site-data";

export default function AcaiBowlsPage() {
  const hasCheckout = siteData.clover.enabled && Boolean(siteData.clover.orderUrl || siteData.clover.embedUrl);
  const bannerBackground = `linear-gradient(120deg, rgba(8, 12, 18, 0.58), rgba(15, 20, 27, 0.48)), url(${siteData.acai.heroImage})`;
  const sectionBackground = "linear-gradient(120deg, rgba(8, 12, 18, 0.86), rgba(15, 20, 27, 0.76))";

  return (
    <main className="page-shell">
      <section
        className="hero compact"
        style={{ backgroundImage: bannerBackground, backgroundPosition: "center 28%", backgroundSize: "cover" }}
      >
        <p className="eyebrow">Acai Bowls</p>
        <h1>Build it. Fuel it. Love it.</h1>
        <p>{siteData.acai.tagline}</p>
      </section>

      <section
        className="section-grid two-col meal-prep-layout acai-overlay-layout"
        style={{
          backgroundImage: sectionBackground,
        }}
      >
        <aside className="card info-panel meal-prep-pricing acai-overlay-card">
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
