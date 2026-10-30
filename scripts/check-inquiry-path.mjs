import fs from 'node:fs';
import assert from 'node:assert/strict';
import {guides as dailyGuides} from '../content/daily-guides-20261027.mjs';
import {guides as regionalGuides} from '../content/regional-guides-20261028.mjs';
import {guides as latestGuides} from '../content/daily-guides-20261029.mjs';
import {guides as october30Guides} from '../content/daily-guides-20261030.mjs';
const guides = [...dailyGuides, ...regionalGuides, ...latestGuides, ...october30Guides];
let count=0;
for(const prefix of ['', 'es/', 'pt-br/', 'ar/']) {
  const home=fs.readFileSync(prefix+'index.html','utf8');
  assert(home.includes('/assets/inquiry-path.js'));
  assert(home.includes('id="inquiryForm"') && home.includes('id="quickInquiryBtn"'));
  const files=[...fs.readdirSync(prefix+'products').filter(x=>x.endsWith('.html')).map(x=>prefix+'products/'+x),...guides.map(g=>prefix+'articles/'+g.file)];
  if(prefix)files.push(prefix+'contact.html');
  for(const file of files){
    const h=fs.readFileSync(file,'utf8');
    assert.equal((h.match(/<!-- online-inquiry:start -->/g)||[]).length,1,file);
    const href=h.match(/class="online-inquiry"[\s\S]*?<a href="([^"]+)"/)[1].replaceAll('&amp;','&');
    const u=new URL(href,'https://luvieindustry.com');
    assert.equal(u.pathname,'/'+prefix);assert.equal(u.searchParams.get('inquiry'),'1');assert.equal(u.searchParams.get('from'),'/'+file);
    count++;
  }
}
console.log(`Inquiry routing passed: ${count} page entrances and four localized forms.`);
