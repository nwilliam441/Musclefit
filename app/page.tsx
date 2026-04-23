import Link from "next/link";
import { siteData } from "@/lib/site-data";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Meal Prep + Smoothies</p>
        <h1>{siteData.tagline}</h1>
        <p>{siteData.locationBlurb}</p>
        <div className="cta-row">
          <Link href="/meal-prep" className="btn btn-primary">
            Order Meal Prep
          </Link>
          <Link href="/smoothies" className="btn btn-secondary">
            View Smoothies
          </Link>
        </div>
      </section>

      <section className="section-grid cols-3">
        <article className="card">
          <h2>What We Offer</h2>
          <p>
            Clean, gym-ready meal prep bowls and two focused smoothie menus designed for training performance and
            consistency.
          </p>
        </article>
        <article className="card accent-red">
          <h2>Order Window</h2>
          <p>{siteData.mealPrep.cutoffText}</p>
        </article>
        <article className="card accent-green">
          <h2>Contact</h2>
          <p>
            <a href={`tel:${siteData.phone}`}>Call: {siteData.phone}</a>
          </p>
          <p>
            <a href={siteData.instagramUrl} target="_blank" rel="noreferrer">
              Follow on Instagram
            </a>
          </p>
        </article>
      </section>
    </main>
  );
}
