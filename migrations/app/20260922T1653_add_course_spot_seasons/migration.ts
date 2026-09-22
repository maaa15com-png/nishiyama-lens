#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1ad7a57c44455864fb784b70f742c0d8e9937ff62dda7d5bf568fefea8d90998/contract';
import endContract from '../../snapshots/1ad7a57c44455864fb784b70f742c0d8e9937ff62dda7d5bf568fefea8d90998/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/2c5775f19def5aa838f687486538045c29c35b519f77d17ce934f6afba1b1a44/contract';
import startContract from '../../snapshots/2c5775f19def5aa838f687486538045c29c35b519f77d17ce934f6afba1b1a44/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'course_spot_seasons',
        columns: [
          col('course_spot_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('season_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('spot_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'course_spot_seasons',
        constraint: 'course_spot_seasons_course_spot_id_season_id_key',
        columns: ['course_spot_id', 'season_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'course_spot_seasons',
        index: 'course_spot_seasons_course_spot_id_idx_87a34496',
        columns: ['course_spot_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'course_spot_seasons',
        index: 'course_spot_seasons_season_id_idx_b4a5a2c6',
        columns: ['season_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'course_spot_seasons',
        index: 'course_spot_seasons_spot_id_idx_f74e1993',
        columns: ['spot_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'course_spot_seasons',
        foreignKey: {
          name: 'course_spot_seasons_course_spot_id_fkey',
          columns: ['course_spot_id'],
          references: { schema: 'public', table: 'course_spots', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'course_spot_seasons',
        foreignKey: {
          name: 'course_spot_seasons_season_id_fkey',
          columns: ['season_id'],
          references: { schema: 'public', table: 'seasons', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'course_spot_seasons',
        foreignKey: {
          name: 'course_spot_seasons_spot_id_fkey',
          columns: ['spot_id'],
          references: { schema: 'public', table: 'spots', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
