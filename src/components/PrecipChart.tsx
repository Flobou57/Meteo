import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { HourlyForecast } from "../types/weather";

interface PrecipChartProps {
  data: HourlyForecast[];
  title: string;
}

export default function PrecipChart({ data, title }: PrecipChartProps) {
  const chartData = data.map((h) => ({
    heure: new Date(h.time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    "mm": h.precipitation,
  }));

  const hasRain = chartData.some((d) => d["mm"] > 0);

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      border: "1px solid var(--border)",
    }}>
      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "16px" }}>{title}</h3>
      {hasRain ? (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="heure" stroke="var(--text-muted)" fontSize={10} tickLine={false} interval={3} />
            <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "0.8rem",
                color: "var(--text)",
              }}
            />
            <Bar dataKey="mm" fill="var(--rain)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Aucune précipitation prévue dans les 24h
        </div>
      )}
    </div>
  );
}
