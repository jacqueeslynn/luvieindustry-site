"""Assemble today's original source and complete locale editions reproducibly."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
guides=json.loads((ROOT/'content/daily-guides-20261009-source.json').read_text())
for guide in guides:
    guide['related'] += [g['file'] for g in guides if g['file'] != guide['file']]
localized=json.loads((ROOT/'content/daily-guides-20261009-locales.json').read_text())
for locale in ('es','pt-br','ar'):
    if len(localized[locale])!=len(guides):raise ValueError('Incomplete translations')
    for guide,copy in zip(guides,localized[locale]):guide[locale]=copy
(ROOT/'content/daily-guides-20261009.mjs').write_text("export const date = '2026-10-09';\nexport const guides = "+json.dumps(guides,ensure_ascii=False,indent=2)+';\n')
