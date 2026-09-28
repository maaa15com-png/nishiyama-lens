import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadUI } from "./helpers/todays-lenses.mjs";
import images from "../src/lib/media/course-images.json" with {type:"json"};
const {getCoursePhoto,getCourseHeroSpot}=loadUI("src/lib/media/course-image.ts");
const spot=slug=>({slug,name:slug,imageUrl:null});
test("Course presentation fallback maps only two approved slugs and records generated provenance",()=>{
 for(const image of images){
  const photo=getCoursePhoto(spot(image.slug));
  assert.equal(photo.src,image.imagePath);assert.equal(photo.generated,true);assert.match(photo.alt,/生成イメージ/);assert.equal(photo.metadata,null);
  assert.equal(createHash("sha256").update(fs.readFileSync("public"+image.imagePath)).digest("hex"),image.sha256);
 }
 assert.equal(getCoursePhoto(spot("unregistered")).src,null);
});
test("Course stored images always precede generated presentation images",()=>{
 for(const image of images){const p=getCoursePhoto({...spot(image.slug),imageUrl:"/images/actual.jpg"});assert.equal(p.src,"/images/actual.jpg");assert.equal(p.generated,false);}
});
test("Course Hero prefers actual Spot image later in course over generated first Spot",()=>{
 const generated=spot("adventure-forest"),actual={...spot("nishiyama-zoo"),imageUrl:"/images/spots/nishiyama-zoo.jpg"};
 assert.equal(getCourseHeroSpot([generated,actual]),actual);
 assert.equal(getCourseHeroSpot([spot("unknown"),generated]),generated);
 assert.equal(getCourseHeroSpot([spot("unknown")]),undefined);
});
test("Generated CoursePhoto has visible label and non-documentary alt, actual images do not",()=>{
 const Photo=loadUI("src/components/courses/CoursePhoto.tsx").default;
 for(const image of images){const html=renderToStaticMarkup(React.createElement(Photo,getCoursePhoto(spot(image.slug))));assert.match(html,/生成イメージ/);assert.match(html,/実際の施設を撮影した写真ではありません/);assert.ok(html.includes(image.alt));assert.doesNotMatch(html,/CC BY/);}
 const html=renderToStaticMarkup(React.createElement(Photo,{src:"/images/actual.jpg",alt:"実画像"}));assert.doesNotMatch(html,/生成イメージ/);
});

test("Seasonal fallback uses approved azalea with official credit, resolved cherry does not borrow it",()=>{
 const p=getCoursePhoto(spot("seasonal-highlight"));assert.equal(p.src,"/images/spots/nishiyama-azaleas.jpg");assert.equal(p.generated,false);assert.equal(p.metadata.license,"CC BY 2.1 JP");assert.match(p.alt,/代表イメージ/);
 assert.equal(getCoursePhoto(spot("nishiyama-cherry-blossoms")).src,null);
 assert.equal(getCoursePhoto({...spot("seasonal-highlight"),imageUrl:"/images/custom.jpg"}).src,"/images/custom.jpg");
});

 test("Course Hero prefers registered zoo image over preceding official seasonal supplement", () => {
 const seasonal = spot("seasonal-highlight");
 const zoo = {...spot("nishiyama-zoo"), imageUrl:"/images/spots/nishiyama-zoo.jpg"};
 assert.equal(getCourseHeroSpot([seasonal, zoo, spot("michi-no-eki-nishiyama")]), zoo);
 assert.equal(getCoursePhoto(seasonal).src, "/images/spots/nishiyama-azaleas.jpg");
});

test("Course Hero keeps course order among supplements regardless of generated or official origin", () => {
 const adventure = spot("adventure-forest"), station = spot("michi-no-eki-nishiyama");
 const seasonal = spot("seasonal-highlight");
 assert.equal(getCourseHeroSpot([adventure, station]), adventure);
 assert.equal(getCourseHeroSpot([spot("unknown"), adventure, seasonal]), adventure);
 assert.equal(getCourseHeroSpot([seasonal, adventure]), seasonal);
});

test("Course Hero keeps course order among registered Spot images", () => {
 const zoo = {...spot("nishiyama-zoo"), imageUrl:"/images/spots/nishiyama-zoo.jpg"};
 const autumn = {...spot("nishiyama-autumn-leaves"), imageUrl:"/images/spots/nishiyama-autumn-leaves.jpg"};
 assert.equal(getCourseHeroSpot([zoo, autumn]), zoo);
 assert.equal(getCourseHeroSpot([autumn, zoo]), autumn);
});

test("Course Hero without registered images or supplements retains empty fallback", () => {
 assert.equal(getCourseHeroSpot([spot("unknown"), spot("nishiyama-cherry-blossoms")]), undefined);
 assert.equal(getCourseHeroSpot([]), undefined);
});
