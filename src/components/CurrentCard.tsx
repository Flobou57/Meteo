import { Thermometer, Wind, Droplets, Eye, Gauge, Sun } from "lucide-react";
import type { CurrentWeather } from "../types/weather";
import { getWeatherInfo } from "../types/weather";
import AnimatedValue from "./AnimatedValue";

interface CurrentCardProps {
  data: CurrentWeather;
  convertTemp: (c: number) => number;
  convertSpeed: (k: number) => number;
  tempLabel: string;
  speedLabel: string;
  labels: Record<string, string>;
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="stat-item" style={{
      display: "flex", alignItems: "center", gap: "8px",
      padding: "8px 0", borderBottom: "1px solid var(--border)",
    }}>
      {icon}
      <div>
        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}

// Stat compacte pour le mode mobile (grille 3x2)
function StatChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "6px",
      padding: "8px 10px",
      background: "rgba(255,255,255,0.04)",
      borderRadius: "var(--radius-sm)",
    }}>
      {icon}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
        <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}

export default function CurrentCard({ data, convertTemp, convertSpeed, tempLabel, speedLabel, labels }: CurrentCardProps) {
  const info = getWeatherInfo(data.weathercode);

  const stats = [
    { icon: <Thermometer size={14} color="var(--warm)" />, label: labels.feelsLike, value: `${convertTemp(data.feelsLike).toFixed(1)}${tempLabel}` },
    { icon: <Droplets size={14} color="var(--rain)" />, label: labels.humidity, value: `${data.humidity}%` },
    { icon: <Wind size={14} color="var(--accent)" />, label: labels.wind, value: `${Math.round(convertSpeed(data.windspeed))} ${speedLabel}` },
    { icon: <Gauge size={14} color="var(--text-secondary)" />, label: labels.pressure, value: `${Math.round(data.pressure)} hPa` },
    { icon: <Sun size={14} color="var(--warm)" />, label: labels.uv, value: `${data.uvIndex}` },
    { icon: <Eye size={14} color="var(--text-secondary)" />, label: labels.visibility, value: `${(data.visibility / 1000).toFixed(1)} km` },
  ];

  return (
    <div className="card current-card" style={{
      background: "var(--bg-card)", borderRadius: "var(--radius)",
      padding: "20px", border: "1px solid var(--border)",
      animation: "fadeIn 0.4s ease-out",
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Température hero — toujours visible en premier */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "12px", marginBottom: "12px",
      }}>
        <div style={{ fontSize: "clamp(2.8rem, 10vw, 3.5rem)", lineHeight: 1 }}>{info.icon}</div>
        <div>
          <div style={{ fontSize: "clamp(2.8rem, 10vw, 3.5rem)", fontWeight: 800, lineHeight: 1 }}>
            <AnimatedValue value={convertTemp(data.temperature)} suffix={tempLabel} />
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>{info.label}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {labels.feelsLike} <AnimatedValue value={convertTemp(data.feelsLike)} suffix={tempLabel} />
          </div>
        </div>
      </div>

      {/* Stats en grille compacte 3x2 sur mobile, liste classique sur desktop */}
      <div className="stats-grid" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "6px",
      }}>
        {stats.map((s, i) => (
          <StatChip key={i} icon={s.icon} label={s.label} value={s.value} />
        ))}
      </div>

      {/* Version liste pour desktop — cachée sur mobile */}
      <div className="stats-list" style={{ display: "none" }}>
        {stats.map((s, i) => (
          <StatItem key={i} icon={s.icon} label={s.label} value={s.value} />
        ))}
      </div>
    </div>
  );
}
