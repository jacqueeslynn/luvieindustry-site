import fs from 'node:fs';
export const date='2026-11-20';
export const guides=[1,2,3].map(n=>JSON.parse(fs.readFileSync(new URL(`./nov20-a${n}.json`,import.meta.url),'utf8')));
