import { useWeather } from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import CurrentCard from "./components/CurrentCard";
import HourlyChart from "./components/HourlyChart";
import DailyForecast from "./components/DailyForecast";
import { CloudRain, Loader } from "lucide-react";

function App() {
  const { weather, loading, error, search } = useWeather("Metz");

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CloudRain size={28} color="var(--accent)" />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Météo Dashboard</h1>
        </div>
        {weather && <SearchBar onSearch={search} currentCity={weather.city} />}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          gap: "12px",
          color: "var(--text-muted)",
        }}>
          <Loader size={24} style={{ animation: "spin 1s linear infinite" }} />
          <span>Chargement...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "var(--radius-sm)",
          padding: "16px 20px",
          color: "#ef4444",
          fontSize: "0.9rem",
        }}>
          {error}
        </div>
      )}

      {/* Contenu */}
      {weather && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Ligne 1 : Météo actuelle + Prévisions 7j */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}>
            <CurrentCard data={weather.current} />
            <DailyForecast data={weather.daily} />
          </div>

          {/* Ligne 2 : Graphique horaire */}
          <HourlyChart data={weather.hourly} />

          {/* Footer */}
          <div style={{
            textAlign: "center",
            padding: "16px",
            color: "var(--text-muted)",
            fontSize: "0.75rem",
          }}>
            Données fournies par Open-Meteo · Dernière mise à jour : {new Date(weather.current.time).toLocaleString("fr-FR")}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
