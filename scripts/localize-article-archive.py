"""Build crawlable article translations from the English archive.

The translator command must accept `--from en --to LANGUAGE TEXT` and emit one
translated string. Cache entries are committed so future builds don't require
retranslating unchanged paragraphs. Generated pages are reviewed before release.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse

from bs4 import BeautifulSoup, Comment, Doctype

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://luvieindustry.com"
LANGS = {"es": "es", "pt-br": "pt-BR", "ar": "ar"}
TRANSLATOR_CODES = {"es": "es", "pt-br": "pt-BR", "ar": "ar"}
FIRST_GUIDES = {
    "es": "/es/articles/panel-ranurado-pvc-pared.html",
    "pt-br": "/pt-br/articles/painel-ripado-pvc-parede.html",
    "ar": "/ar/articles/fluted-pvc-wall-panels.html",
}
ENGLISH_GUIDE = "/articles/fluted-wall-panels-distributor-guide.html"
BRAND_TERMS = {"Luvie", "Luvie Industry", "PVC", "WPC", "SPC", "OEM", "ODM", "FOB", "CIF", "ISO 9001"}
LANG_LABELS = {"en": "English", "es": "Español", "pt-br": "Português (Brasil)", "ar": "العربية"}
LANG_SWITCH_LABELS = {"es": "Versiones de idioma", "pt-br": "Versões de idioma", "ar": "إصدارات اللغة"}
TRANSLATION_OVERRIDES = {
    "es": {"Home": "Inicio", "Product catalog": "Catálogo de productos", "Resources": "Guías", "or": "o", "Manufacturing": "Fabricación", "Haining Luvie Import & Export Co., Ltd.": "Haining Luvie Import & Export Co., Ltd."},
    "pt-br": {"Home": "Início", "Product catalog": "Catálogo de produtos", "Resources": "Guias", "Manufacturing": "Fabricação", "Haining Luvie Import & Export Co., Ltd.": "Haining Luvie Import & Export Co., Ltd."},
    "ar": {"Home": "الرئيسية", "Product catalog": "كتالوج المنتجات", "Resources": "الأدلة", "Haining Luvie Import & Export Co., Ltd.": "Haining Luvie Import & Export Co., Ltd."},
}


def source_pages() -> list[Path]:
    articles = ROOT / "articles"
    return [
        ROOT / "index.html",
        articles / "index.html",
        *sorted(path for path in articles.glob("*.html") if path.name not in {"index.html", "fluted-wall-panels-distributor-guide.html"}),
        *sorted((ROOT / "products").glob("*.html")),
    ]


def translated_path(locale: str, source: Path) -> Path:
    return ROOT / locale / source.relative_to(ROOT)


def localized_url(locale: str, source_path: str) -> str:
    if source_path == ENGLISH_GUIDE:
        return FIRST_GUIDES[locale]
    if source_path == "/":
        return f"/{locale}/"
    if source_path == "/articles/" or (source_path.startswith("/articles/") and source_path.endswith(".html")) or (source_path.startswith("/products/") and source_path.endswith(".html")):
        return f"/{locale}{source_path}"
    return source_path


def route_for_source(source: Path) -> str:
    return "/" + source.relative_to(ROOT).as_posix().replace("index.html", "") if source.name == "index.html" else "/" + source.relative_to(ROOT).as_posix()


def rewrite_link(value: str, source: Path, locale: str) -> str:
    if not value or value.startswith(("mailto:", "tel:", "javascript:", "data:")):
        return value
    if value.startswith("#"):
        return value
    absolute = urljoin(f"{BASE}{route_for_source(source)}", value)
    parsed = urlparse(absolute)
    if parsed.netloc not in {"luvieindustry.com", "www.luvieindustry.com"}:
        return value
    new_path = localized_url(locale, parsed.path)
    return urlunparse(("", "", new_path, "", parsed.query, parsed.fragment))


def text_candidates(soup: BeautifulSoup) -> set[str]:
    values: set[str] = set()
    for node in soup.find_all(string=True):
        if isinstance(node, (Comment, Doctype)) or node.parent.name in {"script", "style", "noscript", "svg", "code", "pre"}:
            continue
        text = str(node).strip()
        if text and text not in BRAND_TERMS and any(char.isalpha() for char in text):
            values.add(text)
    for tag in soup.find_all(True):
        for attribute in ("alt", "placeholder", "aria-label", "title"):
            value = tag.get(attribute)
            if isinstance(value, str) and value.strip() and value.strip() not in BRAND_TERMS and any(char.isalpha() for char in value):
                values.add(value.strip())
        if tag.name == "meta" and tag.get("name") in {"description", "twitter:title", "twitter:description"}:
            values.add(tag.get("content", "").strip())
        if tag.name == "meta" and tag.get("property") in {"og:title", "og:description"}:
            values.add(tag.get("content", "").strip())
        if tag.name == "script" and tag.get("type") == "application/ld+json" and tag.string:
            try:
                data = json.loads(tag.string)
            except json.JSONDecodeError:
                continue
            def collect(item):
                if isinstance(item, dict):
                    for key, value in item.items():
                        if key in {"headline", "name", "description", "text"} and isinstance(value, str):
                            values.add(value.strip())
                        else:
                            collect(value)
                elif isinstance(item, list):
                    for value in item:
                        collect(value)
            collect(data)
    return {value for value in values if value and value not in BRAND_TERMS and not value.startswith("http")}


def translation_cache(locale: str) -> tuple[Path, dict[str, str]]:
    path = ROOT / "content" / "translations" / f"{locale}.json"
    return path, json.loads(path.read_text()) if path.exists() else {}


def save_cache(path: Path, cache: dict[str, str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n")


def translate_missing(locale: str, values: set[str], cache: dict[str, str], cache_path: Path, command: str, limit: int | None, jobs: int, quality: str = "high") -> None:
    missing = sorted(value for value in values if value not in cache)
    print(f"{locale}: {len(missing)} untranslated strings, {sum(map(len, missing))} characters", flush=True)
    if limit is not None:
        missing = missing[:limit]
    for offset in range(0, len(missing), 100):
        batch = missing[offset:offset + 100]
        response = subprocess.run(
            [command, "--from", "en", "--to", TRANSLATOR_CODES[locale], "--quality", quality, "--concurrency", str(jobs), "--buffer-size", "4096"],
            input="\n".join(batch) + "\n", text=True, capture_output=True, check=False, timeout=180,
        )
        targets = [line.strip() for line in response.stdout.splitlines() if line.strip()]
        if response.returncode or len(targets) != len(batch):
            raise RuntimeError(f"translation batch failed for {locale} at {offset}: {len(targets)}/{len(batch)}: {response.stderr.strip()[:300]}")
        cache.update(zip(batch, targets))
        save_cache(cache_path, cache)
        print(f"{locale}: translated {min(offset + 100, len(missing))}/{len(missing)}", flush=True)


def translate_soup(soup: BeautifulSoup, cache: dict[str, str]) -> None:
    for node in list(soup.find_all(string=True)):
        if isinstance(node, (Comment, Doctype)) or node.parent.name in {"script", "style", "noscript", "svg", "code", "pre"}:
            continue
        text = str(node)
        stripped = text.strip()
        if stripped in cache:
            prefix = text[: len(text) - len(text.lstrip())]
            suffix = text[len(text.rstrip()) :]
            node.replace_with(prefix + cache[stripped] + suffix)
    for tag in soup.find_all(True):
        for attribute in ("alt", "placeholder", "aria-label", "title"):
            value = tag.get(attribute)
            if isinstance(value, str) and value.strip() in cache:
                tag[attribute] = cache[value.strip()]
        if tag.name == "meta" and tag.get("name") in {"description", "twitter:title", "twitter:description"}:
            value = tag.get("content", "").strip()
            if value in cache:
                tag["content"] = cache[value]
        if tag.name == "meta" and tag.get("property") in {"og:title", "og:description"}:
            value = tag.get("content", "").strip()
            if value in cache:
                tag["content"] = cache[value]
    if soup.title and soup.title.string and soup.title.string.strip() in cache:
        soup.title.string = cache[soup.title.string.strip()]


def localized_alternates(soup: BeautifulSoup, source: Path, locale: str) -> None:
    source_route = route_for_source(source)
    canonical = soup.head.find("link", rel="canonical")
    local_route = localized_url(locale, source_route)
    if canonical:
        canonical["href"] = BASE + local_route
    else:
        soup.head.append(soup.new_tag("link", rel="canonical", href=BASE + local_route))
    for tag in soup.head.find_all("link", rel="alternate"):
        if tag.get("hreflang"):
            tag.decompose()
    for language, route in [("en", source_route), *[(LANGS[code], localized_url(code, source_route)) for code in LANGS]]:
        soup.head.append(soup.new_tag("link", rel="alternate", hreflang=language, href=BASE + route))
    soup.html["lang"] = LANGS[locale]
    soup.html["dir"] = "rtl" if locale == "ar" else "ltr"
    for tag in soup.find_all("meta", property="og:url"):
        tag["content"] = BASE + local_route
    for tag in soup.find_all("script", type="application/ld+json"):
        if not tag.string:
            continue
        try:
            data = json.loads(tag.string)
        except json.JSONDecodeError:
            continue
        def update(item):
            if isinstance(item, dict):
                if item.get("@type") in {"Article", "WebPage", "CollectionPage", "BlogPosting"}:
                    item["inLanguage"] = LANGS[locale]
                for key, value in item.items():
                    if key in {"url", "item", "mainEntityOfPage", "@id"} and isinstance(value, str) and value.startswith((BASE + "/articles/", BASE + "/products/")):
                        item[key] = BASE + localized_url(locale, value[len(BASE):])
                    elif key in {"headline", "name", "description", "text"} and isinstance(value, str) and value in cache_for_schema:
                        item[key] = cache_for_schema[value]
                    else:
                        update(value)
            elif isinstance(item, list):
                for value in item:
                    update(value)
        cache_for_schema = getattr(soup, "_translation_cache", {})
        update(data)
        tag.string = json.dumps(data, ensure_ascii=False, separators=(",", ":"))


def language_switch(soup: BeautifulSoup, source: Path, locale: str) -> None:
    source_route = route_for_source(source)
    is_product = source.parent.name == "products"
    is_home = source == ROOT / "index.html"
    old = soup.find("nav", class_="language-switch") or soup.find("nav", class_="language-entry") or (soup.find("nav", class_="language-links") if is_product else None) or (soup.find("nav", class_="locale-nav") if is_home else None)
    if old:
        old.decompose()
    nav_class = "container language-links" if is_product else ("locale-nav" if is_home else "language-switch")
    nav = soup.new_tag("nav", attrs={"class": nav_class, "aria-label": LANG_SWITCH_LABELS[locale]})
    for code, route in [("en", source_route), *[(name, localized_url(name, source_route)) for name in LANGS]]:
        anchor = soup.new_tag("a", href=route, lang="en" if code == "en" else LANGS[code])
        anchor.string = LANG_LABELS[code]
        if code == locale:
            anchor["aria-current"] = "page"
        nav.append(anchor)
    reference = soup.find("nav", class_="breadcrumbs") or soup.find("nav", class_="resource-topic-nav") or soup.find("header")
    if is_home and reference:
        reference.append(nav)
    elif reference:
        reference.insert_after(nav)
    elif soup.body:
        soup.body.insert(0, nav)


def process_page(source: Path, locale: str, cache: dict[str, str]) -> None:
    soup = BeautifulSoup(source.read_text(), "html.parser")
    # BeautifulSoup serialization keeps script/style content but normalizes HTML.
    translate_soup(soup, cache)
    for tag in soup.find_all(True):
        for attribute in ("href", "src", "action", "poster"):
            if isinstance(tag.get(attribute), str):
                tag[attribute] = rewrite_link(tag[attribute], source, locale)
    soup._translation_cache = cache
    localized_alternates(soup, source, locale)
    language_switch(soup, source, locale)
    if source == ROOT / "index.html":
        dynamic_text = {
            "es": {"Sending...": "Enviando...", "Send Inquiry": "Enviar consulta"},
            "pt-br": {"Sending...": "Enviando...", "Send Inquiry": "Enviar consulta"},
            "ar": {"Sending...": "جارٍ الإرسال...", "Send Inquiry": "إرسال الاستفسار"},
        }
        for script in soup.find_all("script"):
            if script.string and "submitBtn.textContent" in script.string:
                source_code = script.string
                for english, translated in dynamic_text[locale].items():
                    source_code = source_code.replace(f"'{english}'", f"'{translated}'")
                script.string = source_code
    destination = translated_path(locale, source)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(str(soup).rstrip("\n") + "\n")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--locale", choices=LANGS, required=True)
    parser.add_argument("--translator", default="trn")
    parser.add_argument("--jobs", type=int, default=4)
    parser.add_argument("--limit", type=int, help="Translate only first N missing strings and stop; useful for testing")
    parser.add_argument("--count-only", action="store_true")
    args = parser.parse_args()
    pages = source_pages()
    soups = [BeautifulSoup(page.read_text(), "html.parser") for page in pages]
    values = set().union(*(text_candidates(soup) for soup in soups))
    cache_path, cache = translation_cache(args.locale)
    cache.update(TRANSLATION_OVERRIDES[args.locale])
    if args.count_only:
        print(f"{len(pages)} pages; {len(values)} unique strings; {sum(map(len, values))} characters")
        return
    translate_missing(args.locale, values, cache, cache_path, args.translator, args.limit, args.jobs)
    if args.limit is not None:
        return
    for source in pages:
        process_page(source, args.locale, cache)
    print(f"{args.locale}: built {len(pages)} localized article pages", flush=True)


if __name__ == "__main__":
    main()
