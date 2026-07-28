import assert from "node:assert/strict";
import test from "node:test";
import { applyCullDecision, completionPercent } from "./culling.ts";

test("confirmed remove flags exclude an image", () => {
  assert.equal(applyCullDecision("remove", true), false);
  assert.equal(applyCullDecision("review", true), true);
});

test("unconfirmed suggestions never remove an image", () => {
  assert.equal(applyCullDecision("remove", false), true);
});

test("completion percentage is safe", () => {
  assert.equal(completionPercent(12, 24), 50);
  assert.equal(completionPercent(2, 0), 0);
  assert.equal(completionPercent(8, 4), 100);
});
