'use client';

import { useTranslation } from 'next-i18next';
import React from 'react';
import { Typography, TypographyProps } from '@mint/ui/components/core';

interface TranslationProps extends TypographyProps {
  i18nKey: string;
  ns?: string;
}

export function Translation({ i18nKey, ns, ...typographyProps }: TranslationProps) {
  const { t } = useTranslation(ns);
  return <Typography {...typographyProps}>{t(i18nKey)}</Typography>;
}
