# Course専用生成イメージ
DB・Seed・schemaを変更せず、course-images.json / course-image.tsでpresentation fallbackを管理する。
冒険の森はユーザー添付、道の駅はbuilt-in image_genで生成。元ファイル名、SHA256、加工後SHA256をJSONに記録。
public/images/courses/ にJPEG品質85、長辺1600px以下、拡大なし、トリミングなしで保存。画面上のみobject-fit: cover。
Spot.imageUrlの安全な実画像を最優先し、その後にslug対応の生成画像、最後に葉のplaceholder。Spot詳細には適用しない。
Heroは全Spotから実画像を先に探し、ないときのみ生成画像を採用する。
生成画像は「生成イメージ」と実景写真ではないalt・読み上げ補足を表示。CC BY等を付与しない。画像取得失敗時は葉のplaceholder。

## 道の駅の生成プロンプト（built-in image_gen）
Create one landscape 4:3 photorealistic-style AI concept illustration for a Japanese park course website: a welcoming modest Japanese roadside station (michi-no-eki), warm timber facade, broad sloping tiled roof, entrance and a small paved forecourt, lush green low mountains immediately behind, leafy framing, soft sunny natural daylight, deep green and warm cream aesthetic. Building centered and fully legible in a card crop, eye-level three-quarter view, natural wood textures, calm family-friendly mood. This is an imagined building illustration, NOT a documentary depiction or exact reconstruction of Nishiyama Park's actual roadside station. No readable signs, no text, no logos, no watermark, no UI, no collage. Keep architecture plausible and modest. Deliver a single image for use as a course presentation fallback.

追加指示：seasonal-highlightのみ、DB画像がないとき既存公式ツツジ画像を代表イメージとして表示。公式出典・CC BY 2.1 JPを維持。季節解決後の別slug（桜等）には流用しない。DB更新なし。

## 検証
全179テストPASS、TypeScript、変更ファイルESLint、npm run build、git diff --check PASS。Chromeで320/375/768/1280/1440pxの実Courseを確認。実画像優先と生成画像のみHeroの計10ケース、画像読み込み成功、ラベル表示、横スクロールなし、focus-visible維持、runtime errorなし。320/1440pxはスクリーンショット目視確認。iPhone Safari実機は未確認。
