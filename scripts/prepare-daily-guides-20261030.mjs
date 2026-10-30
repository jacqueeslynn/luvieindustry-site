// Translate public editorial copy only. Persist complete results for review/reproducibility.
import fs from 'node:fs';
import {guides} from '../content/daily-guides-20261030-source.mjs';
import {reviewTranslations} from '../content/daily-guides-20261030-review.mjs';
const cacheFile='content/daily-guides-20261030-translations.json';
const cache=fs.existsSync(cacheFile)?JSON.parse(fs.readFileSync(cacheFile,'utf8')):{};
function strings(value){return typeof value==='string'?[value]:Object.values(value).flatMap(strings);}
function rebuild(value,values){if(typeof value==='string')return values.shift();if(Array.isArray(value))return value.map(v=>rebuild(v,values));return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,rebuild(v,values)]));}
async function translate(text,locale){
 const url=new URL('https://translate.googleapis.com/translate_a/single');
 for(const [k,v]of Object.entries({client:'gtx',sl:'en',tl:locale,dt:'t',q:text}))url.searchParams.set(k,v);
 for(let attempt=0;attempt<4;attempt++){
  try{const r=await fetch(url,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();return data[0].map(x=>x[0]||'').join('');}
  catch(e){if(attempt===3)throw e;await new Promise(r=>setTimeout(r,2000*(attempt+1)));}
 }
}
for(const [locale,target] of Object.entries({es:'es','pt-br':'pt-BR',ar:'ar'})){
 for(const guide of guides){
  const key=locale+'/'+guide.file;
  if(!cache[key]){
   const input=strings(guide.en),output=[];
   // Keep requests bounded and preserve paragraph boundaries; never translate HTML.
   for(let i=0;i<input.length;i+=4){
    const chunk=input.slice(i,i+4),translated=await translate(chunk.join('\n'),target);
    const lines=translated.split('\n').map(s=>s.trim()).filter(Boolean);
    if(lines.length===chunk.length)output.push(...lines);
    else for(const line of chunk)output.push((await translate(line,target)).trim());
   }
   if(output.length!==input.length||output.some(v=>!v))throw Error('Incomplete '+key);
   cache[key]=rebuild(guide.en,[...output]);
   fs.writeFileSync(cacheFile,JSON.stringify(cache,null,2)+'\n');
  }
  guide[locale]=cache[key];console.log('Prepared '+key);
 }
}

reviewTranslations(guides);
fs.writeFileSync('content/daily-guides-20261030.mjs',"export const date='2026-10-30';\nexport const guides="+JSON.stringify(guides,null,2)+';\n');
