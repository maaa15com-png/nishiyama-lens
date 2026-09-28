# NISHIYAMA LENS

> 見方を変えると、公園は旅になる。

**本番URL：** [https://nishiyama-lens.vercel.app](https://nishiyama-lens.vercel.app)

## アプリ概要

NISHIYAMA LENSは、福井県鯖江市の西山公園を、その人に合った視点（LENS）で楽しむためのWebアプリです。

「誰と行くか」×「何を楽しむか」の2つの質問から、おすすめのLENSとコースを提案します。訪問前に楽しみ方を見つけ、現地ではマップとスポット情報を使って散策し、帰ったあとには別の季節や視点でも訪れたくなる体験を目指しています。

## 解決したい課題

西山公園には、レッサーパンダ、つつじ、紅葉、写真スポット、子どもと遊べる場所など、さまざまな魅力があります。一方で、初めて訪れる人には「自分に合う楽しみ方」や「限られた時間でどこを回るか」が分かりにくいことがあります。

同行者や興味に合ったコースと、現地で必要な情報をつなげることで、公園を訪れるきっかけづくりと散策を支援します。

## 主な機能（実装済み）

- **LENS診断**：同行者と興味を選択。公開中のLENS・コースに応じて選択肢を表示します。
- **診断結果・コース選択**：回答に合うLENSと、所要時間別のコースを表示します。
- **おすすめコース**：回る順番、スポット、滞在・移動時間の目安を確認できます。季節に応じたスポットの切り替えにも対応しています。
- **現地マップ**：Mapboxでコースのスポットを表示。現在地の取得、トイレ・駐車場などの施設情報の表示に対応しています。
- **スポット詳細**：写真、説明、料金・設備など、登録されている情報や公式サイトへのリンクを確認できます。
- **発見と振り返り**：「今日の発見」で写真を撮影・選択してプレビューし、コースの振り返りや別のLENSの提案へ進めます。選択した写真はブラウザ内の一時表示で、サーバーへのアップロード・永続保存は行いません。
- **関連情報**：周辺スポットのおすすめ、公園紹介、お知らせ・イベントの一覧と詳細を表示します。

## 6画面MVP

提出時の中心となる画面は次の6つです。

| 画面 | ルート | 内容 |
| --- | --- | --- |
| トップ | `/` | アプリ紹介、診断への入口、おすすめLENS |
| LENS診断 | `/lens` | 同行者・興味の2問に回答 |
| 診断結果 | `/lens/result?companion=…&interest=…` | LENSと所要時間別コースの提案 |
| おすすめコース | `/courses/[id]` | コースの概要と回るスポット |
| 現地マップ | `/map?courseId=…` | 選択したコースと施設情報の地図 |
| スポット詳細 | `/spots/[slug]` | スポットの楽しみ方と詳細情報 |

`[id]`・`[slug]`・`…` はDB内のデータや診断の回答に置き換わります。診断からリンクをたどると、必要な値を含むURLに移動できます。

6画面以外にも、振り返り（`/recap?courseId=…`）、公園紹介（`/park`）、お知らせ（`/news`・`/news/[id]`）、イベント（`/events`・`/events/[id]`）の画面を実装しています。

## 主要な画面遷移

```text
トップ → LENS診断 → 診断結果 → おすすめコース → 現地マップ → スポット詳細
現地マップ → おすすめコース（戻る）

スポット詳細の「今日の発見」 → 振り返り → 次のコース・別のLENS
```

「今日の発見」や振り返りへの導線は、対象データ・コースの情報がある場合に表示されます。

## 使用技術

| 分野 | 技術・用途 |
| --- | --- |
| フレームワーク | Next.js 16.3.4（App Router） |
| UI | React 19.2.8、TypeScript 5 |
| スタイル | Tailwind CSS 4、CSS Modules |
| データアクセス | Prisma 8 RC（Prisma Next）、`@prisma/orm-postgres` |
| データベース | Supabase PostgreSQL（本番） |
| 地図 | Mapbox GL JS 3 |
| 日時処理 | temporal-polyfill |
| テスト・静的確認 | Node.js標準テストランナー、TypeScript、ESLint 9 |
| デプロイ | Vercel |

DBアクセスは `@prisma/orm-postgres/runtime` と生成済みの契約ファイル（`prisma/schema.json`・`prisma/schema.d.ts`）を使用しています。モデル定義は `prisma/schema.prisma`、接続設定は `prisma.config.ts` にあります。

## システム構成

```text
ブラウザ → Next.js（Vercel） → Prisma Next → Supabase PostgreSQL
   └────→ Mapbox（地図表示）
```

画面は `src/app/`、UI部品は `src/components/` に配置しています。サーバー側のデータ取得処理は `src/lib/server/` にあり、診断結果取得用のAPIは `/api/lens/recommendation` にあります。DB接続情報はサーバー側で使用します。

## ローカル環境のセットアップ

### 1. 必要なものを用意する

- Node.js **22.18.0以上**とnpm（導入済みPrisma CLIの要件）
- このリポジトリのローカルコピー
- 開発用PostgreSQLデータベース（Supabase PostgreSQLも利用可能）
- 地図表示用のMapbox公開アクセストークン

### 2. 依存関係をインストールする

リポジトリのルートで実行します。

```bash
npm ci
```

インストール時には `postinstall` によりPrismaスキルの同期処理が実行されます。

### 3. 環境変数を設定する

リポジトリのルートに `.env` を作成し、下記の環境変数を自身の開発環境の値で設定してください。Next.jsと、`dotenv/config` を読み込むPrisma設定・Seedで使用します。

`.env*` は `.gitignore` の対象です。秘密値をリポジトリに追加しないでください。

### 4. DBを準備する

次の「Migration・Seed」の手順を確認し、スキーマ適用済みの開発用DBへ初期データを投入してください。**現状はMigration実行用のnpm scriptがないため、空のDBからの準備は、このREADMEのnpmコマンドだけでは完結しません。**

### 5. 開発サーバーを起動する

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開きます。

ビルドしたアプリをローカルで起動する場合は、環境変数とDBの準備後に実行します。

```bash
npm run build
npm run start
```

## 必要な環境変数

| 変数名 | 用途 |
| --- | --- |
| `DATABASE_URL` | サーバー・Prisma設定・各SeedからPostgreSQLへ接続するための接続情報 |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | ブラウザでMapboxの地図を表示するための公開アクセストークン |

Mapboxの変数が未設定の場合、地図の代わりに案内を表示します。`NEXT_PUBLIC_` 付きの値はブラウザに公開されるため、Mapboxの公開用トークンを使用してください。

コードでは `NODE_ENV` もDB接続インスタンスの再利用判定に使用しています。通常はNext.jsが実行コマンドに応じて設定するため、手動設定は不要です。

## Migration・Seed

### Migration（DBのテーブル構造を準備する）

Migrationファイルは `migrations/app/` にあり、初期テーブル、季節別コーススポット、公園施設、授乳室・おむつ交換情報の変更が含まれています。

**本番DBにはMigration・Seedともに適用済みです。**

新しい開発用DBには、Seedより先に既存Migrationの適用が必要です。ただし、現在の `package.json` にはMigration実行用のnpm scriptがありません。そのため、ここでは未定義のDBコマンドを掲載していません。空のDBから始める場合は、リポジトリ管理者に既存Migrationの適用手順を確認してください。

### Seed（初期データを投入する）

**全Migrationを適用した新規の開発用DB**を対象に、`.env` の接続先を確認してから、次の順で実行します。基本データ、公式スポット、追加コース、周辺スポットとの関連など、後続のSeedが参照するデータを先に作成します。

```bash
npm run db:seed
npm run db:seed:official-spots
npm run db:seed:official-nearby-spots
npm run db:seed:issue-47
npm run db:seed:park-facilities
npm run db:seed:spot-images
npm run db:seed:issue-52
```

`db:seed` には既存データを更新する処理もあります。この一括手順は新規開発環境向けです。既存DBへの追加投入は、対象Seedの処理・前提データを確認してください。本番を閲覧するだけなら、MigrationやSeedの再実行は不要です。

## 利用可能な主要npm scripts

| コマンド | 用途 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用ビルドを作成 |
| `npm run start` | 作成済みの本番用ビルドを起動 |
| `npm run lint` | ESLintによる確認 |
| `npm run db:seed` | 基本のLENS・コース・スポットなどを投入 |
| `npm run db:seed:official-spots` | 公式情報に基づく園内スポットを追加 |
| `npm run db:seed:official-nearby-spots` | 公式情報に基づく周辺スポットを追加 |
| `npm run db:seed:issue-47` | 追加LENS・コース・季節別スポットなどを投入 |
| `npm run db:seed:park-facilities` | トイレ・駐車場などの施設情報を投入 |
| `npm run db:seed:spot-images` | スポット画像情報を反映 |
| `npm run db:seed:issue-52` | LENSと周辺スポットのおすすめ関連を追加 |

## テスト・品質確認

提出時点で共有されている確認結果は次のとおりです。

| 項目 | 結果 |
| --- | --- |
| 全テスト | 192件PASS |
| TypeScript | PASS |
| 本番用build | PASS |
| 本番の6画面MVP | 表示確認済み |
| 全体Lint | 提出を妨げない既知の指摘あり |

テストは `tests/` にあります。テスト・型チェック専用のnpm scriptは未定義のため、直接実行します。

```bash
node --test tests/*.test.mjs
npx tsc --noEmit --incremental false
npm run build
npm run lint
```

上記の結果はREADME更新時の再実行結果ではなく、提出に向けた確認済み情報です。全体Lintを含めて「すべてPASS」という状態ではありません。

## デプロイ情報・本番の確認方法

- デプロイ先：Vercel
- データベース：Supabase PostgreSQL
- 本番URL：[https://nishiyama-lens.vercel.app](https://nishiyama-lens.vercel.app)
- 本番DBのMigration・Seed：適用済み

本番URLを開き、「LENS診断 → 診断結果 → おすすめコース → 現地マップ → スポット詳細」の順に進むと、トップを含めた6画面を確認できます。IDを含むURLを手入力する必要はありません。現在地機能を試す場合は、ブラウザの位置情報アクセスを許可してください。

同じ構成を別環境へデプロイする場合は、Vercelの環境変数にも `DATABASE_URL` と `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` を設定します。Mapboxの公開変数はビルドに取り込まれるため、変更後は再ビルドが必要です。現在の `build` scriptはNext.jsのビルドのみで、Migration・Seedは実行しません。

## 今後の展望

「別の季節にも行ってみたい」と思える体験に向けて、季節ごとの見どころやLENS・コースの内容をさらに充実させていくことを目指します。これは今後の方向性であり、追加機能や公開時期を確約するものではありません。

## 関連資料

企画・設計・各機能の検討記録は [docs/](./docs/) にあります。背景は [コンセプト](./docs/concept.md) と [PRD](./docs/prd.md) を参照してください。資料内の計画と、現在の実装済み機能は区別してください。

## ライセンス

[MIT License](./LICENSE)
