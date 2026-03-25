export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  humidity: number;
  weathercode: number;
  time: string;
  feelsLike: number;
  uvIndex: number;
  pressure: number;
  visibility: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  weathercode: number;
  windspeed: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weathercode: number;
  precipitation: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  city: string;
}

// Codes météo Open-Meteo → description + icône
export function getWeatherInfo(code: number): { label: string; icon: string } {
  const map: Record<number, { label: string; icon: string }> = {
    0: { label: "Ciel dégagé", icon: "☀️" },
    1: { label: "Principalement dégagé", icon: "🌤️" },
    2: { label: "Partiellement nuageux", icon: "⛅" },
    3: { label: "Couvert", icon: "☁️" },
    45: { label: "Brouillard", icon: "🌫️" },
    48: { label: "Brouillard givrant", icon: "🌫️" },
    51: { label: "Bruine légère", icon: "🌦️" },
    53: { label: "Bruine modérée", icon: "🌦️" },
    55: { label: "Bruine forte", icon: "🌧️" },
    61: { label: "Pluie légère", icon: "🌧️" },
    63: { label: "Pluie modérée", icon: "🌧️" },
    65: { label: "Pluie forte", icon: "🌧️" },
    71: { label: "Neige légère", icon: "🌨️" },
    73: { label: "Neige modérée", icon: "🌨️" },
    75: { label: "Neige forte", icon: "❄️" },
    80: { label: "Averses légères", icon: "🌦️" },
    81: { label: "Averses modérées", icon: "🌧️" },
    82: { label: "Averses violentes", icon: "⛈️" },
    95: { label: "Orage", icon: "⛈️" },
    96: { label: "Orage avec grêle", icon: "⛈️" },
    99: { label: "Orage violent", icon: "⛈️" },
  };
  return map[code] ?? { label: "Inconnu", icon: "❓" };
}
