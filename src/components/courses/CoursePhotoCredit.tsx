import { getCoursePhoto as photoFor } from "@/lib/media/course-image";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174a36]";
export default function CoursePhotoCredit({ spot }: { spot: { slug: string; name: string; imageUrl: string | null } }) {
  const image = photoFor(spot).metadata;
  if (!image) return null;
  return <details className="px-5 py-2 text-xs leading-6 text-[#53665a]">
    <summary className={`min-h-11 cursor-pointer content-center ${focus}`}>写真の出典・ライセンス · 代表イメージ</summary>
    <p>{image.attribution}「{image.title}」</p>
    <div className="flex flex-wrap gap-x-4">
      <a className={`inline-flex min-h-11 items-center underline ${focus}`} href={image.sourceUrl}>画像の出典</a>
      <a className={`inline-flex min-h-11 items-center underline ${focus}`} href={image.licenseUrl}>{image.license}</a>
    </div>
    <p>{image.modification}</p><p>{image.representativeNotice}</p>
    <p>表示枠に合わせて切り抜き表示しています。</p>
  </details>;
}
