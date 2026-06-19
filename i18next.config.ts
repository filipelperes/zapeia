import type { I18nextToolkitConfig } from 'i18next-cli';

const config: I18nextToolkitConfig = {
  locales: ['en', 'pt-BR'],
  extract: {
    input: ['src/**/*.{ts,tsx}'],
    output: 'public/locales/{{language}}/translation.json',
    functions: ['t', 'i18n.t'],
    transComponents: ['Trans'],
    keySeparator: '.',
    nsSeparator: false,
    defaultValue: '',
    primaryLanguage: 'en',
  },
  types: {
    input: ['public/locales/en/translation.json'],
    output: 'src/types/i18next.d.ts',
  },
};

export default config;
