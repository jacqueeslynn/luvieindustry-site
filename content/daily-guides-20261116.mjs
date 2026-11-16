import fs from 'node:fs';
export const date='2026-11-16';
export const guides=['brazil','uae','uzbekistan'].map(country=>JSON.parse(fs.readFileSync(new URL(`./nov16-${country}-draft.json`,import.meta.url),'utf8')));
