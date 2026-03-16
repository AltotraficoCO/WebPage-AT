export interface QuizOption {
  icon?: string;
  title: string;
  desc: string;
  value: string;
  letter: string;
  score: number;
}

export interface QuizStep {
  id: string;
  phase: string;
  title: string;
  subtitle: string;
  type: "form" | "select";
  options?: QuizOption[];
  fields?: { name: string; label: string; type: string; placeholder: string; required: boolean }[];
}

export interface Archetype {
  key: string;
  name: string;
  tagline: string;
  focus: string;
  painPoint: string;
  proposal: string;
  icon: string;
}

export interface DiagnosisResult {
  archetype: Archetype;
  score: number;
  profile_summary: string;
  area_analysis: {
    sales_marketing: { status: string; insights: string[] };
    operations: { status: string; insights: string[] };
  };
  risk_semaphore: {
    red: string[];
    yellow: string[];
    green: string[];
  };
  tactical_roadmap: {
    immediate: string[];
    short_term: string[];
    medium_term: string[];
  };
  commercial_close: {
    headline: string;
    body: string;
    cta_text: string;
  };
}

export const archetypes: Archetype[] = [
  {
    key: "explorador",
    name: "El Explorador Curioso",
    tagline: "Primeros pasos hacia la transformación digital",
    focus: "Educación y primeros pasos",
    painPoint: "Miedo a quedarse atrás y caos manual",
    proposal: "Talleres de alfabetización IA y automatización básica con ChatGPT",
    icon: "explore",
  },
  {
    key: "optimizador",
    name: "El Optimizador Reactivo",
    tagline: "Listo para escalar con herramientas inteligentes",
    focus: "Eficiencia y ahorro de tiempo",
    painPoint: "Tareas repetitivas que queman al equipo",
    proposal: "CRMs con IA, chatbots de ventas y automatización de procesos clave",
    icon: "tune",
  },
  {
    key: "estratega",
    name: "El Estratega Digital",
    tagline: "Ventaja competitiva a través de datos e IA",
    focus: "Ventaja competitiva y datos",
    painPoint: "Falta de integración entre sistemas",
    proposal: "IA personalizada, automatización de flujos e integración end-to-end",
    icon: "psychology",
  },
  {
    key: "visionario",
    name: "El Visionario Disruptivo",
    tagline: "Transformación total con agentes autónomos",
    focus: "Transformación total",
    painPoint: "Costos de nómina altos en áreas operativas",
    proposal: "Agentes autónomos de IA y 'Cerebro Central' para orquestar operaciones",
    icon: "rocket_launch",
  },
];

export function getArchetype(score: number): Archetype {
  if (score <= 18) return archetypes[0];
  if (score <= 27) return archetypes[1];
  if (score <= 35) return archetypes[2];
  return archetypes[3];
}

export const quizSteps: QuizStep[] = [
  {
    id: "contact",
    phase: "Fase 00: Identificación",
    title: "Cuéntanos sobre ti",
    subtitle: "Personaliza tu diagnóstico con tus datos básicos.",
    type: "form",
    fields: [
      { name: "name", label: "Nombre completo", type: "text", placeholder: "Tu nombre", required: true },
      { name: "email", label: "Email corporativo", type: "email", placeholder: "nombre@empresa.com", required: true },
      { name: "company", label: "Empresa", type: "text", placeholder: "Nombre de tu empresa", required: true },
      { name: "role", label: "Cargo", type: "text", placeholder: "Tu cargo actual", required: true },
    ],
  },
  // --- BLOQUE GENERAL (Q1-Q5): Preguntas fáciles y universales primero ---
  {
    id: "q9_frustracion",
    phase: "Fase 01: Situación",
    title: "¿Cuál es la mayor frustración operativa hoy?",
    subtitle: "Empecemos por lo más importante — identificar tu dolor principal.",
    type: "select",
    options: [
      { letter: "A", icon: "visibility_off", title: "Falta de visibilidad", desc: "No sabemos qué pasa en tiempo real en la operación.", value: "Falta de visibilidad — no sabemos qué pasa en tiempo real", score: 1 },
      { letter: "B", icon: "local_fire_department", title: "Tareas repetitivas que queman al equipo", desc: "El equipo gasta horas en tareas que podrían automatizarse.", value: "Tareas repetitivas que queman al equipo", score: 2 },
      { letter: "C", icon: "scatter_plot", title: "Datos dispersos para tomar decisiones", desc: "La información está fragmentada y dificulta decisiones rápidas.", value: "Datos dispersos que dificultan tomar decisiones rápidas", score: 3 },
      { letter: "D", icon: "groups", title: "Escalar sin multiplicar nómina", desc: "Necesitamos crecer sin contratar proporcionalmente más gente.", value: "Escalar sin multiplicar la nómina proporcionalmente", score: 4 },
    ],
  },
  {
    id: "q10_adopcion",
    phase: "Fase 02: Equipo",
    title: "¿Qué tan abierto está tu equipo a adoptar IA?",
    subtitle: "La disposición del equipo determina la velocidad de implementación.",
    type: "select",
    options: [
      { letter: "A", icon: "block", title: "Resistentes al cambio", desc: "Prefieren hacer las cosas como siempre, hay resistencia.", value: "Resistentes — prefieren hacer las cosas como siempre", score: 1 },
      { letter: "B", icon: "help_outline", title: "Curiosos pero sin capacitación", desc: "Hay interés pero falta tiempo y formación.", value: "Curiosos pero sin capacitación ni tiempo", score: 2 },
      { letter: "C", icon: "emoji_objects", title: "Algunos champions usan IA", desc: "Hay personas que ya usan ChatGPT y herramientas por su cuenta.", value: "Algunos champions ya usan ChatGPT/herramientas por su cuenta", score: 3 },
      { letter: "D", icon: "verified", title: "Mandato directivo para integrar IA", desc: "La dirección ha dado la orden de implementar IA en todo.", value: "Hay mandato directivo para integrar IA en todo", score: 4 },
    ],
  },
  {
    id: "q6_procesos",
    phase: "Fase 03: Procesos",
    title: "¿Cómo gestionan los procesos internos repetitivos?",
    subtitle: "Las tareas repetitivas son la mayor oportunidad de eficiencia con IA.",
    type: "select",
    options: [
      { letter: "A", icon: "front_hand", title: "Todo manual", desc: "Copiar/pegar, emails manuales, revisiones humanas para todo.", value: "Todo manual — copiar/pegar, emails, revisiones humanas", score: 1 },
      { letter: "B", icon: "description", title: "Plantillas y herramientas básicas", desc: "Usamos algunas plantillas y herramientas digitales simples.", value: "Algunas plantillas y herramientas digitales básicas", score: 2 },
      { letter: "C", icon: "settings_suggest", title: "Flujos automatizados", desc: "Automatizaciones con Zapier, Make o scripts personalizados.", value: "Flujos automatizados (Zapier, Make, scripts)", score: 3 },
      { letter: "D", icon: "precision_manufacturing", title: "Automatización end-to-end con IA", desc: "Agentes de IA que ejecutan flujos completos de forma autónoma.", value: "Automatización end-to-end con agentes de IA", score: 4 },
    ],
  },
  {
    id: "q7_documentacion",
    phase: "Fase 04: Conocimiento",
    title: "¿Cómo está la documentación y conocimiento interno?",
    subtitle: "El conocimiento organizacional es la base para implementar IA.",
    type: "select",
    options: [
      { letter: "A", icon: "person_off", title: "En la cabeza de las personas", desc: "Nada documentado, todo depende de quién sabe qué.", value: "En la cabeza de las personas, nada documentado", score: 1 },
      { letter: "B", icon: "folder_open", title: "Drive o carpetas con documentos dispersos", desc: "Hay documentos pero sin organización central.", value: "Google Drive o carpetas con documentos dispersos", score: 2 },
      { letter: "C", icon: "menu_book", title: "Wiki o base de conocimiento centralizada", desc: "Base de conocimiento organizada y accesible para el equipo.", value: "Wiki o base de conocimiento centralizada", score: 3 },
      { letter: "D", icon: "auto_stories", title: "Sistema con IA para gestión de conocimiento", desc: "IA encuentra, resume y actualiza documentación automáticamente.", value: "Sistema con IA que encuentra, resume y actualiza documentación", score: 4 },
    ],
  },
  {
    id: "q8_integracion",
    phase: "Fase 05: Herramientas",
    title: "¿Cuántas herramientas usan que NO se hablan entre sí?",
    subtitle: "Las herramientas desconectadas generan fricción y pérdida de datos.",
    type: "select",
    options: [
      { letter: "A", icon: "link_off", title: "Muchas — todo desconectado", desc: "Cada área usa sus propias herramientas sin integración.", value: "Muchas — todo está desconectado", score: 1 },
      { letter: "B", icon: "sync_alt", title: "Algunas integraciones manuales", desc: "Copiamos datos manualmente entre aplicaciones.", value: "Algunas integraciones manuales (copiar datos entre apps)", score: 2 },
      { letter: "C", icon: "hub", title: "Mayoría integradas vía APIs", desc: "La mayoría de herramientas se conectan via APIs o middleware.", value: "Mayoría integradas vía APIs o middleware", score: 3 },
      { letter: "D", icon: "device_hub", title: "Ecosistema unificado con IA", desc: "IA como capa de orquestación que conecta todo el ecosistema.", value: "Ecosistema unificado con IA como capa de orquestación", score: 4 },
    ],
  },
  // --- BLOQUE ESPECÍFICO (Q6-Q10): Ventas, marketing, métricas ---
  {
    id: "q1_captacion",
    phase: "Fase 06: Ventas",
    title: "¿Cómo captan clientes hoy?",
    subtitle: "Ahora vamos al detalle — ¿cómo llegan los clientes a ti?",
    type: "select",
    options: [
      { letter: "A", icon: "record_voice_over", title: "Boca a boca y referidos", desc: "Dependemos de recomendaciones y contactos personales.", value: "Boca a boca y referidos", score: 1 },
      { letter: "B", icon: "phone_android", title: "Redes sociales manuales y algo de pauta", desc: "Publicamos contenido y hacemos algo de publicidad digital.", value: "Redes sociales manuales y algo de pauta", score: 2 },
      { letter: "C", icon: "filter_alt", title: "Funnel digital con CRM y automatización básica", desc: "Tenemos un embudo definido con seguimiento automatizado.", value: "Funnel digital con CRM y automatización básica", score: 3 },
      { letter: "D", icon: "auto_awesome", title: "Growth engine con IA y scoring predictivo", desc: "Motor de crecimiento con personalización e IA integrada.", value: "Growth engine con IA, scoring predictivo y personalización", score: 4 },
    ],
  },
  {
    id: "q2_leads",
    phase: "Fase 07: Seguimiento",
    title: "¿Cómo gestionan el seguimiento de leads?",
    subtitle: "El manejo de prospectos revela la madurez de tu proceso comercial.",
    type: "select",
    options: [
      { letter: "A", icon: "table_chart", title: "Excel o libreta, sin proceso claro", desc: "Seguimiento manual sin estructura definida.", value: "Excel o libreta, sin proceso claro", score: 1 },
      { letter: "B", icon: "contact_mail", title: "CRM básico pero sin automatización", desc: "Registramos leads pero todo el seguimiento es manual.", value: "CRM básico pero sin automatización", score: 2 },
      { letter: "C", icon: "mark_email_read", title: "CRM con secuencias automáticas", desc: "Secuencias de email/WhatsApp automáticas configuradas.", value: "CRM con secuencias automáticas de email/WhatsApp", score: 3 },
      { letter: "D", icon: "smart_toy", title: "IA que prioriza leads y predice cierre", desc: "Inteligencia artificial sugiere acciones y prioriza oportunidades.", value: "IA que prioriza leads, predice cierre y sugiere acciones", score: 4 },
    ],
  },
  {
    id: "q3_contenido",
    phase: "Fase 08: Marketing",
    title: "¿Qué rol juega el contenido y marketing digital?",
    subtitle: "Tu presencia digital impacta directamente en la generación de demanda.",
    type: "select",
    options: [
      { letter: "A", icon: "visibility_off", title: "Casi nulo", desc: "No tenemos presencia digital activa ni estrategia de contenido.", value: "Casi nulo, no tenemos presencia digital activa", score: 1 },
      { letter: "B", icon: "edit_note", title: "Publicamos sin estrategia clara", desc: "Tenemos redes sociales pero sin plan ni métricas claras.", value: "Publicamos en redes pero sin estrategia clara", score: 2 },
      { letter: "C", icon: "event_note", title: "Estrategia con calendario y métricas", desc: "Contenido planificado con KPIs y calendario editorial.", value: "Estrategia de contenido con calendario y métricas", score: 3 },
      { letter: "D", icon: "auto_fix_high", title: "Contenido optimizado con IA", desc: "IA genera y optimiza contenido con A/B testing automatizado.", value: "Contenido generado/optimizado con IA, A/B testing automatizado", score: 4 },
    ],
  },
  {
    id: "q4_postventa",
    phase: "Fase 09: Post-venta",
    title: "¿Cómo atienden a sus clientes post-venta?",
    subtitle: "La retención es tan importante como la adquisición.",
    type: "select",
    options: [
      { letter: "A", icon: "chat", title: "WhatsApp personal o llamadas", desc: "Atendemos cuando el cliente nos escribe, sin sistema.", value: "Por WhatsApp personal o llamadas cuando el cliente escribe", score: 1 },
      { letter: "B", icon: "email", title: "Email de soporte o ticketing básico", desc: "Tenemos un canal de soporte pero sin SLAs definidos.", value: "Email de soporte o ticketing básico", score: 2 },
      { letter: "C", icon: "support_agent", title: "Sistema de soporte con SLAs", desc: "Soporte estructurado con tiempos de respuesta y base de conocimiento.", value: "Sistema de soporte con SLAs y base de conocimiento", score: 3 },
      { letter: "D", icon: "smart_toy", title: "Chatbots con IA y atención 24/7", desc: "Atención automatizada con escalamiento inteligente.", value: "Chatbots con IA, atención 24/7 y escalamiento inteligente", score: 4 },
    ],
  },
  {
    id: "q5_metricas",
    phase: "Fase 10: Métricas",
    title: "¿Cómo miden el rendimiento comercial?",
    subtitle: "Última pregunta — lo que no se mide no se mejora.",
    type: "select",
    options: [
      { letter: "A", icon: "psychology_alt", title: "Intuición y revisión esporádica", desc: "Revisamos ventas de forma ocasional, sin datos estructurados.", value: "Intuición y revisión esporádica de ventas", score: 1 },
      { letter: "B", icon: "description", title: "Reportes manuales mensuales", desc: "Hacemos reportes en Excel pero de forma manual y mensual.", value: "Reportes manuales mensuales en Excel", score: 2 },
      { letter: "C", icon: "dashboard", title: "Dashboards en tiempo real", desc: "KPIs definidos con dashboards que se actualizan automáticamente.", value: "Dashboards en tiempo real con KPIs definidos", score: 3 },
      { letter: "D", icon: "trending_up", title: "Analytics predictivo con IA", desc: "IA anticipa tendencias y sugiere acciones basadas en datos.", value: "Analytics predictivo con IA que anticipa tendencias", score: 4 },
    ],
  },
];

export const terminalLogs: Record<string, string[]> = {
  contact: [
    "Initializing diagnostic protocol...",
    "Loading heuristic models...",
    "Awaiting user identification...",
  ],
  q9_frustracion: [
    "User profile loaded.",
    "Identifying primary pain points...",
    "Loading operational friction models...",
  ],
  q10_adopcion: [
    "Pain points registered.",
    "Evaluating team AI readiness...",
    "Loading change management models...",
  ],
  q6_procesos: [
    "Team readiness assessed.",
    "Scanning internal process workflows...",
    "Loading automation benchmarks...",
  ],
  q7_documentacion: [
    "Process audit complete.",
    "Evaluating knowledge management...",
    "Loading documentation standards...",
  ],
  q8_integracion: [
    "Knowledge base assessed.",
    "Mapping tool ecosystem integration...",
    "Loading interoperability metrics...",
  ],
  q1_captacion: [
    "--- Switching to Sales & Marketing ---",
    "Scanning acquisition channels...",
    "Loading commercial benchmarks...",
  ],
  q2_leads: [
    "Acquisition model indexed.",
    "Analyzing lead management pipeline...",
    "Cross-referencing CRM maturity...",
  ],
  q3_contenido: [
    "Lead pipeline mapped.",
    "Evaluating content & marketing strategy...",
    "Loading digital presence metrics...",
  ],
  q4_postventa: [
    "Marketing strategy assessed.",
    "Scanning post-sale service model...",
    "Loading retention benchmarks...",
  ],
  q5_metricas: [
    "Service model registered.",
    "Final analysis vector preparing...",
    "Preparing archetype classification...",
  ],
};

export const processingLogs = [
  "Compiling all 10 response vectors...",
  "Calculating Sales & Marketing score...",
  "Calculating Operations score...",
  "Aggregating total score: {score}/40...",
  "Classifying archetype: {archetype}...",
  "Loading archetype-specific frameworks...",
  "Cross-referencing with industry patterns...",
  "Generating area analysis matrix...",
  "Building risk semaphore assessment...",
  "Constructing tactical roadmap...",
  "Generating AI-personalized insights...",
  "Finalizing executive diagnosis...",
];

export function buildPrompt(answers: Record<string, string>, score: number, archetype: Archetype): string {
  return `Eres un consultor senior de transformación digital e Inteligencia Artificial para empresas en Latinoamérica, trabajando para Alto Tráfico, una agencia de automatización e IA.

Analiza los siguientes datos de un prospecto y genera un diagnóstico ejecutivo personalizado.

## Datos del prospecto:
- Nombre: ${answers.name}
- Empresa: ${answers.company}
- Cargo: ${answers.role}
- Email: ${answers.email}

## Resultados del Quiz (10 preguntas, score ${score}/40):

### Bloque Ventas/Marketing (Q1-Q5):
1. Captación de clientes: ${answers.q1_captacion}
2. Seguimiento de leads: ${answers.q2_leads}
3. Contenido/marketing digital: ${answers.q3_contenido}
4. Atención post-venta: ${answers.q4_postventa}
5. Medición comercial: ${answers.q5_metricas}

### Bloque Operaciones (Q6-Q10):
6. Procesos internos repetitivos: ${answers.q6_procesos}
7. Documentación y conocimiento: ${answers.q7_documentacion}
8. Integración de herramientas: ${answers.q8_integracion}
9. Mayor frustración operativa: ${answers.q9_frustracion}
10. Apertura del equipo a IA: ${answers.q10_adopcion}

## Arquetipo determinado: ${archetype.name} (${archetype.key})
- Score: ${score}/40
- Foco: ${archetype.focus}
- Pain point principal: ${archetype.painPoint}
- Propuesta base: ${archetype.proposal}

## Instrucciones:
- Personaliza TODO al contexto de esta empresa y sus respuestas específicas. No uses respuestas genéricas.
- El tono debe ser empático, directo, profesional y conversacional.
- No juzgues la automatización de puestos — enmárcalo como "Eficiencia Operativa" y "Escalabilidad Inteligente".
- Las recomendaciones deben ser coherentes con el arquetipo ${archetype.name}.
- Sé concreto: menciona herramientas, plataformas y estrategias específicas.
- El profile_summary debe ser 2-3 oraciones máximo, empático y motivador.

Genera un JSON con esta estructura EXACTA (sin texto adicional, solo el JSON):
{
  "profile_summary": "<resumen empático de 2-3 oraciones sobre dónde está la empresa y su potencial>",
  "area_analysis": {
    "sales_marketing": {
      "status": "<Crítico|En desarrollo|Competente|Avanzado>",
      "insights": ["<insight específico 1>", "<insight específico 2>", "<insight específico 3>"]
    },
    "operations": {
      "status": "<Crítico|En desarrollo|Competente|Avanzado>",
      "insights": ["<insight específico 1>", "<insight específico 2>", "<insight específico 3>"]
    }
  },
  "risk_semaphore": {
    "red": ["<riesgo urgente si no actúan en 6 meses>", "<otro riesgo urgente>"],
    "yellow": ["<riesgo moderado a monitorear>", "<otro riesgo moderado>"],
    "green": ["<fortaleza actual a mantener>", "<otra fortaleza>"]
  },
  "tactical_roadmap": {
    "immediate": ["<acción concreta esta semana>", "<otra acción inmediata>", "<otra>"],
    "short_term": ["<acción a 30 días>", "<otra acción a 30 días>", "<otra>"],
    "medium_term": ["<acción a 60-90 días>", "<otra acción a 60-90 días>", "<otra>"]
  },
  "commercial_close": {
    "headline": "<titular impactante y personalizado para invitar a sesión>",
    "body": "<párrafo persuasivo de 2-3 oraciones sobre el valor de una auditoría profunda con Alto Tráfico>",
    "cta_text": "<texto del botón CTA>"
  }
}`;
}
