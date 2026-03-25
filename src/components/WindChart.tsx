import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { HourlyForecast } from "../types/weather";

interface WindChartProps {
  data: HourlyForecast[];
  convertSpeed: (k: number) => number;
  speedLabel: string;
}

export default function WindChart({ data, convertSpeed, speedLabel }: WindChartProps) {
  const chartData = data.map((h) => ({
    heure: new Date(h.time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    [speedLabel]: Math.round(convertSpeed(h.windspeed)),
  }));

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      border: "1px solid var(--border)",
    }}>
      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "16px" }}>
        Vent sur 24h
      </h3>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a9eff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#4a9eff" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey={speedLabel}
            stroke="#4a9eff"
            fill="url(#windGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
