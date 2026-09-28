# Issue #61: トップカード・サンプル画像

## 割り当て
|場所|画像|
|---|---|
|01 動物に会う|generated-panda-bamboo.jpg（竹の葉を味わうレッサーパンダ）|
|02 四季を感じる|nishiyama-azaleas.jpg（既存公式ツツジ）|
|03 思いきり遊ぶ|generated-woodland-playground.jpg（森の冒険遊び場で遊ぶ子どもたち）|
|04 のんびり歩く|generated-green-path.jpg（木漏れ日の緑豊かな小径）|
|FAMILY × PANDA|generated-panda-walking.jpg（緑の森を歩くレッサーパンダ）|
|Heroのパンダ|generated-panda-sunlight.jpg（木漏れ日のレッサーパンダ）|

## メタデータと権利表示
提供済み5枚の生成PNGを使用。西山公園の実際の施設・個体の写真とは扱わない。個体名を推測しない。
既存spot-images.jsonはDB用Seedが全件読み込むため、その配列に生成画像は混ぜない。
関連メタデータ home-generated-images.json で元ファイル名、生成画像種別、title、alt、加工内容、元/保存SHA256、寸法を記録。既存home-photos.tsを通じて公式画像と同じ表示処理に渡す。
生成画像のsourceUrl/license/licenseUrlはnull。市の著作権表記やCC BYを流用せず「ユーザー提供のAI生成画像」と明示。権利放棄・第三者再利用許可を主張するものではない。
公式ツツジ画像の出典・ライセンス・リンクは維持。公式Spot詳細の画像も変更しない。

## 加工・表示
public/images/spots/ にJPEG品質85で保存。長辺1600px以下、拡大なし、トリミングなし。
1448px原稿は1448pxのまま、1672px原稿は1600pxに縮小する。
既存のカード寸法・丸み・番号・余白・文言・overlayを維持。表示枠でのみcover切り抜きする。
読み込み完了まで従来イラスト、失敗時もイラストを残す。本文は画像なしでも理解できる。
生成画像には小さなAI生成イメージ表示を追加し、クレジット欄で実景ではない旨を説明する。サンプルの固定ラベルはNISHIYAMA LENSとする。

## 検証
配置・5画像hash・公式ライセンスとの分離・JP/EN・query保持・Hero再抽選の回帰テスト。全169テスト。
TypeScript、変更ファイルESLint、本番buildを実施。DB・Seed・schema・Migration変更なし。
ブラウザ結果は作業報告を参照。iPhone Safari実機は未確認。

## 最終ブラウザ確認
Chromeで320/375/768/1280/1440px：5画像読み込み成功、横スクロールなし。320/1440pxのカード・サンプル・生成Heroのスクリーンショットで主題・ラベルを目視確認。通常とsessionStorage拒否時に各10回リロード、連続重複なし・3候補出現。JS無効・画像取得失敗時のfallback、Enterで出典開閉、Tabリンク移動とfocus-visibleを確認。hydration警告・runtime errorなし。iPhone Safari実機は未確認。

検証環境の制約：PostgreSQL 127.0.0.1:5432 接続拒否により、季節おすすめ取得は既存の非表示fallbackで動作。上記エラーなしはブラウザ側の評価であり、DB取得を含む実表示は未確認。DB設定・データは変更していない。
