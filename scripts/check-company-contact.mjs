import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
let count=0;
for(const file of execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0')){
 if(!file.endsWith('.html'))continue;
 const html=fs.readFileSync(file,'utf8');
 assert(!html.includes('jinsburg@luvieindustry.com')&&!html.includes('6947135317'),file);
 for(const [,href]of html.matchAll(/href="([^"]+)"/g)){
  if(href.startsWith('mailto:'))assert(href.startsWith('mailto:globalsales@luvieindustry.com'),file+': '+href);
  if(href.includes('wa.me/'))assert(href.includes('wa.me/8619005833027'),file+': '+href);
 }
 count++;
}
for(const prefix of ['', 'es/', 'pt-br/', 'ar/']){
 const h=fs.readFileSync(prefix+'index.html','utf8');
 assert(h.includes('action="https://formsubmit.co/globalsales@luvieindustry.com"'));
 assert(h.includes('https://formsubmit.co/ajax/globalsales@luvieindustry.com'));
 assert(!h.includes('name="_cc"'));
}
console.log(`Company contacts validated across ${count} HTML pages; delivery not tested.`);
