import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import ts from "typescript";

// A small relational fixture: execute published filters, selections and nested includes.
// The same fixture supports the additive seed and the actual server query functions.
const relations = {
  Course: { courseSpots: ["CourseSpot", "id", "courseId", true] },
  CourseSpot: { spot: ["Spot", "spotId", "id"], seasonalCandidates: ["CourseSpotSeason", "id", "courseSpotId", true] },
  CourseSpotSeason: { spot: ["Spot", "spotId", "id"], season: ["Season", "seasonId", "id"] },
  Lens: { courses: ["Course", "id", "lensId", true], nearbySpots: ["LensNearbySpot", "id", "lensId", true] },
  LensNearbySpot: { nearbySpot: ["NearbySpot", "nearbySpotId", "id"] },
  Spot: { redPandas: ["RedPanda", "id", "spotId", true] },
  TodaysFind: { spot: ["Spot", "spotId", "id"], lens: ["Lens", "lensId", "id"], season: ["Season", "seasonId", "id"] },
};
export function fixtureDatabase(initial = {}) {
  let rows = structuredClone(initial);
  const modelNames = ["Lens", "Course", "CourseSpot", "Season", "TodaysFind", "CourseSpotSeason", "Spot", "NearbySpot", "LensNearbySpot", "RedPanda", "News", "Event"];
  for (const n of modelNames) rows[n] ??= [];
  function query(model, filters = [], fields = null, includes = [], orders = []) {
    const q = {
      where(filter) { return query(model, [...filters, filter], fields, includes, orders); },
      select(...keys) { return query(model, filters, keys, includes, orders); },
      include(name, callback) { return query(model, filters, fields, [...includes, [name, callback]], orders); },
      orderBy(order) {
        const proxy = new Proxy({}, { get: (_, key) => ({ asc: () => [key, 1], desc: () => [key, -1] }) });
        return query(model, filters, fields, includes, (Array.isArray(order) ? order : [order]).map(fn => fn(proxy)));
      },
      async all() {
        const found = rows[model].filter(row => filters.every(f => Object.entries(f).every(([k, v]) => row[k] === v)));
        found.sort((a,b) => { for (const [k,d] of orders) { if (a[k] < b[k]) return -d; if (a[k] > b[k]) return d; } return 0; });
        return Promise.all(found.map(async row => {
          const result = fields ? Object.fromEntries(fields.map(k => [k, row[k]])) : { ...row };
          for (const [name, callback] of includes) {
            const [target, sourceKey, targetKey, many] = relations[model][name];
            const branch = callback(query(target).where({ [targetKey]: row[sourceKey] }));
            result[name] = many ? await branch.all() : await branch.first();
          }
          return result;
        }));
      },
      async first() { return (await q.all())[0] ?? null; },
      async create(row) {
        assert.ok(!rows[model].some(x => x.id === row.id), "duplicate UUID");
        rows[model].push(structuredClone(row)); return row;
      },
    };
    return q;
  }
  const db = { orm: { public: Object.fromEntries(modelNames.map(n => [n, query(n)])) },
    rows: () => rows,
    async transaction(callback) { const before = structuredClone(rows); try { return await callback(db); } catch (e) { rows = before; throw e; } },
  };
  return db;
}

export function serverModules(db, overrides = {}) {
  const cache = new Map();
  function load(file) {
    const absolute = path.resolve(file);
    if (cache.has(absolute)) return cache.get(absolute);
    const context = { exports: {}, Date, Intl, console, require(name) {
      if (name === "server-only") return {};
      if (name === "./db") return { db };
      if (name in overrides) return overrides[name];
      const target = name.startsWith("@/") ? path.join("src", name.slice(2)) : path.resolve(path.dirname(absolute), name);
      return load(target.endsWith(".ts") ? target : target + ".ts");
    } };
    cache.set(absolute, context.exports);
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText, context, { filename: absolute });
    return context.exports;
  }
  return load;
}
