import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const cases = [
  ["FAMILY", "PLAY", "HOURS_2_3"],
  ["COUPLE", "PHOTO", "HOURS_1_2"],
  ["SOLO", "RELAX", "MINUTES_30_60"],
  // Family themes now consistently use FAMILY.
  ["FAMILY", "PANDA", "HOURS_2_3"],
];
const lenses = cases.map(([companion, interest], id) => ({ id: String(id), companion, interest, name: interest, description: "description" }));
const courses = cases.map(([, , durationType], id) => ({ id: `course-${id}`, lensId: String(id), durationType, name: "course", durationMinutes: 60 }));
const source = ts.transpileModule(readFileSync(new URL("../src/lib/server/lens-recommendation.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const model = (rows) => ({ where(condition) { return { select() { return this; }, async first() { return rows.find((row) => Object.entries(condition).every(([key, value]) => row[key] === value)) ?? null; } }; } });
const context = { exports: {}, require(name) {
  assert.equal(name, "./db");
  return { db: { orm: { public: { Lens: model(lenses), Course: model(courses) } } } };
} };
vm.runInNewContext(source, context);
const get = context.exports.getLensRecommendation;
for (const [index, [companion, interest, duration]] of cases.entries()) {
  test(`${companion} + ${interest}: exact duration only`, async () => {
    assert.equal((await get({ companion, interest, duration })).recommendation.course.id, `course-${index}`);
    for (const other of ["MINUTES_30_60", "HOURS_1_2", "HOURS_2_3", "HALF_DAY"].filter((value) => value !== duration)) {
      assert.equal((await get({ companion, interest, duration: other })).reason, "COURSE_NOT_FOUND");
    }
  });
}
test("companions are not aliased or inferred from a Lens display name", async () => {
  assert.equal((await get({ companion: "SMALL_CHILDREN", interest: "PANDA", duration: "HOURS_2_3" })).reason, "LENS_NOT_FOUND");
  assert.equal((await get({ companion: "SMALL_CHILDREN", interest: "PLAY", duration: "HOURS_2_3" })).reason, "LENS_NOT_FOUND");
});
