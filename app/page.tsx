import Image from "next/image";
import Link from "next/link";
import { siteData } from "@/lib/site-data";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="landing-hero">
        <div className="landing-hero-bg" />
        <div className="landing-hero-grid">
          <div className="landing-panel">
            <p className="landing-eyebrow">Meal Prep + Smoothies</p>
            <h1 className="landing-title">
              Fuel Your
              <br />
              Workouts With
              <br />
              Clean Meals
              <br />
              And Smoothies
            </h1>

            <p className="landing-copy">{siteData.locationBlurb}</p>

            <div className="cta-row landing-cta-row">
              <Link href="/meal-prep" className="btn btn-primary">
                Order Meal Prep
              </Link>
              <Link href="/smoothies" className="btn btn-secondary">
                View Smoothies
              </Link>
              {siteData.clover.enabled ? (
                <Link href="/order" className="btn landing-btn-checkout">
                  Checkout
                </Link>
              ) : null}
            </div>
          </div>

          <div className="landing-art-panel">
            <div className="landing-art-wrap">
              <Image
                src="/brand/smooth monster.png"
                alt="Muscle Fit mascot"
                width={420}
                height={420}
                className="landing-mascot"
                priority
              />
            </div>
            <p className="landing-art-caption">Built For Performance</p>
          </div>
        </div>
      </section>

      <section className="section-grid cols-3 landing-info-grid">
        <article className="card landing-info-card">
          <div className="landing-info-line landing-line-lime" />
          <h2>What We Offer</h2>
          <p>
            Clean, gym-ready meal prep bowls and two focused smoothie menus designed for training performance and
            consistency.
          </p>
        </article>
        <article className="card landing-info-card">
          <div className="landing-info-line landing-line-orange" />
          <h2>Order Window</h2>
          <p>{siteData.mealPrep.cutoffText}</p>
        </article>
        <article className="card landing-info-card">
          <div className="landing-info-line landing-line-cyan" />
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
