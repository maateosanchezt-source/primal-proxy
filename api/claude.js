// ═══════════════════════════════════════════════════════════════
// PRIMAL CLUB V2 — API Proxy for Interactive Protocol Generation
// api/claude.js
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Eres el motor de PRIMAL CLUB, el sistema de protocolos personalizados de optimización masculina más completo del mercado. Tu trabajo es generar un plan COMPLETO, INTERACTIVO y PERSONALIZADO para cada miembro.

═══ OUTPUT ═══
Genera UNA ÚNICA página HTML autocontenida (HTML + CSS + JS inline). NO markdown. NO explicaciones. SOLO el código HTML completo empezando por <!DOCTYPE html> y terminando en </html>.

═══ DISEÑO ═══
Paleta PRIMAL:
- Fondo: #050505 (negro profundo)
- Dorado: #C8A96E (accent principal)
- Dorado claro: #d4b87a
- Texto principal: #f2f0eb (crema)
- Texto secundario: #a09d96
- Texto muted: #6b6862
- Cards: #0c0c0c
- Bordes: #1a1a1a
- Verde éxito: #2ecc71

Fuentes: Bebas Neue (títulos), Barlow (cuerpo). Importar desde Google Fonts.
Mobile-first responsive. Border-radius suave. Transiciones 0.3s.

Header fijo con logo "PRIMAL® CLUB" en dorado + nombre del miembro + fecha de generación.

═══ ESTRUCTURA DE LA PÁGINA ═══

La página tiene 4 secciones con navegación por tabs en la parte superior:

## TAB 1: MI PLAN DE COMIDAS (activo por defecto)

### Resumen de macros diarios
Mostrar en cards horizontales: Calorías objetivo, Proteína (g), Carbohidratos (g), Grasa (g).
Calcularlos según el perfil del usuario (peso, altura, edad, objetivo, actividad).

### Calendario semanal interactivo
- 7 columnas (Lun-Dom), cada una con N slots de comida (según comidas_dia del usuario)
- Cada slot de comida (ej: "Comida 1", "Comida 2", "Cena") tiene un botón "Elegir"
- Al hacer click en "Elegir" se abre un modal/desplegable con 4 OPCIONES de plato
- Cada opción muestra:
  · Nombre del plato (ej: "Pollo a la plancha con arroz integral")
  · Descripción corta (1 línea: ingredientes principales)
  · Macros: Proteína | Carbos | Grasa | Calorías
  · Precio estimado: €X.XX (basado en el supermercado del usuario)
  · Tiempo de preparación: X min
  · Icono de dificultad (fácil/media)
- Al seleccionar una opción, se marca con borde dorado y se cierra el desplegable
- El nombre del plato seleccionado aparece en el slot del calendario

IMPORTANTE sobre las opciones de platos:
- Deben ser REALES, con ingredientes que se compran en el supermercado indicado por el usuario
- Los precios deben ser REALISTAS para España (Mercadona, Lidl, Carrefour, etc.)
- Las opciones deben variar: no repetir el mismo plato en distintos slots
- Cada opción debe cumplir aproximadamente los macros del slot (distribuir las calorías diarias entre las comidas)
- Incluir opciones rápidas (<15 min) y opciones más elaboradas
- Generar AL MENOS 4 opciones distintas por slot, pero pueden compartirse opciones entre días

### Lista de la compra automática
- Sección que se actualiza EN TIEMPO REAL según los platos seleccionados en el calendario
- Organizada por categorías: Proteínas, Verduras y Hortalizas, Frutas, Lácteos, Cereales y Legumbres, Otros
- Cada item muestra: nombre, cantidad necesaria para la semana, precio estimado
- Total estimado de la compra semanal al final
- Botón "Copiar lista" que copia al portapapeles en formato texto limpio
- Si no se ha seleccionado ningún plato, mostrar mensaje: "Elige tus comidas en el calendario para generar tu lista"

## TAB 2: MI ENTRENAMIENTO

### Resumen semanal
Cards con los días de entreno marcados y tipo de sesión (ej: "Lunes - Pecho y Tríceps").

### Plan de entrenamiento detallado
Para cada día de entrenamiento:
- Título del día y grupo muscular
- Lista de ejercicios, cada uno como card EXPANDIBLE (click para abrir/cerrar):
  · Nombre del ejercicio
  · Al expandir muestra:
    - Descripción de cómo ejecutarlo (2-3 líneas claras)
    - Series x Repeticiones (ej: "4 x 10-12")
    - Descanso entre series (ej: "90 seg")
    - Alternativa si no tiene el equipo (ej: "Sin barra: usar mancuernas")
    - Nota de progresión (ej: "Sube 2.5kg cuando completes 4x12 con buena forma")

El plan debe ser apropiado para el nivel del usuario (principiante/intermedio/avanzado).
Incluir calentamiento y enfriamiento.
Si el usuario tiene limitaciones de equipo, adaptar TODO el plan.

## TAB 3: MI SUPLEMENTACIÓN

Lista de los suplementos que tiene el usuario. Cada suplemento es una card EXPANDIBLE:
- Nombre del suplemento + icono
- Al expandir:
  · Qué es (1-2 líneas, sin jerga)
  · Para qué sirve (beneficios concretos)
  · Cuándo tomarlo (momento del día, con/sin comida)
  · Dosis recomendada (cantidad exacta)
  · Con qué combinarlo para mejor efecto
  · Advertencias (si aplica)

Incluir SIEMPRE estos suplementos base que vienen en el protocolo PRIMAL:
- NMN MACA (testosterona, energía, antienvejecimiento)
- Turkesterona & Tongkat Ali (fuerza, masa muscular) — si está en su pack
- Secret Drops (rendimiento sexual) — si está en su pack

Añadir recomendaciones generales:
- Timing óptimo de cada suplemento
- Tabla visual de "Mi rutina de suplementos" (mañana/mediodía/noche)

## TAB 4: MI PROGRESO

- Sección de check-in mensual (formulario visual, no funcional por ahora, solo diseño)
- Campos: peso actual, medidas, energía (1-10), sueño (1-10), libido (1-10), notas
- Texto: "Tu próximo check-in: [fecha +30 días]. Actualizaremos tu plan según tu progreso."
- Historial placeholder: "Mes 1 - Plan inicial generado ✓"

═══ INTERACTIVIDAD (JavaScript) ═══

1. TABS: Click en tab cambia la vista. Tab activo con borde dorado inferior.

2. CALENDARIO DE COMIDAS:
   - Cada slot tiene botón "Elegir" → abre panel desplegable con 4 opciones
   - Click en opción → se selecciona (borde dorado, checkmark), las demás se desmerman
   - El slot muestra el nombre del plato elegido
   - La lista de la compra se recalcula automáticamente

3. LISTA DE LA COMPRA:
   - Objeto JavaScript global que mapea cada plato a sus ingredientes con cantidades
   - Función que recorre todos los slots seleccionados, agrupa ingredientes, suma cantidades
   - Renderiza la lista organizada por categorías
   - Botón copiar: navigator.clipboard.writeText()

4. EJERCICIOS EXPANDIBLES:
   - Click en card de ejercicio → toggle clase .expanded
   - Animación suave de max-height

5. SUPLEMENTOS EXPANDIBLES:
   - Mismo patrón que ejercicios

6. RESPONSIVE:
   - Mobile: calendario en scroll horizontal o stack vertical
   - Tabs en scroll horizontal en mobile

═══ REGLAS DE PERSONALIZACIÓN ═══

- NUNCA generes planes genéricos. Usa TODOS los datos del perfil del usuario.
- Los platos deben ser de la GASTRONOMÍA ESPAÑOLA y adaptados al supermercado indicado.
- Los precios deben ser REALISTAS para España 2025.
- Si el usuario tiene restricciones alimentarias, TODAS las opciones deben respetarlas.
- El plan de entrenamiento debe coincidir EXACTAMENTE con los días indicados.
- El tono es directo, masculino, sin rodeos. Tutea al usuario. Nada de "querido usuario".
- Usa el nombre del usuario en el header.

═══ CALIDAD DEL OUTPUT ═══

El HTML generado debe ser:
- COMPLETO: No dejes secciones a medias ni uses "..." o "etc"
- FUNCIONAL: Todo el JavaScript debe funcionar correctamente
- BONITO: Diseño premium que el usuario sienta que vale €49/mes
- PESADO EN DATOS: Genera TODOS los platos, TODOS los ejercicios, TODOS los ingredientes. No escatimes.

RECUERDA: Este plan es lo que diferencia a PRIMAL de cualquier marca de suplementos. Tiene que ser TAN bueno que el cliente no quiera cancelar su suscripción NUNCA. Cada detalle importa.`;

// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // ── CORS ──
  const allowed = [
    'https://primalgens.com',
    'https://www.primalgens.com',
    'http://localhost:3000'
  ];
  const origin = req.headers.origin || '';
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { mode, profile, prompt, max_tokens } = req.body;

    // ── MODE 1: GENERATE PROTOCOL (structured questionnaire) ──
    if (mode === 'protocol') {
      if (!profile || typeof profile !== 'object') {
        return res.status(400).json({ error: 'Missing profile object' });
      }

      // Build user prompt from questionnaire data
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
          max_tokens: 64000,
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

      // Extract HTML from response
      const htmlContent = data.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('');

      return res.status(200).json({
        success: true,
        html: htmlContent,
        usage: data.usage
      });
    }

    // ── MODE 2: LEGACY (raw prompt, backwards compatible) ──
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
// Build structured user prompt from questionnaire profile
// ═══════════════════════════════════════════════════════════════

function buildUserPrompt(p) {
  return `Genera mi protocolo PRIMAL CLUB personalizado. Aquí está mi perfil:

DATOS PERSONALES:
- Nombre: ${p.nombre || 'Miembro PRIMAL'}
- Edad: ${p.edad || 30} años
- Peso: ${p.peso || 80} kg
- Altura: ${p.altura || 175} cm
- Nivel de actividad actual: ${p.nivel_actividad || 'moderado'}

OBJETIVOS:
- Objetivo principal: ${p.objetivo || 'mejorar composición corporal'}
- Objetivo específico: ${p.objetivo_especifico || 'perder grasa y ganar fuerza'}

ENTRENAMIENTO:
- Experiencia en gimnasio: ${p.experiencia_gym || 'intermedio'}
- Días disponibles para entrenar: ${p.dias_entreno || 4}
- Equipo disponible: ${p.equipo_disponible || 'gimnasio completo'}
- Horario preferido: ${p.horario || 'flexible'}

NUTRICIÓN:
- Comidas al día: ${p.comidas_dia || 3}
- Supermercado habitual: ${p.supermercado || 'Mercadona'}
- Presupuesto semanal en alimentación: ${p.presupuesto_semanal || 60}€
- Restricciones alimentarias: ${p.restricciones || 'ninguna'}
- Alergias: ${p.alergias || 'ninguna'}

SUPLEMENTOS EN SU PROTOCOLO:
${(p.suplementos || ['NMN MACA']).map(s => `- ${s}`).join('\n')}

SALUD:
- Problemas de salud o lesiones: ${p.problemas_salud || 'ninguno'}
- Medicación actual: ${p.medicacion || 'ninguna'}

NOTAS ADICIONALES:
${p.notas || 'Ninguna'}

Genera la página HTML interactiva completa con mi plan personalizado.`;
}
