import { NextRequest, NextResponse } from "next/server";
import { PublicationItem } from "@/types/calendar";

export async function POST(req: NextRequest) {
  try {
    const items: PublicationItem[] = await req.json();
    const dateStr = new Date().toISOString().slice(0, 10);
    const dateDisplay = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const statusLabels: Record<string, string> = {
      todo: "⚪ À faire",
      generated: "🟡 Vidéo générée",
      scheduled: "🔵 Planifié",
      published: "🟢 Publié",
    };

    const published = items.filter((i) => i.status === "published").length;
    const scheduled = items.filter((i) => i.status === "scheduled").length;
    const generated = items.filter((i) => i.status === "generated").length;
    const todo = items.filter((i) => i.status === "todo").length;
    const percentage = Math.round((published / items.length) * 100);

    // Group items by day
    const dayGroups: Record<number, PublicationItem[]> = {};
    items.forEach((item) => {
      if (!dayGroups[item.day]) dayGroups[item.day] = [];
      dayGroups[item.day].push(item);
    });

    const esc = (s: string) =>
      (s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const dayRows = Array.from({ length: 30 }, (_, i) => i + 1)
      .map((day) => {
        const slots = (dayGroups[day] || []).sort((a) => (a.slot === "Matin" ? -1 : 1));
        return slots
          .map((item) => {
            const fb = item.facebook_fields;
            const slotLabel =
              item.slot === "Matin"
                ? "☀️ Matin<br><small>12h00</small>"
                : "🌙 Soir<br><small>18h30</small>";
            return `
            <tr class="${item.slot === "Matin" ? "row-matin" : "row-soir"}">
              <td class="col-day"><strong>J${String(item.day).padStart(2, "0")}</strong></td>
              <td class="col-slot">${slotLabel}</td>
              <td class="col-num">#${String(item.number).padStart(2, "0")}</td>
              <td class="col-arabic" dir="rtl">${esc(item.arabic)}<br><small class="phonetic">${esc(item.phonetic)}</small></td>
              <td class="col-fr">${esc(item.french_written)}</td>
              <td class="col-theme">${esc(item.theme)}</td>
              <td class="col-status status-${item.status}">${statusLabels[item.status] ?? item.status}</td>
              <td class="col-prompt"><details><summary>Voir le prompt ▸</summary><pre>${esc(item.omni_prompt)}</pre></details></td>
              <td class="col-post"><details><summary>Voir le post ▸</summary><pre>${esc(fb.full_post ?? "")}</pre></details></td>
            </tr>`;
          })
          .join("");
      })
      .join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kalima Studio — Rapport ${dateDisplay}</title>
  <style>
    :root{--accent:#6366f1;--bg:#0a0a0a;--card:#111;--border:#222;--text:#e5e5e5;--sub:#888;--matin:rgba(234,179,8,.06);--soir:rgba(99,102,241,.06)}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:var(--bg);color:var(--text);padding:2rem;font-size:13px;line-height:1.5}
    h1{font-size:1.6rem;font-weight:700;color:#fff;margin-bottom:.25rem}
    .subtitle{color:var(--sub);margin-bottom:1.5rem;font-size:.875rem}
    .stats{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem}
    .stat{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:.75rem 1.25rem}
    .stat-val{font-size:1.5rem;font-weight:700;color:#fff}
    .stat-label{font-size:.75rem;color:var(--sub)}
    .progress-bar{width:100%;height:6px;background:#222;border-radius:999px;margin:0 0 2rem;overflow:hidden}
    .progress-fill{height:100%;background:var(--accent);border-radius:999px}
    table{width:100%;border-collapse:collapse}
    th{text-align:left;padding:.6rem .75rem;background:#111;color:var(--sub);font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border);position:sticky;top:0}
    td{padding:.6rem .75rem;border-bottom:1px solid #1a1a1a;vertical-align:top}
    .row-matin{background:var(--matin)}
    .row-soir{background:var(--soir)}
    .col-arabic{font-size:1rem;font-weight:600;min-width:120px}
    .phonetic{color:var(--sub);font-size:.7rem;direction:ltr;display:block}
    .col-day{font-weight:700;color:#fff;white-space:nowrap}
    .col-num{color:var(--sub);font-family:monospace}
    .col-theme{color:var(--sub);font-size:.75rem}
    .status-todo{color:#64748b}
    .status-generated{color:#eab308}
    .status-scheduled{color:#60a5fa}
    .status-published{color:#34d399;font-weight:600}
    details{cursor:pointer}
    summary{color:var(--accent);font-size:.75rem;padding:.25rem 0;user-select:none}
    pre{margin-top:.5rem;padding:.75rem;background:#0d0d0d;border:1px solid #222;border-radius:8px;font-size:.7rem;white-space:pre-wrap;word-break:break-word;color:#ccc;max-height:160px;overflow-y:auto}
    .footer{font-size:.75rem;color:var(--sub);margin-top:2rem;padding-top:1rem;border-top:1px solid var(--border)}
  </style>
</head>
<body>
  <h1>📅 Kalima Studio — Rapport Calendrier</h1>
  <p class="subtitle">Généré le ${dateDisplay} &bull; 30 Jours &bull; 60 Reels &bull; Facebook + Omni 1.1 Flash</p>
  <div class="stats">
    <div class="stat"><div class="stat-val">${items.length}</div><div class="stat-label">Total Reels</div></div>
    <div class="stat"><div class="stat-val" style="color:#34d399">${published}</div><div class="stat-label">🟢 Publiés</div></div>
    <div class="stat"><div class="stat-val" style="color:#60a5fa">${scheduled}</div><div class="stat-label">🔵 Planifiés</div></div>
    <div class="stat"><div class="stat-val" style="color:#eab308">${generated}</div><div class="stat-label">🟡 Générés</div></div>
    <div class="stat"><div class="stat-val" style="color:#64748b">${todo}</div><div class="stat-label">⚪ À faire</div></div>
    <div class="stat"><div class="stat-val">${percentage}%</div><div class="stat-label">Progression</div></div>
  </div>
  <div class="progress-bar"><div class="progress-fill" style="width:${percentage}%"></div></div>
  <table>
    <thead>
      <tr>
        <th>Jour</th><th>Créneau</th><th>N°</th><th>Expression Arabe</th><th>Traduction</th><th>Thème</th><th>Statut</th><th>Prompt Vidéo</th><th>Post Facebook</th>
      </tr>
    </thead>
    <tbody>${dayRows}</tbody>
  </table>
  <p class="footer">Rapport auto-généré par Kalima Studio &mdash; Prompts calibrés pour Omni 1.1 Flash (10.0s, One-Take, 9:16 vertical, sans musique).</p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="kalima_rapport_${dateStr}.html"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[export-html] Error:", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
