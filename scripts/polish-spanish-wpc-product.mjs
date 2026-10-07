import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// One-time, scoped correction of a visibly corrupted machine translation.
// Keep the same corrections in the translation cache so a later rebuild cannot revert them.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'es/products/wpc-wall-panels.html');
const cacheFile = path.join(root, 'content/translations/es.json');
const english = fs.readFileSync(path.join(root, 'products/wpc-wall-panels.html'), 'utf8');
const before = fs.readFileSync(target, 'utf8');
const rules = [
  [/interioes/g, 'interiores'], [/exterioes/g, 'exteriores'], [/\binterio\b/gi, 'interior'], [/\bexterio\b/gi, 'exterior'],
  [/interiorres/g, 'interiores'], [/exteriorres/g, 'exteriores'], [/\binteriorr\b/g, 'interior'], [/\bexteriorr\b/g, 'exterior'],
  [/decoación/g, 'decoración'], [/decoativas/g, 'decorativas'], [/Potada/g, 'Portada'],
  [/meteoización/g, 'meteorización'], [/Laboatoio/g, 'Laboratorio'], [/Foestales/g, 'Forestales'],
  [/coectas/g, 'correctas'], [/proveedorr/g, 'proveedor'], [/\bproveedo\b/g, 'proveedor'], [/sopote/g, 'soporte'], [/cote/g, 'corte'],
  [/colo\b/g, 'color'], [/accesoios/g, 'accesorios'], [/Calculadoa/g, 'Calculadora'],
  [/infomación/g, 'información'], [/infomes/g, 'informes'], [/infome/g, 'resumen'],
  [/propocione/g, 'proporcione'], [/expotación/g, 'exportación'], [/\bpo\b/g, 'por'], [/\boden\b/g, 'orden'],
  [/Cheque del comprado/g, 'Verificación del comprador'], [/¿Po qué cambia la elección\?/g, '¿Por qué influye en la elección?'],
  [/Ancho facial efectivo/g, 'Ancho útil visible'], [/demanda de cartón/g, 'cantidad de cajas'],
  [/Muestra conectada/g, 'Muestra de paneles ensamblados'], [/Recotes y transiciones/g, 'Remates y transiciones'],
  [/números predeterminados/g, 'valores predeterminados'], [/Una pared necesita comienzos, extremos y esquinas compatibles\./g, 'Una pared necesita perfiles de inicio, remates y esquinas compatibles.'],
  [/Recortes y transiciones/g, 'Remates y transiciones'], [/paredes de características/g, 'paredes de acento'],
  [/Es un fondo independiente/g, 'Es una referencia independiente'], [/\bDescribe cómo/g, 'describe cómo'],
  [/\bUsa el\b/g, 'Use la'], [/\bla dimensiones\b/g, 'las dimensiones'], [/\blas perfiles\b/g, 'los perfiles'],
  [/\bel ausencia\b/g, 'la ausencia'], [/\bla proceso\b/g, 'el proceso'], [/\brevisa el\b/g, 'revise la'],
  [/Guía WPC interior-versus-exterior/g, 'guía WPC sobre uso interior y exterior'],
  [/\bExploe\b/g, 'Explore'], [/\b¿Interio o exterior\?/g, '¿Interior o exterior?'],
  [/¿interior o exterior\?/g, '¿Interior o exterior?'],
  [/Cree un resumen de pedido que se pueda comprobar/g, 'Prepare una solicitud de compra verificable'],
  [/elevación de la pared/g, 'dimensiones del muro'], [/Incluya aperturas/g, 'Incluya huecos'],
  [/cantidad de cajas y las opciones de accesorios/g, 'cantidad por caja y los accesorios compatibles'],
  [/mantenga una referencia de aprobación etiquetada/g, 'conserve una muestra patrón identificada'],
  [/tiras de arranque/g, 'perfiles de inicio'], [/stock de reemplazo/g, 'material de reposición'],
  [/Los detalles de la cubierta y el revestimiento aún deben evaluarse por separado\./g, 'Las especificaciones de tarima y revestimiento deben evaluarse por separado.'],
  [/ninguna etiqueta WPC genérica/i, 'Ninguna denominación genérica WPC'],
  [/mantenimiento cero/g, 'ausencia de mantenimiento'], [/una garantía fija/g, 'una garantía determinada'],
  [/tiempo de producción/g, 'plazo de producción'], [/en una cotización por escrito/g, 'en una oferta escrita'],
  [/en el primer orden/g, 'en el primer pedido'], [/resumen de la solicitud/g, 'resumen del proyecto'],
  [/Preseleccionado un sistema WPC para su mercado/g, 'Seleccione un sistema WPC para su mercado'],
  [/envíe su solicitud, destino y volumen aproximado/g, 'indique la aplicación, el destino y el volumen aproximado'],
  [/ruta de muestra/g, 'proceso de aprobación de muestras'],
  [/acrónimo material solo/g, 'acrónimo del material por sí solo'],
  [/El (<a [^>]+>)Investigación/g, 'La $1investigación'],
  [/aire libre<\/a>; Las especificaciones/g, 'aire libre</a>; las especificaciones'],
];
function polish(value) {
  return rules.reduce((text, [from, to]) => text.replace(from, to), value);
}
let output = polish(before);
output = output.replace('Paneles de pared WPC para importadores: interior y exterior | Luvie', 'Paneles WPC de interior y exterior para importadores | Luvie');
output = output.replace(/<meta content="[^"]*" name="description"\/>/, '<meta content="Compare paneles WPC de interior y exterior por perfil, ancho útil, acabado y fijación. Consulte el catálogo y solicite los datos del modelo específico." name="description"/>');
output = output.replace(/<meta content="[^"]*" property="og:title"\/>/, '<meta content="Paneles WPC de interior y exterior para importadores | Luvie" property="og:title"/>');
output = output.replace('Lista de paneles de pared WPC por aplicación real, perfil, cobertura, fijación y evidencia específica del producto.', 'Compare paneles WPC según el uso previsto, el perfil, la cobertura, la fijación y la documentación del modelo concreto.');
output = output.replace('Guía de selección de paneles de pared WPC interiores y exteriores para importadores y compradores de proyectos.', 'Guía de selección de paneles WPC de interior y exterior para importadores y compradores de proyectos.');
output = output.replace('Separar la decoración interior del uso de la exposición al aire libre', 'Distinga los paneles decorativos de interior de los sistemas para exterior');
output = output.replace('Los paneles WPC estriados o con aspecto de madera para interiores a menudo se eligen para paredes de características y superficies decorativas.', 'Los paneles WPC ranurados o con acabado de madera suelen elegirse para paredes decorativas interiores.');
output = output.replace('Usa el ', 'Use la ');
output = output.replace(' Para preparar las preguntas correctas del proveedor.', ' para preparar las preguntas adecuadas para el proveedor.');
output = output.replace('La geometría de unión cambia la cobertura instalada y la cantidad de cajas.', 'La geometría de las uniones cambia la cobertura instalada y el número de cajas necesarias.');
output = output.replace('El plan de corte, el manejo y el soporte varían según el modelo.', 'La planificación de cortes, la manipulación y los soportes dependen del modelo.');
output = output.replace('El respaldo y la aplicación dictan el detalle de la instalación.', 'El soporte y el uso previsto determinan los detalles de instalación.');
output = output.replace('Solo después de obtener el ancho efectivo y la longitud utilizable para el panel conectado.', ' solo después de confirmar el ancho útil y la longitud aprovechable del panel ensamblado.');
output = output.replace('Sus valores predeterminados son ilustrativos, no un SKU Luvie publicado.', 'Sus valores predeterminados son orientativos; no describen un modelo Luvie concreto.');
output = output.replace('Pida al proveedor que identifique los modelos candidatos y proporcione el dibujo del perfil específico, la información de soporte y fijación, los informes disponibles, la cantidad de cajas y las opciones de accesorios.', 'Pida al proveedor que proponga modelos concretos y facilite el plano de cada perfil, las instrucciones de soporte y fijación, los informes disponibles, las unidades por caja y los accesorios compatibles.');
output = output.replace('Para una comparación a nivel de material, lea ', 'Para comparar las familias de materiales, lea ');
output = output.replace('Apruebe el producto y el sistema de instalación juntos, no el acrónimo del material por sí solo.', 'Apruebe conjuntamente el producto y su sistema de instalación; no se guíe solo por las siglas del material.');

// JSON-LD must describe the localized page, while hreflang keeps the English alternate.
output = output.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_match, start, json, end) => {
  const data = JSON.parse(json);
  const page = data['@graph'].find(node => node['@type'] === 'CollectionPage');
  page.url = 'https://luvieindustry.com/es/products/wpc-wall-panels.html';
  page.description = 'Guía de selección de paneles WPC de interior y exterior para importadores y compradores de proyectos.';
  const crumbs = data['@graph'].find(node => node['@type'] === 'BreadcrumbList').itemListElement;
  crumbs[0].item = 'https://luvieindustry.com/es/';
  crumbs[1].item = page.url;
  return `${start}${JSON.stringify(data)}${end}`;
});

if (output === before || /\b(?:interioes|exterioes|decoación|Potada|proveedo|sopote|infome|expotación)\b/i.test(output)) throw new Error('Spanish WPC page correction incomplete');
fs.writeFileSync(target, output);

const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
let updated = 0;
for (const [source, value] of Object.entries(cache)) {
  if (source === 'Use the') continue; // Shared fragment: its article/gender depends on the next noun.
  if (!english.includes(source) || typeof value !== 'string') continue;
  const polished = polish(value);
  if (polished !== value) { cache[source] = polished; updated++; }
}
fs.writeFileSync(cacheFile, `${JSON.stringify(cache, null, 2)}\n`);
console.log(`Polished Spanish WPC product page and ${updated} matching translation-cache entries.`);
