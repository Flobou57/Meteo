import { describe, it, expect } from "vitest";
import { getWeatherInfo } from "../types/weather";

describe("getWeatherInfo", () => {
  it("retourne ciel dégagé pour le code 0", () => {
    const info = getWeatherInfo(0);
    expect(info.label).toBe("Ciel dégagé");
    expect(info.icon).toBe("☀️");
  });

  it("retourne couvert pour le code 3", () => {
    const info = getWeatherInfo(3);
    expect(info.label).toBe("Couvert");
    expect(info.icon).toBe("☁️");
  });

  it("retourne pluie forte pour le code 65", () => {
    const info = getWeatherInfo(65);
    expect(info.label).toBe("Pluie forte");
  });

  it("retourne orage pour le code 95", () => {
    const info = getWeatherInfo(95);
    expect(info.label).toBe("Orage");
    expect(info.icon).toBe("⛈️");
  });

  it("retourne inconnu pour un code invalide", () => {
    const info = getWeatherInfo(999);
    expect(info.label).toBe("Inconnu");
    expect(info.icon).toBe("❓");
  });
});
