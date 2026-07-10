import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
ARTICLES_DIR = ROOT / "articles"
SITE_ORIGIN = "https://luvieindustry.com"
APPROVED_PHONE = "+30 6947135317"
PROHIBITED_CLAIMS = (
    "best in the world",
    "lowest price",
    "lifetime warranty",
    "zero formaldehyde",
)
VOID_ELEMENTS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}


class SiteHTMLParser(HTMLParser):
    """Collect only the HTML details needed by the static-site checks."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.titles = []
        self.h1s = []
        self.meta_descriptions = []
        self.canonicals = []
        self.json_ld_blocks = []
        self.hrefs = []
        self.times = []
        self.visible_text_parts = []
        self._captures = []
        self._body_depth = 0
        self._hidden_depth = 0
        self._element_stack = []

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        attributes = {key.lower(): value or "" for key, value in attrs}

        if tag == "body":
            self._body_depth += 1
        inline_style = attributes.get("style", "")
        hides_content = (
            tag in {"head", "script", "style", "template", "noscript"}
            or "hidden" in attributes
            or attributes.get("aria-hidden", "").strip().casefold() == "true"
            or re.search(
                r"(?:^|;)\s*display\s*:\s*none(?:\s*!important)?\s*(?:;|$)",
                inline_style,
                re.I,
            )
            or re.search(
                r"(?:^|;)\s*visibility\s*:\s*hidden(?:\s*!important)?\s*(?:;|$)",
                inline_style,
                re.I,
            )
        )
        if tag not in VOID_ELEMENTS:
            hides_content = bool(hides_content)
            self._element_stack.append((tag, hides_content))
            if hides_content:
                self._hidden_depth += 1

        if tag == "meta" and attributes.get("name", "").lower() == "description":
            self.meta_descriptions.append(attributes.get("content", "").strip())
        if tag == "link":
            rels = {part.lower() for part in attributes.get("rel", "").split()}
            if "canonical" in rels:
                self.canonicals.append(attributes.get("href", "").strip())
        if tag in {"a", "link"} and "href" in attributes:
            self.hrefs.append(attributes["href"].strip())

        capture_kind = None
        capture_attrs = attributes
        if tag == "title":
            capture_kind = "title"
        elif tag == "h1":
            capture_kind = "h1"
        elif tag == "time":
            capture_kind = "time"
        elif tag == "script" and attributes.get("type", "").lower() == "application/ld+json":
            capture_kind = "json_ld"
        if capture_kind:
            self._captures.append(
                {
                    "tag": tag,
                    "kind": capture_kind,
                    "attrs": capture_attrs,
                    "parts": [],
                    "visible": self._body_depth > 0 and self._hidden_depth == 0,
                }
            )

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag):
        tag = tag.lower()
        for index in range(len(self._captures) - 1, -1, -1):
            capture = self._captures[index]
            if capture["tag"] != tag:
                continue
            self._captures.pop(index)
            text = " ".join("".join(capture["parts"]).split())
            if capture["kind"] == "title":
                self.titles.append(text)
            elif capture["kind"] == "h1":
                self.h1s.append(text)
            elif capture["kind"] == "time":
                if capture["visible"]:
                    self.times.append((capture["attrs"], text))
            else:
                self.json_ld_blocks.append("".join(capture["parts"]).strip())
            break

        if tag == "body" and self._body_depth:
            self._body_depth -= 1
        matching_indexes = [
            index
            for index, (open_tag, _) in enumerate(self._element_stack)
            if open_tag == tag
        ]
        if matching_indexes:
            closing_entries = self._element_stack[matching_indexes[-1]:]
            del self._element_stack[matching_indexes[-1]:]
            self._hidden_depth -= sum(hides for _, hides in closing_entries)

    def handle_data(self, data):
        for capture in self._captures:
            capture["parts"].append(data)
        if self._body_depth and not self._hidden_depth and data.strip():
            self.visible_text_parts.append(data)

    @property
    def visible_text(self):
        return " ".join(" ".join(self.visible_text_parts).split())


class ValidationHelperTests(unittest.TestCase):
    def parse_fixture(self, source):
        parser = SiteHTMLParser()
        parser.feed(source)
        parser.close()
        return parser

    def test_parser_collects_anchor_and_link_hrefs(self):
        parser = self.parse_fixture(
            '<link rel="canonical" href="/articles/example.html">'
            '<a href="other.html">Other</a>'
        )
        self.assertEqual(
            parser.hrefs,
            ["/articles/example.html", "other.html"],
        )

    def test_parser_excludes_hidden_publication_text_and_times(self):
        parser = self.parse_fixture(
            "<html>"
            "<head><time datetime='2026-01-01'>Head +30 6947135317</time></head>"
            "<body>"
            "<template><time datetime='2026-01-02'>Template +30 6947135317</time></template>"
            "<div hidden><time datetime='2026-01-03'>Hidden +30 6947135317</time></div>"
            "<div hidden><div>Nested</div><time datetime='2026-01-08'>"
            "Still hidden +30 6947135317</time></div>"
            "<div aria-hidden='true'><time datetime='2026-01-04'>ARIA +30 6947135317</time></div>"
            "<div style='display: none'><time datetime='2026-01-05'>Display +30 6947135317</time></div>"
            "<div style='visibility:hidden'><time datetime='2026-01-06'>Visibility +30 6947135317</time></div>"
            "<time datetime='2026-01-07'>Published 2026-01-07</time>"
            "<p>Phone +30 6947135317</p>"
            "</body></html>"
        )
        self.assertEqual(
            parser.times,
            [({"datetime": "2026-01-07"}, "Published 2026-01-07")],
        )
        self.assertEqual(parser.visible_text.count(APPROVED_PHONE), 1)

    def test_local_href_resolution_handles_root_absolute_and_extensionless_urls(self):
        source = ARTICLES_DIR / "what-is-pvc-wall-panel.html"
        target = ARTICLES_DIR / "wall-panel-quality-inspection-guide.html"
        self.assertEqual(
            resolve_local_href_target(
                source, "/articles/wall-panel-quality-inspection-guide.html"
            ),
            target,
        )
        self.assertEqual(
            resolve_local_href_target(
                source,
                f"{SITE_ORIGIN}/articles/wall-panel-quality-inspection-guide.html?from=guide#top",
            ),
            target,
        )
        self.assertEqual(
            resolve_local_href_target(source, "/articles"),
            ARTICLES_DIR / "index.html",
        )
        self.assertIsNone(
            resolve_local_href_target(source, "https://example.com/articles/external.html")
        )

    def test_prohibited_claims_scan_complete_html_source(self):
        source = (
            '<title>BEST IN THE WORLD</title>'
            '<meta name="description" content="Lowest Price">'
            '<div data-offer="Lifetime Warranty"></div>'
            '<script type="application/ld+json">{"claim":"Zero Formaldehyde"}</script>'
        )
        self.assertEqual(set(find_prohibited_claims(source)), set(PROHIBITED_CLAIMS))


def parse_html(path):
    parser = SiteHTMLParser()
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()
    return parser


def resolve_local_href_target(source_page, href, root=ROOT, site_origin=SITE_ORIGIN):
    """Resolve a local href to its filesystem target, or return None for ignored URLs."""
    if not href or href.startswith("#"):
        return None
    split = urlsplit(href)
    origin = urlsplit(site_origin)
    if split.scheme or split.netloc:
        effective_scheme = split.scheme.casefold() or origin.scheme.casefold()
        if (
            effective_scheme != origin.scheme.casefold()
            or split.netloc.casefold() != origin.netloc.casefold()
        ):
            return None
    path_text = unquote(split.path)
    if not path_text:
        return None
    raw_target = (
        root / path_text.lstrip("/")
        if path_text.startswith("/") or split.netloc
        else source_page.parent / path_text
    )
    target = raw_target.resolve()
    if path_text.endswith("/") or target.is_dir():
        return target / "index.html"
    if not target.suffix and not target.is_file():
        return target / "index.html"
    return target


def find_prohibited_claims(source):
    normalized = source.casefold()
    return [claim for claim in PROHIBITED_CLAIMS if claim.casefold() in normalized]


def schema_types(value):
    """Return every @type found in a JSON-LD object, including nested graphs."""
    found = set()
    if isinstance(value, dict):
        item_type = value.get("@type")
        if isinstance(item_type, str):
            found.add(item_type)
        elif isinstance(item_type, list):
            found.update(item for item in item_type if isinstance(item, str))
        for child in value.values():
            found.update(schema_types(child))
    elif isinstance(value, list):
        for child in value:
            found.update(schema_types(child))
    return found


def json_ld_documents(parser, page):
    documents = []
    for block_number, block in enumerate(parser.json_ld_blocks, start=1):
        try:
            documents.append(json.loads(block))
        except json.JSONDecodeError as error:
            raise AssertionError(
                f"{page.relative_to(ROOT)} JSON-LD block {block_number} is invalid: "
                f"line {error.lineno}, column {error.colno}: {error.msg}"
            ) from error
    return documents


class ContentQualityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.article_pages = sorted(
            page for page in ARTICLES_DIR.glob("*.html") if page.name != "index.html"
        )
        cls.article_parsers = {page: parse_html(page) for page in cls.article_pages}

    def test_exactly_fifteen_article_pages(self):
        names = [page.name for page in self.article_pages]
        self.assertEqual(
            len(names),
            15,
            f"Expected exactly 15 non-index HTML files in articles/, found "
            f"{len(names)}: {', '.join(names) or 'none'}",
        )

    def test_article_pages_have_required_metadata(self):
        for page, parser in self.article_parsers.items():
            label = str(page.relative_to(ROOT))
            with self.subTest(page=label):
                self.assertEqual(
                    len(parser.titles), 1,
                    f"{label} must contain exactly one <title>; found {len(parser.titles)}",
                )
                self.assertTrue(parser.titles[0], f"{label} has an empty <title>")
                self.assertEqual(
                    len(parser.meta_descriptions), 1,
                    f'{label} must contain exactly one <meta name="description">; '
                    f"found {len(parser.meta_descriptions)}",
                )
                self.assertTrue(
                    parser.meta_descriptions[0], f"{label} has an empty meta description"
                )
                self.assertEqual(
                    len(parser.canonicals), 1,
                    f'{label} must contain exactly one <link rel="canonical">; '
                    f"found {len(parser.canonicals)}",
                )
                self.assertTrue(parser.canonicals[0], f"{label} has an empty canonical URL")
                self.assertEqual(
                    len(parser.h1s), 1,
                    f"{label} must contain exactly one <h1>; found {len(parser.h1s)}",
                )
                self.assertTrue(parser.h1s[0], f"{label} has an empty <h1>")

    def test_article_pages_have_visible_publication_metadata(self):
        for page, parser in self.article_parsers.items():
            label = str(page.relative_to(ROOT))
            with self.subTest(page=label):
                visible_times = [
                    (attrs.get("datetime", "").strip(), text)
                    for attrs, text in parser.times
                    if text.strip()
                ]
                labeled_date = re.search(
                    r"\b(?:published|publication date|posted)\b.{0,50}"
                    r"(?:\d{4}[-/]\d{1,2}[-/]\d{1,2}|"
                    r"[A-Za-z]+\s+\d{1,2},?\s+\d{4}|"
                    r"\d{1,2}\s+[A-Za-z]+\s+\d{4})",
                    parser.visible_text,
                    flags=re.IGNORECASE,
                )
                self.assertTrue(
                    any(datetime for datetime, _ in visible_times) or labeled_date,
                    f"{label} must visibly show a publication date using a non-empty "
                    "<time datetime> element or labeled 'Published' date",
                )

    def test_article_pages_have_required_json_ld_types(self):
        required_types = {"Article", "BreadcrumbList"}
        for page, parser in self.article_parsers.items():
            label = str(page.relative_to(ROOT))
            with self.subTest(page=label):
                self.assertTrue(
                    parser.json_ld_blocks,
                    f'{label} must contain <script type="application/ld+json">',
                )
                documents = json_ld_documents(parser, page)
                present_types = set()
                for document in documents:
                    present_types.update(schema_types(document))
                missing = sorted(required_types - present_types)
                self.assertFalse(
                    missing,
                    f"{label} JSON-LD is missing required type(s): {', '.join(missing)}; "
                    f"found: {', '.join(sorted(present_types)) or 'none'}",
                )

    def test_canonical_and_sitemap_urls_match_article_filenames(self):
        expected_urls = {
            f"{SITE_ORIGIN}/articles/{page.name}" for page in self.article_pages
        }
        canonical_urls = set()
        for page, parser in self.article_parsers.items():
            label = str(page.relative_to(ROOT))
            expected = f"{SITE_ORIGIN}/articles/{page.name}"
            with self.subTest(page=label):
                self.assertEqual(
                    parser.canonicals,
                    [expected],
                    f"{label} canonical must be {expected!r}; found {parser.canonicals}",
                )
            canonical_urls.update(parser.canonicals)

        sitemap_path = ROOT / "sitemap.xml"
        try:
            sitemap_root = ElementTree.parse(sitemap_path).getroot()
        except ElementTree.ParseError as error:
            self.fail(f"sitemap.xml is not valid XML: {error}")
        namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        sitemap_urls = {
            (node.text or "").strip()
            for node in sitemap_root.findall("sm:url/sm:loc", namespace)
        }
        sitemap_article_urls = {
            url for url in sitemap_urls if url.startswith(f"{SITE_ORIGIN}/articles/")
            and url != f"{SITE_ORIGIN}/articles/"
        }
        self.assertEqual(
            sitemap_article_urls,
            expected_urls,
            "sitemap.xml article URLs must exactly match article filenames; "
            f"missing={sorted(expected_urls - sitemap_article_urls)}, "
            f"unexpected={sorted(sitemap_article_urls - expected_urls)}",
        )
        self.assertEqual(
            canonical_urls,
            expected_urls,
            "Article canonical URLs must exactly match the discovered article filenames",
        )

    def test_articles_link_to_two_other_articles_and_show_approved_phone(self):
        article_names = {page.name for page in self.article_pages}
        for page, parser in self.article_parsers.items():
            label = str(page.relative_to(ROOT))
            linked_articles = set()
            for href in parser.hrefs:
                target = resolve_local_href_target(page, href)
                if target is None:
                    continue
                if target.parent == ARTICLES_DIR.resolve() and target.name in article_names:
                    if target.name != page.name:
                        linked_articles.add(target.name)
            with self.subTest(page=label):
                self.assertGreaterEqual(
                    len(linked_articles),
                    2,
                    f"{label} must link to at least two other article pages; "
                    f"found {sorted(linked_articles)}",
                )
                self.assertIn(
                    APPROVED_PHONE,
                    parser.visible_text,
                    f"{label} must visibly show approved phone {APPROVED_PHONE}",
                )

    def test_every_local_html_href_resolves(self):
        html_pages = sorted(ROOT.rglob("*.html"))
        broken = []
        for page in html_pages:
            parser = parse_html(page)
            for href in parser.hrefs:
                target = resolve_local_href_target(page, href)
                if target is None:
                    continue
                try:
                    target.relative_to(ROOT)
                except ValueError:
                    broken.append(f"{page.relative_to(ROOT)}: href={href!r} escapes site root")
                    continue
                if not target.is_file():
                    broken.append(
                        f"{page.relative_to(ROOT)}: href={href!r} resolves to missing "
                        f"{target.relative_to(ROOT)}"
                    )
        self.assertFalse(
            broken,
            "Local HTML links must resolve:\n" + "\n".join(f"- {item}" for item in broken),
        )

    def test_articles_do_not_contain_prohibited_claims(self):
        violations = []
        for page in self.article_pages:
            source = page.read_text(encoding="utf-8")
            for claim in find_prohibited_claims(source):
                violations.append(f"{page.relative_to(ROOT)} contains {claim!r}")
        self.assertFalse(
            violations,
            "Remove prohibited marketing claims:\n"
            + "\n".join(f"- {item}" for item in violations),
        )

    def test_robots_allows_oai_searchbot_and_has_absolute_sitemap(self):
        robots_path = ROOT / "robots.txt"
        directives = []
        for line_number, raw_line in enumerate(
            robots_path.read_text(encoding="utf-8").splitlines(), start=1
        ):
            line = raw_line.split("#", 1)[0].strip()
            if not line:
                continue
            if ":" not in line:
                self.fail(f"robots.txt line {line_number} is not a directive: {raw_line!r}")
            name, value = line.split(":", 1)
            directives.append((name.strip().casefold(), value.strip(), line_number))

        groups = []
        current_agents = []
        current_rules = []
        for name, value, line_number in directives:
            if name == "user-agent":
                if current_rules:
                    groups.append((current_agents, current_rules))
                    current_agents, current_rules = [], []
                current_agents.append(value.casefold())
            elif name in {"allow", "disallow"}:
                current_rules.append((name, value, line_number))
        if current_agents or current_rules:
            groups.append((current_agents, current_rules))

        oai_groups = [rules for agents, rules in groups if "oai-searchbot" in agents]
        self.assertTrue(
            oai_groups,
            "robots.txt must include an explicit 'User-agent: OAI-SearchBot' group",
        )
        self.assertTrue(
            any(name == "allow" and value == "/" for rules in oai_groups for name, value, _ in rules),
            "robots.txt OAI-SearchBot group must explicitly include 'Allow: /'",
        )

        sitemap_values = [value for name, value, _ in directives if name == "sitemap"]
        absolute_sitemaps = [
            value
            for value in sitemap_values
            if urlsplit(value).scheme in {"http", "https"} and urlsplit(value).netloc
        ]
        expected_sitemap = f"{SITE_ORIGIN}/sitemap.xml"
        self.assertIn(
            expected_sitemap,
            absolute_sitemaps,
            f"robots.txt must include absolute 'Sitemap: {expected_sitemap}'; "
            f"found {sitemap_values}",
        )


if __name__ == "__main__":
    unittest.main()
