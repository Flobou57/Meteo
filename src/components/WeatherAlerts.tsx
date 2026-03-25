import { AlertTriangle, Snowflake, CloudRain, Thermometer } from "lucide-react";
import type { DailyForecast } from "../types/weather";

interface WeatherAlertsProps {
  daily: DailyForecast[];
  currentTemp: number;
}

interface Alert {
  icon: React.ReactNode;
  title: string;
  message: string;
  color: string;
}

export default function WeatherAlerts({ daily, currentTemp }: WeatherAlertsProps) {
  const alerts: Alert[] = [];

  // Canicule
  if (currentTemp >= 35 || daily.some((d) => d.tempMax >= 35)) {
    alerts.push({
      icon: <Thermometer size={18} />,
      title: "Canicule",
      message: "Températures très élevées prévues. Restez hydraté.",
      color: "#ef4444",
    });
  }

  // Gel
  if (currentTemp <= 0 || daily.some((d) => d.tempMin <= -5)) {
    alerts.push({
      icon: <Snowflake size={18} />,
      title: "Gel",
      message: "Températures négatives. Attention au verglas.",
      color: "#60a5fa",
    });
  }

  // Fortes pluies
  if (daily.some((d) => d.precipitation > 20)) {
    alerts.push({
      icon: <CloudRain size={18} />,
      title: "Fortes pluies",
      message: "Précipitations importantes prévues dans les prochains jours.",
      color: "#5b8def",
    });
  }

  // Orage
  if (daily.some((d) => d.weathercode >= 95)) {
    alerts.push({
      icon: <AlertTriangle size={18} />,
      title: "Orage",
      message: "Risque d'orages violents. Restez à l'abri.",
      color: "#f59e0b",
    });
  }

  // Neige
  if (daily.some((d) => d.weathercode >= 71 && d.weathercode <= 77)) {
    alerts.push({
      icon: <Snowflake size={18} />,
      title: "Neige",
      message: "Chutes de neige prévues. Prudence sur les routes.",
      color: "#a5b4fc",
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {alerts.map((alert, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "var(--radius-sm)",
            background: `${alert.color}15`,
            border: `1px solid ${alert.color}30`,
          }}
        >
          <div style={{ color: alert.color, flexShrink: 0 }}>{alert.icon}</div>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: alert.color }}>
              {alert.title}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {alert.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
