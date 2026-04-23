"use client";

import { useState } from "react";

type Props = {
  orderToken: string;
  detectedReference: string;
  initialStatus: "idle" | "success" | "error";
};

export default function CheckoutCompleteClient({ orderToken, detectedReference, initialStatus }: Props) {
  const [manualRef, setManualRef] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(initialStatus);

  const finalizeOrder = async (paymentReference: string) => {
    setStatus("sending");

    try {
      const response = await fetch("/api/orders/finalize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderToken,
          paymentReference,
        }),
      });

      if (!response.ok) {
        throw new Error("Finalize failed");
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="page-shell">
      <section className="hero compact">
        <p className="eyebrow">Checkout Complete</p>
        <h1>Finalize Your Paid Order</h1>
        <p>If checkout returns a payment ID, your order is submitted automatically below.</p>
      </section>

      <section className="card">
        {detectedReference && status === "success" ? (
          <p className="submit-message">Payment confirmed. Store and customer receipt emails have been sent.</p>
        ) : null}

        {status === "sending" ? <p>Finalizing order and sending emails...</p> : null}

        {status === "error" ? (
          <p className="muted">Could not finalize automatically. Enter your receipt/payment ID and submit below.</p>
        ) : null}

        {!detectedReference && status !== "success" ? (
          <div className="checkout-complete-form">
            <label>
              Receipt / Payment ID
              <input
                value={manualRef}
                onChange={(event) => setManualRef(event.target.value)}
                placeholder="Enter payment reference"
              />
            </label>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!orderToken || !manualRef || status === "sending"}
              onClick={() => void finalizeOrder(manualRef)}
            >
              Send My Paid Order
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
