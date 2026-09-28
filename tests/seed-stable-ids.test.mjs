import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Evaluate the actual seed's upsert payloads without importing its DB entry point.
const source = fs.readFileSync("prisma/seed.mts", "utf8");
const tree = ts.createSourceFile("seed.mts", source, ts.ScriptTarget.Latest, true);
const declarations = new Map();
const calls = [];
function visit(node) {
  if (ts.isVariableDeclaration(node)) declarations.set(node.name.getText(tree), node.initializer);
  if (ts.isCallExpression(node)) calls.push(node);
  ts.forEachChild(node, visit);
}
visit(tree);
const identity = value => value;
function payload(model, spotSeed) {
  let randomCalls = 0;
  const context = { spotSeed, varchar100: identity, varchar150: identity, varchar255: identity,
    numeric9_6: identity, randomUUID: () => `random-${++randomCalls}` };
  for (const name of ["NISHIYAMA_ZOO_SPOT_ID", "SABAE_MANABE_MUSEUM_NEARBY_SPOT_ID"]) {
    const declaration = declarations.get(name);
    if (declaration) context[name] = vm.runInNewContext(declaration.getText(tree), context);
  }
  const call = calls.find(node => node.expression.getText(tree) === `tx.orm.public.${model}.upsert`);
  assert.ok(call);
  const value = vm.runInNewContext(`(${call.arguments[0].getText(tree)})`, context);
  return { value, randomCalls };
}
const spots = vm.runInNewContext(ts.transpileModule(`(${declarations.get("spotSeeds").getText(tree)})`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, {
  varchar100: identity, varchar150: identity, varchar255: identity, numeric9_6: identity,
});

test("Fresh zoo uses the official image seed UUID", () => {
  const {value, randomCalls} = payload("Spot", spots.find(s => s.slug === "nishiyama-zoo"));
  assert.equal(value.create.id, "39ad31f0-58be-40d6-90c9-ea52e1a84b7d");
  assert.equal(randomCalls, 0);
  const images = JSON.parse(fs.readFileSync("src/lib/media/spot-images.json", "utf8"));
  assert.equal(value.create.id, images.find(i => i.slug === "nishiyama-zoo").spotId);
});

test("Fresh Manabe Museum uses the official NearbySpot relation UUID", () => {
  const {value, randomCalls} = payload("NearbySpot");
  assert.equal(value.create.id, "b23c8a02-a9d9-45b7-be8e-6d358a52a412");
  assert.equal(value.create.slug, "sabae-manabe-museum");
  assert.equal(randomCalls, 0);
});

test("Existing IDs are not part of updates and slug conflicts remain stable on rerun", () => {
  for (const {value} of [payload("Spot", spots.find(s => s.slug === "nishiyama-zoo")), payload("NearbySpot")]) {
    assert.equal(Object.hasOwn(value.update, "id"), false);
    assert.deepEqual(Object.keys(value.conflictOn), ["slug"]);
    assert.equal(value.conflictOn.slug, value.create.slug);
    const existing = { ...value.create, id: "existing-id" };
    Object.assign(existing, value.update);
    Object.assign(existing, value.update);
    assert.equal(existing.id, "existing-id");
  }
});

test("Other base Spots and unrelated upserts retain random ID generation", () => {
  for (const spot of spots.filter(s => s.slug !== "nishiyama-zoo")) {
    const {value, randomCalls} = payload("Spot", spot);
    assert.equal(randomCalls, 1);
    assert.equal(value.create.id, "random-1");
    assert.equal(Object.hasOwn(value.update, "id"), false);
  }
  for (const call of calls.filter(node => /\.upsert$/.test(node.expression.getText(tree)) &&
    !/\.(Spot|NearbySpot|RedPanda)\.upsert$/.test(node.expression.getText(tree)))) {
    const create = call.arguments[0].properties.find(p => p.name?.getText(tree) === "create").initializer;
    assert.equal(create.properties.find(p => p.name?.getText(tree) === "id").initializer.getText(tree), "randomUUID()");
  }
});
