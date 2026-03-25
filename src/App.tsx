import { useWeather } from "./hooks/useWeather";
import { useTheme } from "./hooks/useTheme";
import SearchBar from "./components/SearchBar";
import CurrentCard from "./components/CurrentCard";
import HourlyChart from "./components/HourlyChart";
import DailyForecast from "./components/DailyForecast";
import WeatherAlerts from "./components/WeatherAlerts";
import WeatherMap from "./components/WeatherMap";
import HistoryCompare from "./components/HistoryCompare";
import { CloudRain, Loader } from "lucide-react";

function App() {
  const {
    weather,
    history,
    loading,
    error,
    search,
    geolocate,
    favorites,
    addFavorite,
    removeFavorite,
  } = useWeather("Metz");

  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "24px",
      }}>
        <CloudRain size={28} color="var(--accent)" />
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Météo Dashboard</h1>
      </div>

      {/* Barre de recherche + favoris + thème */}
      {weather && (
        <div style={{ marginBottom: "24px" }}>
          <SearchBar
            onSearch={search}
            onGeolocate={geolocate}
            currentCity={weather.city}
            favorites={favorites}
            onAddFavorite={addFavorite}
            onRemoveFavorite={removeFavorite}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </div>
      )}

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
          color: "var(--danger)",
          fontSize: "0.9rem",
          marginBottom: "20px",
        }}>
          {error}
        </div>
      )}

      {/* Contenu */}
      {weather && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Alertes */}
          <WeatherAlerts
            daily={weather.daily}
            currentTemp={weather.current.temperature}
          />

          {/* Ligne 1 : Météo actuelle + Prévisions 7j */}
          <div className="grid-2col" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}>
            <CurrentCard data={weather.current} />
            <DailyForecast data={weather.daily} />
          </div>

          {/* Historique comparatif */}
          <HistoryCompare
            currentTemp={weather.current.temperature}
            currentPrecip={weather.daily[0]?.precipitation ?? 0}
            history={history}
          />

          {/* Ligne 2 : Graphique + Carte */}
          <div className="grid-2col" style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "20px",
          }}>
            <HourlyChart data={weather.hourly} />
            <WeatherMap
              latitude={weather.latitude}
              longitude={weather.longitude}
              city={weather.city}
              temperature={weather.current.temperature}
            />
          </div>

          {/* Footer */}
          <div style={{
            textAlign: "center",
            padding: "16px",
            color: "var(--text-muted)",
            fontSize: "0.75rem",
          }}>
            Données fournies par Open-Meteo · Dernière mise à jour :{" "}
            {new Date(weather.current.time).toLocaleString("fr-FR")}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
