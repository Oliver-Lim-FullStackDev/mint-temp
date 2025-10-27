'use client';

import React from 'react';
import StorePage from "src/app/store/page";
import { BackToTopButton } from "@mint/ui/components/animate";

export function HomeView() {
  return (
    <>
      <StorePage />
      <BackToTopButton />
    </>
  )
}
