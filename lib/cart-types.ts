export type CartEntry = {
  subtotal: number;
  lineItems: Array<{ label: string; amount: number }>;
  details?: Record<string, unknown>;
};

export type UnifiedCart = {
  mealPrep?: CartEntry;
  acai?: CartEntry;
  smoothie?: CartEntry;
};

export type UnifiedCheckoutPayload = {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  cart: UnifiedCart;
  grandTotal: number;
};
