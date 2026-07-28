import { createHmac, timingSafeEqual } from "node:crypto";

export type SelectionReceipt = { gallery: string; selected: number[]; submittedAt: string; receiptId: string };

function secret() {
  const value = process.env.SELECTION_RECEIPT_SECRET ?? process.env.WALLET_CHALLENGE_SECRET;
  if (!value) throw new Error("Selection receipts are not configured");
  return value;
}

export function signSelectionReceipt(receipt: SelectionReceipt) {
  const payload = Buffer.from(JSON.stringify(receipt)).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySelectionReceipt(token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) throw new Error("Selection receipt is invalid");
  const expected = Buffer.from(createHmac("sha256", secret()).update(payload).digest("base64url"));
  const supplied = Buffer.from(signature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) throw new Error("Selection receipt is invalid");
  return JSON.parse(Buffer.from(payload, "base64url").toString()) as SelectionReceipt;
}
