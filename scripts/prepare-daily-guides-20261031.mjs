import fs from 'node:fs';
import {guides} from '../content/daily-guides-20261031-source.mjs';
import {localized} from '../content/daily-guides-20261031-locales.mjs';
import {reviewTranslations} from '../content/daily-guides-20261031-review.mjs';
for (const [locale, copies] of Object.entries(localized)) {
  if(copies.length!==guides.length)throw Error('Incomplete locale '+locale);
  guides.forEach((guide,i)=>{guide[locale]=copies[i];});
}
reviewTranslations(guides);
fs.writeFileSync('content/daily-guides-20261031.mjs',"export const date='2026-10-31';\nexport const guides="+JSON.stringify(guides,null,2)+';\n');
console.log('Prepared complete editorial translations without an external translation service.');
