const shimmer: React.CSSProperties = {
  background: "linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
  borderRadius: "var(--radius-sm)",
};

export default function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>

      {/* Fausse carte actuelle + prévisions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ ...shimmer, height: "280px", borderRadius: "var(--radius)" }} />
        <div style={{ ...shimmer, height: "280px", borderRadius: "var(--radius)" }} />
      </div>

      {/* Fausse barre historique */}
      <div style={{ ...shimmer, height: "80px", borderRadius: "var(--radius)" }} />

      {/* Faux graphique + carte */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
        <div style={{ ...shimmer, height: "300px", borderRadius: "var(--radius)" }} />
        <div style={{ ...shimmer, height: "300px", borderRadius: "var(--radius)" }} />
      </div>
    </div>
  );
}
