// Fixed UUIDs: generated once when authoring, never on seed execution.
// Course times are editorial estimates, not measured walking times.
// Cherry calendar source: https://www.city.sabae.fukui.jp/kurashi_tetsuduki/doro_kasen_koen/koen/koen.html
export const cherrySeasonSeed = {
  "id": "123eb7a8-b1e2-4130-ba23-254f176eb756",
  "slug": "spring-cherry-blossoms",
  "name": "春の桜",
  "seasonGroup": "SPRING",
  "startMonth": 4,
  "startDay": 1,
  "endMonth": 4,
  "endDay": 10,
  "description": "公式の「4月上旬」という表現をもとに、アプリ内掲載期間を4/1〜4/10として設定。実際の開花・満開を保証しない。"
} as const;

export const seasonalFindSeeds = [
  {
    "seasonSlug": "spring-cherry-blossoms",
    "spotSlug": "nishiyama-cherry-blossoms",
    "find": {
      "id": "f10b6e8c-4960-4248-a8e7-7e2c669e876e",
      "title": "お気に入りの桜を見つけよう",
      "description": "桜の色や花の形を眺めて、心に留まった景色を探してみよう。",
      "effectType": "FLOWER"
    }
  },
  {
    "seasonSlug": "spring-azaleas",
    "spotSlug": "nishiyama-azaleas",
    "find": {
      "id": "62304c47-1be7-4008-bec0-3abd2eeb3086",
      "title": "お気に入りのツツジを見つけよう",
      "description": "ツツジの色や咲き方を眺めて、お気に入りの花を探してみよう。",
      "effectType": "FLOWER"
    }
  },
  {
    "seasonSlug": "autumn-leaves",
    "spotSlug": "nishiyama-autumn-leaves",
    "find": {
      "id": "40dd7853-dd8e-49e6-9922-7572a3b77c4d",
      "title": "お気に入りの紅葉を見つけよう",
      "description": "もみじの色や葉の形を眺めて、お気に入りの一枚を探してみよう。",
      "effectType": "AUTUMN"
    }
  }
] as const;

export const additionalLensSeeds = [
  {
    "id": "38fc8d90-e2aa-4d5b-b135-2278f30347e5",
    "companion": "FAMILY",
    "interest": "SEASON",
    "name": "FAMILY × SEASON",
    "title": "家族で季節の景色を楽しむ旅",
    "titleEn": "Seasonal Scenery for Families",
    "description": "家族で、季節の景色や花を楽しむLENS。",
    "descriptionEn": "Enjoy seasonal flowers and scenery with your family.",
    "courses": [
      {
        "id": "85d649b0-498e-46e6-b065-c8231eb6be78",
        "name": "家族で季節を楽しむコース",
        "nameEn": "Seasonal Discoveries with Family",
        "durationType": "MINUTES_30_60",
        "durationMinutes": 60,
        "description": "季節に合わせた見どころを楽しむコースです。花や紅葉の状況は年によって異なります。",
        "slots": [
          {
            "id": "03969840-174c-4017-a09d-0a5460d2b21f",
            "slug": "seasonal-highlight",
            "candidateIds": [
              "f18625c7-2525-47d8-8f2c-cef37774f581",
              "84b60710-ae72-417c-b0cc-22f0d02d2787",
              "9a7540cb-d577-4aa5-a39f-26196d9b7e77"
            ]
          }
        ]
      },
      {
        "id": "0d85fd96-a449-4f6e-afe4-22cd1d20abe0",
        "name": "家族で季節と遊びを楽しむコース",
        "nameEn": "Seasonal Scenery and Family Play",
        "durationType": "HOURS_1_2",
        "durationMinutes": 90,
        "description": "季節に合わせた見どころを楽しむコースです。花や紅葉の状況は年によって異なります。",
        "slots": [
          {
            "id": "95130510-4cdc-4617-91de-4d840d623e2b",
            "slug": "seasonal-highlight",
            "candidateIds": [
              "703f6194-298e-4c4e-8ba6-0042e7d1ef80",
              "f7954988-9780-4ce8-9383-ad61cb231639",
              "7fd11871-99ff-48f2-bdd5-787e758da53b"
            ]
          },
          {
            "id": "e2a85c51-f36a-42dc-aa2c-27dc0cfaca0e",
            "slug": "adventure-forest",
            "candidateIds": []
          }
        ]
      },
      {
        "id": "2e186bda-68b5-4d07-9c70-450962063cb9",
        "name": "家族で季節と景色を楽しむコース",
        "nameEn": "Family Scenery Walk",
        "durationType": "HOURS_2_3",
        "durationMinutes": 150,
        "description": "季節に合わせた見どころを楽しむコースです。花や紅葉の状況は年によって異なります。",
        "slots": [
          {
            "id": "fa26ae62-649b-48cf-8e37-c776e157d817",
            "slug": "seasonal-highlight",
            "candidateIds": [
              "e01eb9a3-25ce-4ca5-b465-a760eed872ff",
              "f4aa774d-6ee6-4d68-9679-82edd1622f10",
              "c531d2be-8cca-4ccd-9134-43fff430a4a4"
            ]
          },
          {
            "id": "7b651d73-4ac8-446f-afda-ad918ccb37c4",
            "slug": "adventure-forest",
            "candidateIds": []
          },
          {
            "id": "d175af03-d4a1-4f71-9c0f-fcd46ddfb2af",
            "slug": "ai-no-kane-observation-deck",
            "candidateIds": []
          },
          {
            "id": "92619228-46f6-49fc-9a21-ac266a1eb26d",
            "slug": "michi-no-eki-nishiyama",
            "candidateIds": []
          }
        ]
      }
    ]
  },
  {
    "id": "91161523-145c-4fbe-b7f4-07b536731d48",
    "companion": "COUPLE",
    "interest": "SEASON",
    "name": "COUPLE × SEASON",
    "title": "ふたりで季節を感じる旅",
    "titleEn": "Seasons for Two",
    "description": "ふたりで、季節の景色をゆっくり楽しむLENS。",
    "descriptionEn": "Take your time enjoying seasonal scenery together.",
    "courses": [
      {
        "id": "4ee9192b-f9f3-4960-8f63-18c806253eb3",
        "name": "ふたりで季節を楽しむコース",
        "nameEn": "Seasonal Discoveries for Two",
        "durationType": "MINUTES_30_60",
        "durationMinutes": 60,
        "description": "季節に合わせた見どころを楽しむコースです。花や紅葉の状況は年によって異なります。",
        "slots": [
          {
            "id": "7bbda556-3d2d-4ff8-8b58-fb193aa0594d",
            "slug": "seasonal-highlight",
            "candidateIds": [
              "6c830568-c26c-46fe-b274-b50ea4b9949a",
              "f99f6eeb-242c-4505-b937-82b4f7185440",
              "eff29b36-9c07-478b-8fda-b5cae551f383"
            ]
          }
        ]
      },
      {
        "id": "13fdcc5d-a1e6-4c9e-a827-7bfa95c0440a",
        "name": "ふたりで季節と庭を楽しむコース",
        "nameEn": "Seasons and Gardens for Two",
        "durationType": "HOURS_1_2",
        "durationMinutes": 90,
        "description": "季節に合わせた見どころを楽しむコースです。花や紅葉の状況は年によって異なります。",
        "slots": [
          {
            "id": "57b2f159-1c23-47e0-bec6-7b5d5c6af6d4",
            "slug": "seasonal-highlight",
            "candidateIds": [
              "e7e93907-bbbd-4bc8-a4c0-1ce0266cb691",
              "41f6850b-b0a7-4754-b105-9939fdbcf8c9",
              "ae04889f-8426-4591-ad85-6535148c66a3"
            ]
          },
          {
            "id": "63dd7331-ea12-4c12-9f0a-8620aafa60e5",
            "slug": "shodoan",
            "candidateIds": []
          }
        ]
      },
      {
        "id": "9a30e8b4-2c5c-43ce-b583-f5dc0d6b10eb",
        "name": "ふたりで季節と景色を楽しむコース",
        "nameEn": "Scenic Seasonal Walk for Two",
        "durationType": "HOURS_2_3",
        "durationMinutes": 150,
        "description": "季節に合わせた見どころを楽しむコースです。花や紅葉の状況は年によって異なります。",
        "slots": [
          {
            "id": "27814c7c-b47e-46be-b9fb-25dc660df0f6",
            "slug": "seasonal-highlight",
            "candidateIds": [
              "bbbf566b-43ee-454d-be8f-68462e45c10f",
              "e453e7d9-6dc9-4f79-8b3e-ddbf56f1718a",
              "383304fe-9227-455c-aa3f-bd0901f3728a"
            ]
          },
          {
            "id": "f6d91137-7dfb-403f-a447-1f1251d5b8ff",
            "slug": "shodoan",
            "candidateIds": []
          },
          {
            "id": "1cb70fd2-5249-4c2f-bc06-ce7baa7d1bc3",
            "slug": "nishiyama-bridge",
            "candidateIds": []
          },
          {
            "id": "c514ff1c-0f82-4ec2-96d0-e71cafedb96e",
            "slug": "ai-no-kane-observation-deck",
            "candidateIds": []
          }
        ]
      }
    ]
  },
  {
    "id": "6626da45-9386-4d2f-984b-1151e41396db",
    "companion": "FRIENDS",
    "interest": "PHOTO",
    "name": "FRIENDS × PHOTO",
    "title": "友達と景色を写真に残す旅",
    "titleEn": "Photo Walk with Friends",
    "description": "友達と、景色や写真を楽しむLENS。",
    "descriptionEn": "Explore the scenery and enjoy taking photos with friends.",
    "courses": [
      {
        "id": "2a5835e6-b9af-4e2e-a3a5-17b0737b767d",
        "name": "友達と写真を楽しむコース",
        "nameEn": "Photos with Friends",
        "durationType": "MINUTES_30_60",
        "durationMinutes": 60,
        "description": "西山公園の景色を、自分たちのペースで写真に残すコースです。",
        "slots": [
          {
            "id": "709a526b-fcec-415b-9da4-7b328545c0a1",
            "slug": "nishiyama-bridge",
            "candidateIds": []
          }
        ]
      },
      {
        "id": "93ef2d88-b8c5-4652-a974-658b9cb96cba",
        "name": "友達と季節を撮るコース",
        "nameEn": "Seasonal Photos with Friends",
        "durationType": "HOURS_1_2",
        "durationMinutes": 90,
        "description": "季節に合わせた見どころを楽しむコースです。花や紅葉の状況は年によって異なります。",
        "slots": [
          {
            "id": "a27a62a4-fd22-4a36-a502-a2770b82623e",
            "slug": "nishiyama-bridge",
            "candidateIds": []
          },
          {
            "id": "9463244a-403d-4680-af3d-6459085b7ad3",
            "slug": "seasonal-highlight",
            "candidateIds": [
              "e1d56c64-5306-4f60-b3a0-3189cf8d31a4",
              "9756a4e6-028d-40cf-968c-779c292a729c",
              "7d0694d9-16a4-4606-b046-6daf6e1a2fb4"
            ]
          }
        ]
      },
      {
        "id": "0c649512-e5b8-42ac-a543-faa475835913",
        "name": "友達と西山公園を撮り歩くコース",
        "nameEn": "Nishiyama Photo Walk with Friends",
        "durationType": "HOURS_2_3",
        "durationMinutes": 150,
        "description": "季節に合わせた見どころを楽しむコースです。花や紅葉の状況は年によって異なります。",
        "slots": [
          {
            "id": "aca4a9ec-370d-4170-a038-30fc4bcea2fb",
            "slug": "nishiyama-bridge",
            "candidateIds": []
          },
          {
            "id": "31ca86fb-999a-47bd-af48-da1dbec36031",
            "slug": "seasonal-highlight",
            "candidateIds": [
              "0914eae5-8018-401d-8e8d-f11fdfd6a6ca",
              "c588e8ec-ae40-4b03-93ba-8c3af7d768df",
              "fe1584d3-602c-48b2-a927-e3d2ef017e01"
            ]
          },
          {
            "id": "07bebabf-7454-47fa-ba85-d59666a83e89",
            "slug": "ai-no-kane-observation-deck",
            "candidateIds": []
          },
          {
            "id": "db29da66-a586-473d-abe1-4832025c745c",
            "slug": "michi-no-eki-nishiyama",
            "candidateIds": []
          }
        ]
      }
    ]
  },
  {
    "id": "5b83edc3-e839-4fd6-8302-52f7c94aef8c",
    "companion": "SOLO",
    "interest": "PHOTO",
    "name": "SOLO × PHOTO",
    "title": "ひとりで自分らしい景色を写す旅",
    "titleEn": "Your Own Photo Walk",
    "description": "ひとりで、自分のペースで景色や写真を楽しむLENS。",
    "descriptionEn": "Enjoy the scenery and take photos at your own pace.",
    "courses": [
      {
        "id": "56e28f79-44d3-4679-b68a-16d57f7363f7",
        "name": "ひとりで季節を撮るコース",
        "nameEn": "Solo Seasonal Photos",
        "durationType": "MINUTES_30_60",
        "durationMinutes": 60,
        "description": "季節に合わせた見どころを楽しむコースです。花や紅葉の状況は年によって異なります。",
        "slots": [
          {
            "id": "57f08350-5f1d-433b-95d5-acb6e6ceabeb",
            "slug": "seasonal-highlight",
            "candidateIds": [
              "f2326bcf-6142-4d9d-bd52-7d3aeb7bc2c9",
              "c3c308dd-8c35-4c65-a0df-b77e92ccb7b1",
              "844c096b-5412-4ca0-aa28-e419f0b7fbf3"
            ]
          }
        ]
      },
      {
        "id": "de1de61d-0028-4a68-bfeb-57644351b9df",
        "name": "ひとりで景色を撮り歩くコース",
        "nameEn": "Solo Scenic Photo Walk",
        "durationType": "HOURS_1_2",
        "durationMinutes": 90,
        "description": "季節に合わせた見どころを楽しむコースです。花や紅葉の状況は年によって異なります。",
        "slots": [
          {
            "id": "a97015b6-724c-44dd-9db7-c39b68be01cc",
            "slug": "seasonal-highlight",
            "candidateIds": [
              "403f2a65-bc98-4f9a-b1a4-0b140f270ab1",
              "be3313d0-71f3-41fe-9aab-3028c9917ec1",
              "cae3f9b9-e537-4e21-8504-137be28cd74d"
            ]
          },
          {
            "id": "e4769ae2-7478-4ae7-b7d5-bb479035f38d",
            "slug": "nishiyama-bridge",
            "candidateIds": []
          }
        ]
      },
      {
        "id": "b8fd7c8b-bcef-4ed8-9948-01e8b48e4490",
        "name": "ひとりで静かに写真を楽しむコース",
        "nameEn": "A Quiet Solo Photo Walk",
        "durationType": "HOURS_2_3",
        "durationMinutes": 150,
        "description": "季節に合わせた見どころを楽しむコースです。花や紅葉の状況は年によって異なります。",
        "slots": [
          {
            "id": "9ce77bb6-53b9-482d-9a12-81d4f9627903",
            "slug": "seasonal-highlight",
            "candidateIds": [
              "6e3419b4-3f0f-4b82-a78e-4f2bba2429ac",
              "df5c2088-b983-4ba9-8aa1-fd9a8ea16a76",
              "6a2a30c7-69b4-4aa7-9180-9dcd98d81b54"
            ]
          },
          {
            "id": "8ba7cf4b-e613-4f4b-9fc2-34db9789c8b2",
            "slug": "nishiyama-bridge",
            "candidateIds": []
          },
          {
            "id": "60ed07d0-0389-42f0-92de-1c084abf7b44",
            "slug": "shodoan",
            "candidateIds": []
          },
          {
            "id": "0c9448f1-4e57-428e-9b00-ad8b172f0966",
            "slug": "ai-no-kane-observation-deck",
            "candidateIds": []
          }
        ]
      }
    ]
  }
] as const;
