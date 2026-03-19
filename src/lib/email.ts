import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL = "Alto Tráfico <notificaciones@altotrafico.co>";
const TEAM_EMAIL = "notificaciones@altotrafico.co";

interface DiagnosisEmailData {
  userName: string;
  userEmail: string;
  company: string;
  role: string;
  score: number;
  archetype: { name: string; tagline: string; icon: string };
  profileSummary: string;
  areaAnalysis: Record<string, { status: string; insights: string[] }>;
  riskSemaphore: { red: string[]; yellow: string[]; green: string[] };
  tacticalRoadmap: { immediate: string[]; short_term: string[]; medium_term: string[] };
  website?: string;
}

function statusColor(status: string): string {
  if (status.toLowerCase().includes("criti") || status.toLowerCase().includes("rojo")) return "#ef4444";
  if (status.toLowerCase().includes("riesgo") || status.toLowerCase().includes("amarillo") || status.toLowerCase().includes("parcial")) return "#f59e0b";
  return "#22c55e";
}

function statusLabel(status: string): string {
  if (status.toLowerCase().includes("criti") || status.toLowerCase().includes("rojo")) return "Critico";
  if (status.toLowerCase().includes("riesgo") || status.toLowerCase().includes("amarillo") || status.toLowerCase().includes("parcial")) return "En riesgo";
  return "Saludable";
}

function generatePdfHtml(data: DiagnosisEmailData): string {
  const areaRows = Object.entries(data.areaAnalysis || {})
    .map(([key, area]) => {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const color = statusColor(area.status);
      const insights = (area.insights || []).map((i) => `<li style="margin-bottom:4px;color:#4b5563;font-size:13px;">${i}</li>`).join("");
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;vertical-align:top;">
            <strong style="color:#163336;font-size:14px;">${label}</strong>
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;vertical-align:top;">
            <span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;color:white;background:${color};">${statusLabel(area.status)}</span>
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #f3f4f6;vertical-align:top;">
            <ul style="margin:0;padding-left:16px;">${insights}</ul>
          </td>
        </tr>`;
    })
    .join("");

  const riskSection = (items: string[], color: string, label: string) => {
    if (!items || items.length === 0) return "";
    return `
      <div style="margin-bottom:12px;">
        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${color};margin-right:8px;vertical-align:middle;"></span>
        <strong style="color:#163336;font-size:14px;">${label}</strong>
        <ul style="margin:6px 0 0 20px;padding:0;">
          ${items.map((i) => `<li style="color:#4b5563;font-size:13px;margin-bottom:3px;">${i}</li>`).join("")}
        </ul>
      </div>`;
  };

  const roadmapSection = (items: string[], title: string) => {
    if (!items || items.length === 0) return "";
    return `
      <div style="margin-bottom:16px;">
        <h4 style="color:#163336;font-size:14px;margin:0 0 6px 0;">${title}</h4>
        <ul style="margin:0;padding-left:20px;">
          ${items.map((i) => `<li style="color:#4b5563;font-size:13px;margin-bottom:4px;">${i}</li>`).join("")}
        </ul>
      </div>`;
  };

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Diagnostico IA - ${data.company}</title></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;color:#1f2937;background:#ffffff;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#163336,#2c5f64);padding:40px 32px;text-align:center;">
    <h1 style="color:#ffffff;font-size:28px;margin:0 0 8px 0;font-weight:600;">Diagnostico de IA Empresarial</h1>
    <p style="color:#B2FFB5;font-size:16px;margin:0;">Alto Trafico — Consultoria Estrategica de IA</p>
  </div>

  <!-- User Info -->
  <div style="padding:32px;max-width:700px;margin:0 auto;">
    <div style="background:#f8faf8;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px;width:120px;">Nombre</td>
          <td style="padding:4px 0;color:#163336;font-size:14px;font-weight:600;">${data.userName}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px;">Empresa</td>
          <td style="padding:4px 0;color:#163336;font-size:14px;font-weight:600;">${data.company}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px;">Cargo</td>
          <td style="padding:4px 0;color:#163336;font-size:14px;">${data.role}</td>
        </tr>
        ${data.website ? `<tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Web</td><td style="padding:4px 0;color:#163336;font-size:14px;">${data.website}</td></tr>` : ""}
      </table>
    </div>

    <!-- Archetype -->
    <div style="text-align:center;margin-bottom:32px;padding:24px;background:linear-gradient(135deg,#f0fdf4,#fefce8);border-radius:12px;border:1px solid #d1fae5;">
      <div style="font-size:36px;margin-bottom:8px;">&#x1F9E0;</div>
      <h2 style="color:#163336;font-size:22px;margin:0 0 4px 0;">${data.archetype.name}</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 8px 0;">${data.archetype.tagline}</p>
      <div style="display:inline-block;background:#163336;color:#B2FFB5;padding:6px 16px;border-radius:20px;font-size:14px;font-weight:700;">
        Score: ${data.score}/40
      </div>
    </div>

    <!-- Summary -->
    <div style="margin-bottom:28px;">
      <h3 style="color:#163336;font-size:18px;border-bottom:2px solid #B2FFB5;padding-bottom:8px;margin-bottom:12px;">Resumen Ejecutivo</h3>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;">${data.profileSummary}</p>
    </div>

    <!-- Area Analysis -->
    <div style="margin-bottom:28px;">
      <h3 style="color:#163336;font-size:18px;border-bottom:2px solid #B2FFB5;padding-bottom:8px;margin-bottom:12px;">Analisis por Areas</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:10px 16px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Area</th>
            <th style="padding:10px 16px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Estado</th>
            <th style="padding:10px 16px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Hallazgos</th>
          </tr>
        </thead>
        <tbody>${areaRows}</tbody>
      </table>
    </div>

    <!-- Risk Semaphore -->
    <div style="margin-bottom:28px;">
      <h3 style="color:#163336;font-size:18px;border-bottom:2px solid #B2FFB5;padding-bottom:8px;margin-bottom:12px;">Semaforo de Riesgo</h3>
      ${riskSection(data.riskSemaphore?.red, "#ef4444", "Critico — Accion inmediata")}
      ${riskSection(data.riskSemaphore?.yellow, "#f59e0b", "Atencion — Monitorear")}
      ${riskSection(data.riskSemaphore?.green, "#22c55e", "Saludable — Mantener")}
    </div>

    <!-- Roadmap -->
    <div style="margin-bottom:28px;">
      <h3 style="color:#163336;font-size:18px;border-bottom:2px solid #B2FFB5;padding-bottom:8px;margin-bottom:12px;">Hoja de Ruta</h3>
      ${roadmapSection(data.tacticalRoadmap?.immediate, "Inmediato (0-30 dias)")}
      ${roadmapSection(data.tacticalRoadmap?.short_term, "Corto plazo (1-3 meses)")}
      ${roadmapSection(data.tacticalRoadmap?.medium_term, "Mediano plazo (3-6 meses)")}
    </div>

    <!-- CTA -->
    <div style="text-align:center;padding:32px 24px;background:#163336;border-radius:12px;margin-top:32px;">
      <h3 style="color:#ffffff;font-size:18px;margin:0 0 8px 0;">¿Listo para implementar tu hoja de ruta?</h3>
      <p style="color:#B2FFB5;font-size:14px;margin:0 0 16px 0;">Agenda una sesion estrategica con nuestro equipo.</p>
      <a href="https://altotrafico.co/contacto" style="display:inline-block;background:#B2FFB5;color:#163336;padding:12px 28px;border-radius:24px;font-size:14px;font-weight:700;text-decoration:none;">Agendar Sesion</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;margin-top:24px;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">Alto Trafico — Consultoria Estrategica de IA</p>
      <p style="color:#9ca3af;font-size:12px;margin:4px 0 0 0;">altotrafico.co | hola@altotrafico.ai</p>
    </div>
  </div>
</body>
</html>`;
}

function generateEmailHtml(userName: string, company: string, archetypeName: string, score: number): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f9fafb;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#163336,#2c5f64);padding:32px;text-align:center;">
        <h1 style="color:#ffffff;font-size:22px;margin:0 0 4px 0;">Tu Diagnostico de IA esta listo</h1>
        <p style="color:#B2FFB5;font-size:14px;margin:0;">Alto Trafico</p>
      </div>

      <div style="padding:32px;">
        <p style="color:#163336;font-size:16px;margin:0 0 16px 0;">Hola <strong>${userName}</strong>,</p>
        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 20px 0;">
          Gracias por completar el diagnostico de IA para <strong>${company}</strong>.
          Adjunto encontraras tu informe completo en PDF con tu perfil, analisis por areas,
          semaforo de riesgo y hoja de ruta personalizada.
        </p>

        <!-- Archetype card -->
        <div style="background:#f0fdf4;border:1px solid #d1fae5;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
          <p style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px 0;">Tu perfil</p>
          <h2 style="color:#163336;font-size:20px;margin:0 0 4px 0;">${archetypeName}</h2>
          <p style="color:#163336;font-size:14px;margin:0;"><strong>Score: ${score}/40</strong></p>
        </div>

        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 24px 0;">
          Si deseas implementar las recomendaciones de tu diagnostico, nuestro equipo esta listo
          para ayudarte a dar el siguiente paso.
        </p>

        <div style="text-align:center;">
          <a href="https://altotrafico.co/contacto" style="display:inline-block;background:#163336;color:#B2FFB5;padding:14px 32px;border-radius:24px;font-size:14px;font-weight:700;text-decoration:none;">Agendar sesion estrategica</a>
        </div>
      </div>

      <div style="padding:20px 32px;background:#f9fafb;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">Alto Trafico — Consultoria Estrategica de IA</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateTeamNotificationHtml(data: DiagnosisEmailData, diagnosisSummary: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f9fafb;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <div style="background:#163336;padding:24px 32px;">
        <h1 style="color:#B2FFB5;font-size:18px;margin:0;">Nuevo diagnostico completado</h1>
      </div>
      <div style="padding:24px 32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:100px;">Nombre</td><td style="padding:6px 0;color:#163336;font-weight:600;">${data.userName}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td><td style="padding:6px 0;"><a href="mailto:${data.userEmail}" style="color:#2c5f64;">${data.userEmail}</a></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Empresa</td><td style="padding:6px 0;color:#163336;font-weight:600;">${data.company}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Cargo</td><td style="padding:6px 0;color:#163336;">${data.role}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Perfil</td><td style="padding:6px 0;color:#163336;font-weight:600;">${data.archetype.name} (${data.score}/40)</td></tr>
          ${data.website ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Web</td><td style="padding:6px 0;"><a href="${data.website}" style="color:#2c5f64;">${data.website}</a></td></tr>` : ""}
        </table>
        <div style="margin-top:16px;padding:16px;background:#f8faf8;border-radius:8px;border:1px solid #e5e7eb;">
          <pre style="margin:0;font-size:12px;color:#4b5563;white-space:pre-wrap;font-family:monospace;">${diagnosisSummary}</pre>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function sendDiagnosisEmails(
  data: DiagnosisEmailData,
  diagnosisSummary: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured — skipping emails");
    return;
  }

  const pdfHtml = generatePdfHtml(data);
  const pdfBuffer = Buffer.from(pdfHtml, "utf-8");

  // Send email to user with PDF attachment
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: `Tu Diagnostico de IA — ${data.archetype.name} | Alto Trafico`,
      html: generateEmailHtml(data.userName, data.company, data.archetype.name, data.score),
      attachments: [
        {
          filename: `diagnostico-ia-${data.company.toLowerCase().replace(/\s+/g, "-")}.html`,
          content: pdfBuffer,
          contentType: "text/html",
        },
      ],
    });
    console.log("Diagnosis email sent to user:", data.userEmail);
  } catch (err) {
    console.error("Failed to send user email:", err);
  }

  // Send notification to team
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: TEAM_EMAIL,
      subject: `Nuevo diagnostico: ${data.userName} — ${data.company} (${data.archetype.name})`,
      html: generateTeamNotificationHtml(data, diagnosisSummary),
    });
    console.log("Team notification email sent");
  } catch (err) {
    console.error("Failed to send team email:", err);
  }
}
