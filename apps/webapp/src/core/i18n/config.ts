export const defaultLocale = 'en';

export const timeZone = 'Europe/London';

export const locales = [defaultLocale, 'es', 'ru'] as const;

export const localesMap = [
  { key: 'en', title: 'English' },
  { key: 'es', title: 'Español' },
  { key: 'ru', title: 'Русский' },
];
