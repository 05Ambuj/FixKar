// i18n.jsx
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json'; // Bengali
import gu from './locales/gu.json'; // Gujarati
import ta from './locales/ta.json'; // Tamil
import te from './locales/te.json'; // Telugu
import pa from './locales/pa.json'; // Punjabi
import bp from './locales/bp.json'; // Bhojpuri
import kn from './locales/kn.json'; // Kannada
import ur from './locales/ur.json'; // Urdu
import rj from './locales/rj.json'; // Rajasthani
import mr from './locales/mr.json'; // Marathi
import as from './locales/as.json'; // Assamese
import od from './locales/od.json'; // Odia

const loadLanguage = async () => {
  const language = await AsyncStorage.getItem('user-language');
  return language || 'en'; // Default to English if no language is set
};

const initI18n = async () => {
  const lng = await loadLanguage();

  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        hi: { translation: hi },
        bn: { translation: bn }, // Bengali
        gu: { translation: gu }, // Gujarati
        ta: { translation: ta }, // Tamil
        te: { translation: te }, // Telugu
        pa: { translation: pa }, // Punjabi
        bp: { translation: bp }, // Bhojpuri
        kn: { translation: kn }, // Kannada
        ur: { translation: ur }, // Urdu
        rj: { translation: rj }, // Rajasthani
        mr: { translation: mr }, // Marathi
        as: { translation: as }, // Assamese
        od: { translation: od }, // Odia
      },
      lng, // Set the loaded language as default
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export default i18n;
