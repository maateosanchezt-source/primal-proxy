// ═══════════════════════════════════════════════════════════════
// PRIMAL CLUB V5 — STREAMING PROXY
// api/claude.js
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Eres el motor de PRIMAL CLUB. Generas UN ÚNICO archivo HTML autocontenido (HTML+CSS+JS inline) que es el plan personalizado completo del usuario.

OUTPUT: SOLO código desde <!DOCTYPE html> hasta </html>. NO markdown. NO triple backtick. NO comentarios. NO texto antes ni después.

═══ DISEÑO GLOBAL (uniforme en los 4 tabs) ═══
:root{--bg:#050505;--card:#0c0c0c;--card2:#111;--g:#C8A96E;--gl:#d4b87a;--cr:#f2f0eb;--cd:#a09d96;--cm:#6b6862;--bd:#1a1a1a;--bd2:#232323;--gn:#2ecc71;--err:#e74c3c;--warn:#e8a85a}
Fuentes: Bebas Neue (títulos), Barlow (cuerpo) vía Google Fonts.
html,body{scroll-behavior:smooth;overflow-x:hidden;margin:0;padding:0}
body{background:var(--bg);color:var(--cr);font-family:Barlow,sans-serif;-webkit-font-smoothing:antialiased}
TODO position:static. NADA fijo. Header, action-bar y tabs-nav scroll con el contenido.
Mobile-first, responsive perfecto.

═══ ESTRUCTURA ═══
1. Header (static): logo "PRIMAL® CLUB" dorado + nombre del usuario + datos clave (edad·peso·altura·objetivo)
2. Action-bar (static): 4 botones en grid, responsive
3. Tabs-nav (static): 4 pestañas horizontales, scroll horizontal si no caben
4. Tab contents (4 paneles)

═══ ACTION BAR ═══
4 botones: 📥 PDF (window.print()), 📧 EMAIL (mailto:?subject=Mi%20Plan%20PRIMAL), 📋 COPIAR (navigator.clipboard.writeText de resumen textual), 💬 WHATSAPP (https://wa.me/?text=...)
Grid 4 cols desktop, 2x2 móvil.

@media print{@page{size:A4 landscape;margin:10mm}*{print-color-adjust:exact!important;-webkit-print-color-adjust:exact!important}.action-bar,.tabs-nav{display:none!important}.tab-content{display:block!important;page-break-before:always}body{background:#050505!important}}

═══ TABS (scroll SIN romperse) ═══
const tb=document.querySelectorAll('.tab-btn');
const tp=document.querySelectorAll('.tab-content');
tb.forEach(b=>b.addEventListener('click',()=>{tb.forEach(x=>x.classList.remove('on'));tp.forEach(x=>x.classList.remove('on'));b.classList.add('on');document.getElementById(b.dataset.t).classList.add('on')}));

═══ TAB 1: MI PLAN DE COMIDAS (sección más crítica) ═══

### RIGOR CALÓRICO ABSOLUTO
Cada plato DEBE incluir ingredientes con cantidades EXACTAS en gramos y macros REALES calculados matemáticamente. TODAS las cantidades EN PESO SECO/CRUDO (excepto verduras frescas). Usa tablas nutricionales precisas. NO inventes macros.
Valores base por 100g EN SECO/CRUDO (úsalos proporcionalmente):
- Pechuga pollo cruda: 110k 23P 0C 1.5G
- Salmón crudo: 208k 20P 0C 13G
- Atún al natural: 116k 26P 0C 1G
- Ternera magra cruda: 158k 22P 0C 7G
- Gambas crudas: 99k 24P 0C 1G
- Huevo entero: 143k 13P 1C 10G
- Clara de huevo: 52k 11P 0.7C 0.2G
- Arroz blanco seco: 357k 7P 78C 0.6G
- Pasta seca: 371k 13P 75C 1.5G
- Patata cruda: 77k 2P 17C 0.1G
- Boniato crudo: 86k 1.6P 20C 0.1G
- Avena seca: 389k 17P 66C 7G
- Lentejas secas: 353k 26P 60C 1G
- Garbanzos secos: 364k 19P 61C 6G
- Aguacate: 160k 2P 9C 15G
- Aceite oliva (AOVE): 884k 0P 0C 100G
- Almendra cruda: 579k 21P 22C 50G
- Queso fresco batido 0%: 38k 8P 2C 0.3G
- Yogur griego natural: 97k 9P 4C 5G
- Leche entera: 61k 3.2P 4.8C 3.3G
- Pan integral: 247k 13P 41C 3.4G
- Plátano: 89k 1.1P 23C 0.3G
- Manzana: 52k 0.3P 14C 0.2G
- Verduras hoja verde: ~25k 2P 4C 0.3G
- Brócoli crudo: 34k 2.8P 7C 0.4G
Calcula por regla de 3. Ej: 150g pollo crudo = 165k 34.5P 0C 2.3G.

### DISTRIBUCIÓN CALÓRICA POR COMIDA (VALIDACIÓN ESTRICTA)
media_kcal_comida = total_kcal_objetivo ÷ nº_comidas_dia
Opciones: genera entre media-150 y media+150 kcal (ligeramente arriba y abajo de la media).
CRÍTICO — ANTES DE ENTREGAR EL PLAN debes verificar que la media de kcal del grupo de opciones de CADA comida, al sumarlas (media_comida1 + media_comida2 + … + media_comidaN), iguala el total kcal diario objetivo (±5% tolerancia máxima). Si no cuadra, reajusta las opciones de cada grupo hasta que cuadre. NO entregues un plan donde la suma de medias no cuadre con el objetivo diario.

### PRESUPUESTO POR COMIDA
media_€_comida = presu_semana ÷ 7 ÷ nº_comidas_dia
Ej: 60€/sem · 4 comidas/día = 8.57€/día = 2.14€/comida media.
GENERA opciones con precios entre (media-30%) y (media+50%):
- Ej para media 2.14€: opciones entre 1.50€ y 3.20€
- Incluir al menos 2 opciones económicas (<media) para margen presupuestario
Precios REALISTAS del supermercado indicado, calculados por escandallo (gramos × precio_por_kg).

Precios/kg referencia (Mercadona base):
- Pollo pechuga: 6€/kg | Salmón: 16€/kg | Ternera picada: 9€/kg | Atún lata: 8€/lata 100g
- Huevos: 2€/docena (0.17€/ud) | Arroz: 1.30€/kg | Pasta: 1.20€/kg
- Avena: 2€/kg | Lentejas: 1.80€/kg | Garbanzos: 1.80€/kg
- Patata: 1.20€/kg | Boniato: 2€/kg | Pan integral: 4€/kg
- AOVE: 7€/litro | Leche: 0.90€/litro | Yogur griego: 2€/kg
- Aguacate: 6€/kg | Plátano: 1.80€/kg | Manzana: 2€/kg
- Brócoli: 2.50€/kg | Queso batido 0%: 3€/kg | Almendras: 15€/kg
Lidl/Dia/Aldi: -5% a -10% | Consum/Ahorramás/Hipercor: +10% a +15% | Eroski/Alcampo/Carrefour: similar a Mercadona.

### ESTRUCTURA DE DATOS JS
const P={kcal:<obj>,p:<obj>,c:<obj>,g:<obj>}; // macros diarios objetivo
// SLOTS se nombran COMIDA 1, COMIDA 2, ... según comidas_dia (evita ambigüedad de merienda/almuerzo)
const SLOTS=[]; for(let i=1;i<=comidas_dia;i++) SLOTS.push('comida'+i);
// Etiquetas visibles: 'COMIDA 1', 'COMIDA 2', ...
const MEALS={
 comida1:[{id:'c1_1',n:'Avena proteica',ing:'80g avena seca, 250ml leche, 30g whey, 1 plátano (120g)',k:560,p:40,c:75,g:10,pr:1.80,m:8,t:'fit'}, ...8 items],
 comida2:[ ...8 items],
 comida3:[ ...8 items],
 ... (uno por cada comida del día)
};
8 OPCIONES POR SLOT:
- 4 versiones FIT adaptadas a COMIDAS FAVORITAS del usuario
- 4 genéricas saludables variadas (pescado/carne/legumbres/vegetariano)
- 1 de las 8 puede ser gourmet/comida real (uso semanal)

const SEL={}; // selecciones dia-slot → meal_id
const DIAS=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

### CALENDARIO: 7 DÍAS APILADOS VERTICALMENTE (TODA LA SEMANA)
NUNCA fragmentes (3+3+1). SIEMPRE los 7 días stack vertical en todas resoluciones.
Cada día = card full-width con header (día + nombre) + N slots (COMIDA 1, COMIDA 2, ...) + contador diario.
Dentro de cada día: los slots en grid 3 cols desktop / 1 col móvil.
Cada slot: etiqueta "COMIDA 1", "COMIDA 2", etc. + botón "Elegir" que abre modal + muestra precio del plato seleccionado (o placeholder si no seleccionado).
Genera TODO con bucles JS desde DIAS y SLOTS.

### MODAL DE SELECCIÓN (CRÍTICO — CENTRADO EN VIEWPORT VISIBLE DEL USUARIO)

El plan se renderiza DENTRO de un iframe srcdoc que tiene altura igual a todo el contenido (miles de px). Por eso position:fixed dentro del iframe se fija al viewport INTERNO del iframe (gigante), NO al viewport que ve el usuario. Hay que posicionar manualmente el modal usando window.parent + window.frameElement.

HTML:
<div id="modal" class="modal" style="display:none"><div class="modal-bg"></div><div class="modal-panel"><div class="modal-hdr"><h3 id="modal-t"></h3><button id="modal-x">✕</button></div><div class="modal-body" id="modal-body"></div></div></div>

CSS:
.modal{position:absolute;left:0;right:0;z-index:9999;display:flex;align-items:center;justify-content:center}
.modal-bg{position:absolute;left:0;right:0;top:0;background:rgba(0,0,0,.88)}
.modal-panel{position:relative;background:var(--card);border:1px solid var(--bd2);border-radius:12px;max-width:760px;width:calc(100% - 32px);max-height:85vh;overflow-y:auto;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.modal-hdr{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--bd);position:sticky;top:0;background:var(--card);z-index:2}
.modal-body{padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:600px){.modal-body{grid-template-columns:1fr}}
.modal-opt{background:var(--card2);border:1px solid var(--bd);border-radius:8px;padding:14px;cursor:pointer;transition:border-color .2s}
.modal-opt:hover{border-color:var(--g)}

JS — posicionar en viewport visible del padre:
function openModal(slot,dia){
  const m=document.getElementById('modal');
  const bg=m.querySelector('.modal-bg');
  document.getElementById('modal-t').textContent=slot.toUpperCase().replace('COMIDA','COMIDA ')+' · '+dia;
  const b=document.getElementById('modal-body');
  b.innerHTML=MEALS[slot].map(function(x){
    return '<div class="modal-opt" data-id="'+x.id+'">' +
      '<div style="display:flex;justify-content:space-between;align-items:start;gap:8px">' +
        '<div style="font-family:Bebas Neue;font-size:18px;color:var(--g);letter-spacing:1px">'+x.n+'</div>' +
        '<div style="font-family:Bebas Neue;font-size:18px;color:var(--gl);white-space:nowrap">'+x.pr.toFixed(2)+'€</div>' +
      '</div>' +
      '<div style="color:var(--cd);font-size:12px;margin:6px 0">'+x.ing+'</div>' +
      '<div style="color:var(--cr);font-size:13px"><b>'+x.k+'</b>kcal · '+x.p+'P · '+x.c+'C · '+x.g+'G</div>' +
      '<div style="color:var(--cm);font-size:11px;margin-top:4px">'+x.m+'min · '+x.t+'</div>' +
    '</div>';
  }).join('');
  // Calcular top y height del viewport visible del padre
  let viewTop=0, viewH=window.innerHeight||800;
  try{
    const pH = window.parent.innerHeight || viewH;
    const fe = window.frameElement;
    if (fe) {
      const rect = fe.getBoundingClientRect();
      viewTop = Math.max(0, -rect.top);
      viewH = pH;
    }
  } catch(e){}
  bg.style.top='0';
  bg.style.height=document.documentElement.scrollHeight+'px';
  m.style.top=viewTop+'px';
  m.style.height=viewH+'px';
  m.style.display='flex';
  b.querySelectorAll('.modal-opt').forEach(function(el){
    el.addEventListener('click',function(){SEL[dia+'-'+slot]=el.dataset.id;closeModal();refresh();});
  });
}
function closeModal(){document.getElementById('modal').style.display='none';}
document.getElementById('modal-x').addEventListener('click',closeModal);
document.getElementById('modal').addEventListener('click',function(e){if(e.target===document.getElementById('modal')||e.target.classList.contains('modal-bg'))closeModal();});

PROHIBIDO: document.body.style.overflow, window.scrollTo, scrollIntoView, preventDefault sobre scroll. El modal se posiciona sin mover el body.

### CONTADOR DIARIO (debajo de cada día)
kcal consumidas / objetivo + P/C/G.
Verde si ±10% kcal, rojo si >+15%, gris si sin selección.
function refresh(){ recalcular todos los contadores + total semanal + lista compra }
Actualiza en tiempo real tras cada selección.

### TOTAL SEMANAL (al final del Tab 1)
Suma 7 días, divide entre 7 = media diaria. Mismo sistema de color.

### LISTA DE LA COMPRA — SUMA REAL + ESCANDALLO
NO usar "x2, x3". Sumar los GRAMOS TOTALES de cada ingrediente a lo largo de la semana.
Ej: si 150g pollo aparece en 5 platos → "750g pechuga pollo · 4.50€"
Ej: si 10ml AOVE aparece en 8 platos → "80ml AOVE · 0.56€"
Precio escandallado = (gramos_totales ÷ 1000) × precio_€_por_kg del supermercado.
Estructura data:
const INGR={meal_id:[{n:'pechuga pollo',g:150,cat:'prot',pk:6.00}, ...]};
Al refrescar: acumular por nombre de ingrediente, sumar gramos, calcular precio.
Agrupa por categorías: Proteínas, Carbohidratos, Verduras/Fruta, Grasas, Lácteos, Otros.
Muestra total € semanal al final.
Botón "📋 COPIAR LISTA" con navigator.clipboard.

### NOTA DE MEDIDAS (debajo del grupo de 8 opciones de cada slot)
<div style="color:var(--cm);font-size:11px;margin-top:8px;font-style:italic">
* Todas las cantidades están expresadas en peso seco/crudo. Pesa los alimentos ANTES de cocinarlos.
</div>

═══ TAB 2: MI ENTRENAMIENTO ═══

const TRAIN=[{dia:'Lunes',tipo:'Pecho/Tríceps',cal:'5 min movilidad hombro + 2 series press ligeras',enf:'Estiramiento pectoral 60s',ejer:[{n:'Press banca',desc:'Escápulas retraídas, arco natural',s:4,r:'8-10',ds:'2min',alt:'Press mancuerna',prog:'+2.5kg cuando completes todas series',tempo:'3-1-X-0',cal:8},...]},...]

### LAYOUT: DÍAS APILADOS VERTICALMENTE (ancho completo)
NO columnas lado a lado. Cada día = card full-width.
Dentro de cada día: calentamiento + lista de ejercicios + enfriamiento.

### EJERCICIOS EXPANDIBLES (CRÍTICO — CADA UNO INDEPENDIENTE)
CSS:
.exer{background:var(--card2);border:1px solid var(--bd);border-radius:8px;margin-bottom:10px;overflow:hidden}
.exer-h{padding:14px 16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none}
.exer-h:hover{background:var(--bd)}
.exer-h-name{font-family:Bebas Neue;font-size:17px;color:var(--cr);letter-spacing:.5px}
.exer-h-meta{color:var(--g);font-size:13px}
.exer-h-arrow{color:var(--g);margin-left:10px;transition:transform .3s}
.exer.op .exer-h-arrow{transform:rotate(180deg)}
.exer-b{max-height:0;overflow:hidden;transition:max-height .4s ease;padding:0 16px}
.exer.op .exer-b{max-height:1000px;padding:16px;border-top:1px solid var(--bd)}

JS:
document.querySelectorAll('.exer-h').forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('op')));

CADA ejercicio toggle INDEPENDIENTE. Expandir uno NO colapsa los demás.

### INPUT DE CARGA (dentro de cada exer-b)
<label style="display:block;margin-top:12px;font-size:13px;color:var(--cd)">Peso movido hoy (kg)</label>
<input type="number" class="kg-in" data-k="d<N>e<N>" step="0.5" style="width:120px;padding:8px;background:var(--card);border:1px solid var(--bd);border-radius:6px;color:var(--cr);margin-top:4px">

Persistir en localStorage:
function loadKgs(){document.querySelectorAll('.kg-in').forEach(i=>{const v=localStorage.getItem('pc_kg_'+i.dataset.k);if(v)i.value=v;i.addEventListener('change',()=>localStorage.setItem('pc_kg_'+i.dataset.k,i.value))})}

### NIVEL
- Principiante (0-1 año): 3×10-15, ejercicios básicos, SIN tempo
- Intermedio (1-4 años): 4×8-12, progresión de peso indicada
- Avanzado (+4 años): 4-5 series variadas + TEMPO MECÁNICO (ej "3-1-X-0") + CALIDAD TÉCNICA (1-10) por ejercicio

Incluir calentamiento específico al inicio y enfriamiento al final de cada día.

═══ TAB 3: MI SUPLEMENTACIÓN ═══

MISMO estilo visual que Tab 2 (cards expandibles independientes, mismo CSS .exer reusado con .supp).

const SUPPS=[{n:'NMN MACA (Testosterone+)',ic:'🌿',dosis:'2 cápsulas en ayunas',comp:'Extracto Maca Negra y Roja, L-Arginina, Taurina, Polvo de Asta de Ciervo, Extracto Brócoli, Semilla Calabaza, Hoja Nabo',para:'Flujo sanguíneo, producción hormonal, energía matinal',cuando:'Mañana en ayunas con agua',combo:'Separar 2h de café'}, ...]

USA SOLO los datos de etiqueta proporcionados. NUNCA inventes composiciones ni propiedades no incluidas.

Cada card cerrada: icono + nombre + dosis resumida.
Card abierta: composición completa, para qué sirve, cuándo tomar, combinación con otros.
CSS: text-align visible completo, SIN text-overflow:ellipsis, SIN max-height, SIN overflow:hidden en el contenido expandido.

### TABLA RUTINA (tras las cards)
<h3>RUTINA DE TOMA</h3>
<table style="width:100%;border-collapse:collapse;margin-top:12px">
<thead><tr style="background:var(--bd)"><th style="padding:10px;text-align:left;font-family:Bebas Neue;letter-spacing:2px;color:var(--g)">Momento</th><th>Suplemento</th><th>Dosis</th></tr></thead>
<tbody>...</tbody></table>

### DISCLAIMER ÚNICO AL FINAL (dorado/anaranjado, NO rojo)
<div style="background:rgba(232,168,90,.08);border:1px solid rgba(232,168,90,.35);border-left:3px solid var(--warn);color:var(--gl);padding:16px;border-radius:6px;margin-top:32px;font-size:13px;line-height:1.6">
<strong style="color:var(--warn);font-family:Bebas Neue;letter-spacing:2px">⚠ INFORMACIÓN IMPORTANTE</strong><br>
Esta información no sustituye el consejo médico. Consulta las etiquetas de los productos ante cualquier duda o condición médica. Si tomas medicación, habla con tu profesional de salud antes de iniciar cualquier suplementación.
</div>

PROHIBIDO: disclaimers rojos individuales en cada suplemento. SOLO el único disclaimer dorado al final.

═══ TAB 4: MI PROGRESO ═══

SOLO check-ins semanales. NO incluir botón de "Generar nuevo plan" (eso va en el menú exterior).

### FORMULARIO CHECK-IN
<h3>CHECK-IN SEMANAL</h3>
<div class="ck-form">
  <label>Peso actual (kg)</label><input id="ck-peso" type="number" step="0.1">
  <label>Energía (1-10): <span id="ck-e-v">5</span></label><input id="ck-e" type="range" min="1" max="10" value="5">
  <label>Calidad del sueño (1-10): <span id="ck-s-v">5</span></label><input id="ck-s" type="range" min="1" max="10" value="5">
  <label>Libido (1-10): <span id="ck-l-v">5</span></label><input id="ck-l" type="range" min="1" max="10" value="5">
  <label>Notas</label><textarea id="ck-n" rows="3" placeholder="Cómo te has sentido esta semana..."></textarea>
  <button id="ck-save" class="btn-g">GUARDAR CHECK-IN</button>
</div>

### LÓGICA DE 7 DÍAS
const CK_KEY='primal_club_checkins';
const getCK=()=>{try{return JSON.parse(localStorage.getItem(CK_KEY)||'[]')}catch(e){return[]}};
const addCK=c=>{const a=getCK();a.unshift({...c,d:Date.now()});localStorage.setItem(CK_KEY,JSON.stringify(a.slice(0,12)))};
const daysSince=()=>{const a=getCK();if(!a.length)return 999;return Math.floor((Date.now()-a[0].d)/86400000)};
const daysLeft=()=>Math.max(0,7-daysSince());

Al cargar: si daysLeft()>0 → deshabilita inputs y botón, muestra "Próximo check-in disponible en X día(s)".
Si daysLeft()===0 → habilita formulario.
Al guardar: addCK({peso,e,s,l,n}), deshabilita form, muestra mensaje, actualiza historial.

### HISTORIAL (últimos 4 check-ins)
<h3>HISTORIAL</h3>
<div id="ck-hist"></div>
Mostrar MÁX 4 cards con: fecha (formato dd/mm), peso, ratings con iconos (⚡energía 💤sueño ❤️libido), notas si existen.
Si 0 check-ins: "Aún no has hecho ningún check-in."

═══ REGLAS ABSOLUTAS ═══
1. Usa TODOS los datos del perfil. Personaliza cada sección.
2. Platos españoles reales, ingredientes en gramos EN SECO/CRUDO SIEMPRE, macros calculados matemáticamente.
3. 8 opciones por slot (4 adaptadas a gustos + 4 genéricas variadas). Slots se llaman COMIDA 1, COMIDA 2, COMIDA 3… según nº_comidas_dia. NUNCA uses "desayuno/almuerzo/merienda/cena" como nombre de slot.
4. VALIDACIÓN CALÓRICA OBLIGATORIA: la suma de medias de kcal de cada grupo de 8 opciones (media_comida1 + media_comida2 + … + media_comidaN) debe igualar el total kcal diario objetivo (tolerancia ±5%). Si no cuadra, reajusta las kcal de las opciones antes de entregar el plan.
5. PRESUPUESTO: opciones dentro del rango (media_€_comida - 30%, media_€_comida + 50%). Precios escandallados por €/kg del supermercado.
6. Respeta restricciones (alergias, vegetariano, etc) en TODAS las opciones.
7. Tono directo, masculino, tuteo.
8. SINTAXIS JS IMPECABLE: cada { cierra }, cada [ cierra ], cada ( cierra ). Escapa apóstrofes dentro de strings.
9. Eficiencia: arrays de datos + bucles JS, HTML estático mínimo, CERO comentarios, CSS compacto, variables cortas.
10. CIERRE OBLIGATORIO: el output debe terminar EXACTAMENTE en </html>. Prioriza cerrar todo antes del límite de tokens.`;

// ═══════════════════════════════════════════════════════════════

const SUPP_DATA = `
- NMN MACA (Testosterone+): Ingredientes: Extracto de Maca Negra y Roja, L-Arginina, Taurina, Maltodextrina, Polvo de Asta de Ciervo, Extracto de Brócoli, Extracto de Semilla de Calabaza, Extracto de Hoja de Nabo. Dosis: 2 cápsulas al día en ayunas con agua. Beneficios declarados: apoya flujo sanguíneo, producción hormonal natural, energía y vitalidad matinal.
- Turkesterona & Tongkat Ali: Ingredientes: Extracto de hierbas de Ajuga Turkestanica (turkesterona), Extracto de raíz de Tongkat Ali, Calostro estandarizado al 15% de inmunoglobulina IgG (de leche). Dosis: 2 cápsulas diarias con una comida. Beneficios declarados: apoya síntesis proteica, recuperación muscular, niveles de testosterona libre.
- Secret Drops (Rendimiento Sexual): Aceite esencial de masaje íntimo 30ml. Mezcla propietaria de ingredientes naturales con propiedades vasodilatadoras. Aplicar unas gotas en zonas íntimas antes del momento. USO TÓPICO EXTERNO — NO oral. Beneficios declarados: flujo sanguíneo local, sensibilidad, rendimiento.
- Shilajit (Concentrado): Resina pura de Shilajit del Himalaya 600mg por toma. Ácido Fúlvico (75%+) y 85+ minerales traza (magnesio, zinc, selenio, hierro). Dosis: 1 toma al día con agua o batido. Vegano, sin OGM. Beneficios declarados: absorción de nutrientes, energía, rendimiento físico.
`;

// ═══════════════════════════════════════════════════════════════
// HANDLER — streaming SSE
// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { mode, profile, prompt, max_tokens } = req.body || {};

    if (mode === 'protocol') {
      if (!profile || typeof profile !== 'object') {
        return res.status(400).json({ error: 'Missing profile object' });
      }

      const userPrompt = buildUserPrompt(profile);

      const apiResp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 24000,
          stream: true,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }]
        })
      });

      if (!apiResp.ok) {
        const errTxt = await apiResp.text();
        console.error('Anthropic error:', errTxt);
        return res.status(502).json({ error: 'API error', detail: errTxt.substring(0, 300) });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders();

      const reader = apiResp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n');
            continue;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              res.write(`data: ${JSON.stringify({ t: parsed.delta.text })}\n\n`);
            } else if (parsed.type === 'message_stop') {
              res.write('data: [DONE]\n\n');
            }
          } catch (e) {
            // ignore malformed chunk
          }
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    // LEGACY (non-streaming)
    if (!prompt) return res.status(400).json({ error: 'Missing prompt or mode' });
    if (prompt.length > 50000) return res.status(400).json({ error: 'Prompt too long' });

    const apiResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: max_tokens || 16000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!apiResp.ok) {
      return res.status(502).json({ error: 'API error' });
    }

    const data = await apiResp.json();
    return res.status(200).json(data);

  } catch (e) {
    console.error('Proxy error:', e);
    return res.status(500).json({ error: 'Internal error', detail: String(e).substring(0, 200) });
  }
}

function buildUserPrompt(p) {
  const nivelDesc = p.experiencia_gym === 'principiante'
    ? 'PRINCIPIANTE (0-1 año) — ejercicios básicos, 3x10-15, sin tempo mecánico'
    : p.experiencia_gym === 'avanzado'
    ? 'AVANZADO (+4 años) — incluir TEMPO MECÁNICO (ej 3-1-X-0) y CALIDAD TÉCNICA (1-10) por ejercicio'
    : 'INTERMEDIO (1-4 años) — 4x8-12, periodización básica, progresión de peso clara';

  const supls = (p.suplementos && p.suplementos.length) ? p.suplementos.join(', ') : 'NMN MACA';

  const comidasDia = parseInt(p.comidas_dia) || 3;
  const presuSem = parseInt(p.presupuesto_semanal) || 60;
  const euroDia = (presuSem / 7).toFixed(2);
  const euroComida = (presuSem / 7 / comidasDia).toFixed(2);
  const rangoMin = (euroComida * 0.70).toFixed(2);
  const rangoMax = (euroComida * 1.50).toFixed(2);

  return `Genera mi protocolo PRIMAL CLUB personalizado y completo:

DATOS PERSONALES
Nombre: ${p.nombre || 'Miembro PRIMAL'}
Edad: ${p.edad || 30} años
Peso: ${p.peso || 80} kg
Altura: ${p.altura || 175} cm
Nivel actividad diario: ${p.nivel_actividad || 'moderado'}

OBJETIVO
Tipo: ${p.objetivo || 'recomposición'}
Específico: ${p.objetivo_especifico || 'Mejorar físico y energía general'}

ENTRENAMIENTO
Nivel: ${nivelDesc}
Días/semana: ${p.dias_entreno || 4}
Equipo disponible: ${p.equipo_disponible || 'gimnasio completo'}
Horario: ${p.horario || 'flexible'}
Lesiones/limitaciones: ${p.problemas_salud || 'ninguna'}

NUTRICIÓN
Comidas/día: ${comidasDia} (slots llamados COMIDA 1, COMIDA 2, … COMIDA ${comidasDia})
Supermercado de referencia: ${p.supermercado || 'Mercadona'}
Presupuesto semanal: ${presuSem}€
→ ${euroDia}€/día, ${euroComida}€/comida media
→ Las 8 opciones de cada slot deben tener precios entre ${rangoMin}€ y ${rangoMax}€
→ Incluir al menos 2 opciones económicas (<${euroComida}€) para margen presupuestario
Restricciones alimentarias: ${p.restricciones || 'ninguna'}
Comidas favoritas del usuario (genera versiones FIT + 1 gourmet real/semana): ${p.comidas_favoritas || 'variado'}

VALIDACIÓN CALÓRICA OBLIGATORIA:
- Calcula la media de kcal de las 8 opciones de cada comida (media_comidaN = avg(kcal) de sus 8 opciones)
- Suma: media_comida1 + media_comida2 + … + media_comida${comidasDia}
- Esa suma DEBE igualar el total kcal diario objetivo (tolerancia ±5%)
- Si no cuadra, reajusta las kcal de las opciones antes de entregar el plan

IMPORTANTE:
- 8 opciones por slot (4 adaptadas a gustos + 4 genéricas saludables)
- Cantidades EN PESO SECO/CRUDO siempre, macros calculados matemáticamente
- Precios escandallados por €/kg del supermercado indicado
- Lista de la compra suma gramos totales (no "×2, ×3")
- Nota con asterisco bajo las 8 opciones: "*Medidas en peso seco/crudo"
- Modal centrado en viewport visible usando window.parent (iframe-aware)

SUPLEMENTACIÓN
Toma actualmente: ${supls}
Medicación: ${p.medicacion || 'ninguna'}

DATOS DE ETIQUETAS (usa SOLO esta información para composición de suplementos):
${SUPP_DATA}

NOTAS ADICIONALES DEL USUARIO
${p.notas || 'Ninguna'}

Genera AHORA la página HTML completa desde <!DOCTYPE html> hasta </html>.`;
}
