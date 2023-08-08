import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import en from "./locales/en.json";
import zh_tw from "./locales/zh_TW.json";

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh_tw,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
});

export default i18n;