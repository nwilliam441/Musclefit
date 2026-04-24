import Image from "next/image";
import Link from "next/link";
import { siteData } from "@/lib/site-data";

export default function Home() {
  const hasCheckout = siteData.clover.enabled && Boolean(siteData.clover.orderUrl || siteData.clover.embedUrl);
  const hasPhone = /^\+?[\d\s().-]{7,}$/.test(siteData.phone);
  const hasInstagram = siteData.instagramUrl.startsWith("http");

  return (
    <main className="page-shell">
      <section className="landing-hero">
        <div className="landing-hero-bg" />
        <div className="landing-hero-grid">
          <div className="landing-panel">
            <p className="landing-eyebrow">Meal Prep + Acai + Smoothies</p>
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
              <Link href="/acai-bowls" className="btn btn-secondary">
                Build Acai Bowl
              </Link>
              {hasCheckout ? (
                <Link href="/order" className="btn landing-btn-checkout">
                  Checkout
                </Link>
              ) : null}
            </div>
          </div>

          <div className="landing-art-panel">
            <div className="landing-art-wrap">
              <Image
                src="/brand/Mascot logo.png"
                alt="Muscle Fit mascot logo"
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
            Clean, gym-ready meal prep bowls, made-to-order acai bowls, and two focused smoothie menus designed for
            training performance and consistency.
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
          {hasPhone ? (
            <p>
              <a href={`tel:${siteData.phone}`}>Call: {siteData.phone}</a>
            </p>
          ) : (
            <p className="muted">Phone number coming soon</p>
          )}
          {hasInstagram ? (
            <p>
              <a href={siteData.instagramUrl} target="_blank" rel="noreferrer">
                Follow on Instagram
              </a>
            </p>
          ) : (
            <p className="muted">Instagram link coming soon</p>
          )}
          {!hasCheckout ? <p className="muted">Online checkout coming soon</p> : null}
        </article>
      </section>
    </main>
  );
}
