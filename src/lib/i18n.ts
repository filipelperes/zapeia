import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../public/locales/en/translation.json';
import ptBR from '../../public/locales/pt-BR/translation.json';

const detectedLanguage = navigator.language.startsWith('pt') ? 'pt-BR' : 'en';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'pt-BR': { translation: ptBR },
  },
  lng: detectedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes output
  },
});

export default i18n;
