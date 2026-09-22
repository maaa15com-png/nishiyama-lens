# Issue #50 園内・周辺の施設Map

## 調査と設計比較

| 案 | 評価 | 採用 |
| --- | --- | --- |
| A: ParkFacility独立テーブル | Spot/CourseSpot/Season/Lens/NearbySpotとrelationを持たず、設備の公開・位置を独立管理できる | 採用 |
| B: Spot/NearbySpot流用 | Spotは体験・Course・Find、NearbySpotは園外回遊・Lens推薦。既存の意味や取得条件を混ぜる | 不採用 |

既存Spotはname/slug/category/座標/設備フラグ等を持つが、hasToilet等はSpotの属性であり、個々の設備位置ではない。NearbySpotも観光回遊用途。いずれの値も今回変更しない。

MapはgetCourseMap→getCourseDetail→resolveCourseSpotsを維持。番号はCourseSpot.sortOrder、GPSのfindNearestSpotとfitBoundsはCourse Spot配列を使用。FacilityはgetParkFacilitiesから別配列で取得し、独立したFacilityControlsで描画する。Facilityには番号・Courseへのrelation・Spot詳細URLを持たせない。

| 表示案 | 評価 | 採用 |
| --- | --- | --- |
| 常時表示 | 8トイレのピンが狭い画面でCourseピンと重なる | 不採用 |
| 簡単な種別切り替え | 地図外の44px以上ボタン2個で表示切替。Courseは常時表示 | 採用 |

初期表示はCourseのみ。トイレ・駐車場はそれぞれON/OFF。明示的な切替時のみCourseと表示対象施設が収まる範囲へfitBounds。GPS取得は従来どおりCourseと現在地だけを対象とする。nearest Facilityは未実装。

施設一覧から対象地点を開くこともでき、Courseピンと重なったトイレにも到達できる。Popupを開くと施設を中央寄りに配置して狭幅で見切れを防ぐ。地図が利用できない場合も一覧・説明・公式URLは参照できる。

## schema / Migration / Seed

- ParkFacility: id, name, nameEn, type, latitude, longitude, description, descriptionEn, externalUrl, isPublished, createdAt, updatedAt。
- 種別は根拠付き登録データのあるTOILET/PARKINGのみ。REST_AREA等の空の種別は先行追加しない。
- 座標は既存方式のNumeric(9,6)。緯度経度範囲check、name×type unique、UUID主キー。
- nameEnは公式CSV原文（括弧表記も含む）。駐車場nameEnと全descriptionEnはNULL。画像・営業時間カラムの先行追加なし。
- バリアフリートイレとベビーベッドは該当トイレのdescriptionに集約。ベビーベッドをおむつ交換台と同一視しない。空欄は不明であり「なし」に変換しない。
- migrations/app/20260922T1726_add_park_facilities: 新規tableとuniqueだけの2additive操作。座標・種別checkはCREATE TABLEに含まれる。既存tableのALTER/UPDATE/DELETEなし。
- Prisma 8: contract emit → migration plan --from 1ad7a57c44455864fb784b70f742c0d8e9937ff62dda7d5bf568fefea8d90998 → db migrate。
- コマンド: npm run db:seed:park-facilities。固定UUID・transaction・createのみ。識別子衝突はrollback、既存行の編集内容/非公開状態を上書きしない。

## 公式データと利用条件

- 市公式ポータル https://data.city.sabae.lg.jp/opendata-list/ から公式CKANに到達。作者は福井県鯖江市、CC BY 2.1。UI内に「データシティ鯖江」の出典リンクを掲載。
- トイレ: https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-202-odp → https://data.odp.jig.jp/viewcsv/jp/fukui/sabae/202.csv （Shift_JIS）。
- 駐車場: https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-953-odp → https://data.odp.jig.jp/viewcsv/jp/fukui/sabae/953.csv （UTF-8）。旧201.csvとも座標一致。
- 選定10行の原文、取得日時、元CSV全体のSHA256をdocs/sources/issue-50-facilities.jsonへ保存。Seed実行時に外部取得はしない。
- 施設名と同じCSV行の緯度経度のみ採用。Spot位置・公園代表点・地図画像・第三者ジオコーディングは不使用。施設位置であり入口・段差のない経路・測量精度を保証しない。
- 嚮陽会館前駐車場の現在の利用条件: https://www.city.sabae.fukui.jp/about_city/kekaku_torikumi/fukugo/tyuusyajyou.html （2026-08-21更新、工事中も利用可能、出入口変更・台数減少）。descriptionとexternalUrlに反映し、古いCSVの台数や料金を転載しない。
- ふれあい広場の公式案内: https://www.city.sabae.fukui.jp/kurashi_tetsuduki/kokyokotsu/chushajo_churinjo/shieichushajo.html 。

## 登録施設

| name | type | UUID | latitude | longitude |
| --- | --- | --- | --- | --- |
| 西山公園(中央広場) | TOILET | 36d7f379-e387-4636-aa3c-12f9c64c7b3f | 35.949591 | 136.182136 |
| 西山公園(八角(お祭り広場北)) | TOILET | 70361abc-2dc8-4178-b0ab-613e4bde60d6 | 35.950859 | 136.182765 |
| 西山公園(冒険の森) | TOILET | 86ed4e64-3b16-4e12-bf3c-5d72fe72836f | 35.951945 | 136.183205 |
| 西山公園(西山動物園) | TOILET | 586282f7-ea81-4520-afd2-197f04073ba3 | 35.950538 | 136.180952 |
| 西山公園(嚮陽庭園(中段)) | TOILET | 01a4490e-9c05-41f1-a6dd-a0fc7003b6f9 | 35.950998 | 136.184696 |
| 西山公園(嚮陽庭園(北の庭)) | TOILET | e9b0e36c-f3eb-46ac-9eba-e07b3bb95146 | 35.951988 | 136.184546 |
| 西山公園(嚮陽庭園(松堂亭)) | TOILET | a6446adb-62b0-4e1f-8d27-5538949ee707 | 35.950752 | 136.184111 |
| 道の駅西山公園 | TOILET | 96902ac7-2229-42d6-a55e-db58a0125caf | 35.949262 | 136.180450 |
| 嚮陽会館前駐車場 | PARKING | dad3655a-0705-42a3-be69-78a00a68d1b3 | 35.947771 | 136.180548 |
| ふれあい広場駐車場 | PARKING | 4c4af182-d20a-4eac-93b6-b6044d6671b2 | 35.947841 | 136.181970 |

## 保留・未登録

- 休憩所: 西山公園公式施設案内に上段の庭の四阿、松堂庵などが存在。中央広場休憩所も市公式の公募物件資料に記載。ただし設備そのものに対応する座標は確認できず、Spotやトイレの座標を流用しない。松堂庵は既存Spotとして維持し重複登録しない。
  - https://www.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/nishiyama/Nishiyama-Shisetsu.html
  - 市都市公園自動販売機設置事業者募集の公募物件説明書（2026年度）: https://www.city.sabae.fukui.jp/users/kikaku/keiyaku/各課要項等/04_都市計画課/02_都市公園/02_公募物件説明書（都市公園）.pdf
- AED: https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-112-odp の112.csvを調査。嚮陽会館の地点はあるが館内工事・全館利用不可の市公式説明があるため採用しない。市役所は今回の公園内・近接設備範囲外。園内AED位置を推測しない。
  - https://www.city.sabae.fukui.jp/about_city/shichonoheya/shoshinhyomei/reiwa8/Sogo01202605261.html
- 嚮陽会館館内トイレも上記工事のため除外。道の駅駐車場はSpot代表点を流用せず今回は保留。
- 授乳室・おむつ交換台: 対象トイレCSVの対応項目は空欄。ベビーベッドの記載から推測して追加しない。
- 西山公園(冒険の森)、西山公園(嚮陽庭園(松堂亭))等の名称はトイレデータの地点名を原文維持。体験Spotの冒険の森・松堂庵とは別種別・別座標。

## 検証記録

- Seed初回: inserted10 / skipped0 / updated0。2回目: inserted0 / skipped10 / updated0。Facility全カラム（時刻含む）一致。
- Migration前の12既存モデルを全行保存。適用・Seed2回後も全行全カラム一致。Lens8 / Course24 / CourseSpot53 / CourseSpotSeason33 / Season3 / TodaysFind6 / Spot10 / NearbySpot8 / LensNearbySpot1 / RedPanda7 / News0 / Event0。
- 追加回帰テスト: 公式座標・type・UUID・二重登録防止・既存値維持・衝突rollback・公開条件・不正座標/URL除外・Course配列への非混入。

- 全93テスト（既存87＋追加6）PASS。TypeScript / 変更ファイルESLint / npm run build / git diff --check PASS。Prisma db verifyもPASS。
- 実DBの公開施設取得10件。既存全24CourseのMap入力を4月・5月・8月・11月の96ケースで変更前スナップショットと比較し完全一致。
- Chromium本番build、320/375/768/1280/1440px: 全10施設のPopupが地図領域内、44px marker、2種filter切替、Courseの番号維持、横スクロールなし。Course4＋施設10の同時表示を確認。
- GPSテスト位置（中央広場トイレ座標）で推薦はCourse Spotのまま。施設ON/OFFでも推薦内容が変わらない。
- Course PopupのSpot URLはcourseId/lang/companion/interest/foo=1&foo=2を維持。Headerメニュー/Escape/focus戻しを全幅で確認。
- native button、施設名＋種別のaria-label、filterのaria-pressed、Tab/Enter/Space/focus-visibleを確認。施設OFF時は開いたPopupも閉じる。
- WebGL非対応を再現し、filter disabledでも10施設一覧・公式リンクを参照できることを確認。
- 320px画面と施設Popupのスクリーンショットを目視確認。ブラウザpageerrorなし。

## 残る課題

- iPhone Safari実機、GPS実測は未検証。ブラウザGPSはテスト位置を使用。
- 施設情報は公式データの取得時点の情報。臨時閉鎖・駐車場満空・リアルタイム設備状態は自動同期しない。
- 休憩所・園内AED・授乳室・おむつ交換台等は、施設固有の位置と利用条件を確認できた段階で別途追加する。
- 車椅子で到達できる経路やトイレの利用時間が空欄の地点は推測しない。nearest Facility・徒歩経路・所要時間は未実装。
