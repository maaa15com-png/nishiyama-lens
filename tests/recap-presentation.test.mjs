import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadUI } from "./helpers/todays-lenses.mjs";
import { fixtureDatabase, serverModules } from "./helpers/issue-47-db.mjs";
const Summary=loadUI("src/components/recap/RecapSummary.tsx").default;
const id="00000000-0000-4000-8000-000000000001",lensId="00000000-0000-4000-8000-000000000002",spotId="00000000-0000-4000-8000-000000000003";
const spot={id:spotId,slug:"nishiyama-zoo",name:"西山動物園",imageUrl:"/images/spots/nishiyama-zoo.jpg"};
const recap={course:{id,name:"親子のコース",description:"コース説明",durationType:"HOURS_1_2",durationMinutes:90,courseSpots:[{spotId,sortOrder:1,spot}]},lens:{id:lensId,name:"FAMILY × PANDA",title:"パンダを楽しむ",companion:"FAMILY",interest:"PANDA"},finds:[{id:"find",title:"動きを観察",description:"お気に入りの姿を探そう",season:null}],findSpotIds:{find:spotId}};
const render=(data=recap)=>renderToStaticMarkup(React.createElement(Summary,{recap:data,query:{lang:"en",foo:["1","2"],courseId:id}}));
test("Recap uses representative, Spot and correctly associated Find photos with attribution",()=>{
 const html=render();
 assert.equal((html.match(/<h1/g)||[]).length,1);assert.equal((html.match(/<img/g)||[]).length,3);
 for(const text of ["FAMILY × PANDA","親子のコース","動きを観察","CC BY 2.1 JP","実際に訪れた場所や滞在時間の記録ではありません","focus-visible"])assert.ok(html.includes(text));
 assert.doesNotMatch(html,/達成状況|訪れたスポット|5\s*\/\s*5|今日歩いた|完了しました/);
});
test("Recap hides zero Find and zero Spot sections while maintaining current Lens and Course",()=>{
 const html=render({...recap,course:{...recap.course,courseSpots:[]},finds:[],findSpotIds:{}});
 assert.doesNotMatch(html,/id="recap-find"|id="recap-spots"|<img/);assert.match(html,/FAMILY × PANDA/);assert.match(html,/写真は準備中です/);
});
test("Recap does not borrow photographs for unassociated themes and supports missing photos",()=>{
 const html=render({...recap,findSpotIds:{}});
 assert.equal((html.match(/<img/g)||[]).length,2);
 const noPhoto={...recap,course:{...recap.course,courseSpots:[{spotId,sortOrder:1,spot:{...spot,slug:"nishiyama-cherry-blossoms",imageUrl:null}}]}};
 assert.doesNotMatch(render(noPhoto),/<img/);
});
test("Recap links retain repeated query and current Course; Find text is not truncated",()=>{
 const html=render({...recap,finds:[{...recap.finds[0],description:"長い発見の説明".repeat(40)}]});
 for(const match of html.matchAll(/href="([^"]+)"/g)){const href=match[1].replaceAll("&amp;","&");if(!href.startsWith("/"))continue;const u=new URL(href,"https://test.local");assert.equal(u.searchParams.get("lang"),"en");assert.deepEqual(u.searchParams.getAll("foo"),["1","2"]);}
 assert.ok(html.includes("長い発見の説明".repeat(40)));assert.doesNotMatch(html,/line-clamp/);
});
test("Recap query associates Find IDs with their actual resolved Spot without changing Find contents",async()=>{
 const db=fixtureDatabase({Lens:[{id:lensId,isPublished:true,companion:"FAMILY",interest:"PANDA",name:"FAMILY × PANDA"}]});
 const course={...recap.course,lensId};
 const load=serverModules(db,{"./course-detail":{getCourseDetail:async()=>course},"./todays-find":{getTodaysFinds:async(s)=>s===spotId?recap.finds:[]}});
 const result=await load("src/lib/server/recap.ts").getRecap(id);
 assert.equal(result.findSpotIds.find,spotId);assert.equal(result.finds[0].title,"動きを観察");
});
