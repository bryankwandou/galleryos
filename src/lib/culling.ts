import type { CullFlag } from "./types";

export function applyCullDecision(flag: CullFlag, confirmed: boolean) {
  if (!confirmed) return true;
  return flag !== "remove";
}

export function completionPercent(reviewed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((reviewed / total) * 100));
}
