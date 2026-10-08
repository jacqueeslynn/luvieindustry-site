"""Check published-language completeness, SEO tags, links and article images."""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

from bs4 import BeautifulSoup, Comment, Doctype

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://luvieindustry.com"
LOCALES = {"es": "es", "pt-br": "pt-BR", "ar": "ar"}
SPECIAL = {
    "es": "/es/articles/panel-ranurado-pvc-pared.html",
    "pt-br": "/pt-br/articles/painel-ripado-pvc-parede.html",
    "ar": "/ar/articles/fluted-pvc-wall-panels.html",
}
GUIDE = "/articles/fluted-wall-panels-distributor-guide.html"


def route(page: Path) -> str:
    return "/articles/" if page.name == "index.html" else f"/articles/{page.name}"


def locale_route(code: str, source_route: str) -> str:
    return SPECIAL[code] if source_route == GUIDE else f"/{code}{source_route}"


def local_file(url_path: str) -> Path:
    path = ROOT / unquote(url_path).lstrip("/")
    return path / "index.html" if url_path.endswith("/") else path


errors: list[str] = []
warnings: list[str] = []
source_pages = sorted((ROOT / "articles").glob("*.html"))

for source in source_pages:
    source_route = route(source)
    for code, language in LOCALES.items():
        target_route = locale_route(code, source_route)
        target = local_file(target_route)
        if not target.exists():
            errors.append(f"missing: {target_route}")
            continue
        soup = BeautifulSoup(target.read_text(), "html.parser")
        if soup.html.get("lang") != language or (code == "ar" and soup.html.get("dir") != "rtl"):
            errors.append(f"language/dir: {target_route}")
        canonical = soup.find("link", rel="canonical")
        if not canonical or canonical.get("href") != BASE + target_route:
            errors.append(f"canonical: {target_route}")
        if not soup.title or not soup.title.get_text(strip=True) or not soup.find("h1"):
            errors.append(f"title/h1: {target_route}")
        if source_route != GUIDE:
            alternates = {tag.get("hreflang"): tag.get("href") for tag in soup.find_all("link", rel="alternate") if tag.get("hreflang")}
            if set(alternates) != {"en", "es", "pt-BR", "ar"}:
                errors.append(f"hreflang: {target_route}")
            if not soup.select_one('nav.language-switch, nav.languages, nav.language-links'):
                errors.append(f"language switch: {target_route}")
        for tag in soup.find_all(True):
            for key in ("href", "src"):
                value = tag.get(key)
                if not isinstance(value, str) or value.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
                    continue
                parsed = urlparse(value)
                if parsed.netloc and parsed.netloc not in {"luvieindustry.com", "www.luvieindustry.com"}:
                    continue
                if not parsed.path.startswith("/"):
                    parsed = urlparse(urljoin(BASE + target_route, value))
                if not local_file(parsed.path).exists():
                    errors.append(f"broken {key}: {target_route}: {value}")
        if source_route != GUIDE:
            visible = " ".join(str(node).strip() for node in soup.find_all(string=True) if not isinstance(node, (Comment, Doctype)) and node.parent.name not in {"script", "style"})
            english_sentences = re.findall(r"\b(?:the|and|before|buyer|supplier|installation|sample|wall)\b(?:\W+\w+){8,}[.!?]", visible, flags=re.I)
            for sentence in english_sentences[:3]:
                if sum(c.isascii() and c.isalpha() for c in sentence) > 50:
                    warnings.append(f"possible English text: {target_route}: {sentence[:100]}")

for source_route in ("/", *[f'/products/{p.name}' for p in sorted((ROOT/'products').glob('*.html'))]):
    english = BeautifulSoup(local_file(source_route).read_text(), "html.parser")
    expected_sections = len(english.find_all("section"))
    for code, language in LOCALES.items():
        target_route = f"/{code}{source_route}"
        target = local_file(target_route)
        if not target.exists():
            errors.append(f"missing core page: {target_route}")
            continue
        soup = BeautifulSoup(target.read_text(), "html.parser")
        if soup.html.get("lang") != language or (code == "ar" and soup.html.get("dir") != "rtl"):
            errors.append(f"core language/dir: {target_route}")
        if len(soup.find_all("section")) != expected_sections:
            errors.append(f"core section parity: {target_route}: {len(soup.find_all('section'))}/{expected_sections}")
        canonical = soup.find("link", rel="canonical")
        if not canonical or canonical.get("href") != BASE + target_route:
            errors.append(f"core canonical: {target_route}")
        if source_route == "/":
            studio = soup.find(id="project-finder")
            tabs = studio.find_all(attrs={"data-decision-tab": True}) if studio else []
            panels = studio.find_all(attrs={"data-decision-panel": True}) if studio else []
            if len(tabs) != 4 or len(panels) != 4:
                errors.append(f"project finder parity: {target_route}")
            elif any(tab.get("aria-controls") != panel.get("id") for tab, panel in zip(tabs, panels)):
                errors.append(f"project finder tab pairing: {target_route}")
            if not soup.find("script", src=re.compile(r"/assets/site-interactions\.js")):
                errors.append(f"project finder script: {target_route}")
        for tag in soup.find_all(True):
            for key in ("href", "src"):
                value = tag.get(key)
                if not isinstance(value, str) or value.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
                    continue
                parsed = urlparse(value)
                if parsed.netloc and parsed.netloc not in {"luvieindustry.com", "www.luvieindustry.com"}:
                    continue
                if parsed.path.startswith("/") and not local_file(parsed.path).exists():
                    errors.append(f"broken core {key}: {target_route}: {value}")

ns = "http://www.sitemaps.org/schemas/sitemap/0.9"
tree = ET.parse(ROOT / "sitemap.xml")
sitemap_urls = [node.text for node in tree.getroot().findall(f"{{{ns}}}url/{{{ns}}}loc")]
if len(sitemap_urls) != len(set(sitemap_urls)):
    errors.append("duplicate sitemap URLs")
for source in source_pages:
    source_route = route(source)
    for target_route in [source_route, *[locale_route(code, source_route) for code in LOCALES]]:
        if BASE + target_route not in sitemap_urls:
            errors.append(f"sitemap missing: {target_route}")

for product in (ROOT/'products').glob('*.html'):
    route=f'/products/{product.name}'
    for prefix in ('', '/es', '/pt-br', '/ar'):
        target=prefix+route
        soup=BeautifulSoup(local_file(target).read_text(),'html.parser')
        if BASE+target not in sitemap_urls: errors.append(f'sitemap missing product: {target}')
        expected={'en':BASE+route,**{tag:BASE+f'/{code}'+route for code,tag in LOCALES.items()}}
        actual={x.get('hreflang'):x.get('href') for x in soup.find_all('link',rel='alternate')}
        if any(actual.get(k)!=v for k,v in expected.items()): errors.append(f'product hreflang: {target}')

for page in (ROOT/'es').rglob('*.html'):
    if re.search(r'\b(?:decoativos|sopote|coodinación|expotación|compradorr)\b',page.read_text(),re.I):
        errors.append(f'known Spanish spelling regression: {page.relative_to(ROOT)}')

# A new batch must be discoverable on the homepage, not buried at the archive end.
for code in ('',*LOCALES):
    prefix=f'/{code}' if code else ''
    home=BeautifulSoup(local_file(prefix+'/').read_text(),'html.parser')
    recent=home.select('#latest-guides a.latest-guide')
    dates=[]
    for file in (ROOT/code/'articles').glob('*.html'):
        article=BeautifulSoup(file.read_text(),'html.parser')
        published=article.find('meta',property='article:published_time')
        if published:dates.append(published['content'])
    newest=max(dates)
    if len(recent)!=3: errors.append(f'homepage recent guide count: {prefix or "/"}')
    for card in recent:
        if not card.find('time') or card.time.get('datetime')!=newest: errors.append(f'stale homepage guide: {prefix or "/"}')

regional_images = [
    "pvc-ceiling-brazil-installation.webp", "pvc-hot-climate-sample-review.webp",
    "uzbekistan-panel-shipment-check.webp", "coastal-humid-interior-panel-check.webp",
    "gulf-hospitality-panel-evidence.webp",
]
for image in regional_images:
    path = ROOT / "assets" / "articles" / image
    if not path.exists() or path.stat().st_size > 150_000:
        errors.append(f"missing or oversized regional image: {image}")

print(f"Checked {len(source_pages)} English archive pages and {len(source_pages) * 3} localized counterparts")
print(f"Errors: {len(errors)}; warnings: {len(warnings)}")
for issue in errors[:80]:
    print("ERROR", issue)
for issue in warnings[:30]:
    print("WARN", issue)
if errors:
    raise SystemExit(1)
