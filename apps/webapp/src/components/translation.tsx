'use client';

import { useTranslation } from 'next-i18next';
import { Typography, TypographyProps } from '@mint/ui/components';
import React from 'react';

interface TranslationProps extends TypographyProps {
  i18nKey: string;
  ns?: string;
}

export function Translation({ i18nKey, ns, ...typographyProps }: TranslationProps) {
  const { t } = useTranslation(ns);
  return <Typography {...typographyProps}>{t(i18nKey)}</Typography>;
}
