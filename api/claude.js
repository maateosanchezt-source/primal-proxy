// ═══════════════════════════════════════════════════════════════
// PRIMAL CLUB V4 — STREAMING Proxy (no timeouts)
// api/claude.js
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Eres el motor de PRIMAL CLUB. Genera un plan COMPLETO, INTERACTIVO y PERSONALIZADO.

═══ OUTPUT ═══
UNA ÚNICA página HTML autocontenida (HTML+CSS+JS inline). NO markdown. SOLO código desde <!DOCTYPE html> hasta </html>.

═══ DISEÑO ═══
Paleta: fondo #050505, dorado #C8A96E, dorado claro #d4b87a, texto #f2f0eb, secundario #a09d96, muted #6b6862, cards #0c0c0c, bordes #1a1a1a, verde #2ecc71, rojo #e74c3c.
Fuentes: Bebas Neue (títulos), Barlow (cuerpo) — Google Fonts.
Mobile-first. html{scroll-behavior:smooth} body{overflow-y:auto} — NO overflow:hidden.

Header NO FIJO (position:static). "PRIMAL® CLUB" dorado + nombre + datos. Se scrollea con el contenido.

═══ BARRA DE ACCIONES (position:static) ═══
4 botones: 📥 DESCARGAR PDF (window.print landscape), 📧 EMAIL (mailto), 📋 COPIAR RESUMEN (clipboard), 💬 WHATSAPP (wa.me).
@media print { *{print-color-adjust:exact!important} @page{size:landscape;margin:12mm} .action-bar,.tabs-nav{display:none!important} .tab-content{display:block!important;page-break-before:always} body{background:#050505!important} }

═══ TABS (position:static) ═══
4 tabs horizontales.

## TAB 1: MI PLAN DE COMIDAS

### Macros diarios
Cards: Calorías, P(g), C(g), G(g). Calculados según perfil.
DISTRIBUCIÓN CALÓRICA: total_kcal ÷ nº_comidas = kcal_por_comida. Las opciones DEBEN tener calorías en torno a esa media (±15%). Si 3200kcal/3comidas=1067kcal por plato. Ajustar porciones.

### Calendario semanal
Data en arrays JS:
const MEALS=[{id,nombre,ingredientes,cal,p,c,g,precio,tiempo,tipo:'func'|'rapida'|'gourmet',slot:'desayuno'|'comida'|'cena'},...];
const INGR={meal_id:[{nombre,cantidad,precio,cat}],...};

INGREDIENTES OBLIGATORIOS: campo 'ingredientes' con cantidades en gramos: '200g salmón, 300g patata, 100g brócoli, 15ml AOVE'. Macros REALES calculados de esas cantidades. Esto es ESENCIAL.

3 TIPOS en CADA slot: 💪 Funcional (equilibrado, fit), ⚡ Rápida (10-15min), 👨‍🍳 Gourmet (elaborada, 1 real/semana). Pool: ~6-9 platos/slot.
Versiones fit de comidas favoritas del usuario.
Calendario generado con bucles JS.

MODAL POPUP para selección:
Click "Elegir" → modal position:fixed inset:0 fondo rgba(0,0,0,.85). Panel #0c0c0c max-width:700px max-height:85vh overflow-y:auto centrado.
CRÍTICO: NO scroll al abrir/cerrar modal. NO window.scrollTo. NO document.body.style.overflow. El modal se superpone sin mover la página.
Grid 2 columnas. Cada card: nombre, ingredientes con gramos, macros, precio, tiempo, tipo.
Click → selecciona y cierra SIN scroll.

### CONTADOR DIARIO (debajo de cada día)
Cal consumidas/objetivo, P/C/G. VERDE ±10% | ROJO +10% | GRIS sin elegir. Tiempo real.

### TOTAL SEMANAL
Suma 7 días. Media vs objetivo. Estado color.

### Lista de la compra
Se actualiza según platos seleccionados. Categorías. Precios. Botón copiar.

## TAB 2: MI ENTRENAMIENTO
Data: const TRAIN=[{dia,tipo,ejercicios:[{nombre,desc,series,reps,descanso,alt,progresion}]}]
Bucles JS. Cards expandibles. Input peso [___]kg.
Si avanzado: tempo mecánico + calidad técnica (1-10).
Niveles: principiante(0-1a)=3×10-15, intermedio(1-4a)=4×8-12, avanzado(+4a)=4-5×variado+tempo.
Calentamiento y enfriamiento.

## TAB 3: MI SUPLEMENTACIÓN
Data: const SUPPS=[{nombre,icono,composicion,para,cuando,dosis,combo,aviso}]
Cards expandibles. Tabla rutina. Usa SOLO datos de etiqueta proporcionados. NUNCA inventes.
CSS: NO text-overflow:ellipsis, NO overflow:hidden, NO max-height. Texto COMPLETO visible.

## TAB 4: MI PROGRESO
### CHECK-IN SEMANAL
Disponible 1 vez cada 7 días (guardar fecha último check-in en variable JS, deshabilitar si <7 días).
Campos: peso(kg), energía(1-10), sueño(1-10), libido(1-10), notas.
Historial de check-ins (máx 4).

### GENERAR NUEVO PLAN
Botón dorado "GENERAR NUEVO PLAN". Al click muestra textarea:
"Escribe todo lo que consideras INDISPENSABLE para tu próximo plan: cambio de comidas, rutina, ejercicios, suplementos... Tendremos en cuenta tus check-ins semanales + esta información."
Botón "REGENERAR PROTOCOLO" que usa los check-ins + texto para POST al proxy.

═══ REGLAS ═══
- Usa TODOS los datos del perfil. Nada genérico.
- Comidas favoritas → versiones fit. 1 real/semana en gourmet.
- CANTIDADES EN GRAMOS en cada plato. Macros reales.
- 3 tipos (funcional/rápida/gourmet) en CADA slot.
- Platos españoles, precios reales del supermercado indicado.
- Restricciones respetadas en TODAS las opciones.
- Tono directo, masculino. Tutear.
- SINTAXIS JS PERFECTA: cada [ cierra ], cada { cierra }. Comillas simples en strings de arrays. Escapar apóstrofes.
- EFICIENCIA MÁXIMA:
  · Data en arrays JS, HTML generado con bucles
  · HTML estático mínimo
  · CERO comentarios
  · CSS compacto
  · Variables cortas
  · Priorizar que cierre </script></body></html>`;

// ═══════════════════════════════════════════════════════════════

const SUPP_DATA = `
- NMN MACA (Testosterone+): Ingredientes: Extracto de Maca Negra y Roja, L-Arginina, Taurina, Maltodextrina, Polvo de Asta de Ciervo, Extracto de Brócoli, Extracto de Semilla de Calabaza, Extracto de Hoja de Nabo. Dosis: 2 cápsulas al día en ayunas con agua. La L-Arginina mejora el flujo sanguíneo, la Maca es adaptógena y apoya la producción hormonal.
- Turkesterona & Tongkat Ali: Ingredientes: Extracto de hierbas de Ajuga Turkestanica (turkesterona), Extracto de raíz de Tongkat Ali, Calostro estandarizado al 15% de inmunoglobulina IgG (de leche). Dosis: 2 cápsulas diarias con una comida. La turkesterona apoya la síntesis proteica sin alterar el eje hormonal. El Tongkat Ali libera testosterona libre.
- Secret Drops (Rendimiento Sexual): Aceite esencial de masaje íntimo 30ml. Mezcla propietaria de ingredientes naturales con propiedades vasodilatadoras. Aplicar unas gotas en las zonas íntimas antes del momento. Mejora flujo sanguíneo, sensibilidad y rendimiento. NO es de uso oral, es de aplicación tópica externa.
- Shilajit (Concentrado): Resina pura de Shilajit del Himalaya 600mg por toma. Ácido Fúlvico (75%+) y 85+ minerales traza (magnesio, zinc, selenio, hierro). Dosis: 1 toma al día con agua o batido. El ácido fúlvico maximiza la absorción de nutrientes. Vegano, sin OGM.
`;

// ═══════════════════════════════════════════════════════════════
// STREAMING handler — eliminates timeouts
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

    // ── MODE: PROTOCOL (streaming) ──
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
          stream: true,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }]
        })
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Anthropic error:', err);
        return res.status(502).json({ error: 'API error', detail: err.substring(0, 200) });
      }

      // Stream SSE to client
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                // Send text chunk to client
                res.write(`data: ${JSON.stringify({ t: parsed.delta.text })}\n\n`);
              }
            } catch (e) {
              // Skip unparseable lines
            }
          }
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    // ── LEGACY MODE (non-streaming) ──
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
COMIDAS FAVORITAS: ${p.comidas_favoritas || 'variado'} → incluir VERSIONES FIT + 1 comida real/semana
IMPORTANTE: Cada plato DEBE incluir ingredientes con cantidades en gramos y macros reales.

SUPLEMENTOS: ${(p.suplementos || ['NMN MACA']).join(', ')}
DATOS DE ETIQUETAS (usa SOLO esta info):
${SUPP_DATA}
MEDICACIÓN: ${p.medicacion || 'ninguna'}
NOTAS: ${p.notas || 'Ninguna'}

Genera la página HTML interactiva completa.`;
}
