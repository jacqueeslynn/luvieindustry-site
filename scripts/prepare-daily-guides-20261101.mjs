import fs from 'node:fs';
import {guides} from '../content/daily-guides-20261101-source.mjs';
import {localized} from '../content/daily-guides-20261101-locales.mjs';
for(const [locale,copies] of Object.entries(localized)){
  if(copies.length!==guides.length)throw Error('Incomplete '+locale);
  guides.forEach((guide,i)=>{guide[locale]=copies[i];});
}
fs.writeFileSync('content/daily-guides-20261101.mjs',"export const date='2026-11-01';\nexport const guides="+JSON.stringify(guides,null,2)+';\n');
console.log('Prepared three complete guides in four languages.');
