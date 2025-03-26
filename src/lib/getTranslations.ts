import faTranslations from "../translations/fa.json";
import enTranslations from "../translations/en.json";

const translations = {
  fa: faTranslations,
  en: enTranslations,
};

export function getTranslations(locale: string) {
  return translations[locale as keyof typeof translations] || translations["fa"];
}