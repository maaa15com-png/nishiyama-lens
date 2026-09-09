import assert from "node:assert/strict";
import test from "node:test";
import { distanceMeters, findNearestSpot, formatDistance, isValidCoordinates } from "../src/lib/map/nearest-spot.ts";

const spot = (sortOrder, latitude, longitude) => ({
  id: String(sortOrder), name: `Spot ${sortOrder}`, sortOrder, latitude, longitude, category: "OTHER",
});

test("distance uses metres on the globe, including the date line", () => {
  const origin = { latitude: 0, longitude: 0 };
  assert.equal(distanceMeters(origin, origin), 0);
  assert.ok(Math.abs(distanceMeters(origin, { latitude: 0, longitude: 1 }) - 111195) < 1);
  const a = { latitude: 35, longitude: 179.9 }, b = { latitude: 35, longitude: -179.9 };
  assert.ok(distanceMeters(a, b) < 20000);
  assert.equal(distanceMeters(a, b), distanceMeters(b, a));
  assert.ok(Number.isFinite(distanceMeters(origin, { latitude: 0, longitude: 180 })));
});

test("recommendation changes with location and does not skip a nearby Spot as visited", () => {
  const zoo = spot(1, 35.950693, 136.180883);
  const playground = spot(2, 35.951933, 136.182763);
  const list = [playground, zoo];
  assert.equal(findNearestSpot(zoo, list).spot, zoo);
  assert.equal(findNearestSpot(playground, list).spot, playground);
  assert.equal(findNearestSpot(zoo, list).distanceMeters, 0);
  assert.deepEqual(list, [playground, zoo]);
});

test("equal-distance ties use sortOrder, including repeated Spot locations", () => {
  const first = spot(1, 35, 136), later = spot(4, 35, 136);
  assert.equal(findNearestSpot(first, [later, first]).spot, first);
});

test("empty or invalid positions never become a recommendation", () => {
  const valid = spot(1, 35, 136);
  assert.equal(findNearestSpot(valid, []), null);
  assert.equal(findNearestSpot({ latitude: NaN, longitude: 136 }, [valid]), null);
  assert.equal(findNearestSpot(valid, [spot(2, 91, 136)]), null);
  assert.equal(isValidCoordinates({ latitude: 35, longitude: Infinity }), false);
  assert.equal(isValidCoordinates({ latitude: 35, longitude: 181 }), false);
});

test("distance labels avoid false precision and use metres/kilometres", () => {
  assert.equal(formatDistance(0), "100m未満");
  assert.equal(formatDistance(99), "100m未満");
  assert.equal(formatDistance(123), "約120m");
  assert.equal(formatDistance(999), "約1.0km");
  assert.equal(formatDistance(1260), "約1.3km");
});
