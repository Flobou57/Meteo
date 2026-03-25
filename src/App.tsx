import { useWeather } from "./hooks/useWeather";
import { useTheme } from "./hooks/useTheme";
import { useUnits } from "./hooks/useUnits";
import { useI18n } from "./hooks/useI18n";
import SearchBar from "./components/SearchBar";
import CurrentCard from "./components/CurrentCard";
import HourlyChart from "./components/HourlyChart";
import DailyForecast from "./components/DailyForecast";
import WeatherAlerts from "./components/WeatherAlerts";
import WeatherMap from "./components/WeatherMap";
import HistoryCompare from "./components/HistoryCompare";
import WindRose from "./components/WindRose";
import SunWidget from "./components/SunWidget";
import AirQuality from "./components/AirQuality";
import CityCompare from "./components/CityCompare";
import PrecipChart from "./components/PrecipChart";
import Skeleton from "./components/Skeleton";
import { CloudRain, Globe, Thermometer } from "lucide-react";

function App() {
  const {
    weather, history, loading, error, search, geolocate,
    favorites, addFavorite, removeFavorite,
  } = useWeather("Metz");

  const { theme, toggle: toggleTheme } = useTheme();
  const { convertTemp, convertSpeed, tempLabel, speedLabel, toggleTemp, toggleSpeed, tempUnit, speedUnit } = useUnits();
  const { lang, toggle: toggleLang, t } = useI18n();

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px",
        justifyContent: "space-between", flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CloudRain size={28} color="var(--accent)" />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{t("app.title")}</h1>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {/* Toggle unités */}
          <button onClick={toggleTemp} style={pillBtn} title="Changer unité température">
            <Thermometer size={13} />
            <span>{tempUnit === "C" ? "°C" : "°F"}</span>
          </button>
          <button onClick={toggleSpeed} style={pillBtn} title="Changer unité vitesse">
            {speedUnit === "kmh" ? "km/h" : "mph"}
          </button>
          <button onClick={toggleLang} style={pillBtn} title="Langue">
            <Globe size={13} />
            <span>{lang.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Recherche */}
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
      {loading && <Skeleton />}

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
          <WeatherAlerts daily={weather.daily} currentTemp={weather.current.temperature} />

          {/* Ligne 1 : Météo actuelle + Prévisions 7j */}
          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <CurrentCard
              data={weather.current}
              convertTemp={convertTemp}
              convertSpeed={convertSpeed}
              tempLabel={tempLabel}
              speedLabel={speedLabel}
              labels={{
                feelsLike: t("current.feelsLike"),
                humidity: t("current.humidity"),
                wind: t("current.wind"),
                pressure: t("current.pressure"),
                uv: t("current.uv"),
                visibility: t("current.visibility"),
              }}
            />
            <DailyForecast
              data={weather.daily}
              convertTemp={convertTemp}
              tempLabel={tempLabel}
              title={t("daily.title")}
              todayLabel={t("daily.today")}
            />
          </div>

          {/* Historique */}
          <HistoryCompare
            currentTemp={weather.current.temperature}
            currentPrecip={weather.daily[0]?.precipitation ?? 0}
            history={history}
          />

          {/* Ligne 2 : Widgets (soleil, vent, qualité air) */}
          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <SunWidget
              sunrise={weather.daily[0]?.sunrise ?? ""}
              sunset={weather.daily[0]?.sunset ?? ""}
              labels={{ title: t("sun.title"), rise: t("sun.rise"), set: t("sun.set"), duration: t("sun.duration") }}
            />
            <WindRose speed={convertSpeed(weather.current.windspeed)} speedLabel={speedLabel} title={t("wind.title")} />
            <AirQuality latitude={weather.latitude} longitude={weather.longitude} labels={{ ...Object.fromEntries(Object.keys({
              "aqi.title": 1, "aqi.good": 1, "aqi.moderate": 1, "aqi.unhealthy.sensitive": 1,
              "aqi.unhealthy": 1, "aqi.very.unhealthy": 1, "aqi.hazardous": 1,
            }).map(k => [k, t(k)])) }} />
          </div>

          {/* Ligne 3 : Graphique temp + précip en barres */}
          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
            <HourlyChart data={weather.hourly} />
            <PrecipChart data={weather.hourly} title={t("hourly.precip")} />
          </div>

          {/* Ligne 4 : Carte + Comparaison villes */}
          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <WeatherMap
              latitude={weather.latitude}
              longitude={weather.longitude}
              city={weather.city}
              temperature={weather.current.temperature}
            />
            <CityCompare
              mainCity={{
                city: weather.city,
                temp: weather.current.temperature,
                humidity: weather.current.humidity,
                wind: weather.current.windspeed,
                weathercode: weather.current.weathercode,
              }}
              convertTemp={convertTemp}
              convertSpeed={convertSpeed}
              tempLabel={tempLabel}
              speedLabel={speedLabel}
              labels={{ title: t("compare.title"), add: t("compare.add") }}
            />
          </div>

          {/* Footer */}
          <div style={{
            textAlign: "center", padding: "16px", color: "var(--text-muted)", fontSize: "0.75rem",
          }}>
            {t("footer.powered")} · {t("footer.updated")} : {new Date(weather.current.time).toLocaleString(lang === "fr" ? "fr-FR" : "en-US")}
          </div>
        </div>
      )}
    </div>
  );
}

const pillBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "20px",
  padding: "5px 12px",
  fontSize: "0.75rem",
  color: "var(--text-secondary)",
  cursor: "pointer",
  fontFamily: "var(--font)",
  transition: "all 0.2s",
};

export default App;
