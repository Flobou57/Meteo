import { useState, useCallback } from "react";

export type Lang = "fr" | "en";

const translations: Record<Lang, Record<string, string>> = {
  fr: {
    "app.title": "Météo Dashboard",
    "search.placeholder": "Rechercher une ville...",
    "search.button": "OK",
    "current.feelsLike": "Ressenti",
    "current.humidity": "Humidité",
    "current.wind": "Vent",
    "current.pressure": "Pression",
    "current.uv": "UV Index",
    "current.visibility": "Visibilité",
    "hourly.title": "Prévisions horaires (24h)",
    "hourly.temp": "Température",
    "hourly.precip": "Précipitations",
    "daily.title": "Prévisions 7 jours",
    "daily.today": "Aujourd'hui",
    "map.title": "Localisation",
    "history.title": "vs. même date l'an dernier",
    "history.lastYear": "L'an dernier",
    "history.precip": "Précip. l'an dernier",
    "alerts.heatwave": "Canicule",
    "alerts.heatwave.msg": "Températures très élevées prévues. Restez hydraté.",
    "alerts.frost": "Gel",
    "alerts.frost.msg": "Températures négatives. Attention au verglas.",
    "alerts.rain": "Fortes pluies",
    "alerts.rain.msg": "Précipitations importantes prévues.",
    "alerts.storm": "Orage",
    "alerts.storm.msg": "Risque d'orages violents. Restez à l'abri.",
    "alerts.snow": "Neige",
    "alerts.snow.msg": "Chutes de neige prévues. Prudence sur les routes.",
    "aqi.title": "Qualité de l'air",
    "aqi.good": "Bonne",
    "aqi.moderate": "Modérée",
    "aqi.unhealthy.sensitive": "Mauvaise (sensibles)",
    "aqi.unhealthy": "Mauvaise",
    "aqi.very.unhealthy": "Très mauvaise",
    "aqi.hazardous": "Dangereuse",
    "sun.title": "Soleil",
    "sun.rise": "Lever",
    "sun.set": "Coucher",
    "sun.duration": "Durée du jour",
    "compare.title": "Comparer les villes",
    "compare.add": "Ajouter une ville",
    "footer.powered": "Données fournies par Open-Meteo",
    "footer.updated": "Dernière mise à jour",
    "wind.title": "Vent",
  },
  en: {
    "app.title": "Weather Dashboard",
    "search.placeholder": "Search a city...",
    "search.button": "OK",
    "current.feelsLike": "Feels like",
    "current.humidity": "Humidity",
    "current.wind": "Wind",
    "current.pressure": "Pressure",
    "current.uv": "UV Index",
    "current.visibility": "Visibility",
    "hourly.title": "Hourly forecast (24h)",
    "hourly.temp": "Temperature",
    "hourly.precip": "Precipitation",
    "daily.title": "7-day forecast",
    "daily.today": "Today",
    "map.title": "Location",
    "history.title": "vs. same date last year",
    "history.lastYear": "Last year",
    "history.precip": "Precip. last year",
    "alerts.heatwave": "Heatwave",
    "alerts.heatwave.msg": "Very high temperatures expected. Stay hydrated.",
    "alerts.frost": "Frost",
    "alerts.frost.msg": "Below zero temperatures. Watch for ice.",
    "alerts.rain": "Heavy rain",
    "alerts.rain.msg": "Significant rainfall expected.",
    "alerts.storm": "Storm",
    "alerts.storm.msg": "Risk of violent storms. Stay sheltered.",
    "alerts.snow": "Snow",
    "alerts.snow.msg": "Snowfall expected. Drive carefully.",
    "aqi.title": "Air Quality",
    "aqi.good": "Good",
    "aqi.moderate": "Moderate",
    "aqi.unhealthy.sensitive": "Unhealthy (sensitive)",
    "aqi.unhealthy": "Unhealthy",
    "aqi.very.unhealthy": "Very unhealthy",
    "aqi.hazardous": "Hazardous",
    "sun.title": "Sun",
    "sun.rise": "Sunrise",
    "sun.set": "Sunset",
    "sun.duration": "Day length",
    "compare.title": "Compare cities",
    "compare.add": "Add a city",
    "footer.powered": "Powered by Open-Meteo",
    "footer.updated": "Last updated",
    "wind.title": "Wind",
  },
};

export function useI18n() {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("meteo-lang") as Lang) || "fr",
  );

  const toggle = useCallback(() => {
    setLang((l) => {
      const next = l === "fr" ? "en" : "fr";
      localStorage.setItem("meteo-lang", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[lang][key] ?? key;
    },
    [lang],
  );

  return { lang, toggle, t };
}
