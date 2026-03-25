<div align="center">

# ☁️ Météo Dashboard

**Dashboard météo moderne et interactif**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![Recharts](https://img.shields.io/badge/Recharts-Charts-22b5bf?style=flat-square)
![Leaflet](https://img.shields.io/badge/Leaflet-Map-199900?style=flat-square&logo=leaflet)

</div>

---

## ✨ Fonctionnalités

- 🌡️ **Météo en temps réel** — Température, ressenti, humidité, vent, pression, UV, visibilité
- 📊 **Graphiques interactifs** — Courbes horaires (température + précipitations) sur 24h
- 📅 **Prévisions 7 jours** — Avec barres de température min/max colorées
- 🗺️ **Carte interactive** — Localisation de la ville sur une carte Leaflet
- 📍 **Géolocalisation auto** — Détecte votre position au lancement
- ⭐ **Villes favorites** — Sauvegardées en localStorage, switch rapide
- ⚠️ **Alertes météo** — Bandeau automatique si canicule, gel, orage, neige ou fortes pluies
- 📈 **Historique** — Comparaison avec la même date l'an dernier
- 🌗 **Mode sombre / clair** — Toggle avec sauvegarde
- 📱 **Responsive** — S'adapte à toutes les tailles d'écran
- 🔑 **Aucune clé API requise** — Utilise Open-Meteo (gratuit et open-source)

---

## 🛠️ Stack technique

| Technologie | Usage |
|:-----------:|:------|
| **React 19** | UI composants |
| **TypeScript** | Typage strict |
| **Vite** | Build & dev server |
| **Recharts** | Graphiques interactifs |
| **Leaflet** | Carte interactive |
| **Lucide React** | Icônes |
| **Open-Meteo API** | Données météo (gratuit, sans clé) |

---

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/Flobou57/Meteo.git
cd Meteo

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

---

## 📁 Structure du projet

```
src/
├── components/
│   ├── CurrentCard.tsx      # Carte météo actuelle
│   ├── DailyForecast.tsx    # Prévisions 7 jours
│   ├── HistoryCompare.tsx   # Comparaison historique
│   ├── HourlyChart.tsx      # Graphique horaire
│   ├── SearchBar.tsx        # Recherche + favoris + thème
│   ├── WeatherAlerts.tsx    # Alertes météo automatiques
│   └── WeatherMap.tsx       # Carte Leaflet
├── hooks/
│   ├── useWeather.ts        # Logique métier (API, géoloc, favoris)
│   └── useTheme.ts          # Gestion dark/light mode
├── types/
│   └── weather.ts           # Types TypeScript + codes météo
├── styles/
│   └── app.css              # Variables CSS + thèmes
├── App.tsx                  # Assemblage principal
└── main.tsx                 # Point d'entrée
```

---

## 📡 API utilisée

**[Open-Meteo](https://open-meteo.com/)** — API météo gratuite et open-source, sans inscription ni clé API.

- Données actuelles, horaires et journalières
- Géocodage intégré
- Archives historiques

---

<div align="center">

Fait avec ❤️ par [Flobou57](https://github.com/Flobou57)

</div>
