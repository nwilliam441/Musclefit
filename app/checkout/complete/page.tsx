import CheckoutCompleteClient from "./complete-client";
import { finalizePaidOrder } from "@/lib/finalize-order";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }
  return value || "";
}

function detectPaymentReference(searchParams: SearchParams) {
  return (
    first(searchParams.payment_ref) ||
    first(searchParams.payment_id) ||
    first(searchParams.transaction_id) ||
    first(searchParams.tx)
  );
}

export default async function CheckoutCompletePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const orderToken = first(params.order_token);
  const detectedReference = detectPaymentReference(params);

  let initialStatus: "idle" | "success" | "error" = "idle";

  if (orderToken && detectedReference) {
    const result = await finalizePaidOrder(orderToken, detectedReference);
    initialStatus = result.ok ? "success" : "error";
  }

  return (
    <CheckoutCompleteClient
      orderToken={orderToken}
      detectedReference={detectedReference}
      initialStatus={initialStatus}
    />
  );
}
