import { Resend } from "resend";
import { verifyOrderToken } from "@/lib/order-token";

type CheckoutOrder = {
  customer: {
    name: string;
    email: string;
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
  pricing: {
    perBowlTotal: number;
    orderTotal: number;
    lineItems: Array<{ label: string; amount: number }>;
  };
  notes: string;
};

const sentCache = new Set<string>();

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export async function finalizePaidOrder(orderToken: string, paymentReference: string) {
  if (!orderToken || !paymentReference) {
    return { ok: false as const, status: 400, error: "orderToken and paymentReference are required" };
  }

  const parsed = verifyOrderToken<CheckoutOrder>(orderToken);
  if (!parsed) {
    return { ok: false as const, status: 400, error: "Invalid order token" };
  }

  if (sentCache.has(orderToken)) {
    return { ok: true as const, status: 200, duplicate: true };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.ORDER_FROM_EMAIL;
  const toEmail = process.env.ORDER_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    return {
      ok: false as const,
      status: 500,
      error: "Email service is not configured. Set RESEND_API_KEY, ORDER_FROM_EMAIL, ORDER_TO_EMAIL.",
    };
  }

  const resend = new Resend(apiKey);
  const order = parsed.data;

  const lineItemText = order.pricing.lineItems.map((item) => `- ${item.label}: ${formatCurrency(item.amount)}`).join("\n");

  await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: `Paid Meal Prep Order - ${order.customer.name}`,
    text: [
      "New Paid Meal Prep Order",
      "",
      `Name: ${order.customer.name}`,
      `Email: ${order.customer.email}`,
      `Phone: ${order.customer.phone}`,
      "",
      "Bowl Selection",
      `Protein: ${order.bowl.protein}`,
      `Carb: ${order.bowl.carb}`,
      `Veggies: ${order.bowl.veggies}`,
      `Extra meat: ${order.bowl.extraMeat ? "Yes" : "No"}`,
      `Extra veggie/carb: ${order.bowl.extraVeggieOrCarb ? "Yes" : "No"}`,
      `Quantity: ${order.bowl.quantity}`,
      "",
      "Cart",
      lineItemText,
      `Per bowl total: ${formatCurrency(order.pricing.perBowlTotal)}`,
      `Order total: ${formatCurrency(order.pricing.orderTotal)}`,
      "",
      `Pickup: ${order.pickup}`,
      `Payment reference: ${paymentReference}`,
      `Notes: ${order.notes || "N/A"}`,
    ].join("\n"),
  });

  await resend.emails.send({
    from: fromEmail,
    to: order.customer.email,
    subject: "Your Meal Prep Order Receipt",
    text: [
      `Thanks ${order.customer.name}, your payment was received and your order is confirmed.`,
      "",
      `Payment reference: ${paymentReference}`,
      `Order total: ${formatCurrency(order.pricing.orderTotal)}`,
      `Pickup: ${order.pickup}`,
      "",
      "We will contact you if we need anything else.",
    ].join("\n"),
  });

  sentCache.add(orderToken);
  return { ok: true as const, status: 200, duplicate: false };
}
