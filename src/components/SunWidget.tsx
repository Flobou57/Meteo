import { Sunrise, Sunset, Clock } from "lucide-react";

interface SunWidgetProps {
  sunrise: string;
  sunset: string;
  labels: { title: string; rise: string; set: string; duration: string };
}

export default function SunWidget({ sunrise, sunset, labels }: SunWidgetProps) {
  const riseDate = new Date(sunrise);
  const setDate = new Date(sunset);
  const now = new Date();

  const riseMinutes = riseDate.getHours() * 60 + riseDate.getMinutes();
  const setMinutes = setDate.getHours() * 60 + setDate.getMinutes();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const dayLength = setMinutes - riseMinutes;
  const dayHours = Math.floor(dayLength / 60);
  const dayMins = dayLength % 60;

  // Progression du soleil (0 = lever, 1 = coucher)
  const progress = Math.max(0, Math.min(1, (nowMinutes - riseMinutes) / (setMinutes - riseMinutes)));
  const isDay = nowMinutes >= riseMinutes && nowMinutes <= setMinutes;

  // Position sur l'arc
  const angle = Math.PI * progress;
  const sunX = 50 + Math.cos(Math.PI - angle) * 40;
  const sunY = 55 - Math.sin(angle) * 35;

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      border: "1px solid var(--border)",
    }}>
      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "16px" }}>{labels.title}</h3>

      {/* Arc visuel */}
      <div style={{ position: "relative", width: "100%", height: "80px", marginBottom: "16px" }}>
        <svg viewBox="0 0 100 60" width="100%" height="80">
          {/* Ligne d'horizon */}
          <line x1="8" y1="55" x2="92" y2="55" stroke="var(--border)" strokeWidth="0.5" />
          {/* Arc du soleil */}
          <path
            d={`M 10 55 Q 50 -15 90 55`}
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          {/* Arc parcouru */}
          {isDay && (
            <path
              d={`M 10 55 Q 50 -15 90 55`}
              fill="none"
              stroke="var(--warm)"
              strokeWidth="1"
              strokeDasharray={`${progress * 130} 200`}
            />
          )}
          {/* Soleil */}
          {isDay && (
            <circle cx={sunX} cy={sunY} r="4" fill="var(--warm)">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>
      </div>

      {/* Infos */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sunrise size={16} color="var(--warm)" />
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{labels.rise}</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              {riseDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Clock size={14} color="var(--text-muted)" />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{labels.duration}</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{dayHours}h{String(dayMins).padStart(2, "0")}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sunset size={16} color="var(--warm)" />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{labels.set}</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
              {setDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
