import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
let changed=0;
for(const file of files){
  if(!/\.(html|js|mjs|py|json)$/.test(file)||file.startsWith('content/image-manifest'))continue;
  const old=fs.readFileSync(file,'utf8');
  let next=old.replaceAll('jinsburg@luvieindustry.com','globalsales@luvieindustry.com').replaceAll('+30 6947135317','+86 19005833027').replaceAll('+306947135317','+8619005833027').replaceAll('306947135317','8619005833027');
  next=next.replaceAll('?cc=globalsales@luvieindustry.com&amp;','?').replaceAll('?cc=globalsales@luvieindustry.com&','?')
    .replaceAll('globalsales@luvieindustry.com · globalsales@luvieindustry.com','globalsales@luvieindustry.com')
    .replaceAll('globalsales@luvieindustry.com<br/>globalsales@luvieindustry.com','globalsales@luvieindustry.com')
    .replaceAll('["globalsales@luvieindustry.com", "globalsales@luvieindustry.com"]','["globalsales@luvieindustry.com"]')
    .replace(/<input\b[^>]*name="_cc"[^>]*value="globalsales@luvieindustry.com"[^>]*>\s*/g,'');
  if(next!==old){fs.writeFileSync(file,next);changed++;}
}
console.log({changed});
