# November 25 profile-width calculation: editorial evidence

Status: draft, not published or independently validated.

Product path checked in local source: `/products/pvc-ceiling-panels.html` links `/assets/catalogs/dream-house-wall-panel-catalog.pdf` four times. That is the existing family catalog, not a source confirming hypothetical widths.

All 250/240 mm widths, 4,000 mm room span, 3 m board length and ten-board pack inputs are expressly hypothetical. Arithmetic: ceil(4000/250)=16; ceil(4000/240)=17; 17*240=4080; 16*240=3840; ceil(16/10)=ceil(17/10)=2. Ten equal rooms: 160 vs 170 pieces and 16 vs 17 packs before any reserve. These figures are not inventory, Luvie specifications, waste percentages or country requirements.

Overlap inspected in full text: `articles/calculate-wall-panel-order-quantity.html` already explains net width, row counting, cutting allowance and carton rounding. This new article must remain a worked comparison, not be marketed as a new method. Its substantive additional analysis is the two-profile same-nominal-width calculation, equal one-room pack totals masking unequal surplus, and multi-room aggregation producing 16 versus 17 packs. Brazil is the quotation destination, not evidence of a different physical rule. The existing workflow is linked as related guidance.

Publisher inspection: Nov23 publisher consumes `sources` and optional `referenceNames`; it uses localized heading as image alt. It does not consume `imageAlt` or `sourceNote`. Those extra fields were not added as dead data. Internal reference must not be titled “Independent reference”; main publisher should localize this as “Calculation basis and product reference”, since no independent performance claim is made.

Still required: unique topic image, full release schema/link tests, rendered four-language desktop/mobile review and live verification.
