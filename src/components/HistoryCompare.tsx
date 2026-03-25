import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { HistoryData } from "../hooks/useWeather";

interface HistoryCompareProps {
  currentTemp: number;
  currentPrecip: number;
  history: HistoryData;
}

export default function HistoryCompare({ currentTemp, currentPrecip, history }: HistoryCompareProps) {
  if (history.lastYearTemp === null) return null;

  const tempDiff = currentTemp - history.lastYearTemp;
  const precipDiff = history.lastYearPrecip !== null ? currentPrecip - history.lastYearPrecip : null;

  const TempIcon = tempDiff > 1 ? TrendingUp : tempDiff < -1 ? TrendingDown : Minus;
  const tempColor = tempDiff > 1 ? "var(--warm)" : tempDiff < -1 ? "var(--cold)" : "var(--text-muted)";

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      border: "1px solid var(--border)",
    }}>
      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "14px", color: "var(--text-secondary)" }}>
        vs. même date l'an dernier
      </h3>
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Température */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TempIcon size={20} color={tempColor} />
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: tempColor }}>
              {tempDiff > 0 ? "+" : ""}{tempDiff.toFixed(1)}°C
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              L'an dernier : {history.lastYearTemp.toFixed(1)}°C
            </div>
          </div>
        </div>

        {/* Précipitations */}
        {precipDiff !== null && history.lastYearPrecip !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%",
              background: precipDiff > 0 ? "var(--rain)" : "var(--success)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "10px", color: "#fff", fontWeight: 700,
            }}>
              {precipDiff > 0 ? "+" : "-"}
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                {precipDiff > 0 ? "+" : ""}{precipDiff.toFixed(1)} mm
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Précip. l'an dernier : {history.lastYearPrecip.toFixed(1)} mm
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
