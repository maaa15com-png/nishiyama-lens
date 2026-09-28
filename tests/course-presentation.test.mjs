import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import images from "../src/lib/media/spot-images.json" with { type: "json" };
import { loadUI } from "./helpers/todays-lenses.mjs";
import { fixtureDatabase, serverModules } from "./helpers/issue-47-db.mjs";

const Overview = loadUI("src/components/courses/CourseOverview.tsx").default;
const courseId = "00000000-0000-4000-8000-000000000001";
const spots = images.map((i, n) => ({ id:i.spotId, slug:i.slug, name:i.slug, description:"スポットの説明", category:"FLOWER", imageUrl:i.imagePath, strollerAccessible:null, hasToilet:n === 0 ? true : null, hasRestArea:false }));
const course = { id:courseId, name:"季節の景色を楽しむコース", description:"ゆっくり楽しむ", durationType:"HOURS_1_2", courseSpots:spots.map((spot,n)=>({spot,spotId:spot.id,sortOrder:n+1})) };
const render = (value=course,lens={name:"FAMILY × SEASON",description:"花や景色を楽しむ。"}) => renderToStaticMarkup(React.createElement(Overview,{course:value,lens,query:{lang:"en",foo:["1","2"],courseId:"stale"}}));
test("Course photos use resolved Spot identity and first available image for Hero, retaining credits",()=>{
 const html=render();
 assert.equal((html.match(/<h1/g)??[]).length,1);
 for(const image of images){assert.ok(html.includes(image.imagePath));assert.ok(html.includes(image.alt));assert.ok(html.includes(image.licenseUrl));assert.ok(html.includes(image.sourceUrl));}
 assert.match(html,/FAMILY × SEASON LENS/);assert.match(html,/花や景色を楽しむ/);
 assert.equal((html.match(/<article/g)??[]).length,3);
 assert.ok(html.indexOf(images[0].imagePath)<html.indexOf(images[1].imagePath));
 assert.doesNotMatch(html,/generated-panda|徒歩\d|入園無料|ベビーカーOK|休憩スペースあり/);
 assert.match(html,/トイレあり/);
});
test("Course photos without images preserve cards and do not borrow another Spot image",()=>{
 const noImages={...course,courseSpots:course.courseSpots.map(slot=>({...slot,spot:{...slot.spot,imageUrl:null}}))};
 const html=render(noImages,null);
 assert.doesNotMatch(html,/<img/);assert.equal((html.match(/写真は準備中です/g)??[]).length,4);
 assert.match(html,/巡る順番ではありません/);
 const secondOnly={...noImages,courseSpots:[noImages.courseSpots[0],course.courseSpots[1]]};
 assert.ok(render(secondOnly).includes(images[1].imagePath));
 assert.ok(!render(secondOnly).includes(images[0].imagePath));
});
test("Course CTA and Spot links retain duplicate query, lang, current course identity and existing destinations",()=>{
 const html=render();const links=[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll("&amp;","&"));
 for(const path of ["/map","/recap",...spots.map(s=>"/spots/"+s.slug)]){
  const url=new URL(links.find(h=>h.startsWith(path+"?")),"https://example.test");
  assert.equal(url.searchParams.get("courseId"),courseId);assert.equal(url.searchParams.get("lang"),"en");assert.deepEqual(url.searchParams.getAll("foo"),["1","2"]);
 }
 assert.ok(links.some(h=>h.startsWith("/lens?")));assert.match(html,/focus-visible/);
 assert.match(html,/このコースをMAPで見る/);assert.match(html,/別の楽しみ方を見る/);
});
test("Course empty list and unsafe image URL do not render broken images",()=>{
 assert.doesNotMatch(render({...course,courseSpots:[]}),/<article/);
 const html=render({...course,courseSpots:[{...course.courseSpots[0],spot:{...spots[0],imageUrl:"javascript:alert(1)"}}]});
 assert.doesNotMatch(html,/<img|javascript:/);
});
test("Course query returns seasonal imageUrl from actual chosen Spot and published Lens only",async()=>{
 const fallback={...spots[0],id:"fallback",imageUrl:null,isPublished:true};
 const candidate={...spots[1],isPublished:true};
 const db=fixtureDatabase({Course:[{id:courseId,lensId:"lens",isPublished:true}],Lens:[{id:"lens",name:"SEASON",description:"hint",isPublished:true}],Spot:[fallback,candidate],Season:[{id:"season",isPublished:true,startMonth:11,endMonth:11}],CourseSpot:[{id:"slot",courseId,spotId:"fallback",sortOrder:1}],CourseSpotSeason:[{id:"rel",courseSpotId:"slot",spotId:candidate.id,seasonId:"season"}]});
 const {getCourseDetail,getCourseLens}=serverModules(db)("src/lib/server/course-detail.ts");
 assert.equal((await getCourseDetail(courseId,new Date("2026-11-10T00:00:00Z"))).courseSpots[0].spot.imageUrl,candidate.imageUrl);
 assert.equal((await getCourseDetail(courseId,new Date("2026-08-10T00:00:00Z"))).courseSpots[0].spot.imageUrl,null);
 assert.equal((await getCourseLens("lens")).name,"SEASON");
 db.rows().Lens[0].isPublished=false;assert.equal(await getCourseLens("lens"),null);
});
