import { createHmac, timingSafeEqual } from "node:crypto";

type TokenPayload<T> = {
  data: T;
  createdAt: string;
};

function getSecret() {
  const secret = process.env.ORDER_SIGNING_SECRET;
  if (!secret) {
    throw new Error("ORDER_SIGNING_SECRET is required");
  }
  return secret;
}

function sign(input: string) {
  return createHmac("sha256", getSecret()).update(input).digest("base64url");
}

export function createOrderToken<T>(data: T) {
  const payload: TokenPayload<T> = {
    data,
    createdAt: new Date().toISOString(),
  };

  const encoded = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyOrderToken<T>(token: string): TokenPayload<T> | null {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [encoded, providedSignature] = parts;
  const expectedSignature = sign(encoded);

  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const decoded = Buffer.from(encoded, "base64url").toString("utf-8");
    return JSON.parse(decoded) as TokenPayload<T>;
  } catch {
    return null;
  }
}
