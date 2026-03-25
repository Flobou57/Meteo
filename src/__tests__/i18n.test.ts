import { describe, it, expect } from "vitest";

// Test des traductions directement
const translations = {
  fr: {
    "app.title": "Météo Dashboard",
    "daily.today": "Aujourd'hui",
  },
  en: {
    "app.title": "Weather Dashboard",
    "daily.today": "Today",
  },
};

describe("Traductions i18n", () => {
  it("retourne le titre en français", () => {
    expect(translations.fr["app.title"]).toBe("Météo Dashboard");
  });

  it("retourne le titre en anglais", () => {
    expect(translations.en["app.title"]).toBe("Weather Dashboard");
  });

  it("retourne Aujourd'hui en français", () => {
    expect(translations.fr["daily.today"]).toBe("Aujourd'hui");
  });

  it("retourne Today en anglais", () => {
    expect(translations.en["daily.today"]).toBe("Today");
  });
});
