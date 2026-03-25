import { Thermometer, Wind, Droplets, Eye, Gauge, Sun } from "lucide-react";
import type { CurrentWeather } from "../types/weather";
import { getWeatherInfo } from "../types/weather";

interface CurrentCardProps {
  data: CurrentWeather;
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 0",
      borderBottom: "1px solid var(--border)",
    }}>
      {icon}
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
        <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}

export default function CurrentCard({ data }: CurrentCardProps) {
  const info = getWeatherInfo(data.weathercode);

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "28px",
      border: "1px solid var(--border)",
      display: "flex",
      gap: "32px",
      flexWrap: "wrap",
    }}>
      {/* Gauche : température principale */}
      <div style={{ flex: "1 1 200px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontSize: "4rem", lineHeight: 1 }}>{info.icon}</div>
        <div style={{ fontSize: "4rem", fontWeight: 800, lineHeight: 1, marginTop: "8px" }}>
          {Math.round(data.temperature)}°
        </div>
        <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "6px" }}>
          {info.label}
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
          Ressenti {Math.round(data.feelsLike)}°C
        </div>
      </div>

      {/* Droite : détails */}
      <div style={{ flex: "1 1 240px" }}>
        <StatItem icon={<Thermometer size={18} color="var(--warm)" />} label="Ressenti" value={`${data.feelsLike.toFixed(1)}°C`} />
        <StatItem icon={<Droplets size={18} color="var(--rain)" />} label="Humidité" value={`${data.humidity}%`} />
        <StatItem icon={<Wind size={18} color="var(--accent)" />} label="Vent" value={`${data.windspeed} km/h`} />
        <StatItem icon={<Gauge size={18} color="var(--text-secondary)" />} label="Pression" value={`${Math.round(data.pressure)} hPa`} />
        <StatItem icon={<Sun size={18} color="var(--warm)" />} label="UV Index" value={`${data.uvIndex}`} />
        <StatItem icon={<Eye size={18} color="var(--text-secondary)" />} label="Visibilité" value={`${(data.visibility / 1000).toFixed(1)} km`} />
      </div>
    </div>
  );
}
