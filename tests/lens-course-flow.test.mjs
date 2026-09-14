import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { getNextAction } from "../src/lib/recap/next-action.ts";
import { lensQuestions } from "../src/components/lens/lens-data.ts";
import { durationTypes } from "../src/lib/lens/types.ts";

test("diagnosis has two questions, four companions and five interests", () => {
  assert.deepEqual(lensQuestions.map((question) => question.key), ["companion", "interest"]);
  assert.deepEqual(lensQuestions[0].options.map((option) => option.value), ["SOLO", "FRIENDS", "COUPLE", "FAMILY"]);
  assert.equal(lensQuestions[1].options.length, 5);
  assert.deepEqual([...durationTypes], ["MINUTES_30_60", "HOURS_1_2", "HOURS_2_3"]);
});
const source = ts.transpileModule(readFileSync(new URL("../src/lib/server/recap.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function setup(durationType, nextCourses) {
  const currentLens = { id: "family-play", name: "FAMILY × PLAY", companion: "FAMILY", interest: "PLAY" };
  const context = { exports: {}, require(name) {
    if (name === "server-only") return {};
    if (name === "./course-detail") return { getCourseDetail: async () => ({ id: "course", lensId: currentLens.id, durationType, courseSpots: [] }) };
    if (name === "./todays-find") return { getTodaysFinds: async () => [] };
    if (name === "@/lib/recap/next-action") return { getNextAction };
    if (name === "./db") return { db: { orm: { public: { Lens: {
      where(condition) {
        assert.equal(condition.isPublished, true);
        if (!condition.id) { assert.equal(condition.companion, "FAMILY"); assert.equal(condition.interest, "RELAX"); }
        return { select() { return this; }, include(_key, callback) {
          callback({ where(filter) { assert.equal(filter.isPublished, true); return this; }, select() { return this; }, orderBy() { return this; } });
          return this;
        }, async first() { return condition.id ? currentLens : nextCourses === null ? null : { id: "family-relax", courses: nextCourses }; } };
      },
    } } } } };
    throw new Error(name);
  } };
  vm.runInNewContext(source, context);
  return context.exports.getRecap;
}
for (const duration of durationTypes) {
  test("Recap keeps Lens theme primary and prefers matching duration " + duration, async () => {
    const candidates = durationTypes.map((durationType, index) => ({ id: String(index), durationType }));
    const recap = await setup(duration, candidates)("course");
    assert.equal(recap.action.interest, "RELAX");
    assert.equal(recap.action.href, "/courses/" + candidates.find((c) => c.durationType === duration).id);
  });
}
test("Recap safely falls back when next Lens or its Courses are absent", async () => {
  for (const courses of [null, []]) assert.equal((await setup("HOURS_1_2", courses)("course")).action.href, "/lens");
  assert.equal((await setup("HOURS_1_2", [{ id: "short", durationType: "MINUTES_30_60" }])("course")).action.href, "/courses/short");
});
