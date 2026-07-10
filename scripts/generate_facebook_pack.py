#!/usr/bin/env python3
"""Create draft-only Facebook derivatives from the canonical article data."""

from pathlib import Path

from generate_articles import ARTICLES, PHONE, SITE

OUTPUT = Path("/Users/mac/luvieindustry-kb/Facebook内容/2026-07-SEO-GEO文章联动内容包.md")


def page_post(article):
    checks = ", ".join(item.lower() for item in article["checks"][:3])
    return f"""Many wall panel sourcing problems begin before the quotation—not after production.

{article['answer']}

For a useful supplier discussion, buyers should review {checks}. This makes product comparisons clearer and reduces the risk of comparing different specifications under one product name.

Luvie Industry supports overseas importers, distributors and project buyers with wall panel selection, samples, OEM/ODM packaging and mixed-container planning. Tell us your market, application and estimated quantity, and we will help organize the next step.

Read the buyer guide: {SITE}/articles/{article['slug']}.html
WhatsApp: {PHONE}"""


def group_post(article):
    return f"""For wall panel importers and distributors:

{article['answer']}

Which detail creates the most difficulty in your market—product selection, installation, packing or repeat-order consistency?

Practical guide: {SITE}/articles/{article['slug']}.html"""


def image_direction(article):
    cluster = article["cluster"]
    if cluster == "Product selection":
        return "Use an original product texture/profile comparison or a clean white-background product set. Show labels and scale; avoid generic interiors."
    if cluster == "Quality and inspection":
        return "Use an original factory inspection close-up: measurement, color comparison, joint fit, carton label, or loading record."
    if cluster == "Market and application":
        return "Use a real application photo or clearly labeled rendering paired with a product texture inset. Never present a rendering as a completed Luvie project."
    return "Use an original process or packing photograph with a restrained five-step/checklist overlay in the Luvie white, charcoal, light-gray and warm-wood palette."


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    blocks = ["""# Luvie SEO/GEO 文章联动 Facebook 内容包

状态：**DRAFT ONLY / 仅供审核，不得自动发布或发送**  
周期：2026-07-10 至 2026-08-07  
统一联系方式：`+30 6947135317`

使用规则：每篇文章发布后再使用对应社媒草稿；先核对文章 URL 已上线。主页版用于 Luvie Page，群组版保持讨论导向。涉及价格、MOQ、库存、交期、具体规格或目的国认证的评论，必须转人工确认。
"""]
    for index, article in enumerate(ARTICLES, 1):
        blocks.append(f"""
## {index}. {article['title']}

计划日期：`{article['date']}`  
文章链接：`{SITE}/articles/{article['slug']}.html`

### Facebook 主页版

{page_post(article)}

### Facebook 群组版

{group_post(article)}

### 相关评论回复

**客户问：Can you send the catalog or samples?**

> Yes. Please share your country, target application and preferred panel type. We can recommend the relevant catalog and discuss suitable sample options. WhatsApp: {PHONE}

**客户问：What is the price / MOQ / delivery time?**

> It depends on the exact model, specification and quantity. Please send your country, product type, preferred size or color and estimated quantity so our team can confirm the correct order details. WhatsApp: {PHONE}

### 图片方向

{image_direction(article)}

建议标签：`#WallPanelSupplier #BuildingMaterials #Importer #Distributor #LuvieIndustry`
""")
    blocks.append("""
## 共用审核清单

- [ ] 对应文章已正式上线，链接可打开。
- [ ] 图片为 Luvie 原创实拍或已明确标注的场景渲染。
- [ ] 电话为 `+30 6947135317`。
- [ ] 没有未经确认的价格、MOQ、库存、交期、规格、性能或认证承诺。
- [ ] Facebook 主页和群组尚未自动发布。
""")
    OUTPUT.write_text("\n".join(blocks), encoding="utf-8")
    print(f"Generated {len(ARTICLES)} Facebook content sets: {OUTPUT}")


if __name__ == "__main__":
    main()
