import type { DailyForecast as DailyType } from "../types/weather";
import { getWeatherInfo } from "../types/weather";

interface DailyForecastProps {
  data: DailyType[];
}

export default function DailyForecast({ data }: DailyForecastProps) {
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "24px",
      border: "1px solid var(--border)",
    }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>
        Prévisions 7 jours
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {data.map((day, i) => {
          const info = getWeatherInfo(day.weathercode);
          const d = new Date(day.date);
          const dayName = i === 0 ? "Aujourd'hui" : days[d.getDay()];
          const maxTemp = Math.round(day.tempMax);
          const minTemp = Math.round(day.tempMin);

          // Barre de température relative
          const allMax = Math.max(...data.map((d) => d.tempMax));
          const allMin = Math.min(...data.map((d) => d.tempMin));
          const range = allMax - allMin || 1;
          const leftPct = ((minTemp - allMin) / range) * 100;
          const widthPct = ((maxTemp - minTemp) / range) * 100;

          return (
            <div
              key={day.date}
              style={{
                display: "grid",
                gridTemplateColumns: "90px 30px 40px 1fr 40px",
                alignItems: "center",
                gap: "12px",
                padding: "10px 8px",
                borderRadius: "var(--radius-sm)",
                background: i === 0 ? "var(--accent-glow)" : "transparent",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: i === 0 ? "var(--accent-light)" : "var(--text-secondary)" }}>
                {dayName}
              </span>
              <span style={{ fontSize: "1.2rem" }}>{info.icon}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--cold)", textAlign: "right" }}>
                {minTemp}°
              </span>
              <div style={{
                height: "6px",
                borderRadius: "3px",
                background: "rgba(255,255,255,0.06)",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute",
                  left: `${leftPct}%`,
                  width: `${Math.max(widthPct, 8)}%`,
                  height: "100%",
                  borderRadius: "3px",
                  background: `linear-gradient(90deg, var(--cold), var(--warm))`,
                }} />
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--warm)" }}>
                {maxTemp}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
