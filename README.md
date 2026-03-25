<div align="center">

# ☁️ Météo Dashboard

**Dashboard météo moderne, interactif et complet**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![Vitest](https://img.shields.io/badge/Vitest-14_tests-6E9F18?style=flat-square&logo=vitest)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?style=flat-square&logo=pwa)
![CI](https://img.shields.io/github/actions/workflow/status/Flobou57/Meteo/ci.yml?style=flat-square&label=CI)

</div>

---

## ✨ Fonctionnalités

| Feature | Description |
|:--------|:-----------|
| 🌡️ **Météo temps réel** | Température, ressenti, humidité, vent, pression, UV, visibilité |
| 📊 **Graphiques interactifs** | Courbes horaires température + barres de précipitations (Recharts) |
| 📅 **Prévisions 7 jours** | Barres min/max colorées avec gradient chaud/froid |
| 🗺️ **Carte interactive** | Localisation sur carte Leaflet avec marker |
| 📍 **Géolocalisation auto** | Détecte votre position au lancement |
| ⭐ **Villes favorites** | Sauvegardées en localStorage, switch rapide |
| ⚠️ **Alertes météo** | Bannières auto si canicule, gel, orage, neige, fortes pluies |
| 📈 **Historique** | Comparaison vs même date l'an dernier |
| 🌬️ **Rose des vents** | Widget visuel avec échelle de Beaufort |
| 🌅 **Lever/coucher soleil** | Arc de progression avec durée du jour |
| 💨 **Qualité de l'air** | Index AQI européen avec PM2.5 et PM10 |
| 🏙️ **Multi-villes** | Comparer jusqu'à 4 villes côte à côte |
| 🌗 **Thème sombre/clair** | Toggle avec sauvegarde |
| 🔄 **Unités** | Toggle °C/°F et km/h/mph |
| 🌍 **i18n** | Français / Anglais |
| 📱 **PWA** | Installable sur mobile, fonctionne offline |
| ✅ **Tests** | 14 tests unitaires (Vitest) |
| 🚀 **CI/CD** | GitHub Actions (typecheck + tests + build) |
| 🔑 **Sans clé API** | Open-Meteo (gratuit et open-source) |

---

## 🛠️ Stack technique

| Technologie | Usage |
|:-----------:|:------|
| **React 19** | UI composants |
| **TypeScript** | Typage strict |
| **Vite 8** | Build & dev server |
| **Recharts** | Graphiques (courbes + barres) |
| **Leaflet** | Carte interactive |
| **Lucide React** | Icônes |
| **Vitest** | Tests unitaires |
| **vite-plugin-pwa** | Progressive Web App |
| **GitHub Actions** | CI/CD |
| **Open-Meteo API** | Données météo + qualité air + archives |

---

## 🚀 Installation

```bash
git clone https://github.com/Flobou57/Meteo.git
cd Meteo
npm install --legacy-peer-deps
npm run dev
```

## 🧪 Tests

```bash
npm test           # Run une fois
npm run test:watch # Mode watch
```

---

## 📁 Structure du projet

```
src/
├── components/
│   ├── AirQuality.tsx       # Qualité de l'air (AQI)
│   ├── CityCompare.tsx      # Comparaison multi-villes
│   ├── CurrentCard.tsx      # Carte météo actuelle
│   ├── DailyForecast.tsx    # Prévisions 7 jours
│   ├── HistoryCompare.tsx   # Comparaison historique
│   ├── HourlyChart.tsx      # Graphique horaire (courbes)
│   ├── PrecipChart.tsx      # Graphique précipitations (barres)
│   ├── SearchBar.tsx        # Recherche + favoris + thème
│   ├── Skeleton.tsx         # Loading skeleton animé
│   ├── SunWidget.tsx        # Lever/coucher soleil
│   ├── WeatherAlerts.tsx    # Alertes météo automatiques
│   ├── WeatherMap.tsx       # Carte Leaflet
│   └── WindRose.tsx         # Rose des vents
├── hooks/
│   ├── useI18n.ts           # Internationalisation FR/EN
│   ├── useTheme.ts          # Dark/light mode
│   ├── useUnits.ts          # °C/°F, km/h/mph
│   └── useWeather.ts        # Logique métier (API, géoloc, favoris, historique)
├── types/
│   └── weather.ts           # Types + codes météo
├── __tests__/
│   ├── weather.test.ts      # Tests codes météo
│   ├── units.test.ts        # Tests conversions
│   └── i18n.test.ts         # Tests traductions
├── styles/
│   └── app.css              # Variables CSS + thèmes dark/light
├── App.tsx
└── main.tsx
```

---

## 📡 APIs utilisées

- **[Open-Meteo Weather](https://open-meteo.com/)** — Météo actuelle, horaire, journalière
- **[Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api)** — Recherche de villes
- **[Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api)** — AQI, PM2.5, PM10
- **[Open-Meteo Archive](https://open-meteo.com/en/docs/historical-weather-api)** — Données historiques

Toutes gratuites, sans inscription ni clé API.

---

<div align="center">

Fait avec ❤️ par [Flobou57](https://github.com/Flobou57)

</div>
