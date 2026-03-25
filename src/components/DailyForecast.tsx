import type { DailyForecast as DailyType } from "../types/weather";
import { getWeatherInfo } from "../types/weather";

interface DailyForecastProps {
  data: DailyType[];
  convertTemp: (c: number) => number;
  tempLabel: string;
  title: string;
  todayLabel: string;
}

export default function DailyForecast({ data, convertTemp, tempLabel, title, todayLabel }: DailyForecastProps) {
  const days_fr = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const days_en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = todayLabel === "Today" ? days_en : days_fr;

  return (
    <div style={{
      background: "var(--bg-card)", borderRadius: "var(--radius)",
      padding: "24px", border: "1px solid var(--border)",
    }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {data.map((day, i) => {
          const info = getWeatherInfo(day.weathercode);
          const d = new Date(day.date);
          const dayName = i === 0 ? todayLabel : days[d.getDay()];
          const maxTemp = Math.round(convertTemp(day.tempMax));
          const minTemp = Math.round(convertTemp(day.tempMin));

          const allMax = Math.max(...data.map((d) => convertTemp(d.tempMax)));
          const allMin = Math.min(...data.map((d) => convertTemp(d.tempMin)));
          const range = allMax - allMin || 1;
          const leftPct = ((minTemp - allMin) / range) * 100;
          const widthPct = ((maxTemp - minTemp) / range) * 100;

          return (
            <div key={day.date} style={{
              display: "grid", gridTemplateColumns: "80px 28px 40px 1fr 40px",
              alignItems: "center", gap: "10px", padding: "8px 6px",
              borderRadius: "var(--radius-sm)",
              background: i === 0 ? "var(--accent-glow)" : "transparent",
            }}>
              <span style={{ fontSize: "0.8rem", color: i === 0 ? "var(--accent-light)" : "var(--text-secondary)" }}>
                {dayName}
              </span>
              <span style={{ fontSize: "1.1rem" }}>{info.icon}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--cold)", textAlign: "right" }}>
                {minTemp}{tempLabel}
              </span>
              <div style={{ height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", position: "relative" }}>
                <div style={{
                  position: "absolute", left: `${leftPct}%`,
                  width: `${Math.max(widthPct, 8)}%`, height: "100%",
                  borderRadius: "3px",
                  background: "linear-gradient(90deg, var(--cold), var(--warm))",
                }} />
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--warm)" }}>
                {maxTemp}{tempLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
