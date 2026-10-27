# Inquiry path improvement — October 28

Observed: localized contact pages only offered mailto/WhatsApp, despite existing localized homepage forms. Product and latest-article users had no explicit link to those web forms.

Added localized online-form entrances to all 24 product-family pages, 12 October 27 guide pages, and three localized contact pages. Four homepage forms accept a validated source path and open through their existing trigger/focus flow. New funnel events: inquiry_open, inquiry_start, inquiry_submit_attempt, inquiry_error. No personal fields enter these event payloads. Existing generate_lead remains service-acceptance feedback, not proof of inbox delivery.

Validation: four-language mobile/desktop product-to-form navigation and source preservation; request-intercepted failure/retry/success tests with zero real emails. Failure preserves text and reenables submit. Screenshots in ../verification-inquiry-20261028. Existing modal entrance animation requires stable/disabled-animation screenshots for final visual review.

New routing checker in CI prevents missing/duplicate entrances. Regenerate these entrances with node scripts/refresh-inquiry-path.mjs if source pages are rebuilt. SEO local-link audit now strips query strings as well as fragments before filesystem checks.

Limits: no GA/Search Console traffic-quality diagnosis, inbox-delivery test, conversion-rate improvement claim, or changes to daily publication scheduling. Older article entrances remain outside this release.
