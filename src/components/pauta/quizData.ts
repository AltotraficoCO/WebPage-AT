export interface QuizOption {
  icon?: string;
  title: string;
  desc: string;
  value: string;
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

export const quizSteps: QuizStep[] = [
  {
    id: "contact",
    phase: "Fase 01: Identificación",
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
  {
    id: "sector",
    phase: "Fase 02: Sector",
    title: "¿En qué sector opera tu empresa?",
    subtitle: "Esto nos permite personalizar las recomendaciones a tu industria.",
    type: "select",
    options: [
      { icon: "account_balance", title: "Fintech", desc: "Servicios financieros, pagos, banca digital.", value: "Fintech" },
      { icon: "shopping_cart", title: "E-commerce", desc: "Comercio electrónico, marketplace, retail online.", value: "E-commerce" },
      { icon: "code", title: "SaaS / Tech", desc: "Software como servicio, plataformas tecnológicas.", value: "SaaS" },
      { icon: "handshake", title: "Servicios", desc: "Consultoría, agencias, servicios profesionales.", value: "Servicios" },
      { icon: "local_hospital", title: "Salud", desc: "Healthtech, clínicas, farmacéutica.", value: "Salud" },
      { icon: "precision_manufacturing", title: "Manufactura", desc: "Producción, logística, cadena de suministro.", value: "Manufactura" },
      { icon: "school", title: "Educación", desc: "Edtech, universidades, formación corporativa.", value: "Educación" },
      { icon: "more_horiz", title: "Otro", desc: "Otro sector o industria.", value: "Otro" },
    ],
  },
  {
    id: "company_size",
    phase: "Fase 03: Escala",
    title: "¿Cuántas personas hay en tu equipo?",
    subtitle: "El tamaño del equipo define la estrategia de implementación.",
    type: "select",
    options: [
      { icon: "person", title: "1 – 10", desc: "Startup o equipo pequeño.", value: "1-10" },
      { icon: "group", title: "11 – 50", desc: "Empresa en crecimiento.", value: "11-50" },
      { icon: "groups", title: "51 – 200", desc: "Mediana empresa consolidada.", value: "51-200" },
      { icon: "corporate_fare", title: "200+", desc: "Empresa grande o corporación.", value: "200+" },
    ],
  },
  {
    id: "data_maturity",
    phase: "Fase 04: Infraestructura",
    title: "Nivel de Digitalización Actual",
    subtitle: "¿Cómo gestionan la información y los datos en tu organización?",
    type: "select",
    options: [
      { icon: "folder_off", title: "Analógica / Dispersa", desc: "Documentos físicos, Excel locales, emails no centralizados.", value: "Analógica/Manual" },
      { icon: "cloud_queue", title: "Digital Básica", desc: "Google Drive/Office 365, pero sin integraciones.", value: "Cloud Básica" },
      { icon: "hub", title: "Sistemas Integrados", desc: "CRM/ERP implementados, datos estructurados.", value: "Sistemas Integrados" },
      { icon: "insights", title: "Data-Driven", desc: "Dashboards en tiempo real, cultura de datos establecida.", value: "Data-Driven" },
    ],
  },
  {
    id: "ai_usage",
    phase: "Fase 05: Adopción IA",
    title: "Uso Actual de Inteligencia Artificial",
    subtitle: "¿En qué grado se utiliza la IA en tus procesos?",
    type: "select",
    options: [
      { icon: "explore", title: "Nulo / Exploración", desc: "Uso ocasional de ChatGPT o similar de forma individual.", value: "Nulo" },
      { icon: "science", title: "Experimental", desc: "Pequeños pilotos o pruebas de concepto aisladas.", value: "Experimental" },
      { icon: "settings", title: "Operativo", desc: "IA integrada en algunos procesos core.", value: "Operativo" },
      { icon: "auto_awesome", title: "Estratégico", desc: "Modelos propios, automatización end-to-end.", value: "Estratégico" },
    ],
  },
  {
    id: "ai_priority",
    phase: "Fase 06: Visión",
    title: "Objetivo Principal con IA",
    subtitle: "¿Cuál es la meta prioritaria para los próximos 12 meses?",
    type: "select",
    options: [
      { icon: "bolt", title: "Eficiencia Operativa", desc: "Reducir costes y tiempos de ejecución manual.", value: "Eficiencia Operativa" },
      { icon: "trending_up", title: "Escalabilidad", desc: "Crecer sin aumentar proporcionalmente la estructura.", value: "Escalabilidad" },
      { icon: "lightbulb", title: "Innovación", desc: "Crear nuevas líneas de negocio basadas en IA.", value: "Innovación" },
      { icon: "support_agent", title: "Experiencia del Cliente", desc: "Personalización, atención 24/7, satisfacción.", value: "Experiencia del Cliente" },
    ],
  },
];

export const terminalLogs: Record<string, string[]> = {
  contact: [
    "Initializing diagnostic protocol...",
    "Loading heuristic models...",
    "Awaiting user identification...",
  ],
  sector: [
    "User profile loaded.",
    "Mapping industry benchmarks...",
    "Loading sector-specific models...",
  ],
  company_size: [
    "Sector data indexed.",
    "Calibrating scale parameters...",
    "Loading organizational frameworks...",
  ],
  data_maturity: [
    "Scale parameters set.",
    "Scanning infrastructure patterns...",
    "Loading digitalization benchmarks...",
  ],
  ai_usage: [
    "Infrastructure profile complete.",
    "Analyzing AI adoption patterns...",
    "Cross-referencing maturity models...",
  ],
  ai_priority: [
    "Adoption level registered.",
    "Loading strategic frameworks...",
    "Preparing final analysis vector...",
  ],
};

export const processingLogs = [
  "Compiling user profile data...",
  "Analyzing sector patterns for {sector}...",
  "Cross-referencing industry benchmarks...",
  "Evaluating digital maturity indicators...",
  "Mapping AI adoption trajectory...",
  "Calculating maturity score...",
  "Generating strategic roadmap...",
  "Estimating ROI projections...",
  "Building executive report...",
  "Finalizing diagnosis...",
];

export interface DiagnosisResult {
  maturity_score: number;
  maturity_label: string;
  sector_average: number;
  dimensions: { name: string; score: number; insight: string }[];
  opportunities: { title: string; description: string; impact: string; icon: string }[];
  roadmap: {
    month1: { title: string; actions: string[] };
    month2: { title: string; actions: string[] };
    month3: { title: string; actions: string[] };
  };
  roi_estimate: {
    hours_saved: string;
    cost_reduction: string;
    efficiency_gain: string;
  };
}

export function buildPrompt(answers: Record<string, string>): string {
  return `Eres un consultor senior de transformación digital e Inteligencia Artificial para empresas en Latinoamérica. Analiza los siguientes datos de un prospecto y genera un diagnóstico ejecutivo completo y personalizado.

Datos del prospecto:
- Nombre: ${answers.name}
- Empresa: ${answers.company}
- Cargo: ${answers.role}
- Sector: ${answers.sector}
- Tamaño de equipo: ${answers.company_size}
- Nivel de digitalización: ${answers.data_maturity}
- Uso actual de IA: ${answers.ai_usage}
- Objetivo principal: ${answers.ai_priority}

IMPORTANTE: Personaliza TODO el diagnóstico al sector "${answers.sector}", tamaño "${answers.company_size}" y nivel actual "${answers.data_maturity}". No uses respuestas genéricas. Menciona herramientas, plataformas y estrategias específicas del sector. Sé concreto y accionable.

Genera un JSON con esta estructura EXACTA (sin texto adicional, solo el JSON):
{
  "maturity_score": <número 0-100 basado en digitalización + uso IA>,
  "maturity_label": "<Explorador|Emergente|Avanzado|Líder>",
  "sector_average": <número 0-100 promedio estimado del sector>,
  "dimensions": [
    { "name": "Datos & Infraestructura", "score": <0-100>, "insight": "<análisis breve específico>" },
    { "name": "Procesos & Automatización", "score": <0-100>, "insight": "<análisis breve específico>" },
    { "name": "Cultura & Talento", "score": <0-100>, "insight": "<análisis breve específico>" },
    { "name": "Estrategia IA", "score": <0-100>, "insight": "<análisis breve específico>" }
  ],
  "opportunities": [
    { "title": "<título concreto>", "description": "<descripción detallada y específica al sector>", "impact": "<Alto|Medio>", "icon": "<nombre_icono_material>" },
    { "title": "...", "description": "...", "impact": "...", "icon": "..." },
    { "title": "...", "description": "...", "impact": "...", "icon": "..." }
  ],
  "roadmap": {
    "month1": { "title": "Quick Wins", "actions": ["<acción concreta 1>", "<acción concreta 2>", "<acción concreta 3>"] },
    "month2": { "title": "Implementación", "actions": ["<acción concreta 1>", "<acción concreta 2>", "<acción concreta 3>"] },
    "month3": { "title": "Escalamiento", "actions": ["<acción concreta 1>", "<acción concreta 2>", "<acción concreta 3>"] }
  },
  "roi_estimate": {
    "hours_saved": "<ej: 120-180 horas/mes>",
    "cost_reduction": "<ej: 15-25% en costos operativos>",
    "efficiency_gain": "<ej: 40-60% mejora en eficiencia>"
  }
}`;
}
