#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2c5775f19def5aa838f687486538045c29c35b519f77d17ce934f6afba1b1a44/contract';
import endContract from '../../snapshots/2c5775f19def5aa838f687486538045c29c35b519f77d17ce934f6afba1b1a44/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'course_spots',
        columns: [
          col('course_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('note', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('note_en', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('sort_order', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('spot_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('stay_minutes', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('walk_minutes_from_previous', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('course_spots_sort_order_positive_90621c4e', 'sort_order > 0'),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'courses',
        columns: [
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('description_en', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('duration_minutes', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('duration_type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('image_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('is_published', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('lens_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('name', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('name_en', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('courses_duration_minutes_positive_4cddc355', 'duration_minutes > 0'),
          checkExpression(
            'courses_duration_type_check_90a23ba8',
            "\"duration_type\" IN ('MINUTES_30_60', 'HOURS_1_2', 'HOURS_2_3', 'HALF_DAY')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'events',
        columns: [
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('description_en', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('end_at', 'timestamptz(6)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('external_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('image_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('is_published', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('location', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('location_en', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('start_at', 'timestamptz(6)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('title', 'character varying(200)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('title_en', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'lens_nearby_spots',
        columns: [
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('lens_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('nearby_spot_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('priority', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('recommendation_reason', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('recommendation_reason_en', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'lenses',
        columns: [
          col('companion', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('description_en', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('image_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('interest', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('is_published', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('title', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('title_en', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'lenses_companion_check_384aa1d3',
            "\"companion\" IN ('SOLO', 'FRIENDS', 'COUPLE', 'SMALL_CHILDREN', 'FAMILY')",
          ),
          checkExpression(
            'lenses_interest_check_d61f7203',
            "\"interest\" IN ('PANDA', 'SEASON', 'PLAY', 'PHOTO', 'RELAX')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'nearby_spots',
        columns: [
          col('address', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('address_en', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('description_en', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('external_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('image_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
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
          col('opening_hours', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('slug', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'nearby_spots_category_check_3b9369dc',
            "\"category\" IN ('CAFE', 'RESTAURANT', 'KIDS', 'SIGHTSEEING', 'SHOPPING', 'RELAX', 'OTHER')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'news',
        columns: [
          col('body', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('body_en', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('image_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('is_published', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('published_at', 'timestamptz(6)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('title', 'character varying(200)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('title_en', 'character varying(200)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 200 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'red_pandas',
        columns: [
          col('birth_date', 'date', { codecRef: { codecId: 'pg/date-temporal@1' } }),
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('description_en', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('father_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('image_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('is_published', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('mother_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('name_en', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('sex', 'character varying(20)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('source_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('spot_id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'seasons',
        columns: [
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('description_en', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('end_day', 'int2', { codecRef: { codecId: 'pg/int2@1' } }),
          col('end_month', 'int2', { notNull: true, codecRef: { codecId: 'pg/int2@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('image_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('is_published', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('name_en', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('season_group', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('start_day', 'int2', { codecRef: { codecId: 'pg/int2@1' } }),
          col('start_month', 'int2', { notNull: true, codecRef: { codecId: 'pg/int2@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('seasons_end_month_range_83d8a391', 'end_month BETWEEN 1 AND 12'),
          checkExpression(
            'seasons_season_group_check_8ddc52f9',
            "\"season_group\" IN ('SPRING', 'SUMMER', 'AUTUMN', 'WINTER')",
          ),
          checkExpression('seasons_start_month_range_bbc43c89', 'start_month BETWEEN 1 AND 12'),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'spots',
        columns: [
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('description_en', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('external_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('fee_text', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('fee_text_en', 'character varying(100)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('has_rest_area', 'bool', { codecRef: { codecId: 'pg/bool@1' } }),
          col('has_toilet', 'bool', { codecRef: { codecId: 'pg/bool@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('image_url', 'text', { codecRef: { codecId: 'pg/text@1' } }),
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
          col('opening_hours', 'character varying(255)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('slug', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('stay_minutes', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('stroller_accessible', 'bool', { codecRef: { codecId: 'pg/bool@1' } }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'spots_category_check_386717d1',
            "\"category\" IN ('ZOO', 'PLAYGROUND', 'GARDEN', 'FLOWER', 'VIEW', 'REST', 'FOOD', 'OTHER')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'todays_finds',
        columns: [
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('description_en', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('effect_type', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('end_at', 'timestamptz(6)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('is_published', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('lens_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('season_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('spot_id', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('start_at', 'timestamptz(6)', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1', typeParams: { precision: 6 } },
          }),
          col('title', 'character varying(150)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('title_en', 'character varying(150)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 150 } },
          }),
          col('updated_at', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'todays_finds_effect_type_check_352072ad',
            "\"effect_type\" IN ('FLOWER', 'LEAF', 'AUTUMN', 'SNOW', 'NONE')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'course_spots',
        constraint: 'course_spots_course_id_sort_order_key',
        columns: ['course_id', 'sort_order'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'courses',
        constraint: 'courses_lens_id_duration_type_key',
        columns: ['lens_id', 'duration_type'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'lens_nearby_spots',
        constraint: 'lens_nearby_spots_lens_id_nearby_spot_id_key',
        columns: ['lens_id', 'nearby_spot_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'lenses',
        constraint: 'lenses_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'lenses',
        constraint: 'lenses_companion_interest_key',
        columns: ['companion', 'interest'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'nearby_spots',
        constraint: 'nearby_spots_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'seasons',
        constraint: 'seasons_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'spots',
        constraint: 'spots_slug_key',
        columns: ['slug'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'course_spots',
        index: 'course_spots_course_id_idx_297aaf4e',
        columns: ['course_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'course_spots',
        index: 'course_spots_spot_id_idx_f74e1993',
        columns: ['spot_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'courses',
        index: 'courses_lens_id_idx_92db1f93',
        columns: ['lens_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'lens_nearby_spots',
        index: 'lens_nearby_spots_lens_id_idx_92db1f93',
        columns: ['lens_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'lens_nearby_spots',
        index: 'lens_nearby_spots_nearby_spot_id_idx_e235bfcd',
        columns: ['nearby_spot_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'red_pandas',
        index: 'red_pandas_father_id_idx_f695c6a4',
        columns: ['father_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'red_pandas',
        index: 'red_pandas_mother_id_idx_51713653',
        columns: ['mother_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'red_pandas',
        index: 'red_pandas_spot_id_idx_f74e1993',
        columns: ['spot_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'todays_finds',
        index: 'todays_finds_lens_id_idx_92db1f93',
        columns: ['lens_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'todays_finds',
        index: 'todays_finds_season_id_idx_b4a5a2c6',
        columns: ['season_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'todays_finds',
        index: 'todays_finds_spot_id_idx_f74e1993',
        columns: ['spot_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'course_spots',
        foreignKey: {
          name: 'course_spots_course_id_fkey',
          columns: ['course_id'],
          references: { schema: 'public', table: 'courses', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'course_spots',
        foreignKey: {
          name: 'course_spots_spot_id_fkey',
          columns: ['spot_id'],
          references: { schema: 'public', table: 'spots', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'courses',
        foreignKey: {
          name: 'courses_lens_id_fkey',
          columns: ['lens_id'],
          references: { schema: 'public', table: 'lenses', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'lens_nearby_spots',
        foreignKey: {
          name: 'lens_nearby_spots_lens_id_fkey',
          columns: ['lens_id'],
          references: { schema: 'public', table: 'lenses', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'lens_nearby_spots',
        foreignKey: {
          name: 'lens_nearby_spots_nearby_spot_id_fkey',
          columns: ['nearby_spot_id'],
          references: { schema: 'public', table: 'nearby_spots', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'red_pandas',
        foreignKey: {
          name: 'red_pandas_spot_id_fkey',
          columns: ['spot_id'],
          references: { schema: 'public', table: 'spots', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'red_pandas',
        foreignKey: {
          name: 'red_pandas_father_id_fkey',
          columns: ['father_id'],
          references: { schema: 'public', table: 'red_pandas', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'red_pandas',
        foreignKey: {
          name: 'red_pandas_mother_id_fkey',
          columns: ['mother_id'],
          references: { schema: 'public', table: 'red_pandas', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'todays_finds',
        foreignKey: {
          name: 'todays_finds_season_id_fkey',
          columns: ['season_id'],
          references: { schema: 'public', table: 'seasons', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'todays_finds',
        foreignKey: {
          name: 'todays_finds_spot_id_fkey',
          columns: ['spot_id'],
          references: { schema: 'public', table: 'spots', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'todays_finds',
        foreignKey: {
          name: 'todays_finds_lens_id_fkey',
          columns: ['lens_id'],
          references: { schema: 'public', table: 'lenses', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
