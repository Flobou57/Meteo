import { useState, useCallback } from "react";

export type TempUnit = "C" | "F";
export type SpeedUnit = "kmh" | "mph";

export function useUnits() {
  const [tempUnit, setTempUnit] = useState<TempUnit>(
    () => (localStorage.getItem("meteo-temp-unit") as TempUnit) || "C",
  );
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>(
    () => (localStorage.getItem("meteo-speed-unit") as SpeedUnit) || "kmh",
  );

  const toggleTemp = useCallback(() => {
    setTempUnit((u) => {
      const next = u === "C" ? "F" : "C";
      localStorage.setItem("meteo-temp-unit", next);
      return next;
    });
  }, []);

  const toggleSpeed = useCallback(() => {
    setSpeedUnit((u) => {
      const next = u === "kmh" ? "mph" : "kmh";
      localStorage.setItem("meteo-speed-unit", next);
      return next;
    });
  }, []);

  const convertTemp = useCallback(
    (celsius: number): number => {
      return tempUnit === "F" ? celsius * 1.8 + 32 : celsius;
    },
    [tempUnit],
  );

  const convertSpeed = useCallback(
    (kmh: number): number => {
      return speedUnit === "mph" ? kmh * 0.621371 : kmh;
    },
    [speedUnit],
  );

  const tempLabel = tempUnit === "C" ? "°C" : "°F";
  const speedLabel = speedUnit === "kmh" ? "km/h" : "mph";

  return {
    tempUnit,
    speedUnit,
    toggleTemp,
    toggleSpeed,
    convertTemp,
    convertSpeed,
    tempLabel,
    speedLabel,
  };
}
