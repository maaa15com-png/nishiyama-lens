import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import * as types from "../src/lib/lens/types.ts";

const pairs = [["FAMILY", "PANDA"], ["FAMILY", "PLAY"], ["COUPLE", "PHOTO"], ["SOLO", "RELAX"]];
const lenses = pairs.map(([companion, interest], id) => ({ id: String(id), companion, interest, name: companion + " × " + interest, description: "説明", isPublished: true }));
const courses = lenses.flatMap((lens) => [...types.durationTypes].reverse().map((durationType, i) => ({
  id: lens.id + "-" + i, lensId: lens.id, durationType, name: "Course", description: "説明", durationMinutes: 60, isPublished: true,
})));
const source = ts.transpileModule(readFileSync(new URL("../src/lib/server/lens-recommendation.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function setup(lensRows = lenses, courseRows = courses) {
  let calls = 0;
  const model = (rows) => ({ where(condition) {
    calls++;
    const found = rows.filter((row) => Object.entries(condition).every(([key, value]) => row[key] === value));
    return { select() { return this; }, orderBy() { return this; }, async first() { return found[0] ?? null; }, async all() { return found; } };
  } });
  const context = { exports: {}, require(name) {
    if (name === "server-only") return {};
    if (name === "@/lib/lens/types") return types;
    assert.equal(name, "./db");
    return { db: { orm: { public: { Lens: model(lensRows), Course: model(courseRows) } } } };
  } };
  vm.runInNewContext(source, context);
  return { get: context.exports.getLensRecommendation, calls: () => calls };
}
for (const [companion, interest] of pairs) {
  test(companion + " + " + interest + ": two answers yield Lens and three ordered Courses", async () => {
    const { get } = setup();
    const { recommendation } = await get({ companion, interest });
    assert.equal(recommendation.lens.name, companion + " × " + interest);
    assert.deepEqual(Array.from(recommendation.courses, (c) => c.durationType), [...types.durationTypes]);
    assert.ok(recommendation.courses.every((c) => c.id.startsWith(recommendation.lens.id + "-")));
    const legacyUrl = await get({ companion, interest, duration: "HALF_DAY" });
    assert.equal(JSON.stringify(legacyUrl), JSON.stringify({ recommendation }));
  });
}
test("invalid or repeated answers and legacy companion skip the DB", async () => {
  const { get, calls } = setup();
  for (const input of [null, {}, { companion: "SMALL_CHILDREN", interest: "PANDA" }, { companion: ["FAMILY"], interest: "PANDA" }, { companion: "FAMILY", interest: ["PLAY", "PANDA"] }]) {
    assert.equal(types.isLensRecommendationInput(input), false);
    assert.equal((await get(input)).reason, "INVALID_INPUT");
  }
  assert.equal(calls(), 0);
});
test("missing and unpublished Lenses return a non-error empty result", async () => {
  assert.equal((await setup().get({ companion: "FRIENDS", interest: "PANDA" })).reason, "LENS_NOT_FOUND");
  assert.equal((await setup([{ ...lenses[0], isPublished: false }]).get(pairsInput())).reason, "LENS_NOT_FOUND");
});
const pairsInput = () => ({ companion: "FAMILY", interest: "PANDA" });
test("Lens remains visible without Courses; hidden and HALF_DAY courses are excluded", async () => {
  const { recommendation } = await setup(lenses, [
    { ...courses[0], isPublished: false },
    { ...courses[0], durationType: "HALF_DAY" },
    ...courses.filter((c) => c.lensId !== "0"),
  ]).get(pairsInput());
  assert.equal(recommendation.lens.id, "0");
  assert.equal(recommendation.courses.length, 0);
});
