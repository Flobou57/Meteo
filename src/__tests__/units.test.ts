import { describe, it, expect } from "vitest";

// Test des fonctions de conversion directement
describe("Conversions d'unités", () => {
  const toFahrenheit = (c: number) => c * 1.8 + 32;
  const toMph = (kmh: number) => kmh * 0.621371;

  it("convertit 0°C en 32°F", () => {
    expect(toFahrenheit(0)).toBe(32);
  });

  it("convertit 100°C en 212°F", () => {
    expect(toFahrenheit(100)).toBe(212);
  });

  it("convertit -40°C en -40°F", () => {
    expect(toFahrenheit(-40)).toBeCloseTo(-40);
  });

  it("convertit 100 km/h en ~62.14 mph", () => {
    expect(toMph(100)).toBeCloseTo(62.14, 1);
  });

  it("convertit 0 km/h en 0 mph", () => {
    expect(toMph(0)).toBe(0);
  });
});
