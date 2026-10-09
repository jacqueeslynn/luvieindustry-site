# Luvie website release rules

Read `.impeccable.md` for the approved audience and beige/brown design direction.

- Daily publishing remains three original English guides at 08:30 Asia/Shanghai, each with full Spanish, Brazilian Portuguese and Arabic counterparts. Do not increase counts or republish old work to imply new activity.
- Every article and product family must have an independent URL in all four languages, reciprocal hreflang, correct lang/RTL, canonical, sitemap entry and language-preserving product/article/catalog/inquiry routes. PDF files remain unchanged; localize their introductions and links.
- Never globally replace a short word inside translation strings. `or` to `o` previously corrupted Spanish spelling throughout the archive. Run the normalization regression tests and review paragraphs, not just labels.
- After publishing content, run `node scripts/refresh-homepage-latest.mjs` so all four homepages and article indexes surface genuinely recent content. Dates must come from published metadata, not the wall clock.
- Required release checks: `node scripts/audit-site-seo.mjs`, `python3 scripts/check-localized-archive.py`, `python3 scripts/test-translation-normalization.py`, applicable dated-guide checks and publishing unit tests. Do not treat a partial green check as complete multilingual acceptance.
- Verify changed pages visually at phone and desktop widths in all affected languages, test interaction and links, then verify public pages and the live sitemap after deployment. HTTP 200 is not proof of Google indexing or professional native-language editorial approval.
- Preserve real product facts. No invented certification, delivery time, pricing, MOQ, factory evidence or customer projects. Prefer existing product photos over concept imagery; disclose illustrations.
- Each new guide needs its own newly prepared, topic-specific image; never recycle another article's hero. Public captions may simply say illustration, without naming AI tools. Keep generation provenance internally and never imply that a concept is verified photography.
- Meaningful hourly work should close a documented defect or improve a full buyer journey, not repeatedly adjust isolated labels while major coverage gaps remain.
