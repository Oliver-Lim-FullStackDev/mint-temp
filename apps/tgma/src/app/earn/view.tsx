'use client';

import React from 'react';
import { BackToTopButton } from "@mint/ui/components/animate";
import EarnPage from "./page";

export function HomeView() {
  return (
    <>
      <EarnPage />
      <BackToTopButton />
    </>
  )
}
