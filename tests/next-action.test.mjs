import assert from "node:assert/strict";
import test from "node:test";
import { getNextAction } from "../src/lib/recap/next-action.ts";

const expectations = {
  PANDA: ["SEASON", "次は季節の西山公園も見てみる"],
  SEASON: ["PANDA", "次はレッサーパンダに会いにいく"],
  PLAY: ["RELAX", "次はのんびり過ごすコースを探す"],
  PHOTO: ["SEASON", "別の景色を探してみる"],
  RELAX: ["PHOTO", "次は写真に残したい景色を探す"],
};
for (const [interest, [target, label]] of Object.entries(expectations)) {
  test(`${interest} selects one different next theme`, () => {
    assert.deepEqual(getNextAction(interest), { interest: target, label });
    assert.notEqual(target, interest);
  });
}
test("callers cannot mutate later recommendations", () => {
  const action = getNextAction("PANDA");
  action.label = "changed";
  assert.equal(getNextAction("PANDA").label, expectations.PANDA[1]);
});
