import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articlesDir = path.join(root, 'articles');

const sources = {
  astmFire: ['https://store.astm.org/e0084-26a.html', 'ASTM E84-26a'],
  cdphVoc: ['https://www.cdph.ca.gov/Programs/cls/dehl/ehl/Pages/AQS/VOCs.aspx', 'California Department of Public Health VOC guidance'],
  ctuCode: ['https://unece.org/transport/documents/standards/ctu-code', 'IMO/ILO/UNECE CTU Code'],
  epaMoisture: ['https://www.epa.gov/indoor-air-quality-iaq/moisture-control-guidance-building-design-construction-and-maintenance-0', 'U.S. EPA moisture-control guidance'],
  incoterms: ['https://library.iccwbo.org/content/tfb/BOOKS/BK_0049/BK_0049.htm?AGENT=ICC_HQ', 'ICC Incoterms® 2020 rules'],
  ipccWood: ['https://www.ippc.int/en/archive-old-pages/phytosanitary-system/ispm-15-implementation/', 'IPPC guidance for ISPM 15'],
  isoAql: ['https://www.iso.org/standard/85464.html', 'ISO 2859-1:2026'],
  isoColor: ['https://www.iso.org/standard/82662.html', 'ISO/CIE 11664-6:2022'],
  isoGloss: ['https://www.iso.org/standard/56807.html', 'ISO 2813:2014'],
  isoQms: ['https://www.iso.org/home/insights-news/resources/iso-9001-explained.html', 'ISO’s explanation of ISO 9001'],
  isoTensile: ['https://www.iso.org/standard/527-1?browse=ics', 'ISO 527-1:2019'],
  isoWeather: ['https://www.iso.org/standard/83802.html', 'ISO 4892-3:2024'],
  pubchemPvc: ['https://pubchem.ncbi.nlm.nih.gov/compound/Poly_vinyl-chloride', 'NIH PubChem’s PVC reference'],
  usdaWpc: ['https://www.fpl.fs.usda.gov/documnts/pdf2007/fpl_2007_stark001.pdf', 'USDA Forest Products Laboratory research on WPC weathering'],
};

const link = (key) => {
  const [url, label] = sources[key];
  return `<a href="${url}" target="_blank" rel="noopener noreferrer external">${label}</a>`;
};

const evidence = {
  'apartment-bedroom-feature-wall-case.html': `For bedrooms and other occupied interiors, visual approval is only one part of specification. ${link('cdphVoc')} describes a chamber-based method used to evaluate chemical emissions from indoor building materials, while ${link('astmFire')} shows why a fire report must identify the tested product or assembly rather than only the material name.`,
  'calculate-wall-panel-order-quantity.html': `Area coverage is not the same as a safe loading plan. The ${link('ctuCode')} covers packing and securing cargo transport units, so buyers should convert panel quantities into cartons, dimensions, gross weight, stacking pattern and restraint requirements before confirming a container plan.`,
  'choose-pvc-wall-panel-thickness-profile.html': `Thickness alone does not prove strength or suitability. ${link('isoTensile')} defines controlled methods for measuring tensile behavior of plastics and composites, and ${link('astmFire')} makes clear that fire results depend on the tested specimen and mounting. Ask for evidence tied to the exact SKU and construction.`,
  'evaluate-wall-panel-samples.html': `A sample can be evaluated more consistently when subjective descriptions are converted into measurements. ${link('isoColor')} specifies the CIEDE2000 colour-difference calculation, while ${link('isoGloss')} defines gloss measurements at 20°, 60° and 85° for suitable coatings. Buyers should still agree the instrument, geometry, tolerance and reference sample in writing.`,
  'fluted-wall-panels-distributor-guide.html': `For fluted panels used in occupied commercial interiors, appearance is not the only decision. ${link('cdphVoc')} explains one recognized approach to building-material emissions testing, and ${link('astmFire')} explains a surface-burning test used for exposed wall and ceiling surfaces. Neither source certifies a generic “fluted panel” category; the report must match the product.`,
  'fob-vs-cif-wall-panel-orders.html': `FOB and CIF are defined trade rules, not informal shipping labels. The ${link('incoterms')} sets out the allocation of delivery, cost, insurance and risk responsibilities. The selected term, named port and Incoterms® edition should appear consistently in the quotation and contract.`,
  'hotel-corridor-fluted-wall-panel-case.html': `Hotel corridors may have project-specific fire and indoor-air requirements. ${link('astmFire')} covers comparative surface flame-spread and smoke measurements but explicitly does not represent every real-fire condition. ${link('cdphVoc')} provides a separate emissions-testing framework for indoor materials. Request the exact reports required by the destination project.`,
  'luvie-order-process-inquiry-to-shipment.html': `${link('isoQms')} explains that ISO 9001 is a quality-management-system standard, not a blanket certificate for every product. For lot acceptance, ${link('isoAql')} defines AQL-indexed sampling schemes. A practical order process therefore needs both process controls and product-specific inspection criteria.`,
  'mixed-container-wall-panel-orders.html': `A mixed container reduces commercial concentration but increases packing complexity. The ${link('ctuCode')} addresses safe packing and securing across sea and land transport. If raw-wood pallets, crates or dunnage are used, ${link('ipccWood')} explains the treatment and marking framework for regulated wood packaging in international trade.`,
  'oem-private-label-wall-panels.html': `Private-label artwork must not turn a management-system claim into a product claim. ${link('isoQms')} identifies ISO 9001 as a framework for quality management, while ISO’s own guidance distinguishes management-system certification from certification of a product. Keep product test claims tied to the exact model, report and scope.`,
  'office-lobby-decorative-wall-panel-case.html': `An office-lobby finish may need separate evidence for emissions and reaction to fire. ${link('cdphVoc')} documents a health-based emissions test method for indoor sources, while ${link('astmFire')} applies to exposed wall and ceiling surfaces under controlled fire-test conditions. Project requirements determine which reports are relevant.`,
  'pu-stone-panels-vs-natural-stone.html': `Exterior suitability cannot be inferred from a stone-look surface. ${link('isoWeather')} describes laboratory exposure of plastics to UV radiation, heat and water to simulate weathering effects. Where fire classification is required, ${link('astmFire')} also shows why the actual panel construction and mounting must be tested rather than transferring a claim from another product.`,
  'pvc-ceiling-panels-vs-wall-panels.html': `${link('astmFire')} is written for exposed surfaces such as walls and ceilings, but it also explains that supporting materials and mounting can change results. That is why a ceiling-panel report should identify the exact panel, backing and test configuration; a report for a visually similar wall profile is not automatically interchangeable.`,
  'pvc-wall-panel-vs-wpc-wall-panel.html': `${link('pubchemPvc')} identifies PVC as a widely used synthetic polymer with rigid and flexible forms used in construction. WPC is a different composite family: ${link('usdaWpc')} reports that UV light and water can affect color and mechanical properties during weathering. The useful comparison is therefore exact formulation, profile and application—not the material acronym alone.`,
  'pvc-wall-panels-humid-areas.html': `${link('pubchemPvc')} documents PVC’s broad use in construction products, but a PVC face does not make an entire bathroom wall assembly waterproof. ${link('epaMoisture')} treats moisture control as a building-design, construction and maintenance issue, supporting the need to check joints, penetrations, substrate, sealant and ventilation together.`,
  'questions-to-ask-wall-panel-supplier.html': `${link('isoQms')} helps buyers interpret a supplier’s quality-management claim, while ${link('isoAql')} provides a formal basis for lot-by-lot acceptance sampling. When fire performance is claimed, ${link('astmFire')} shows why the report must identify the tested material or assembly and test conditions.`,
  'reduce-wall-panel-batch-color-differences.html': `${link('isoColor')} specifies the CIEDE2000 method for calculating colour difference from CIELAB coordinates. ${link('isoGloss')} separately measures coating gloss at defined geometries. Because color and gloss are different attributes, repeat orders should record both when appearance consistency matters.`,
  'wall-panel-export-packaging-checklist.html': `The ${link('ctuCode')} is a joint IMO/ILO/UNECE code addressing safe packing and securing of cargo transport units. If shipments use raw-wood pallets, crates or dunnage, ${link('ipccWood')} explains the ISPM 15 treatment and marking framework. These references support, but do not replace, destination-specific carrier and import requirements.`,
  'wall-panel-product-mix-by-project.html': `${link('pubchemPvc')} confirms PVC’s established use across construction products, while ${link('usdaWpc')} shows why WPC weathering depends on UV and water exposure. ${link('isoWeather')} provides a current laboratory framework for UV, heat and water exposure of plastics. This supports separating indoor decorative lines from products specifically evidenced for exterior use.`,
  'wall-panel-quality-inspection-guide.html': `${link('isoAql')} defines acceptance-sampling schemes for lot-by-lot inspection. For appearance, ${link('isoColor')} provides a standardized colour-difference calculation and ${link('isoGloss')} defines gloss measurement. These methods are most useful when the quotation names the reference sample, instrument, tolerance and acceptance rule.`,
  'wall-panel-buyer-faq.html': `Independent references support the decision framework used below: ${link('epaMoisture')} explains why water management is a whole-building issue; ${link('usdaWpc')} documents UV-and-water weathering mechanisms in WPC; ${link('astmFire')} limits fire conclusions to the tested specimen and conditions; and ${link('cdphVoc')} provides an indoor-emissions testing method. None of these sources proves performance for an unnamed SKU.`,
  'what-is-pvc-wall-panel.html': `${link('pubchemPvc')} identifies PVC as a widely used polymer available in rigid and flexible forms and used throughout construction. Product selection still requires evidence beyond the resin name: ${link('cdphVoc')} addresses indoor emissions testing, and ${link('astmFire')} shows that reaction-to-fire results belong to a tested specimen or assembly.`,
};

const markerPattern = /<!-- authority-evidence:start -->[\s\S]*?<!-- authority-evidence:end -->\s*/;

for (const [file, paragraph] of Object.entries(evidence)) {
  const filePath = path.join(articlesDir, file);
  let source = fs.readFileSync(filePath, 'utf8').replace(markerPattern, '');
  const block = `<!-- authority-evidence:start -->
<aside class="authority-evidence" aria-label="Independent evidence">
  <span>Independent evidence</span>
  <p>${paragraph}</p>
</aside>
<!-- authority-evidence:end -->`;

  if (!source.includes('<!-- topic-cluster-links:end -->')) {
    throw new Error(`Topic-link marker not found in ${file}`);
  }
  source = source.replace('<!-- topic-cluster-links:end -->', `<!-- topic-cluster-links:end -->\n${block}`);
  fs.writeFileSync(filePath, source);
}

console.log(`Added independent, contextual references to ${Object.keys(evidence).length} existing articles.`);
