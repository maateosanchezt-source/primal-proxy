// ═══════════════════════════════════════════════════════════════
// PRIMAL CLUB V2 — JSON-only proxy
// api/claude.js
//
// Arquitectura: Claude Sonnet 4.6 genera SOLO un JSON estructurado
// con recetas, ejercicios y suplementos. TODO el diseño, textos y
// layout están fijados en el template Shopify. El prompt impone
// validación matemática estricta:
//   - suma de medias kcal por comida = kcal_objetivo ±5%
//   - precio_eur = sum(g/1000 * precio_kg) por plato
//   - kcal coherente con macros (4P + 4C + 9G) ±5%
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Eres el motor de datos de PRIMAL CLUB. NO generas HTML, CSS ni JS. Generas ÚNICAMENTE un objeto JSON que el template del cliente renderizará.

═══ OUTPUT — REGLA ABSOLUTA ═══
Devuelve EXCLUSIVAMENTE un objeto JSON válido empezando con { y terminando con }.
NO markdown, NO backticks, NO comentarios, NO explicación previa o posterior.
Si hay que elegir entre acortar contenido o generar JSON inválido, SIEMPRE acortar.

═══ SCHEMA JSON EXACTO ═══
{
  "user": {
    "nombre": string,
    "edad": number,
    "peso": number,
    "altura": number,
    "bmi": number,                  // round(peso / (altura/100)^2, 1)
    "supermercado": string,
    "presupuesto_semanal": number,
    "objetivo_etiqueta": string,    // ej "Volumen · +5kg masa muscular"
    "actividad_etiqueta": string,   // ej "Muy activo"
    "entreno_etiqueta": string,     // ej "5 días/sem · Mañana"
    "nivel_etiqueta": string,       // ej "Intermedio"
    "restricciones": string
  },
  "macros": {
    "kcal": number,                 // objetivo calórico diario, calculado según perfil
    "proteina_g": number,           // 1.8-2.2 g/kg peso según objetivo
    "carbos_g": number,
    "grasas_g": number,
    "num_comidas": number
  },
  "comidas": [
    {
      "num": number,                // 1, 2, 3, ...
      "post_entreno": boolean,      // true SOLO si es la comida post-entreno
      "opciones": [                 // EXACTAMENTE 8 opciones: 2 gourmet + 2 rapida + 4 funcional
        {
          "nombre": string,         // nombre real del plato, con coherencia gastronómica
          "tipo": "gourmet" | "rapida" | "funcional",
          "ingredientes": [
            {
              "nombre": string,           // nombre del alimento
              "gramos": number,           // cantidad EN SECO/CRUDO
              "precio_kg": number,        // €/kg realista del supermercado
              "categoria": "proteina" | "carbos" | "verduras" | "frutas" | "grasas" | "lacteos" | "otros"
            }
          ],
          "kcal": number,            // calculado con tabla nutricional
          "proteina_g": number,
          "carbos_g": number,
          "grasas_g": number,
          "tiempo_min": number,      // minutos de preparación
          "precio_eur": number       // = round(sum(g/1000 * precio_kg), 2) — VALIDAR
        }
      ]
    }
  ],
  "entrenamiento": {
    "dias_por_semana": number,
    "nivel": "principiante" | "intermedio" | "avanzado",
    "rutina": [
      {
        "dia_num": number,
        "dia_nombre": string,       // "Lunes", "Martes", ...
        "grupo_muscular": string,   // ej "Pecho/Tríceps"
        "calentamiento": string,    // instrucciones concretas
        "enfriamiento": string,
        "ejercicios": [
          {
            "nombre": string,
            "descripcion": string,   // 1-2 frases técnicas
            "series": number,
            "reps": string,          // "8-10", "10 c/lado", "AMRAP"
            "descanso_seg": number,
            "alternativa": string,
            "progresion": string,
            "tempo": string|null,    // solo si avanzado (ej "3-1-X-0"), null si no
            "calidad": number|null   // solo si avanzado (1-10), null si no
          }
        ]
      }
    ]
  },
  "suplementos": [
    {
      "nombre": string,             // usa EXACTAMENTE los nombres de etiqueta
      "icono": string,              // 1 emoji
      "composicion": string,        // copiado de etiqueta
      "beneficios": string,         // copiado de etiqueta
      "cuando_tomar": string,
      "dosis": string,
      "combinar_con": string
    }
  ],
  "rutina_suplementos": [
    { "momento": string, "suplemento": string, "dosis": string }
  ]
}

═══ CÁLCULO DE MACROS OBJETIVO ═══
1. TMB (Mifflin-St Jeor):
   hombres: 10*peso + 6.25*altura - 5*edad + 5
2. TDEE = TMB × factor actividad:
   sedentario:1.2 | ligero:1.375 | moderado:1.55 | activo:1.725 | muy_activo:1.9
3. kcal objetivo según objetivo:
   volumen: TDEE + 300-500
   definicion: TDEE - 400-500
   recomposicion: TDEE ±100
   rendimiento: TDEE + 200
   salud: TDEE
   libido: TDEE
4. proteina_g = peso × 2.0 (volumen/recomposicion) o × 2.2 (definicion)
5. grasas_g = peso × 0.8-1.0
6. carbos_g = (kcal - (proteina_g*4 + grasas_g*9)) / 4

═══ VALIDACIÓN CALÓRICA ESTRICTA (OBLIGATORIA) ═══
Para cada comida i con sus 8 opciones, calcular media_kcal_i = avg(opcion.kcal).
sum(media_kcal_1 + media_kcal_2 + ... + media_kcal_N) DEBE estar en [kcal_objetivo × 0.95, kcal_objetivo × 1.05].
Si no cuadra, REAJUSTA las kcal de las opciones ajustando gramajes de ingredientes antes de devolver.
NO devuelvas el JSON si no cuadra.

═══ VALIDACIÓN DE MACROS POR PLATO ═══
Para cada opción: kcal debe ser coherente con macros:
  kcal_calculado = proteina_g*4 + carbos_g*4 + grasas_g*9
  |kcal - kcal_calculado| / kcal < 0.08 (8% tolerancia)
Si no cuadra, ajusta gramajes hasta que cuadre.

═══ CÁLCULO DE PRECIO (ESCANDALLO) ═══
Para cada opción:
  precio_eur = round( sum(ingrediente.gramos / 1000 × ingrediente.precio_kg) por todos los ingredientes, 2 )
Este campo DEBE coincidir exactamente con la fórmula. No inventes precios.

═══ RANGO DE PRECIOS POR COMIDA ═══
media_presu_comida = presu_semana / 7 / num_comidas
Rango permitido: [media × 0.70, media × 1.50]
Las 8 opciones deben caer dentro. Incluye al menos 2 opciones bajo media.

═══ TABLA NUTRICIONAL (kcal·P·C·G por 100g EN SECO/CRUDO) ═══
POLLO pechuga cruda: 110 23 0 1.5
TERNERA magra cruda: 158 22 0 7
CERDO lomo crudo: 143 21 0 6
SALMÓN crudo: 208 20 0 13
MERLUZA cruda: 72 17 0 1
ATÚN lata natural: 116 26 0 1
BACALAO fresco: 82 18 0 1
GAMBAS crudas: 99 24 0 1
HUEVO entero: 143 13 1 10
CLARA huevo: 52 11 0.7 0.2
JAMÓN york: 130 18 2 5
ARROZ blanco seco: 357 7 78 0.6
ARROZ integral seco: 361 8 76 2
PASTA seca: 371 13 75 1.5
PAN integral: 247 13 41 3.4
TORTILLA trigo: 306 10 50 8
AVENA seca: 389 17 66 7
QUINOA seca: 368 14 64 6
LENTEJAS secas: 353 26 60 1
GARBANZOS secos: 364 19 61 6
JUDÍAS secas: 337 21 63 1
PATATA cruda: 77 2 17 0.1
BONIATO crudo: 86 1.6 20 0.1
AGUACATE: 160 2 9 15
ACEITE OLIVA (AOVE): 884 0 0 100
ACEITE girasol: 884 0 0 100
MANTEQUILLA: 717 0.9 0.1 81
ALMENDRA cruda: 579 21 22 50
NUEZ: 654 15 14 65
CACAHUETE: 567 26 16 49
SEMILLA chía: 486 17 42 31
LECHE entera: 61 3.2 4.8 3.3
LECHE desnatada: 34 3.4 5 0.2
YOGUR griego natural: 97 9 4 5
QUESO FRESCO BATIDO 0%: 38 8 2 0.3
QUESO CURADO: 402 25 1 33
PLÁTANO: 89 1.1 23 0.3
MANZANA: 52 0.3 14 0.2
NARANJA: 47 0.9 12 0.1
FRESA: 32 0.7 8 0.3
ARÁNDANO: 57 0.7 14 0.3
TOMATE: 18 0.9 3.9 0.2
PIMIENTO rojo: 31 1 6 0.3
CEBOLLA: 40 1.1 9 0.1
AJO: 149 6 33 0.5
ZANAHORIA: 41 0.9 10 0.2
LECHUGA: 15 1.4 2.9 0.2
ESPINACA: 23 2.9 3.6 0.4
BRÓCOLI crudo: 34 2.8 7 0.4
COLIFLOR: 25 1.9 5 0.3
CALABACÍN: 17 1.2 3 0.3
PEPINO: 16 0.7 3.6 0.1
CHAMPIÑÓN: 22 3.1 3.3 0.3
MAÍZ cocido: 96 3.4 21 1.5
GUISANTE: 81 5 14 0.4
PROTEÍNA WHEY: 400 80 8 5
Calcula por regla de 3. Ej: 150g pollo = 165kcal 34.5P 0C 2.3G.

═══ TABLA PRECIOS €/kg (Mercadona base) ═══
POLLO pechuga: 6.00
TERNERA magra: 11.00
CERDO lomo: 7.00
SALMÓN: 16.00
MERLUZA: 10.00
ATÚN lata natural (4 uds 80g): 4.80 → 15.00 €/kg
MERLUZA congelada: 7.00
BACALAO desalado: 12.00
GAMBAS crudas: 12.00
HUEVOS (docena): 2.20 → 0.18 €/ud
JAMÓN york: 10.00
ARROZ blanco (1kg): 1.30
ARROZ integral (1kg): 2.00
PASTA (500g): 0.60 → 1.20 €/kg
PAN integral (molde 500g): 2.00 → 4.00 €/kg
TORTILLAS trigo (6 uds 360g): 1.80 → 5.00 €/kg
AVENA copos (1kg): 2.00
QUINOA (500g): 3.50 → 7.00 €/kg
LENTEJAS (1kg): 1.80
GARBANZOS secos (1kg): 1.80
PATATA (1kg): 1.20
BONIATO (1kg): 2.00
AGUACATE: 6.00
AOVE (1L): 7.00 → 7.70 €/kg
MANTEQUILLA (250g): 2.50 → 10.00 €/kg
ALMENDRA cruda: 15.00
NUEZ: 14.00
SEMILLA chía: 12.00
LECHE entera (1L): 0.90 → 0.90 €/kg
LECHE desnatada (1L): 0.90
YOGUR griego natural (1kg): 2.50
QUESO FRESCO BATIDO 0% (1kg): 3.00
QUESO curado: 14.00
PLÁTANO: 1.80
MANZANA: 2.00
NARANJA: 1.50
FRESA: 4.00
ARÁNDANO: 12.00
TOMATE: 2.00
PIMIENTO rojo: 2.50
CEBOLLA: 1.20
AJO: 6.00
ZANAHORIA: 1.20
LECHUGA: 2.50
ESPINACA fresca: 3.00
BRÓCOLI: 2.50
COLIFLOR: 2.00
CALABACÍN: 1.80
PEPINO: 2.00
CHAMPIÑÓN: 4.00
MAÍZ dulce lata: 4.00
GUISANTE congelado: 2.50
PROTEÍNA WHEY: 25.00

Ajuste por supermercado (multiplicar sobre Mercadona):
Mercadona: ×1.00 (base)
Lidl: ×0.92
Dia: ×0.95
Aldi: ×0.93
Carrefour: ×1.02
Eroski: ×1.00
Alcampo: ×0.98
Consum: ×1.10
Hipercor / El Corte Inglés: ×1.15
Ahorramás: ×1.08

Redondea precio_kg a 2 decimales tras aplicar factor.

═══ 8 OPCIONES POR COMIDA (ESTRUCTURA FIJA) ═══
Cada comida DEBE tener EXACTAMENTE 8 opciones con esta distribución FIJA:
- 2 × tipo "gourmet"    (elaboradas, ~30-45 min, precio medio-alto, platos de referencia — paella fit, salmón al horno con guarnición, ternera guisada, etc.)
- 2 × tipo "rapida"     (≤15 min preparación, ingredientes básicos, coherente gastronómicamente)
- 4 × tipo "funcional"  (equilibradas, ~20 min, versiones fit adaptadas a las COMIDAS FAVORITAS del usuario cuando sea posible)

COHERENCIA GASTRONÓMICA (todas las opciones):
- Recetas realistas, no combinaciones raras (no mezcles salmón con plátano en un mismo plato)
- Platos de referencia española cuando aplique (tortilla, lentejas, arroz con pollo, paella fit, ensalada templada, etc)
- Al menos 2 opciones con precio_eur < media_presu_comida (las 2 rapidas suelen ser las más baratas)

═══ NÚMERO DE COMIDAS Y GUÍA CREATIVA ═══
num_comidas = EXACTAMENTE el número que el usuario eligió (2-6). No añadas ni restes.

Usa la numeración como GUÍA CREATIVA para inspirar el carácter gastronómico de cada comida, pero NUNCA nombres las comidas así en el JSON. El campo "num" es 1, 2, 3... sin más. Los horarios los gestiona el cliente.

Guía mental de carácter gastronómico según total de comidas:
- 2 comidas: C1 comida principal (tipo almuerzo), C2 cena ligera
- 3 comidas: C1 desayuno, C2 almuerzo, C3 cena
- 4 comidas: C1 desayuno, C2 media mañana, C3 comida, C4 cena
- 5 comidas: C1 desayuno, C2 media mañana, C3 comida, C4 merienda, C5 cena
- 6 comidas: C1 desayuno, C2 media mañana, C3 comida, C4 merienda, C5 cena, C6 SNACK POST-ENTRENO

REGLA POST-ENTRENO:
- SOLO si num_comidas = 6 → la COMIDA 6 tiene post_entreno=true y carácter SNACK post-entreno:
  · Porciones más pequeñas (300-500 kcal)
  · Alta proteína (30-45g) — carne magra, pescado blanco, whey, claras, yogur griego
  · Carbos de asimilación rápida (arroz blanco, plátano, patata, pan blanco, miel)
  · Baja grasa (<8g)
  · Snack-style: batidos, tuppers fríos, bowls, wraps, tostadas — nada de platos elaborados
  · Preparación rápida (5-15 min)
- Si num_comidas < 6 → TODAS las comidas tienen post_entreno=false, perfil normal

Las 8 opciones de cada comida mantienen la estructura 2 gourmet + 2 rapida + 4 funcional incluso en la COMIDA 6 snack — pero "gourmet snack" es un batido elaborado, "rapida snack" es algo de 5 min, "funcional snack" es un tupper balanceado para llevar, etc.

═══ EJERCICIOS SEGÚN NIVEL ═══
principiante (0-1 año): 3 series × 10-15 reps, ejercicios básicos con máquinas o peso corporal, SIN tempo ni calidad. tempo=null, calidad=null.
intermedio (1-4 años): 4 series × 8-12 reps, barra libre + mancuernas, progresión de peso semanal. tempo=null, calidad=null.
avanzado (+4 años): 4-5 series variadas, INCLUIR tempo (ej "3-1-X-0") y calidad (1-10) en TODOS los ejercicios.

═══ VALIDACIONES FINALES (hacer mentalmente antes de devolver) ═══
1. ✓ sum(media_kcal de cada comida) ∈ [kcal_objetivo × 0.95, kcal_objetivo × 1.05]
2. ✓ Cada opción: kcal coherente con macros (P*4+C*4+G*9) ±8%
3. ✓ Cada opción: precio_eur = sum(g/1000 × precio_kg) redondeado a 2 decimales
4. ✓ Cada comida tiene exactamente 8 opciones: 2 gourmet + 2 rapida + 4 funcional
5. ✓ num_comidas = exactamente el número elegido por el usuario (2-6)
6. ✓ Si num_comidas = 6: COMIDA 6 tiene post_entreno=true con perfil snack post-entreno; el resto post_entreno=false
7. ✓ Si num_comidas < 6: todas las comidas tienen post_entreno=false
8. ✓ Al menos 2 opciones por comida con precio < media_presu
9. ✓ Restricciones respetadas en TODAS las opciones
10. ✓ JSON válido, sin texto alrededor, sin markdown`;

// ═══════════════════════════════════════════════════════════════

const SUPP_DATA = `
- NMN MACA (Testosterone+): Ingredientes: Extracto de Maca Negra y Roja, L-Arginina, Taurina, Maltodextrina, Polvo de Asta de Ciervo, Extracto de Brócoli, Extracto de Semilla de Calabaza, Extracto de Hoja de Nabo. Dosis: 2 cápsulas al día en ayunas con agua. Beneficios declarados: apoya flujo sanguíneo, producción hormonal natural, energía y vitalidad matinal.
- Turkesterona & Tongkat Ali: Ingredientes: Extracto de hierbas de Ajuga Turkestanica (turkesterona), Extracto de raíz de Tongkat Ali, Calostro estandarizado al 15% de inmunoglobulina IgG (de leche). Dosis: 2 cápsulas diarias con una comida. Beneficios declarados: apoya síntesis proteica, recuperación muscular, niveles de testosterona libre.
- Secret Drops (Rendimiento Sexual): Aceite esencial de masaje íntimo 30ml. Mezcla propietaria de ingredientes naturales con propiedades vasodilatadoras. Aplicar unas gotas en zonas íntimas antes del momento. USO TÓPICO EXTERNO — NO oral. Beneficios declarados: flujo sanguíneo local, sensibilidad, rendimiento.
- Shilajit (Concentrado): Resina pura de Shilajit del Himalaya 600mg por toma. Ácido Fúlvico (75%+) y 85+ minerales traza (magnesio, zinc, selenio, hierro). Dosis: 1 toma al día con agua o batido. Vegano, sin OGM. Beneficios declarados: absorción de nutrientes, energía, rendimiento físico.
`;

// ═══════════════════════════════════════════════════════════════
// HANDLER — streaming SSE, mismo formato que V6
// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { mode, profile } = req.body || {};

    if (mode !== 'protocol') {
      return res.status(400).json({ error: 'mode must be "protocol"' });
    }
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
        max_tokens: 16000,
        stream: true,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: '{' }   // prefill para forzar JSON
        ]
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

    // Envía el "{" inicial que pusimos como prefill
    res.write(`data: ${JSON.stringify({ t: '{' })}\n\n`);

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

  } catch (e) {
    console.error('Proxy error:', e);
    return res.status(500).json({ error: 'Internal error', detail: String(e).substring(0, 200) });
  }
}

function buildUserPrompt(p) {
  const comidasDia = parseInt(p.comidas_dia) || 3;
  const presuSem = parseInt(p.presupuesto_semanal) || 60;
  const diasEntreno = parseInt(p.dias_entreno) || 4;
  const supls = (p.suplementos && p.suplementos.length) ? p.suplementos.join(', ') : 'NMN MACA';

  // etiquetas de perfil
  const objMap = {
    recomposicion: 'Recomposición',
    volumen: 'Volumen',
    definicion: 'Definición',
    rendimiento: 'Rendimiento',
    salud: 'Salud y energía',
    libido: 'Libido / hormonal'
  };
  const actMap = {
    sedentario: 'Sedentario',
    ligero: 'Ligero',
    moderado: 'Moderado',
    activo: 'Activo',
    muy_activo: 'Muy activo'
  };
  const nivMap = {
    principiante: 'Principiante',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado'
  };
  const horMap = {
    mañana: 'Mañana',
    mediodia: 'Mediodía',
    tarde: 'Tarde',
    noche: 'Noche',
    flexible: 'Flexible'
  };

  const objetivoEtiqueta = (objMap[p.objetivo] || 'Recomposición') +
    (p.objetivo_especifico ? ' · ' + p.objetivo_especifico : '');
  const entrenoEtiqueta = `${diasEntreno} días/sem · ${horMap[p.horario] || 'Flexible'}`;

  return `Genera el JSON de protocolo PRIMAL CLUB con estos datos:

PERFIL
Nombre: ${p.nombre || 'Miembro PRIMAL'}
Edad: ${p.edad || 30}
Peso: ${p.peso || 80} kg
Altura: ${p.altura || 175} cm
Nivel actividad: ${p.nivel_actividad || 'moderado'}
Objetivo principal: ${p.objetivo || 'recomposicion'}
Objetivo específico: ${p.objetivo_especifico || '-'}
Restricciones/alergias: ${p.restricciones || 'ninguna'}

ETIQUETAS PARA CAMPO user
user.objetivo_etiqueta: ${objetivoEtiqueta}
user.actividad_etiqueta: ${actMap[p.nivel_actividad] || 'Moderado'}
user.entreno_etiqueta: ${entrenoEtiqueta}
user.nivel_etiqueta: ${nivMap[p.experiencia_gym] || 'Intermedio'}

ENTRENAMIENTO
Nivel: ${p.experiencia_gym || 'intermedio'}
Días/semana: ${diasEntreno}
Equipo: ${p.equipo_disponible || 'gimnasio completo'}
Horario: ${p.horario || 'flexible'}
Lesiones: ${p.problemas_salud || 'ninguna'}

NUTRICIÓN
Número de comidas/día elegidas: ${comidasDia}
→ Genera EXACTAMENTE ${comidasDia} comidas, numeradas COMIDA 1 a COMIDA ${comidasDia}
${comidasDia === 6
  ? '→ COMIDA 6 tiene post_entreno=true, carácter SNACK post-entreno (porciones pequeñas, alta proteína, carbos rápidos, baja grasa, preparación ≤15 min)\n→ Las comidas 1-5 tienen post_entreno=false, perfil normal'
  : '→ Todas las comidas tienen post_entreno=false, perfil normal (no hay comida post-entreno cuando total<6)'}
→ Guía creativa por numeración: ${comidasDia === 2 ? 'C1 almuerzo principal · C2 cena ligera' : comidasDia === 3 ? 'C1 desayuno · C2 almuerzo · C3 cena' : comidasDia === 4 ? 'C1 desayuno · C2 media mañana · C3 comida · C4 cena' : comidasDia === 5 ? 'C1 desayuno · C2 media mañana · C3 comida · C4 merienda · C5 cena' : 'C1 desayuno · C2 media mañana · C3 comida · C4 merienda · C5 cena · C6 SNACK post-entreno'}
  (es solo guía mental para inspirar recetas — en el JSON son COMIDA 1, 2, 3... sin nombres semánticos)
Supermercado: ${p.supermercado || 'Mercadona'}
Presupuesto semanal: ${presuSem}€
Comidas favoritas del usuario: ${p.comidas_favoritas || 'variado'}
→ Las 4 opciones "funcional" de cada comida deben adaptarse a estos gustos cuando sea posible
→ Las 2 "gourmet" y 2 "rapida" pueden ser más libres (coherencia gastronómica)

SUPLEMENTACIÓN
Toma: ${supls}
Usa solo los nombres/composición/beneficios de esta lista:
${SUPP_DATA}
Medicación: ${p.medicacion || 'ninguna'}

Devuelve SOLO el JSON válido, empezando con { y terminando con }. Sin texto previo ni posterior, sin markdown.`;
}
