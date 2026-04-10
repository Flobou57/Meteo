import { useState, useCallback } from "react";
import type { DailyForecast } from "../types/weather";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied",
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  const checkAlerts = useCallback(
    (daily: DailyForecast[], city: string) => {
      if (permission !== "granted") return;

      // Vérifier les prévisions de demain
      const tomorrow = daily[1];
      if (!tomorrow) return;

      // Vérifier si on a déjà notifié aujourd'hui
      const notifKey = `meteo-notif-${new Date().toISOString().split("T")[0]}`;
      if (localStorage.getItem(notifKey)) return;

      const alerts: string[] = [];

      if (tomorrow.tempMax >= 35) {
        alerts.push(`Canicule demain (${Math.round(tomorrow.tempMax)}°C)`);
      }
      if (tomorrow.tempMin <= -5) {
        alerts.push(`Gel intense demain (${Math.round(tomorrow.tempMin)}°C)`);
      }
      if (tomorrow.weathercode >= 95) {
        alerts.push("Orage prévu demain");
      }
      if (tomorrow.weathercode >= 71 && tomorrow.weathercode <= 77) {
        alerts.push("Neige prévue demain");
      }
      if (tomorrow.precipitation > 20) {
        alerts.push(`Fortes pluies demain (${tomorrow.precipitation}mm)`);
      }

      if (alerts.length > 0) {
        new Notification(`Météo ${city}`, {
          body: alerts.join(" · "),
          icon: "/favicon.svg",
          tag: "meteo-alert",
        });
        localStorage.setItem(notifKey, "1");
      }
    },
    [permission],
  );

  return { permission, requestPermission, checkAlerts };
}
