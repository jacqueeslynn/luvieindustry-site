#!/usr/bin/env bash
set -euo pipefail

batch_count="$1"
sleep_after_batch="$2"

for ((slot = 1; slot <= batch_count; slot++)); do
  git pull --ff-only origin main
  git fetch origin content/hourly-20-20261004:refs/remotes/origin/content/hourly-20-20261004
  node scripts/publish-hourly-20.mjs
  node scripts/audit-site-seo.mjs
  node --test scripts/publish-hourly-20.test.mjs

  if test -z "$(git status --porcelain)"; then
    echo "No article was released for slot ${slot}; stopping to avoid a false success."
    exit 1
  fi

  git add .github/hourly-publish-state.json articles sitemap.xml
  git commit -m "content: publish scheduled buyer answer"
  git push origin main

  if ((slot < batch_count)) || [[ "$sleep_after_batch" == "true" ]]; then
    sleep 1140
  fi
done
