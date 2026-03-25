interface WindRoseProps {
  speed: number;
  speedLabel: string;
  title: string;
}

export default function WindRose({ speed, speedLabel, title }: WindRoseProps) {
  // Direction simulée basée sur la vitesse (l'API Open-Meteo ne donne pas la direction dans le plan gratuit)
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      border: "1px solid var(--border)",
    }}>
      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "16px" }}>{title}</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {/* Rose des vents */}
        <div style={{ position: "relative", width: "120px", height: "120px", flexShrink: 0 }}>
          <svg viewBox="0 0 120 120" width="120" height="120">
            {/* Cercles */}
            <circle cx="60" cy="60" r="55" fill="none" stroke="var(--border)" strokeWidth="1" />
            <circle cx="60" cy="60" r="35" fill="none" stroke="var(--border)" strokeWidth="0.5" />
            {/* Directions */}
            {directions.map((dir, i) => {
              const angle = (i * 45 - 90) * (Math.PI / 180);
              const x = 60 + Math.cos(angle) * 50;
              const y = 60 + Math.sin(angle) * 50;
              return (
                <text
                  key={dir}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--text-muted)"
                  fontSize="9"
                  fontWeight={dir === "N" ? "700" : "400"}
                >
                  {dir}
                </text>
              );
            })}
            {/* Indicateur de vitesse au centre */}
            <text x="60" y="55" textAnchor="middle" fill="var(--accent)" fontSize="18" fontWeight="700">
              {Math.round(speed)}
            </text>
            <text x="60" y="70" textAnchor="middle" fill="var(--text-muted)" fontSize="9">
              {speedLabel}
            </text>
          </svg>
        </div>

        {/* Échelle Beaufort */}
        <div style={{ flex: 1 }}>
          {[
            { max: 1, label: "Calme", color: "#10b981" },
            { max: 12, label: "Légère brise", color: "#34d399" },
            { max: 30, label: "Brise", color: "#fbbf24" },
            { max: 50, label: "Vent modéré", color: "#f97316" },
            { max: 75, label: "Vent fort", color: "#ef4444" },
            { max: Infinity, label: "Tempête", color: "#dc2626" },
          ].map((level, i) => {
            const prevMax = i === 0 ? 0 : [0, 1, 12, 30, 50, 75][i];
            const isActive = speed >= prevMax && speed < level.max;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "3px 0",
                  opacity: isActive ? 1 : 0.35,
                }}
              >
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: level.color,
                }} />
                <span style={{ fontSize: "0.75rem", color: isActive ? "var(--text)" : "var(--text-muted)" }}>
                  {level.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
