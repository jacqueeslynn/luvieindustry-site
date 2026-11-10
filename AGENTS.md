# Luvie website release rules

- Contact override authorized 2026-11-02: use globalsales@luvieindustry.com and +86 19005833027 (WhatsApp https://wa.me/8619005833027) for current website and new drafts. Older contact defaults in historical notes are superseded. Do not change PDF bodies. FormSubmit recipient activation/delivery must be verified separately; changing a link does not prove delivery.
- The 60-article Desktop review batch received explicit publication approval on 2026-11-06 ("上线这六十篇吧直接"). Its release source is content/review-batch-20261106.mjs, with 240 language URLs. Do not publish it again or count it as fresh content on later days. Preserve the Desktop originals. This one-off release does not change the daily cadence.

Read `.impeccable.md` for the approved audience and beige/brown design direction.

- Product hierarchy released from `content/product-series.mjs`: `/products/` → family `.html` → nested size/collection pages. Preserve original article URLs and dates; `refreshHomepageLatest()` also calls `refreshProductGuides()` to associate new guides automatically. Do not regenerate old product pages without restoring hierarchy modules. Run `node scripts/check-product-series.mjs` after product/navigation/contact edits. Catalog dimensions are source references, not inventory or performance guarantees.
- Homepage WhatsApp is a direct `wa.me/8619005833027` anchor, separate from `quickInquiryBtn` which opens the website quotation form. Never put WhatsApp behind that modal again. Nested product paths must survive inquiry source attribution. Contact clicks are not confirmed leads.

- Daily publishing remains three original English guides at 08:30 Asia/Shanghai, each with full Spanish, Brazilian Portuguese and Arabic counterparts. Do not increase counts or republish old work to imply new activity.
- Every article and product family must have an independent URL in all four languages, reciprocal hreflang, correct lang/RTL, canonical, sitemap entry and language-preserving product/article/catalog/inquiry routes. PDF files remain unchanged; localize their introductions and links.
- Never globally replace a short word inside translation strings. `or` to `o` previously corrupted Spanish spelling throughout the archive. Run the normalization regression tests and review paragraphs, not just labels.
- After publishing content, run `node scripts/refresh-homepage-latest.mjs` so all four homepages and article indexes surface genuinely recent content. Dates must come from published metadata, not the wall clock.
- Required release checks: `node scripts/audit-site-seo.mjs`, `python3 scripts/check-localized-archive.py`, `python3 scripts/test-translation-normalization.py`, applicable dated-guide checks and publishing unit tests. Do not treat a partial green check as complete multilingual acceptance.
- Verify changed pages visually at phone and desktop widths in all affected languages, test interaction and links, then verify public pages and the live sitemap after deployment. HTTP 200 is not proof of Google indexing or professional native-language editorial approval.
- Preserve real product facts. No invented certification, delivery time, pricing, MOQ, factory evidence or customer projects. Prefer existing product photos over concept imagery; disclose illustrations.
- Each new guide needs its own newly prepared, topic-specific image; never recycle another article's hero. Public captions may simply say illustration, without naming AI tools. Keep generation provenance internally and never imply that a concept is verified photography.
- Meaningful hourly work should close a documented defect or improve a full buyer journey, not repeatedly adjust isolated labels while major coverage gaps remain.
