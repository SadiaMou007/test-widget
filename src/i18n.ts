import i18next from "i18next";
import { initReactI18next } from "react-i18next";

export type SupportedLocale = "en" | "bn";

const resources = {
  en: {
    translation: {
      title: "Demo Posts",
      load: "Load posts",
      loading: "Loading…",
      error: "Failed to load",
      language: "Language",
    },
  },
  bn: {
    translation: {
      title: "ডেমো পোস্ট",
      load: "পোস্ট লোড করুন",
      loading: "লোড হচ্ছে…",
      error: "লোড করতে ব্যর্থ",
      language: "ভাষা",
    },
  },
} as const;

export function initI18n(locale: SupportedLocale = "en"): void {
  if (!i18next.isInitialized) {
    i18next.use(initReactI18next).init({
      resources: resources as any,
      lng: locale,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });
  } else if (i18next.language !== locale) {
    i18next.changeLanguage(locale);
  }
}

export default i18next;
