# Issue #61: アクセスごとのHero画像

## 最終仕様
候補は公式ツツジ、公式紅葉、ユーザー提供の「木漏れ日のレッサーパンダ」生成画像の3枚。トップの01・サンプル用パンダとは別画像。
公式画像の出典・CC BY 2.1 JPは spot-images.json を参照する。生成画像は home-generated-images.json に同じ画像情報形式で記録し、home-photos.ts で共通参照する。Seedが読み込む公式Spot画像配列へ生成画像を入れない。DB・Seed・schema・Migrationは変更しない。

## 選択と連続重複回避
初回は候補から選択、次のリロードは同一タブの直前の表示成功画像を除外する。単一候補、削除済み候補、0件を考慮。
sessionStorage の nishiyama-lens:last-hero-image に保存。成功画像を history.state にも保存し、sessionStorageが使えない場合の補助とする。Nextの既存history.stateは展開して維持し、URLや履歴件数を変更しない。
既存処理はsessionStorage失敗時に例外を無視して履歴なしで選択していたため、この条件では連続表示が起こり得た。通常保存可能な環境の失敗原因やユーザー実機の原因を特定したものではない。
両方の永続化手段が拒否される環境ではリロード間の重複回避は保証できないが、画像とCSS fallbackは維持する。

## SSR / Strict Mode / fallback
ブラウザdocumentごとのストアで一度だけ選択。Strict Modeの購読・解除・再購読では再抽選しない。
useSyncExternalStoreのserver snapshotはnull。サーバーとhydrate初回は同じCSS風景。本文・コピー・CTAはServer Componentのまま。
選択画像のみNext Imageで取得し、成功後に表示、失敗時はCSS風景を残す。JS無効でも本文とCTAを維持。
生成画像のクレジットに外部ライセンスリンクは作らず、「AI生成イメージ」と実景写真ではない旨を表示する。パンダのobject-positionは30% 40%、公式2枚は中央。保存画像はトリミングせず、表示枠だけobject-fit: coverを使う。

## 検証
selector、Strict Mode相当再購読、SSR、storage例外、画像失敗、historyによる10回の重複回避をテスト。
全169テスト、TypeScript、変更ファイルESLint、本番buildを実施。
ブラウザ結果は作業報告を参照。iPhone Safari実機は未確認。

## 最終ブラウザ確認
Chromeで320/375/768/1280/1440px：5画像読み込み成功、横スクロールなし。320/1440pxのカード・サンプル・生成Heroのスクリーンショットで主題・ラベルを目視確認。通常とsessionStorage拒否時に各10回リロード、連続重複なし・3候補出現。JS無効・画像取得失敗時のfallback、Enterで出典開閉、Tabリンク移動とfocus-visibleを確認。hydration警告・runtime errorなし。iPhone Safari実機は未確認。

検証環境の制約：PostgreSQL 127.0.0.1:5432 接続拒否により、季節おすすめ取得は既存の非表示fallbackで動作。上記エラーなしはブラウザ側の評価であり、DB取得を含む実表示は未確認。DB設定・データは変更していない。
