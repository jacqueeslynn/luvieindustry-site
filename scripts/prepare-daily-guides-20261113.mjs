import fs from 'node:fs';
import {guides} from '../content/daily-guides-20261113.mjs';
const cacheFile='content/daily-guides-20261113-translations.json';
const cache=fs.existsSync(cacheFile)?JSON.parse(fs.readFileSync(cacheFile)):{};
async function translate(values,language){
 const output=[];let group=[],length=0;const groups=[];
 for(const value of values){if(length+value.length>4000&&group.length){groups.push(group);group=[];length=0;}group.push(value);length+=value.length+20;}if(group.length)groups.push(group);
 for(const items of groups){
  const query=items.map((s,i)=>`[${1000+i}]\n${s}`).join('\n\n');
  const url=new URL('https://translate.googleapis.com/translate_a/single');
  for(const[k,v]of Object.entries({client:'gtx',sl:'en',tl:language,dt:'t',q:query}))url.searchParams.set(k,v);
  const response=await fetch(url,{signal:AbortSignal.timeout(45000)});if(!response.ok)throw Error('Translation HTTP '+response.status);
  const data=await response.json(),text=data[0].map(x=>x[0]||'').join('');
  const parts=text.split(/\[\s*1\s*0\s*\d\s*\d\s*\]/u).slice(1).map(x=>x.trim());
  if(parts.length!==items.length)throw Error('Incomplete translation');output.push(...parts);
 }
 return output;
}
for(const g of guides){
 if(g.related.includes('are-wall-panels-waterproof.html'))g.related=['pvc-wall-panels-humid-areas.html'];
 for(const[locale,code]of [['es','es'],['pt-br','pt'],['ar','ar']]){
  const key=g.file+':'+locale;
  if(!cache[key]){
   const e=g.en,fields=[e.title,e.heading,e.description,e.lead,e.answer,...e.sections.flat(),...e.checklist,...e.faq.flat(),e.closing];
   const t=await translate(fields,code);let i=0;
   cache[key]={title:t[i++],heading:t[i++],description:t[i++],lead:t[i++],answer:t[i++],sections:e.sections.map(()=>[t[i++],t[i++]]),checklist:e.checklist.map(()=>t[i++]),faq:e.faq.map(()=>[t[i++],t[i++]]),closing:t[i++]};
   fs.writeFileSync(cacheFile,JSON.stringify(cache,null,2)+'\n');
  }
  g[locale]=cache[key];console.log(key);
 }
}

