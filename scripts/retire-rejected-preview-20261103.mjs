import fs from 'node:fs';
import path from 'node:path';
const rejected='oman-pvc-wall-panels-leak-inspection-before-cladding.html';
const archive=path.resolve('../verification-20261103/rejected-preview');
fs.mkdirSync(archive,{recursive:true});
for(const prefix of ['','es/','pt-br/','ar/']){
 const file=prefix+'articles/'+rejected;
 if(fs.existsSync(file))fs.renameSync(file,path.join(archive,(prefix.replace('/','-')||'en-')+rejected));
 const index=prefix+'articles/index.html';let s=fs.readFileSync(index,'utf8');
 s=s.replace(/<a class="article-card"[^>]*>[\s\S]*?<\/a>/g,block=>block.includes(rejected)?'':block);fs.writeFileSync(index,s);
}
let map=fs.readFileSync('sitemap.xml','utf8');map=map.replace(/<url>[\s\S]*?<\/url>/g,block=>block.includes(rejected)?'':block);fs.writeFileSync('sitemap.xml',map);
console.log('Rejected unpublished preview moved to verification archive; removed its index/sitemap entries.');
