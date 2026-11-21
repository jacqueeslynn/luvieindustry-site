import fs from 'node:fs';
export const date='2026-11-21';
export const guides=[1,2,3].map(n=>JSON.parse(fs.readFileSync(new URL(`./nov21-${n}.json`,import.meta.url),'utf8')));
