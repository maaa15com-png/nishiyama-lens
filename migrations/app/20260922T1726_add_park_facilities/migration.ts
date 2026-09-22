#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/1ad7a57c44455864fb784b70f742c0d8e9937ff62dda7d5bf568fefea8d90998/contract';
import startContract from '../../snapshots/1ad7a57c44455864fb784b70f742c0d8e9937ff62dda7d5bf568fefea8d90998/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/2f90105fbf68abb60ae1bc2e2115654ce9f6f114c17909a455d352647ae21b1e/contract';
import endContract from '../../snapshots/2f90105fbf68abb60ae1bc2e2115654ce9f6f114c17909a455d352647ae21b1e/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'park_facilities',
        columns: [
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('description_en', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('external_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('is_published', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('latitude', 'numeric(9,6)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 9, scale: 6 } },
          }),
          col('longitude', 'numeric(9,6)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 9, scale: 6 } },
          }),
          col('name', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('name_en', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('park_facilities_latitude_range_9dd11892', 'latitude BETWEEN -90 AND 90'),
          checkExpression(
            'park_facilities_longitude_range_5fbf98d2',
            'longitude BETWEEN -180 AND 180',
          ),
          checkExpression(
            'park_facilities_type_check_fd738207',
            "\"type\" IN ('TOILET', 'PARKING')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'park_facilities',
        constraint: 'park_facilities_name_type_key',
        columns: ['name', 'type'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
