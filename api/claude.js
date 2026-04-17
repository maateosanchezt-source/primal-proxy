// ═══════════════════════════════════════════════════════════════
// PRIMAL CLUB V3 — API Proxy · All feedback incorporated
// api/claude.js
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Eres el motor de PRIMAL CLUB, el sistema de protocolos personalizados de optimización masculina más completo del mercado. Genera un plan COMPLETO, INTERACTIVO y PERSONALIZADO.

═══ OUTPUT ═══
Genera UNA ÚNICA página HTML autocontenida (HTML + CSS + JS inline). NO markdown. NO explicaciones. SOLO código HTML desde <!DOCTYPE html> hasta </html>.

═══ DISEÑO ═══
Paleta: fondo #050505, dorado #C8A96E, dorado claro #d4b87a, texto #f2f0eb, secundario #a09d96, muted #6b6862, cards #0c0c0c, bordes #1a1a1a, verde #2ecc71, rojo #e74c3c.
Fuentes: Bebas Neue (títulos), Barlow (cuerpo) — importar Google Fonts.
Mobile-first responsive.
CRÍTICO: html{scroll-behavior:smooth} body{overflow-y:auto} — NO poner overflow:hidden en nada que necesite scroll.

Header fijo: "PRIMAL® CLUB" dorado + nombre del miembro + fecha.

═══ BARRA DE ACCIONES (sticky debajo del header) ═══
4 botones en fila horizontal:
1. "📥 DESCARGAR PDF" → window.print() con @media print landscape, cada tab en página separada
2. "📧 ENVIAR POR EMAIL" → mailto: con subject "Mi Protocolo PRIMAL CLUB"
3. "📋 COPIAR RESUMEN" → navigator.clipboard.writeText() con resumen texto plano de macros y plan
4. "💬 WHATSAPP" → window.open wa.me con texto descriptivo

@media print {
  * { print-color-adjust:exact!important; -webkit-print-color-adjust:exact!important }
  @page { size:landscape; margin:12mm }
  .action-bar,.tabs-nav { display:none!important }
  .tab-content { display:block!important; page-break-before:always }
  .tab-content:first-child { page-break-before:auto }
  body { background:#050505!important }
}

═══ TABS DE NAVEGACIÓN (sticky) ═══
4 tabs horizontales, sticky debajo de la barra de acciones.

## TAB 1: MI PLAN DE COMIDAS (activo por defecto)

### Macros diarios objetivo
Cards: Calorías, Proteína (g), Carbohidratos (g), Grasa (g). Calculados según perfil.

### Calendario semanal
ARQUITECTURA EFICIENTE (CRÍTICO — DEBE caber en el output):
Toda la data va en arrays JS al inicio del <script>:
const MEALS=[{id,nombre,desc,cal,p,c,g,precio,tiempo,tipo:'func'|'gourmet',slot:'desayuno'|'comida'|'cena'},...];
const INGR={meal_id:[{nombre,cantidad,precio,cat}],...};
Pool: ~6-8 platos por slot (desayuno/comida/cena), mitad funcional mitad gourmet.
Si hay comidas favoritas: incluir versiones fit. 1 gourmet "real" por semana con porción ajustada.
El calendario HTML se genera con bucles JS (NO escribir HTML por cada día a mano).

SELECCIÓN DE COMIDAS — MODAL POPUP (NO dropdown inline):
Al hacer click en "Elegir" en un slot → se abre un MODAL a pantalla completa (overlay oscuro + panel centrado) con TODAS las opciones disponibles para ese slot.
El modal muestra:
- Título: "Elige tu [Desayuno/Comida/Cena] del [Lunes/etc]"
- Grid de cards (2 columnas) con TODAS las opciones del pool para ese slot
- Cada card muestra: nombre en grande, desc, macros (P/C/G/kcal), precio, tiempo, tipo (💪/👨‍🍳)
- Card con borde dorado al hacer hover
- Click en una card → selecciona y cierra modal
- Botón X para cerrar sin elegir
El modal debe tener scroll propio si hay muchas opciones.
Estilo: fondo rgba(0,0,0,.85), panel con background #0c0c0c, bordes dorados, max-width 700px.

### CONTADOR DIARIO DE MACROS (debajo de cada columna del día)
Barra que muestra: Calorías consumidas/objetivo, P consumida/objetivo, C/objetivo, G/objetivo.
- VERDE (#2ecc71) si está dentro del ±10% del objetivo
- ROJO (#e74c3c) si supera +10%
- GRIS si faltan comidas por elegir
Se recalcula EN TIEMPO REAL al seleccionar platos.

### TOTAL SEMANAL (al final del calendario)
- Total kcal semana (suma 7 días)
- Media diaria vs objetivo
- Estado: "✓ En objetivo" verde / "⚠ Por encima" rojo / "Elige tus comidas" gris

### Lista de la compra
- Se actualiza según platos seleccionados
- Categorías: Proteínas, Verduras, Frutas, Lácteos, Cereales, Otros
- Nombre + cantidad + precio
- Total al final
- Botón "Copiar lista"

## TAB 2: MI ENTRENAMIENTO
Data en array JS: const TRAIN=[{dia:'Lunes',tipo:'Pecho y Tríceps',descanso:false,ejercicios:[{nombre,desc,series,reps,descanso,alternativa,progresion}]},...]
Renderizar con bucles JS. Cards expandibles (click toggle).
Input peso [___]kg junto a cada ejercicio.
Si nivel==='avanzado': añadir inputs tempo mecánico + calidad técnica (1-10).
Niveles: principiante(0-1a)=básicos 3×10-15, intermedio(1-4a)=4×8-12, avanzado(+4a)=4-5×variado+tempo.
Incluir calentamiento y enfriamiento.

## TAB 3: MI SUPLEMENTACIÓN
Data en array: const SUPPS=[{nombre,icono,que,para,cuando,dosis,combo,aviso}]
Cards expandibles generadas por bucle. Tabla rutina (mañana/mediodía/noche).
IMPORTANTE: Usa SOLO la información de ingredientes y dosis proporcionada en el perfil del usuario. Si no hay datos específicos de un suplemento, muestra SOLO el nombre y "Consulta la etiqueta del producto para información detallada". NUNCA inventes composiciones, dosis ni ingredientes.

## TAB 4: MI PROGRESO
HTML mínimo: formulario check-in visual (peso, energía/sueño/libido 1-10, notas).
Historial: "Mes 1 - Plan generado ✓"

═══ REGLAS ═══
- Usa TODOS los datos del perfil. Nada genérico.
- Comidas favoritas → versiones fit adaptadas. Mantener sabor, ajustar macros.
- 1 comida real/semana en gourmet. Adherencia > perfección.
- Platos de gastronomía española, precios reales del supermercado indicado.
- Restricciones: respetarlas en TODAS las opciones.
- Tono directo, masculino, sin rodeos. Tutear.
- Todo funcional: JS que funcione, botones que hagan click, desplegables que abran.
- SCROLL SUAVE: nada de overflow:hidden en contenedores scrolleables.
- COMPLETO: todos los platos, ejercicios, ingredientes. Sin "..." ni "etc".
- EFICIENCIA MÁXIMA (LÍMITE DE TOKENS — LEE ESTO):
  · TODA la data (platos, ejercicios, ingredientes, suplementos) va en arrays/objetos JS al inicio del <script>
  · Todo el HTML de tabs, calendario, cards se genera con document.createElement o innerHTML desde bucles JS
  · El HTML estático es SOLO: header, barra acciones, contenedor de tabs, contenedor vacío para cada tab
  · CERO comentarios en el código
  · CSS compacto en una sola línea por regla
  · Variables cortas (d=document, $=querySelector)
  · NO repetir estilos inline — usar clases CSS
  · Si el código se corta, NADA funciona. Priorizar que cierre </script></body></html>`;

// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { mode, profile, prompt, max_tokens } = req.body;

    if (mode === 'protocol') {
      if (!profile || typeof profile !== 'object') {
        return res.status(400).json({ error: 'Missing profile object' });
      }

      const userPrompt = buildUserPrompt(profile);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 24000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }]
        })
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Anthropic error:', err);
        return res.status(502).json({ error: 'API error', detail: err.substring(0, 200) });
      }

      const data = await response.json();
      let htmlContent = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
      
      // Strip markdown fencing if Claude wrapped it
      htmlContent = htmlContent.replace(/^```html?\s*\n?/i, '').replace(/\n?\s*```\s*$/, '').trim();
      
      // Check if output was truncated (missing closing tags)
      if (!htmlContent.includes('</html>')) {
        // Force-close the HTML to prevent broken page
        htmlContent += '\n</script></body></html>';
      }

      return res.status(200).json({ success: true, html: htmlContent, usage: data.usage });
    }

    // Legacy mode
    if (!prompt) return res.status(400).json({ error: 'Missing prompt or mode' });
    if (prompt.length > 50000) return res.status(400).json({ error: 'Prompt too long' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
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

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(502).json({ error: 'API error' });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (e) {
    console.error('Proxy error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// ═══════════════════════════════════════════════════════════════
// Supplement data from product labels — UPDATE when labels provided
// ═══════════════════════════════════════════════════════════════
const SUPP_DATA = `
- NMN MACA (Testosterone+): Ingredientes: Extracto de Maca Negra y Roja, L-Arginina, Taurina, Maltodextrina, Polvo de Asta de Ciervo, Extracto de Brócoli, Extracto de Semilla de Calabaza, Extracto de Hoja de Nabo. Dosis: 2 cápsulas al día. Tomar preferiblemente en ayunas por la mañana con agua. La L-Arginina mejora el flujo sanguíneo y la Maca Negra y Roja es adaptógena y apoya la producción hormonal natural.
- Turkesterona & Tongkat Ali: Composición pendiente de etiqueta. Indicar: "Consulta la etiqueta del producto para composición y dosis."
- Secret Drops (Rendimiento Sexual): Gotas orales 30ml. Fórmula con mezcla propietaria de ingredientes naturales con propiedades vasodilatadoras. Mejora el flujo sanguíneo, sensibilidad y rendimiento. Efecto relajante que reduce estrés y ansiedad. Dosis: unas gotas al día vía oral. Almacenar en lugar fresco y seco. Vida útil: 3 años.
- Shilajit (Concentrado): Resina pura de Shilajit del Himalaya 600mg por toma. Contiene Ácido Fúlvico (75%+) y 85+ minerales traza (magnesio, zinc, selenio, hierro). Dosis: 1 toma al día, mezclar con agua, batido o comida. El ácido fúlvico maximiza la absorción de otros nutrientes y minerales. Vegano, sin OGM. Almacenar en lugar fresco.
`;

function buildUserPrompt(p) {
  const nivelDesc = p.experiencia_gym === 'principiante'
    ? 'PRINCIPIANTE (0-1 año) — ejercicios básicos, sin tempo'
    : p.experiencia_gym === 'avanzado'
    ? 'AVANZADO (+4 años) — incluir TEMPO MECÁNICO y CALIDAD TÉCNICA (1-10) por ejercicio'
    : 'INTERMEDIO (1-4 años) — periodización básica, progresión de peso';

  return `Genera mi protocolo PRIMAL CLUB personalizado:

DATOS: ${p.nombre || 'Miembro PRIMAL'}, ${p.edad || 30} años, ${p.peso || 80}kg, ${p.altura || 175}cm, actividad ${p.nivel_actividad || 'moderado'}

OBJETIVOS: ${p.objetivo || 'recomposición'} — ${p.objetivo_especifico || ''}

ENTRENAMIENTO: ${nivelDesc}. ${p.dias_entreno || 4} días/sem, equipo ${p.equipo_disponible || 'gimnasio completo'}, horario ${p.horario || 'flexible'}, lesiones: ${p.problemas_salud || 'ninguna'}

NUTRICIÓN: ${p.comidas_dia || 3} comidas/día, supermercado ${p.supermercado || 'Mercadona'}, presupuesto ${p.presupuesto_semanal || 60}€/sem, restricciones: ${p.restricciones || 'ninguna'}
COMIDAS FAVORITAS: ${p.comidas_favoritas || 'variado'} → incluir VERSIONES FIT de estas + 1 comida real/semana con porción ajustada

SUPLEMENTOS: ${(p.suplementos || ['NMN MACA']).join(', ')}
DATOS DE ETIQUETAS (usa SOLO esta info — si un campo dice "pendiente", pon "Consulta la etiqueta"):
${SUPP_DATA}
MEDICACIÓN: ${p.medicacion || 'ninguna'}
NOTAS: ${p.notas || 'Ninguna'}

Genera la página HTML interactiva completa.`;
}
