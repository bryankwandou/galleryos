import assert from "node:assert/strict";
import test from "node:test";
import { signSelectionReceipt, verifySelectionReceipt } from "./selection-receipt.ts";

test("selection receipt round-trips", () => {
  process.env.SELECTION_RECEIPT_SECRET = "selection-test-secret";
  const receipt = { gallery: "harper-chen", selected: [1, 3], submittedAt: new Date().toISOString(), receiptId: "receipt-1" };
  assert.deepEqual(verifySelectionReceipt(signSelectionReceipt(receipt)), receipt);
});

test("tampered selection receipt is rejected", () => {
  process.env.SELECTION_RECEIPT_SECRET = "selection-test-secret";
  const receipt = { gallery: "harper-chen", selected: [1], submittedAt: new Date().toISOString(), receiptId: "receipt-2" };
  const token = signSelectionReceipt(receipt);
  assert.throws(() => verifySelectionReceipt(`${token.slice(0, -2)}xx`), /invalid/);
});
