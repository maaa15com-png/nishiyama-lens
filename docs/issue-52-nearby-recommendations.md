# Issue #52 — LENSから鯖江の次の楽しみ方へ

実装日: 2026-09-24。既存NearbySpot 8件・Lens 8件・LensNearbySpot 1件を事前に確認。UUID・slug・公開状態を照合し、関連の重複・孤立なし。新規施設や営業情報を追加せず、関係9件だけを追加した。

## 選定と順序

距離・現在地・ランキングではなく、LENSのテーマを公園後の歴史・文化・建築・ものづくりへつなげる編集上の提案。施設での撮影可否や見頃、当日の開館を保証するものではない。

| LENS | 順番 | NearbySpot | 選定理由（DB recommendationReason） | 関連UUID |
| --- | ---: | --- | --- | --- |
| FAMILY × PANDA | 1 | 鯖江市まなべの館 | 既存の親子向け文化・歴史の理由を全値維持 | f268ac2d-f6c5-46a2-a866-1bfbbd72e8ba |
| FAMILY × SEASON | 1 | 地蔵橋 | 公園の季節散策のあと、親子で橋の歴史や地蔵の伝承に触れる立ち寄り先として。 | 91fe3835-cbc2-45ea-85fd-f2b5f821684a |
| FAMILY × SEASON | 2 | 鯖江市まなべの館 | 季節の景色を楽しんだあと、親子で鯖江の芸術・歴史・文化に触れるきっかけとして。 | bd0bcf17-8fe1-4779-8b5e-4815ca5dd767 |
| COUPLE × SEASON | 1 | 本山誠照寺 | 季節散策のあと、ふたりで寺院の建築や鯖江の歴史にも目を向ける立ち寄り先として。 | 229daa4c-e49e-4023-b4ca-c98e2960c568 |
| COUPLE × SEASON | 2 | 萬慶寺 | ふたりの散策に、鯖江藩主・間部家ゆかりの歴史に触れる楽しみを添える立ち寄り先として。 | 50422b69-7b38-464f-92ee-6a5d93f60084 |
| COUPLE × SEASON | 3 | 恵美写真館洋館・表門 | ふたりでまちなみの建築に目を向ける次の楽しみとして。内部非公開で、見学は事前問い合わせが必要です。 | bfea8021-0ca1-49cb-892c-76d4734d829d |
| FRIENDS × PHOTO | 1 | 地蔵橋 | 写真を楽しむまち歩きに、橋の姿と地蔵の伝承を知るきっかけを添える立ち寄り先として。 | 0f52ca7b-9d1c-4ba5-9f5a-c8be9d926015 |
| FRIENDS × PHOTO | 2 | めがねミュージアム | 友人と鯖江らしい題材を探しながら、めがねの歴史やものづくりに触れる立ち寄り先として。 | 0236ca84-99d9-4c82-b5e8-a8851a519723 |
| SOLO × PHOTO | 1 | 本山誠照寺 | ひとりで建築の形や歴史に目を向け、写真を楽しむまち歩きの題材を探す立ち寄り先として。 | afb03897-7d48-4176-bebf-cea1ff6e2019 |
| SOLO × PHOTO | 2 | 王山古墳群 | 史跡公園を自分のペースで散策し、景色や土地の歴史に目を向ける立ち寄り先として。 | 906d7597-aac3-43b0-8f60-1b6f21503c59 |

兜山古墳および他のLENSは今回追加関連なし。施設を全件表示する設計にはしない。親子向けのまなべの館は公園内にあるが、文化への次の入口として既存方針を維持する。すべてが公園外だとは表示しない。

## 公式情報・既存値の扱い

2026-09-24に公式情報を再確認。場所・説明の基礎情報はIssue #48の記録と既存DBを優先し、NearbySpot自体は一切更新していない。以下は推薦理由の背景資料であり、見学条件・営業時間のリアルタイム判定ではない。

- 本山誠照寺: https://www.jyosyoji.org/
- めがねミュージアム: https://www.megane.gr.jp/museum/
- 地蔵橋: https://www.fuku-e.com/spot/detail_1030.html
- 萬慶寺: https://www.fuku-e.com/spot/detail_1100.html
- 鯖江市まなべの館: https://www.city.sabae.fukui.jp/kosodate_kyoiku/manabenoyakata/manabenoyakata.html
- 王山古墳群: https://www.city.sabae.fukui.jp/kanko/sightseeing/ozankohun.html
- 恵美写真館洋館・表門: https://www.city.sabae.fukui.jp/kanko/sightseeing/emisyasinkan.html

恵美写真館は市の案内に見学問い合わせが必要との記載がある。既存descriptionの「内部非公開で、見学は写真館への事前問い合わせが必要です。」を全文表示する。推薦理由にも条件を残し、自由な内部見学や撮影を約束しない。営業時間・距離・徒歩時間を推測して追加しない。

## schema・Seed

既存LensNearbySpotのid / lensId / nearbySpotId / priority / recommendationReason / recommendationReasonEnのみを利用。既存unique(lensId, nearbySpotId)とFKを使用し、schema・Migrationなし。

コマンド: npm run db:seed:issue-52

- prisma/issue-52-data.mtsに9件の固定UUID、対象ID・slug・LENS種別、推薦理由を記録。UUIDは執筆時に生成し、実行時には生成しない。
- prisma/issue-52-seed.mtsはtransaction内のINSERTのみ。既存pairは別UUIDでも尊重し、priority・理由・英訳等を更新しない。
- 固定UUID衝突、対象欠落、IDとslug/companion/interestの不一致は全体rollback。新規関連先が非公開でも止める。既存関連の公開状態をseedで戻さない。
- recommendationReasonEnは新規9件ともNULL。Recap本文の日本語中心方針に合わせ、無理に全体英訳しない。
- 既存の汎用Seedは実行しない。新規環境では既存Lens / NearbySpot導入後に専用Seedを実行する。

## 表示・取得

既存Recap末尾のNearbySpotsを再利用し、見出しを「このLENSなら、次は鯖江のまちへ」に変更。現在LENS・Course・TODAY'S FIND・既存の次のCTAは変更しない。別セクションを追加して二重表示にしない。

getNearbySpots(lensId)は公開Lensの関連だけを取得し、priority昇順→関連UUID昇順で安定表示。非公開・欠落NearbySpotを除外してから最大3件へ絞る。0件・存在しないLens・非公開Lens・不正UUIDは空セクションを作らない。priorityは編集順であり、距離順ではない。UIにLENS別の施設分岐はない。

カードに名称・カテゴリ・全文の既存説明・DBの推薦理由・既存住所（ある場合）・公式案内リンクを表示する。NearbySpot詳細ページは存在しないため大きく新設せず、既存externalUrlを再利用する。不正URLやNULLはリンクを出さない。

各公式リンクのaccessible nameに施設名と別タブを含める。見出しはh2/h3、カードはli、リンクはnative a、focus-visibleと48px以上の領域を維持。カード全体をbutton化しない。

## Language・回帰範囲

Recapは既存どおり日本語中心。ENでもGlobalHeaderの日本語のみ案内とEnglish Guide導線を維持。外部公式サイトにアプリのlang等を勝手に付加しない。既存の内部CTA・query維持は変更しない。

#47の季節Course、#51のトップ推薦、#53の別LENS再発見、Map・GPS・Season判定には変更を加えない。

## 実DB検証

1回目: 追加9 / 更新0 / スキップ0。2回目: 追加0 / 更新0 / スキップ9。LensNearbySpot総数は1→10。

実行前・1回目後・2回目後で全13モデルの全値を比較。変更はLensNearbySpot新規9行のみ。既存FAMILY × PANDA関連のUUID・優先順・日英理由は一致。2回目は全行全値一致。NearbySpot総数8件、Lens8件、Course24件、CourseSpot53件、CourseSpotSeason33件、Spot10件、Season3件、TodaysFind6件、ParkFacility10件、RedPanda7件、News0件、Event0件を維持。

## 検証

- 全132テストPASS（既存120件＋今回12件）。Seedの重複防止・rollback・既存値維持、対象5LENS、非公開除外、0〜3件UI、Recap既存導線を検証。
- TypeScript、変更ファイルESLint、npm run buildはPASS。
- Chromiumの本番buildで320 / 375 / 768 / 1280 / 1440px、JP / EN、6パターンの計60ケースを確認。1〜3件表示、0件非表示、横スクロールなし、既存CTA、公式リンク、focus-visible、48px以上のリンク領域を確認。
- 320pxで長い名称・説明の折り返しを追加確認。恵美写真館の内部非公開・事前問い合わせ条件も表示を確認。
- iPhone Safari実機は未確認。

## 残る課題

iPhone Safari実機確認、各施設の見学条件の継続確認。撮影可否・混雑・営業時間は利用前に公式案内で確認する。季節ごとのまちなか推薦・距離順・位置連動・未登録施設・英語のRecap本文は今回の対象外。
