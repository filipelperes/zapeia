import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en', 'pt-BR'],
  extract: {
    input: ['src/**/*.{ts,tsx}'],
    output: 'public/locales/{{language}}/translation.json',
    functions: ['t', 'i18n.t'],
    transComponents: ['Trans'],
    keySeparator: '.',
    nsSeparator: false,
    defaultValue: (_key: string, _ns: string, _lang: string, value: string) => value,
    primaryLanguage: 'en',
  },
  types: {
    input: ['public/locales/en/translation.json'],
    output: 'src/types/i18next.d.ts',
  },
});
