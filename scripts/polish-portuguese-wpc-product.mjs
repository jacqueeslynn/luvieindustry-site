import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Scoped copy correction. Sync the exact English-source entries so rebuilds keep the fixes.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagePath = path.join(root, 'pt-br/products/wpc-wall-panels.html');
const cachePath = path.join(root, 'content/translations/pt-br.json');
const english = fs.readFileSync(path.join(root, 'products/wpc-wall-panels.html'), 'utf8');
const current = fs.readFileSync(pagePath, 'utf8');
const replacements = new Map([
  ['Separe a decoração interna do uso de exposição ao ar livre', 'Diferencie os painéis decorativos internos dos sistemas para áreas externas'],
  ['Painéis WPC estriados internos ou com aparência de madeira são frequentemente escolhidos para paredes de destaque e superfícies decorativas.', 'Painéis WPC frisados ou com aparência de madeira costumam ser escolhidos para paredes de destaque e superfícies decorativas internas.'],
  ['não torna um perfil interno adequado para fora.', 'não torna um perfil interno adequado para uso externo.'],
  ['O <a href="https://research.fs.usda.gov/treesearch/27307"', 'A <a href="https://research.fs.usda.gov/treesearch/27307"'],
  ['Pesquisa de intemperismo WPC do Laboratório de Produtos Florestais do USDA</a> Descreve', 'pesquisa sobre o intemperismo do WPC do Laboratório de Produtos Florestais do USDA</a> descreve'],
  ['É um plano de fundo independente', 'É uma referência independente'],
  ['Use o <a href="/pt-br/articles/can-indoor-wpc-wall-panels-be-used-outside.html">Guia WPC interno-versus-exterior</a> Para preparar', 'Use o <a href="/pt-br/articles/can-indoor-wpc-wall-panels-be-used-outside.html">guia sobre WPC para áreas internas e externas</a> para preparar'],
  ['Cheque do comprador', 'Verificação do comprador'],
  ['Largura efetiva do rosto', 'Largura útil do painel'],
  ['A geometria da junta altera a cobertura instalada e a demanda de papelão.', 'A geometria das juntas altera a área coberta após a instalação e a quantidade de caixas necessárias.'],
  ['Amostra conectada e desenho de perfil dimensionado.', 'Amostra de painéis encaixados e desenho cotado do perfil.'],
  ['O plano de corte, manuseio e suporte variam de acordo com o modelo.', 'O planejamento dos cortes, o manuseio e os suportes variam conforme o modelo.'],
  ['O suporte e a aplicação ditam os detalhes da instalação.', 'A base de fixação e o uso previsto determinam os detalhes de instalação.'],
  ['Guarnições e transições', 'Perfis de acabamento e transições'],
  ['Uma parede precisa de começos, extremidades e cantos compatíveis.', 'A instalação precisa de perfis de início, acabamento e cantos compatíveis.'],
  ['Use o <a href="/pt-br/articles/wpc-wall-panel-dimensions-coverage-calculator.html">Calculadora de cobertura WPC</a> Somente depois de obter a largura efetiva e o comprimento utilizável para o painel conectado. Seus números padrão são ilustrativos, não um Luvie SKU publicado.', 'Use a <a href="/pt-br/articles/wpc-wall-panel-dimensions-coverage-calculator.html">calculadora de cobertura para WPC</a> somente depois de confirmar a largura útil e o comprimento aproveitável dos painéis encaixados. Os valores padrão são ilustrativos; não representam um modelo específico da Luvie.'],
  ['Crie um resumo de pedido que possa ser verificado', 'Prepare uma solicitação de compra verificável'],
  ['elevação da parede', 'dimensões da parede'],
  ['quantidade de caixa e opções de acessórios.', 'unidades por caixa e acessórios compatíveis.'],
  ['quantidade de unidades por caixas', 'quantidade de caixas'],
  ['mantenha uma referência de aprovação rotulada', 'guarde uma amostra de referência identificada'],
  ['tiras iniciais', 'perfis de início'],
  ['das perfis de início', 'dos perfis de início'],
  ['estoque de reposição', 'material de reposição'],
  ['revise o <a href="/pt-br/articles/outdoor-wpc-decking-importer-checklist.html">Lista de verificação do sistema WPC ao ar livre</a>; Detalhes de deck e revestimento ainda devem ser avaliados separadamente.', 'consulte a <a href="/pt-br/articles/outdoor-wpc-decking-importer-checklist.html">lista de verificação para sistemas WPC externos</a>; os requisitos de decks e revestimentos devem ser avaliados separadamente.'],
  ['Nenhum rótulo WPC genérico comprova classificação de incêndio, durabilidade UV, capacidade estrutural, manutenção zero ou uma garantia fixa.', 'O nome genérico WPC não comprova classificação de reação ao fogo, durabilidade sob UV, capacidade estrutural, ausência de manutenção ou prazo de garantia.'],
  ['na primeira ordem, envie o resumo da inscrição', 'no primeiro pedido, envie um resumo da aplicação'],
  ['Seleção de um sistema WPC para o seu mercado', 'Selecione um sistema WPC para o seu mercado'],
  ['Abra o catálogo WPC e envie sua inscrição, destino e volume aproximado. Podemos discutir o perfil relevante e a rota de amostra.', 'Consulte o catálogo WPC e informe a aplicação, o destino e o volume aproximado. Assim, podemos avaliar o perfil adequado e o processo de aprovação de amostras.'],
  ['Catálogo WPC aberto em PDF', 'Abrir catálogo WPC em PDF'],
  ['não apenas o acrônimo material.', 'não apenas a sigla do material.'],
]);
let output = current;
for (const [from, to] of replacements) output = output.replace(from, to);
output = output.replace(/<meta content="[^"]*" name="description"\/>/, '<meta content="Compare painéis WPC para áreas internas e externas por perfil, largura útil, acabamento e fixação. Consulte o catálogo e solicite os dados do modelo específico." name="description"/>');
output = output.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_match, start, json, end) => {
  const data = JSON.parse(json);
  const page = data['@graph'].find(node => node['@type'] === 'CollectionPage');
  page.url = 'https://luvieindustry.com/pt-br/products/wpc-wall-panels.html';
  const crumbs = data['@graph'].find(node => node['@type'] === 'BreadcrumbList').itemListElement;
  crumbs[0].item = 'https://luvieindustry.com/pt-br/';
  crumbs[1].item = page.url;
  return start + JSON.stringify(data) + end;
});
if (/demanda de papelão|Largura efetiva do rosto|resumo da inscrição/.test(output)) throw new Error('Portuguese WPC page correction incomplete');
fs.writeFileSync(pagePath, output);

const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
let updated = 0;
for (const [source, value] of Object.entries(cache)) {
  if (!english.includes(source) || typeof value !== 'string') continue;
  const corrected = [...replacements].reduce((text, [from, to]) => text.replace(from, to), value);
  if (corrected !== value) { cache[source] = corrected; updated++; }
}
const cacheOverrides = {
  'For distributors, compare samples in the same light and keep a labelled approval reference. For project orders, separate material quantity from starter strips, corner pieces and replacement stock. If an exterior product is required, review the': 'Para distribuidores, compare as amostras sob a mesma luz e guarde uma amostra de referência identificada. Para pedidos de projeto, separe a quantidade de material dos perfis de início, peças de canto e material de reposição. Se um produto externo for necessário, consulte a',
  'outdoor WPC system checklist': 'lista de verificação para sistemas WPC externos',
  'indoor-versus-outdoor WPC guide': 'guia sobre WPC para áreas internas e externas',
};
for (const [source, value] of Object.entries(cacheOverrides)) {
  if (cache[source] !== value) { cache[source] = value; updated++; }
}
fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2) + '\n');
console.log('Polished Portuguese WPC page and', updated, 'translation-cache entries.');
