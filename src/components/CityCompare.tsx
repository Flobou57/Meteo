import { useState } from "react";
import { Plus, X, Thermometer, Droplets, Wind } from "lucide-react";
import { getWeatherInfo } from "../types/weather";

interface CityData {
  city: string;
  temp: number;
  humidity: number;
  wind: number;
  weathercode: number;
}

interface CityCompareProps {
  mainCity: CityData;
  convertTemp: (c: number) => number;
  convertSpeed: (k: number) => number;
  tempLabel: string;
  speedLabel: string;
  labels: { title: string; add: string };
}

async function fetchCityWeather(city: string): Promise<CityData | null> {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr`,
    );
    const geoData = await geoRes.json();
    if (!geoData.results?.length) return null;
    const { name, latitude, longitude } = geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
    );
    const w = await weatherRes.json();
    return {
      city: name,
      temp: w.current.temperature_2m,
      humidity: w.current.relative_humidity_2m,
      wind: w.current.wind_speed_10m,
      weathercode: w.current.weather_code,
    };
  } catch {
    return null;
  }
}

export default function CityCompare({
  mainCity,
  convertTemp,
  convertSpeed,
  tempLabel,
  speedLabel,
  labels,
}: CityCompareProps) {
  const [cities, setCities] = useState<CityData[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addCity = async () => {
    if (!input.trim() || cities.length >= 3) return;
    setLoading(true);
    const data = await fetchCityWeather(input.trim());
    if (data) setCities((prev) => [...prev, data]);
    setInput("");
    setLoading(false);
  };

  const removeCity = (i: number) => {
    setCities((prev) => prev.filter((_, idx) => idx !== i));
  };

  const allCities = [mainCity, ...cities];

  return (
    <div style={{
      background: "var(--bg-card)",
      borderRadius: "var(--radius)",
      padding: "20px 24px",
      border: "1px solid var(--border)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 600 }}>{labels.title}</h3>
        {cities.length < 3 && (
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCity()}
              placeholder={labels.add}
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "6px 10px",
                fontSize: "0.8rem",
                color: "var(--text)",
                outline: "none",
                width: "140px",
                fontFamily: "var(--font)",
              }}
            />
            <button
              onClick={addCity}
              disabled={loading}
              style={{
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Tableau comparatif */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th style={{ textAlign: "left", padding: "8px 4px", color: "var(--text-muted)", fontWeight: 500 }}>Ville</th>
              <th style={{ textAlign: "center", padding: "8px 4px", color: "var(--text-muted)", fontWeight: 500 }}><Thermometer size={14} /></th>
              <th style={{ textAlign: "center", padding: "8px 4px", color: "var(--text-muted)", fontWeight: 500 }}><Droplets size={14} /></th>
              <th style={{ textAlign: "center", padding: "8px 4px", color: "var(--text-muted)", fontWeight: 500 }}><Wind size={14} /></th>
            </tr>
          </thead>
          <tbody>
            {allCities.map((city, i) => {
              const info = getWeatherInfo(city.weathercode);
              return (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 4px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{info.icon}</span>
                    <span style={{ fontWeight: i === 0 ? 700 : 400 }}>{city.city}</span>
                    {i > 0 && (
                      <button onClick={() => removeCity(i - 1)} style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--text-muted)", padding: "0 2px",
                      }}>
                        <X size={12} />
                      </button>
                    )}
                  </td>
                  <td style={{ textAlign: "center", fontWeight: 600 }}>
                    {Math.round(convertTemp(city.temp))}{tempLabel}
                  </td>
                  <td style={{ textAlign: "center", color: "var(--rain)" }}>
                    {city.humidity}%
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {Math.round(convertSpeed(city.wind))} {speedLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
