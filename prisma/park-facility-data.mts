// Fixed UUIDs. Official CSV evidence: docs/sources/issue-50-facilities.json.
// Coordinates identify facilities, not entrances or accessible routes.
// Verified equipment only; null means unknown, never "absent".
export const babyFacilityEvidence: Record<string, { hasNursingRoom: true | null; hasDiaperChange: true; note: string }> = {
  "96902ac7-2229-42d6-a55e-db58a0125caf": {
    hasNursingRoom: true, hasDiaperChange: true,
    note: "授乳室は1階飲食スペースにある館内設備です。トイレの24時間利用とは異なり、授乳室の利用時間は施設へご確認ください。施設内におむつ交換設備がありますが、詳細な設置場所は未確認です。",
  },
  "586282f7-ea81-4520-afd2-197f04073ba3": {
    hasNursingRoom: null, hasDiaperChange: true,
    note: "動物園の公式案内では、正門前と「レッサーパンダのいえ」館内に多目的トイレがあり、おむつ替えシートは計2台あります。各トイレへの台数の配分は未確認です。",
  },
};
const baseFacilitySeeds = [
  {
    "id": "36d7f379-e387-4636-aa3c-12f9c64c7b3f",
    "name": "西山公園(中央広場)",
    "nameEn": "Nishiyama Park (Central Square）",
    "type": "TOILET",
    "latitude": "35.949591",
    "longitude": "136.182136",
    "description": "公衆トイレ。公式データにバリアフリートイレの記載があります。ベビーベッドの記載があります。",
    "descriptionEn": null,
    "externalUrl": "https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-202-odp",
    "isPublished": true
  },
  {
    "id": "70361abc-2dc8-4178-b0ab-613e4bde60d6",
    "name": "西山公園(八角(お祭り広場北))",
    "nameEn": "Nishiyama Park (Octagonal (Festival Square North))",
    "type": "TOILET",
    "latitude": "35.950859",
    "longitude": "136.182765",
    "description": "公衆トイレ。公式データにバリアフリートイレの記載があります。",
    "descriptionEn": null,
    "externalUrl": "https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-202-odp",
    "isPublished": true
  },
  {
    "id": "86ed4e64-3b16-4e12-bf3c-5d72fe72836f",
    "name": "西山公園(冒険の森)",
    "nameEn": "Nishiyama Park (Forest Adventure)",
    "type": "TOILET",
    "latitude": "35.951945",
    "longitude": "136.183205",
    "description": "公衆トイレ。公式データにバリアフリートイレの記載があります。",
    "descriptionEn": null,
    "externalUrl": "https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-202-odp",
    "isPublished": true
  },
  {
    "id": "586282f7-ea81-4520-afd2-197f04073ba3",
    "name": "西山公園(西山動物園)",
    "nameEn": "Nishiyama Park (Nishiyama Zoo）",
    "type": "TOILET",
    "latitude": "35.950538",
    "longitude": "136.180952",
    "description": "公衆トイレ。公式データにバリアフリートイレの記載があります。ベビーベッドの記載があります。",
    "descriptionEn": null,
    "externalUrl": "https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-202-odp",
    "isPublished": true
  },
  {
    "id": "01a4490e-9c05-41f1-a6dd-a0fc7003b6f9",
    "name": "西山公園(嚮陽庭園(中段))",
    "nameEn": "Nishiyama Park (Garden kyoyo (middle))",
    "type": "TOILET",
    "latitude": "35.950998",
    "longitude": "136.184696",
    "description": "公衆トイレ。公式データにバリアフリートイレの記載があります。",
    "descriptionEn": null,
    "externalUrl": "https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-202-odp",
    "isPublished": true
  },
  {
    "id": "e9b0e36c-f3eb-46ac-9eba-e07b3bb95146",
    "name": "西山公園(嚮陽庭園(北の庭))",
    "nameEn": "Nishiyama Park (Garden kyoyo (North Garden))",
    "type": "TOILET",
    "latitude": "35.951988",
    "longitude": "136.184546",
    "description": "公衆トイレ。公式データにバリアフリートイレの記載があります。",
    "descriptionEn": null,
    "externalUrl": "https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-202-odp",
    "isPublished": true
  },
  {
    "id": "a6446adb-62b0-4e1f-8d27-5538949ee707",
    "name": "西山公園(嚮陽庭園(松堂亭))",
    "nameEn": "Nishiyama Park (Garden kyoyo (Shoto bower))",
    "type": "TOILET",
    "latitude": "35.950752",
    "longitude": "136.184111",
    "description": "公衆トイレ。公式データにバリアフリートイレの記載があります。ベビーベッドの記載があります。",
    "descriptionEn": null,
    "externalUrl": "https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-202-odp",
    "isPublished": true
  },
  {
    "id": "96902ac7-2229-42d6-a55e-db58a0125caf",
    "name": "道の駅西山公園",
    "nameEn": "Michinoeki NishiyamaPark",
    "type": "TOILET",
    "latitude": "35.949262",
    "longitude": "136.180450",
    "description": "公衆トイレ。公式データにバリアフリートイレの記載があります。24時間利用できます。",
    "descriptionEn": null,
    "externalUrl": "https://ckan.odp.jig.jp/dataset/jp-fukui-sabae-202-odp",
    "isPublished": true
  },
  {
    "id": "dad3655a-0705-42a3-be69-78a00a68d1b3",
    "name": "嚮陽会館前駐車場",
    "nameEn": null,
    "type": "PARKING",
    "latitude": "35.947771",
    "longitude": "136.180548",
    "description": "公園周辺の市営駐車場。工事により出入口・利用範囲が変わります。利用前に公式案内をご確認ください。",
    "descriptionEn": null,
    "externalUrl": "https://www.city.sabae.fukui.jp/about_city/kekaku_torikumi/fukugo/tyuusyajyou.html",
    "isPublished": true
  },
  {
    "id": "4c4af182-d20a-4eac-93b6-b6044d6671b2",
    "name": "ふれあい広場駐車場",
    "nameEn": null,
    "type": "PARKING",
    "latitude": "35.947841",
    "longitude": "136.181970",
    "description": "公園周辺の市営駐車場。料金・利用条件は公式案内をご確認ください。",
    "descriptionEn": null,
    "externalUrl": "https://www.city.sabae.fukui.jp/kurashi_tetsuduki/kokyokotsu/chushajo_churinjo/shieichushajo.html",
    "isPublished": true
  }
] as const;

export const parkFacilitySeeds = baseFacilitySeeds.map(seed => {
  const evidence = babyFacilityEvidence[seed.id];
  return { ...seed, hasNursingRoom: evidence?.hasNursingRoom ?? null,
    hasDiaperChange: evidence?.hasDiaperChange ?? null,
    description: seed.description + (evidence ? " " + evidence.note : ""),
  };
});
