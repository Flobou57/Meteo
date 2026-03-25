import { useState, useEffect } from "react";
import { Wind } from "lucide-react";

interface AirQualityProps {
  latitude: number;
  longitude: number;
  labels: Record<string, string>;
}

interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
}

function getAQILevel(aqi: number, labels: Record<string, string>): { label: string; color: string } {
  if (aqi <= 50) return { label: labels["aqi.good"], color: "#10b981" };
  if (aqi <= 100) return { label: labels["aqi.moderate"], color: "#fbbf24" };
  if (aqi <= 150) return { label: labels["aqi.unhealthy.sensitive"], color: "#f97316" };
  if (aqi <= 200) return { label: labels["aqi.unhealthy"], color: "#ef4444" };
  if (aqi <= 300) return { label: labels["aqi.very.unhealthy"], color: "#9333ea" };
  return { label: labels["aqi.hazardous"], color: "#7f1d1d" };
}

export default function AirQuality({ latitude, longitude, labels }: AirQualityProps) {
  const [data, setData] = useState<AQIData | null>(null);

  useEffect(() => {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,pm2_5,pm10`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.current) {
          setData({
            aqi: d.current.european_aqi ?? 0,
            pm25: d.current.pm2_5 ?? 0,
            pm10: d.current.pm10 ?? 0,
          });
        }
      })
      .catch(() => {});
  }, [latitude, longitude]);

  if (!data) return null;

  const level = getAQILevel(data.aqi, labels);
  const pct = Math.min((data.aqi / 300) * 100, 100);

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      border: "1px solid var(--border)",
    }}>
      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Wind size={16} color="var(--accent)" />
        {labels["aqi.title"]}
      </h3>

      {/* Jauge */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "14px" }}>
        <div style={{ fontSize: "2rem", fontWeight: 800, color: level.color }}>{data.aqi}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: level.color, marginBottom: "6px" }}>
            {level.label}
          </div>
          <div style={{
            height: "6px",
            borderRadius: "3px",
            background: "rgba(255,255,255,0.06)",
          }}>
            <div style={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: "3px",
              background: `linear-gradient(90deg, #10b981, #fbbf24, #ef4444, #9333ea)`,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Détails */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>PM2.5</div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{data.pm25.toFixed(1)} µg/m³</div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>PM10</div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{data.pm10.toFixed(1)} µg/m³</div>
        </div>
      </div>
    </div>
  );
}
