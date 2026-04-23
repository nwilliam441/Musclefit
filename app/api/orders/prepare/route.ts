import { NextResponse } from "next/server";
import { siteData } from "@/lib/site-data";
import { createOrderToken } from "@/lib/order-token";

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

function getOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  const envOrigin = process.env.NEXT_PUBLIC_APP_URL;
  if (envOrigin) {
    return envOrigin;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutOrder;

    if (!payload.customer?.name || !payload.customer?.email || !payload.customer?.phone) {
      return NextResponse.json({ error: "Missing customer information" }, { status: 400 });
    }

    if (!siteData.clover.orderUrl) {
      return NextResponse.json({ error: "Clover URL is not configured" }, { status: 500 });
    }

    const orderToken = createOrderToken(payload);

    const cloverUrl = new URL(siteData.clover.orderUrl);
    cloverUrl.searchParams.set("order_token", orderToken);
    cloverUrl.searchParams.set("amount", payload.pricing.orderTotal.toFixed(2));

    const origin = getOrigin(request);
    if (origin) {
      const completeUrl = new URL("/checkout/complete", origin);
      completeUrl.searchParams.set("order_token", orderToken);
      cloverUrl.searchParams.set("return_url", completeUrl.toString());
    }

    return NextResponse.json({ checkoutUrl: cloverUrl.toString() });
  } catch {
    return NextResponse.json({ error: "Failed to prepare checkout" }, { status: 500 });
  }
}
