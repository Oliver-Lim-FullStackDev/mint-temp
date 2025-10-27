'use client';

import { type FC } from 'react';
import { useLocale } from 'next-intl';
import { Select } from '@mint/ui/components/core';

import { localesMap } from 'src/core/i18n/config';
import { setLocale } from 'src/core/i18n/locale';

export const LocaleSwitcher: FC = () => {
  const locale = useLocale();

  const onChange = (value: string) => {
    setLocale(value);
  };

  return (
    <Select value={locale} onChange={({ target }) => onChange(target.value)}>
      {localesMap.map((locale) => (
        <option key={locale.key} value={locale.key}>{locale.title}</option>
      ))}
    </Select>
  );
};
