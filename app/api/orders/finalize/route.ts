import { NextResponse } from "next/server";
import { finalizePaidOrder } from "@/lib/finalize-order";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { orderToken?: string; paymentReference?: string };
    const result = await finalizePaidOrder(body.orderToken || "", body.paymentReference || "");

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ ok: true, duplicate: result.duplicate });
  } catch {
    return NextResponse.json({ error: "Failed to finalize order" }, { status: 500 });
  }
}
