#!/usr/bin/env node

const seeds = [
  "are pvc wall panels",
  "can pvc wall panels",
  "how pvc wall panels",
  "are wpc wall panels",
  "can wpc wall panels",
  "are pu stone panels",
  "are uv marble sheets",
  "how much wall panel"
];

const records = [];

for (const seed of seeds) {
  const url = new URL("https://suggestqueries.google.com/complete/search");
  url.searchParams.set("client", "firefox");
  url.searchParams.set("hl", "en");
  url.searchParams.set("q", seed);

  const response = await fetch(url, {
    headers: {"accept-language": "en-US,en;q=0.9"}
  });

  if (!response.ok) {
    throw new Error(`Google suggestions failed for "${seed}": ${response.status}`);
  }

  const [, suggestions = []] = await response.json();
  for (const question of suggestions) {
    records.push({question, sourceSeed: seed});
  }
}

const unique = [...new Map(records.map((record) => [record.question, record])).values()];

process.stdout.write(`${JSON.stringify({
  generatedAt: new Date().toISOString(),
  language: "en",
  source: "Google autocomplete",
  questions: unique
}, null, 2)}\n`);
