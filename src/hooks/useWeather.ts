import { useState, useEffect, useCallback } from "react";
import type { WeatherData, HourlyForecast, DailyForecast, CurrentWeather } from "../types/weather";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

async function geocode(query: string): Promise<GeoResult | null> {
  const res = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=1&language=fr`);
  const data = await res.json();
  if (!data.results?.length) return null;
  const r = data.results[0];
  return { name: r.name, latitude: r.latitude, longitude: r.longitude, country: r.country };
}

async function fetchWeather(lat: number, lon: number): Promise<Omit<WeatherData, "city">> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    // Données actuelles
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,uv_index",
    // Données horaires (24h)
    hourly: "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,visibility",
    // Données journalières (7 jours)
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7",
    forecast_hours: "24",
  });

  const res = await fetch(`${WEATHER_URL}?${params}`);
  const data = await res.json();

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    windspeed: data.current.wind_speed_10m,
    humidity: data.current.relative_humidity_2m,
    weathercode: data.current.weather_code,
    time: data.current.time,
    feelsLike: data.current.apparent_temperature,
    uvIndex: data.current.uv_index ?? 0,
    pressure: data.current.surface_pressure,
    visibility: data.hourly?.visibility?.[0] ?? 10000,
  };

  const hourly: HourlyForecast[] = data.hourly.time.map((t: string, i: number) => ({
    time: t,
    temperature: data.hourly.temperature_2m[i],
    humidity: data.hourly.relative_humidity_2m[i],
    precipitation: data.hourly.precipitation[i],
    weathercode: data.hourly.weather_code[i],
    windspeed: data.hourly.wind_speed_10m[i],
  }));

  const daily: DailyForecast[] = data.daily.time.map((t: string, i: number) => ({
    date: t,
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    weathercode: data.daily.weather_code[i],
    precipitation: data.daily.precipitation_sum[i],
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
  }));

  return { current, hourly, daily };
}

export function useWeather(defaultCity = "Metz") {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const geo = await geocode(city);
      if (!geo) {
        setError(`Ville "${city}" introuvable`);
        setLoading(false);
        return;
      }
      const data = await fetchWeather(geo.latitude, geo.longitude);
      setWeather({ ...data, city: `${geo.name}, ${geo.country}` });
    } catch {
      setError("Erreur de connexion à l'API météo");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    search(defaultCity);
  }, [defaultCity, search]);

  return { weather, loading, error, search };
}
