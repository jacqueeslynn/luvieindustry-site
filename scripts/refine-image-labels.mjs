import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
// Keep illustration status without making the production tool the caption.
const replacements=[
 ['AI-generated editorial illustration','Editorial illustration'],
 ['AI-generated illustration','Illustration'],
 ['Ilustración editorial generada con IA','Ilustración editorial'],
 ['Ilustración generada con IA','Ilustración'],
 ['Ilustração editorial gerada por IA','Ilustração editorial'],
 ['Ilustração gerada por IA','Ilustração'],
 ['صورة تحريرية مولدة بالذكاء الاصطناعي','صورة توضيحية'],
 ['صورة توضيحية مولدة بالذكاء الاصطناعي','صورة توضيحية']
];
let changed=0;
const files=['scripts/publish-daily-guides-20261009.mjs','scripts/refresh-article-images-20261009.py'];
for(const locale of ['','es','pt-br','ar']){
 const dir=path.join(locale,'articles');
 for(const file of fs.readdirSync(path.join(root,dir)).filter(f=>f.endsWith('.html'))) files.push(path.join(dir,file));
}
for(const file of files){
 const full=path.join(root,file),before=fs.readFileSync(full,'utf8');
 let after=before;for(const [from,to] of replacements)after=after.replaceAll(from,to);
 if(after!==before){fs.writeFileSync(full,after);changed++;}
}
console.log(`Updated illustration wording in ${changed} pages/templates.`);
