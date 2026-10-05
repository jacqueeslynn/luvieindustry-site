"""Build the English-only public PU stone catalog from the archived image PDF.

The supplier source is preserved. Its first two pages have bilingual rasterized
color labels and page six has one Chinese note; this script replaces only those
label areas and adds the already-approved English Luvie cover image.
"""

from pathlib import Path

import pymupdf


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/catalogs/pu-stone-panel-catalog.pdf"
COVER = ROOT / "assets/catalogs/covers/pu-stone-panel.jpg"
OUTPUT = ROOT / "assets/catalogs/pu-stone-panel-catalog-en.pdf"


def replace_label(page, rect, number, name):
    area = pymupdf.Rect(*rect)
    page.draw_rect(area, color=None, fill=(1, 1, 1), overlay=True)
    for label, font, size, baseline in [
        (f"Color {number}", "helv", 10, area.y0 + 15),
        (name, "hebo", 11, area.y0 + 32),
    ]:
        width = pymupdf.get_text_length(label, fontname=font, fontsize=size)
        if width > area.width:
            raise ValueError(f"Label does not fit: {label}")
        page.insert_text((area.x0 + (area.width - width) / 2, baseline), label, fontname=font, fontsize=size, color=(0.21, 0.16, 0.12))


def main():
    source = pymupdf.open(SOURCE)
    if source.page_count != 8:
        raise ValueError(f"Expected 8 source pages, found {source.page_count}")

    output = pymupdf.open()
    page_size = source[0].rect
    cover = output.new_page(width=page_size.width, height=page_size.height)
    cover.insert_image(cover.rect, filename=str(COVER), keep_proportion=False)
    output.insert_pdf(source)

    columns = [(28, 190), (212, 383), (404, 573)]
    first_page_rows = [
        (226, 271, [(1, "Alabaster"), (2, "Hanyu White"), (3, "Clear Water Grey")]),
        (455, 516, [(4, "Volcanic Grey"), (10, "Magnolia"), (11, "Cement Grey")]),
        (703, 772, [(15, "Light Golden Hemp"), (7, "Golden Grain"), (5, "Elegant Black")]),
    ]
    second_page_rows = [
        (226, 286, [(6, "Pretty Black"), (12, "Rammed Earth Yellow"), (8, "Rouge Hermes")]),
        (455, 517, [(9, "Sapphire Blue"), (13, "Peacock Green"), (14, "Brick Red")]),
    ]
    for page_index, rows in [(1, first_page_rows), (2, second_page_rows)]:
        page = output[page_index]
        for y0, y1, labels in rows:
            for (x0, x1), (number, name) in zip(columns, labels):
                replace_label(page, (x0, y0, x1, y1), number, name)

    note_page = output[6]
    note_area = pymupdf.Rect(454, 557, 560, 589)
    note_page.draw_rect(note_area, color=None, fill=(1, 1, 1), overlay=True)
    if note_page.insert_textbox(note_area, "Rear face without\nreinforcing ribs", fontname="helv", fontsize=8.5, align=1, color=(0.21, 0.16, 0.12)) < 0:
        raise ValueError("Rear-face note does not fit")

    output.set_metadata({"title": "Luvie PU Stone Panel Catalog - English Edition", "author": "Luvie Industry"})
    output.save(OUTPUT, garbage=4, deflate=True)
    output.close()
    source.close()
    print(OUTPUT)


if __name__ == "__main__":
    main()
