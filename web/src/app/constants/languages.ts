export const languages = {
  ar: {
    dir: 'rtl',
    lang: 'ar',
  },
  en: {
    dir: 'ltr',
    lang: 'en',
  },
} as const;

export type LangType = keyof typeof languages;
