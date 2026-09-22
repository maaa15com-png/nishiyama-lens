#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/2f90105fbf68abb60ae1bc2e2115654ce9f6f114c17909a455d352647ae21b1e/contract';
import startContract from '../../snapshots/2f90105fbf68abb60ae1bc2e2115654ce9f6f114c17909a455d352647ae21b1e/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/83fb8fed4c22337ef315f1bb7c63efbaae17f2466ab799d3971340272d34fe03/contract';
import endContract from '../../snapshots/83fb8fed4c22337ef315f1bb7c63efbaae17f2466ab799d3971340272d34fe03/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'park_facilities',
        column: col('has_diaper_change', 'bool', { codecRef: { codecId: 'pg/bool@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'park_facilities',
        column: col('has_nursing_room', 'bool', { codecRef: { codecId: 'pg/bool@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
