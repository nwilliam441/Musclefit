import { siteData } from "@/lib/site-data";

export default function OrderPage() {
  const { clover } = siteData;
  const hasEmbed = Boolean(clover.embedUrl);
  const hasOrderLink = Boolean(clover.orderUrl);

  return (
    <main className="page-shell">
      <section className="hero compact">
        <p className="eyebrow">Online Ordering</p>
        <h1>Checkout</h1>
        <p>Use online checkout for order intake. Keep meal prep and smoothies in one ordering flow.</p>
      </section>

      {hasEmbed ? (
        <section className="card">
          <h2>Embedded Checkout</h2>
          <p className="muted">{clover.embedAllowedNote}</p>
          <div className="embed-wrap">
            <iframe
              src={clover.embedUrl}
              title="Online Checkout"
              className="embed-frame"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          {hasOrderLink ? (
            <p>
              If the embed does not load, <a href={clover.orderUrl} target="_blank" rel="noreferrer">open checkout in a new tab</a>.
            </p>
          ) : null}
        </section>
      ) : hasOrderLink ? (
        <section className="card">
          <h2>Checkout Link</h2>
          <p>Embedding is not configured yet. Use this checkout link:</p>
          <p>
            <a href={clover.orderUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
              Open Checkout
            </a>
          </p>
        </section>
      ) : (
        <section className="card">
          <h2>Checkout Unavailable</h2>
          <p>
            Online checkout is not configured yet. Add your Clover URL in <code>lib/site-data.ts</code> under
            <code> clover.orderUrl</code> (or set <code>clover.embedUrl</code> for an embedded checkout).
          </p>
        </section>
      )}
    </main>
  );
}
