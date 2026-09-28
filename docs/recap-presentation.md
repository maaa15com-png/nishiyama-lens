# Recapの写真付き振り返り
- Server ComponentのページとRecapSummaryで構成。画像は既存CoursePhotoの小さなClient Componentを再利用。
- 代表写真・LENS・選んだコース・Spot写真一覧・丸い発見テーマカード・既存次のCTA・NearbySpot・別LENS提案。
- 訪問履歴、歩行履歴、達成件数、チェックマークは追加しない。未訪問の季節という断定も追加しない。
- 季節解決後のcourseSpotsを利用。getRecapは既存Find取得グループからfindSpotIdsを返し、テーマとSpotを照合。getTodaysFinds自体の条件・返却値は変更しない。
- Course画像表示ルールを再利用。公式画像の出典・CCライセンスを保持し、生成画像には表記とalt、画像がない場合は装飾を表示。
- 別LENS画像はテーマの生成イメージであり、そのコースの実景ではない。推薦順・上限・query処理は維持。
- CoursePhotoCreditを抽出してCourse詳細とRecapで共有。
- DB、schema、Migration、Seedに変更なし。Server Component・GlobalHeader・日本語中心の案内を維持。

## 検証
全184テストPASS。TypeScript、変更ファイルESLint、npm run build、git diff --check PASS。Chromeで320/375/768/1280/1440px：実DBのRecap画像8枚、横スクロールなし、NearbySpot・別LENS各1セクション、query付きCourse復帰、focus-visibleを確認。画像取得失敗fallbackとFind 0件非表示も確認。320/1440pxの画面を目視確認。iPhone Safari実機は未確認。
