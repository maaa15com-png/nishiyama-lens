import type postgres from "@prisma/orm-postgres/runtime";
import type { Numeric, Varchar } from "@prisma/orm-postgres/target/codec-types";
import type { Contract } from "./schema.d.ts";
import { parkFacilitySeeds } from "./park-facility-data.mts";

type Database = ReturnType<typeof postgres<Contract>>;

// Insert-only, separate from the legacy seed. Never update existing amenities.
export async function seedParkFacilities(db: Database) {
  return db.transaction(async (tx) => {
    let inserted = 0;
    for (const seed of parkFacilitySeeds) {
      const name = seed.name as Varchar<150>;
      const byId = await tx.orm.public.ParkFacility.where({ id: seed.id }).first();
      const byKey = await tx.orm.public.ParkFacility.where({ name, type: seed.type }).first();
      if ((byId && (byId.name !== name || byId.type !== seed.type)) || (byKey && byKey.id !== seed.id)) {
        throw new Error("ParkFacility seed identity collision: " + seed.id);
      }
      if (byId) continue;
      await tx.orm.public.ParkFacility.create({ ...seed, name,
        nameEn: seed.nameEn as Varchar<150> | null,
        latitude: seed.latitude as Numeric<9,6>, longitude: seed.longitude as Numeric<9,6>,
      });
      inserted++;
    }
    return { inserted, skipped: parkFacilitySeeds.length - inserted, updated: 0 };
  });
}
