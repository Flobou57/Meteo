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
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "10px 0", borderBottom: "1px solid var(--border)",
    }}>
      {icon}
      <div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
        <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}

export default function CurrentCard({ data, convertTemp, convertSpeed, tempLabel, speedLabel, labels }: CurrentCardProps) {
  const info = getWeatherInfo(data.weathercode);

  return (
    <div style={{
      background: "var(--bg-card)", borderRadius: "var(--radius)",
      padding: "28px", border: "1px solid var(--border)",
      display: "flex", gap: "28px", flexWrap: "wrap",
      animation: "fadeIn 0.4s ease-out",
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ flex: "1 1 180px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontSize: "3.5rem", lineHeight: 1, transition: "all 0.3s" }}>{info.icon}</div>
        <div style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1, marginTop: "8px" }}>
          <AnimatedValue value={convertTemp(data.temperature)} suffix={tempLabel} />
        </div>
        <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "6px" }}>{info.label}</div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
          {labels.feelsLike} <AnimatedValue value={convertTemp(data.feelsLike)} suffix={tempLabel} />
        </div>
      </div>
      <div style={{ flex: "1 1 220px" }}>
        <StatItem icon={<Thermometer size={16} color="var(--warm)" />} label={labels.feelsLike} value={`${convertTemp(data.feelsLike).toFixed(1)}${tempLabel}`} />
        <StatItem icon={<Droplets size={16} color="var(--rain)" />} label={labels.humidity} value={`${data.humidity}%`} />
        <StatItem icon={<Wind size={16} color="var(--accent)" />} label={labels.wind} value={`${Math.round(convertSpeed(data.windspeed))} ${speedLabel}`} />
        <StatItem icon={<Gauge size={16} color="var(--text-secondary)" />} label={labels.pressure} value={`${Math.round(data.pressure)} hPa`} />
        <StatItem icon={<Sun size={16} color="var(--warm)" />} label={labels.uv} value={`${data.uvIndex}`} />
        <StatItem icon={<Eye size={16} color="var(--text-secondary)" />} label={labels.visibility} value={`${(data.visibility / 1000).toFixed(1)} km`} />
      </div>
    </div>
  );
}
