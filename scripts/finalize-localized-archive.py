"""Connect the completed language archive and publish canonical sitemap entries.

Run only after all Spanish, Brazilian Portuguese and Arabic article pages exist.
The script is idempotent and leaves PDF files untouched.
"""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://luvieindustry.com"
LOCALES = {"es": "es", "pt-br": "pt-BR", "ar": "ar"}
LABELS = {"en": "English", "es": "Español", "pt-br": "Português (Brasil)", "ar": "العربية"}
GUIDE = "fluted-wall-panels-distributor-guide.html"
SPECIAL = {
    "es": "/es/articles/panel-ranurado-pvc-pared.html",
    "pt-br": "/pt-br/articles/painel-ripado-pvc-parede.html",
    "ar": "/ar/articles/fluted-pvc-wall-panels.html",
}
CORE_NAV = {"es": "Guías", "pt-br": "Guias", "ar": "الأدلة"}


def english_pages() -> list[Path]:
    articles = ROOT / "articles"
    return [articles / "index.html", *sorted(path for path in articles.glob("*.html") if path.name != "index.html")]


def route_for(page: Path) -> str:
    return "/articles/" if page.name == "index.html" else f"/articles/{page.name}"


def localized_route(locale: str, route: str) -> str:
    return SPECIAL[locale] if route == f"/articles/{GUIDE}" else f"/{locale}{route}"


def hreflang_links(route: str) -> str:
    pairs = [("en", route), *[(tag, localized_route(locale, route)) for locale, tag in LOCALES.items()]]
    return "\n".join(f'<link rel="alternate" hreflang="{tag}" href="{BASE}{path}">' for tag, path in pairs)


def language_switch(route: str) -> str:
    pairs = [("en", route), *[(locale, localized_route(locale, route)) for locale in LOCALES]]
    anchors = ""
    for code, path in pairs:
        current = ' aria-current="page"' if code == "en" else ""
        anchors += f'<a href="{path}" lang="{LOCALES.get(code, "en")}"{current}>{LABELS[code]}</a>'
    return f'<nav class="language-switch" aria-label="Language versions">{anchors}</nav>'


def annotate_english(page: Path) -> None:
    route = route_for(page)
    html = page.read_text()
    if page.name == "index.html":
        replacement = language_switch(route).replace('class="language-switch"', 'class="container language-switch"')
        html = re.sub(r'<nav class="container language-entry"[^>]*>.*?</nav>', replacement, html, count=1, flags=re.S)
    elif 'class="language-switch"' not in html:
        breadcrumbs = re.search(r'<nav class="breadcrumbs"[^>]*>.*?</nav>', html, flags=re.S)
        if breadcrumbs:
            html = html[:breadcrumbs.end()] + language_switch(route) + html[breadcrumbs.end():]
        else:
            html = html.replace('<main', language_switch(route) + '<main', 1)
    if 'hreflang="es"' not in html:
        html = html.replace('</head>', hreflang_links(route) + '\n</head>', 1)
    page.write_text(html)


def add_core_navigation(locale: str) -> None:
    for relative in ("index.html", "contact.html", "products/pvc-wall-panels.html", "products/wpc-wall-panels.html"):
        page = ROOT / locale / relative
        html = page.read_text()
        target = f'href="/{locale}/articles/"'
        if target in html:
            continue
        contact = f'<a href="/{locale}/contact.html"'
        html = html.replace(contact, f'<a href="/{locale}/articles/">{CORE_NAV[locale]}</a>{contact}', 1)
        page.write_text(html)


def update_sitemap() -> None:
    sitemap = ROOT / "sitemap.xml"
    ns = "http://www.sitemaps.org/schemas/sitemap/0.9"
    ET.register_namespace("", ns)
    tree = ET.parse(sitemap)
    root = tree.getroot()
    existing = {node.text for node in root.findall(f"{{{ns}}}url/{{{ns}}}loc")}
    for page in english_pages():
        route = route_for(page)
        for path, priority in [(route, "0.8"), *[(localized_route(locale, route), "0.7") for locale in LOCALES]]:
            url = BASE + path
            if url in existing:
                continue
            element = ET.SubElement(root, f"{{{ns}}}url")
            ET.SubElement(element, f"{{{ns}}}loc").text = url
            ET.SubElement(element, f"{{{ns}}}lastmod").text = "2026-10-03"
            ET.SubElement(element, f"{{{ns}}}priority").text = priority
            existing.add(url)
    ET.indent(tree, space="    ")
    tree.write(sitemap, encoding="utf-8", xml_declaration=True)


def main() -> None:
    pages = english_pages()
    for page in pages:
        route = route_for(page)
        for locale in LOCALES:
            target = ROOT / localized_route(locale, route).lstrip("/")
            if target.suffix != ".html":
                target /= "index.html"
            if not target.exists():
                raise RuntimeError(f"Missing translated page: {target}")
    for page in pages:
        annotate_english(page)
    for locale in LOCALES:
        add_core_navigation(locale)
    update_sitemap()
    print(f"Connected {len(pages)} English archive pages to three complete language archives and updated sitemap")


if __name__ == "__main__":
    main()
