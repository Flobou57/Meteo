import { useState, useEffect, useCallback } from "react";
import type {
  WeatherData,
  HourlyForecast,
  DailyForecast,
  CurrentWeather,
} from "../types/weather";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const HISTORY_URL = "https://archive-api.open-meteo.com/v1/archive";

interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

async function geocode(query: string): Promise<GeoResult | null> {
  const res = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=1&language=fr`,
  );
  const data = await res.json();
  if (!data.results?.length) return null;
  const r = data.results[0];
  return {
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
  };
}

async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string> {
  // Open-Meteo n'a pas de reverse geocode, on utilise une approximation
  const res = await fetch(
    `${GEOCODING_URL}?name=city&count=1&language=fr&latitude=${lat}&longitude=${lon}`,
  );
  try {
    const data = await res.json();
    if (data.results?.length) return data.results[0].name;
  } catch {
    // fallback
  }
  return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
}

async function fetchWeather(
  lat: number,
  lon: number,
): Promise<Omit<WeatherData, "city">> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,uv_index",
    hourly:
      "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,visibility",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset",
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

  const hourly: HourlyForecast[] = data.hourly.time.map(
    (t: string, i: number) => ({
      time: t,
      temperature: data.hourly.temperature_2m[i],
      humidity: data.hourly.relative_humidity_2m[i],
      precipitation: data.hourly.precipitation[i],
      weathercode: data.hourly.weather_code[i],
      windspeed: data.hourly.wind_speed_10m[i],
    }),
  );

  const daily: DailyForecast[] = data.daily.time.map(
    (t: string, i: number) => ({
      date: t,
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      weathercode: data.daily.weather_code[i],
      precipitation: data.daily.precipitation_sum[i],
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
    }),
  );

  return { current, hourly, daily, latitude: lat, longitude: lon };
}

export interface HistoryData {
  lastYearTemp: number | null;
  lastYearPrecip: number | null;
}

async function fetchHistory(
  lat: number,
  lon: number,
): Promise<HistoryData> {
  try {
    const now = new Date();
    const lastYear = new Date(now);
    lastYear.setFullYear(now.getFullYear() - 1);
    const dateStr = lastYear.toISOString().split("T")[0];

    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      start_date: dateStr,
      end_date: dateStr,
      daily: "temperature_2m_max,temperature_2m_min,precipitation_sum",
      timezone: "auto",
    });

    const res = await fetch(`${HISTORY_URL}?${params}`);
    const data = await res.json();

    if (data.daily?.temperature_2m_max?.[0] != null) {
      const avg =
        (data.daily.temperature_2m_max[0] + data.daily.temperature_2m_min[0]) /
        2;
      return {
        lastYearTemp: avg,
        lastYearPrecip: data.daily.precipitation_sum[0] ?? null,
      };
    }
  } catch {
    // fallback
  }
  return { lastYearTemp: null, lastYearPrecip: null };
}

// Favoris
const FAVORITES_KEY = "meteo-favorites";

function loadFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFavorites(favs: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function useWeather(defaultCity = "Metz") {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<HistoryData>({
    lastYearTemp: null,
    lastYearPrecip: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  const searchByCoords = useCallback(
    async (lat: number, lon: number, cityName?: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeather(lat, lon);
        const name = cityName || (await reverseGeocode(lat, lon));
        setWeather({ ...data, city: name });

        // Charger l'historique en parallèle
        fetchHistory(lat, lon).then(setHistory);
      } catch {
        setError("Erreur de connexion à l'API météo");
      }
      setLoading(false);
    },
    [],
  );

  const search = useCallback(
    async (city: string) => {
      setLoading(true);
      setError(null);
      try {
        const geo = await geocode(city);
        if (!geo) {
          setError(`Ville "${city}" introuvable`);
          setLoading(false);
          return;
        }
        await searchByCoords(
          geo.latitude,
          geo.longitude,
          `${geo.name}, ${geo.country}`,
        );
      } catch {
        setError("Erreur de connexion à l'API météo");
        setLoading(false);
      }
    },
    [searchByCoords],
  );

  const geolocate = useCallback(() => {
    if (!navigator.geolocation) {
      search(defaultCity);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        searchByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // Refusé ou erreur → ville par défaut
        search(defaultCity);
      },
      { timeout: 5000 },
    );
  }, [defaultCity, search, searchByCoords]);

  const addFavorite = useCallback(
    (city: string) => {
      const updated = [...new Set([...favorites, city])];
      setFavorites(updated);
      saveFavorites(updated);
    },
    [favorites],
  );

  const removeFavorite = useCallback(
    (city: string) => {
      const updated = favorites.filter((f) => f !== city);
      setFavorites(updated);
      saveFavorites(updated);
    },
    [favorites],
  );

  // Géolocalisation au démarrage
  useEffect(() => {
    geolocate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    weather,
    history,
    loading,
    error,
    search,
    geolocate,
    favorites,
    addFavorite,
    removeFavorite,
  };
}
