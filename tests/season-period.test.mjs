import test from "node:test";
import assert from "node:assert/strict";
import { isSeasonActive } from "../src/lib/seasons/period.ts";
const period = (month) => ({ startMonth: month, endMonth: month, startDay: null, endDay: null });
test("May is active for the entire Japanese month", () => {
  for (const date of ["2026-04-30T15:00:00Z", "2026-05-31T14:59:59Z"]) assert.equal(isSeasonActive(period(5), new Date(date)), true);
  for (const date of ["2026-04-30T14:59:59Z", "2026-05-31T15:00:00Z"]) assert.equal(isSeasonActive(period(5), new Date(date)), false);
});
test("November is separate from spring and September", () => {
  assert.equal(isSeasonActive(period(11), new Date("2026-11-15T00:00:00Z")), true);
  assert.equal(isSeasonActive(period(11), new Date("2026-05-15T00:00:00Z")), false);
  assert.equal(isSeasonActive(period(5), new Date("2026-09-12T00:00:00Z")), false);
  assert.equal(isSeasonActive(period(11), new Date("2026-11-30T15:00:00Z")), false);
});
test("explicit days are inclusive; invalid periods fail closed", () => {
  const p = { ...period(5), startDay: 3, endDay: 5 };
  assert.equal(isSeasonActive(p, new Date("2026-05-05T14:59:59Z")), true);
  assert.equal(isSeasonActive(p, new Date("2026-05-02T00:00:00Z")), false);
  for (const invalid of [{ ...p, startMonth: 0 }, { ...p, endDay: 32 }, { ...p, startDay: 6 }]) assert.equal(isSeasonActive(invalid, new Date("2026-05-04")), false);
  assert.equal(isSeasonActive(p, new Date("invalid")), false);
});
test("calendar handles year wrap and leap-year month end", () => {
  assert.equal(isSeasonActive({ ...period(12), endMonth: 2 }, new Date("2026-01-15")), true);
  assert.equal(isSeasonActive(period(2), new Date("2028-02-29T00:00:00Z")), true);
});
