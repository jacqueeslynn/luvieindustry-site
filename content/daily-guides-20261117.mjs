import fs from 'node:fs';
export const date='2026-11-17';
export const guides=['chile','saudi','mexico'].map(country=>JSON.parse(fs.readFileSync(new URL(`./nov17-${country}-draft.json`,import.meta.url),'utf8')));
