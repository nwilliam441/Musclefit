import { NextResponse } from "next/server";
import { Resend } from "resend";

type OrderPayload = {
  customer: {
    name: string;
    phone: string;
  };
  bowl: {
    protein: string;
    carb: string;
    veggies: string;
    extraMeat: boolean;
    extraVeggieOrCarb: boolean;
    quantity: number;
  };
  pickup: string;
  payment: {
    confirmed: boolean;
    reference: string;
  };
  pricing: {
    perBowlTotal: number;
    orderTotal: number;
    lineItems: Array<{ label: string; amount: number }>;
  };
  notes?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OrderPayload;

    if (!payload.customer?.name || !payload.customer?.phone) {
      return NextResponse.json({ error: "Missing customer info" }, { status: 400 });
    }

    if (!payload.payment?.confirmed || !payload.payment?.reference) {
      return NextResponse.json({ error: "Payment confirmation is required" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.ORDER_FROM_EMAIL;
    const toEmail = process.env.ORDER_TO_EMAIL;

    if (!apiKey || !fromEmail || !toEmail) {
      return NextResponse.json(
        { error: "Email service is not configured. Set RESEND_API_KEY, ORDER_FROM_EMAIL, ORDER_TO_EMAIL." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const lineItemText = payload.pricing.lineItems
      .map((item) => `- ${item.label}: ${formatCurrency(item.amount)}`)
      .join("\n");

    const text = [
      "New Paid Meal Prep Order",
      "",
      `Name: ${payload.customer.name}`,
      `Phone: ${payload.customer.phone}`,
      "",
      "Bowl Selection",
      `Protein: ${payload.bowl.protein}`,
      `Carb: ${payload.bowl.carb}`,
      `Veggies: ${payload.bowl.veggies}`,
      `Extra meat: ${payload.bowl.extraMeat ? "Yes" : "No"}`,
      `Extra veggie/carb: ${payload.bowl.extraVeggieOrCarb ? "Yes" : "No"}`,
      `Quantity: ${payload.bowl.quantity}`,
      "",
      "Cart Review",
      lineItemText,
      `Per bowl total: ${formatCurrency(payload.pricing.perBowlTotal)}`,
      `Order total: ${formatCurrency(payload.pricing.orderTotal)}`,
      "",
      `Pickup: ${payload.pickup}`,
      `Payment reference: ${payload.payment.reference}`,
      "",
      `Notes: ${payload.notes || "N/A"}`,
    ].join("\n");

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Paid Meal Prep Order - ${payload.customer.name}`,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send order" }, { status: 500 });
  }
}
