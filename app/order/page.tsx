import Link from "next/link";
import { siteData } from "@/lib/site-data";

export default function OrderPage() {
  const { clover } = siteData;
  const hasEmbed = Boolean(clover.embedUrl);
  const hasOrderLink = Boolean(clover.orderUrl);

  return (
    <main className="page-shell">
      <section className="hero compact">
        <p className="eyebrow">Online Ordering</p>
        <h1>Order with Clover</h1>
        <p>Use Clover for online order intake. Keep meal prep and smoothies in one ordering flow.</p>
      </section>

      {hasEmbed ? (
        <section className="card">
          <h2>Clover Embedded Checkout</h2>
          <p className="muted">{clover.embedAllowedNote}</p>
          <div className="embed-wrap">
            <iframe
              src={clover.embedUrl}
              title="Clover Online Ordering"
              className="embed-frame"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {hasOrderLink ? (
            <p>
              If the embed does not load, <a href={clover.orderUrl} target="_blank" rel="noreferrer">open Clover in a new tab</a>.
            </p>
          ) : null}
        </section>
      ) : hasOrderLink ? (
        <section className="card">
          <h2>Clover Order Link</h2>
          <p>Embedding is not configured yet. Use this Clover link:</p>
          <p>
            <a href={clover.orderUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
              Open Clover Ordering
            </a>
          </p>
        </section>
      ) : (
        <section className="card">
          <h2>Clover Not Configured Yet</h2>
          <p>Add your Clover URLs in <strong>lib/site-data.ts</strong>:</p>
          <ul>
            <li>clover.orderUrl: your public Clover ordering URL</li>
            <li>clover.embedUrl: optional embeddable URL (if Clover allows iframe)</li>
          </ul>
          <p>
            While this is blank, you can still order from <Link href="/meal-prep">Meal Prep</Link> by email.
          </p>
        </section>
      )}
    </main>
  );
}
