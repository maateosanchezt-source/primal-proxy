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
7 columnas (Lun-Dom). Cada día tiene N slots (según comidas_dia).
Cada slot: botón "Elegir" → desplegable con EXACTAMENTE 2 opciones:

OPCIÓN 1 — "💪 Funcional": 15-20 min, práctico, equilibrado. Si hay comidas favoritas, incluir VERSIONES FIT (pizza fit con base integral, burger de pollo con pan integral, etc). Adaptar sabor manteniendo macros.

OPCIÓN 2 — "👨‍🍳 Gourmet": Elaborado, gastronómico. Incluir AL MENOS 1 comida "real" por semana (no fit) con porción ajustada a macros (paella real con cantidad justa, carbonara controlada). Clave para adherencia.

Cada opción muestra: nombre, descripción (1 línea), macros (P/C/G/kcal), precio (€), tiempo (min).
Al seleccionar: borde dorado, se cierra el desplegable.

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

### Resumen semanal con días y tipo de sesión

### Plan por día — ejercicios como cards EXPANDIBLES:
Al expandir cada ejercicio:
- Descripción de ejecución (2-3 líneas directas)
- Series x Reps
- Descanso
- Alternativa sin equipo
- Progresión

### REGISTRO DE PESOS
Junto a cada ejercicio: input numérico editable [___] kg
Se guarda en variable JS mientras la página esté abierta.

### PARA AVANZADOS (+4 años):
Campos adicionales por ejercicio:
- Tempo mecánico: input texto (ej: "3-1-2-0")
- Calidad técnica: selector visual 1-10 con barra dorada proporcional

### Adaptar según nivel:
- PRINCIPIANTE (0-1 año): básicos compuestos, 3 series, 10-15 reps, sin tempo
- INTERMEDIO (1-4 años): periodización, 4 series, 8-12 reps, progresión peso
- AVANZADO (+4 años): técnicas intensidad, 4-5 series, rangos variados, tempo + calidad técnica

Incluir calentamiento y enfriamiento.

## TAB 3: MI SUPLEMENTACIÓN
Cards expandibles por suplemento: qué es, para qué, cuándo, dosis, combinación, advertencias.
Tabla visual "Mi rutina de suplementos" (mañana/mediodía/noche).
NMN MACA siempre. Turkesterona, Secret Drops, Shilajit según pack.

## TAB 4: MI PROGRESO
Check-in mensual (formulario visual).
Campos: peso, medidas, energía/sueño/libido (1-10), notas.
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
- EFICIENTE: Usa CSS minificado, nombres cortos de variables, evita comentarios innecesarios. El código debe ser compacto pero legible. Prioriza funcionalidad sobre verbosidad en el código. Usa arrays de datos y bucles JS para generar HTML dinámicamente en vez de escribir cada elemento a mano.`;

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
          max_tokens: 16000,
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
      const htmlContent = data.content.filter(b => b.type === 'text').map(b => b.text).join('');

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
MEDICACIÓN: ${p.medicacion || 'ninguna'}
NOTAS: ${p.notas || 'Ninguna'}

Genera la página HTML interactiva completa.`;
}
