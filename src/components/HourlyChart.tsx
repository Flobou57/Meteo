import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { HourlyForecast } from "../types/weather";

interface HourlyChartProps {
  data: HourlyForecast[];
}

export default function HourlyChart({ data }: HourlyChartProps) {
  const chartData = data.map((h) => ({
    heure: new Date(h.time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    "Température": h.temperature,
    "Précipitations": h.precipitation,
    "Humidité": h.humidity,
  }));

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "24px",
      border: "1px solid var(--border)",
    }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "20px", color: "var(--text)" }}>
        Prévisions horaires (24h)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8c42" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ff8c42" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b8def" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#5b8def" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="heure"
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
            interval={2}
          />
          <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "0.85rem",
              color: "var(--text)",
            }}
          />
          <Area
            type="monotone"
            dataKey="Température"
            stroke="#ff8c42"
            fill="url(#tempGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Précipitations"
            stroke="#5b8def"
            fill="url(#rainGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
