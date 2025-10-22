'use client';

import { createPaletteChannel } from 'minimal-shared/utils';

import type { ThemeOptions } from './types';

// ----------------------------------------------------------------------

export const themeOverrides: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 400,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: createPaletteChannel({
          lighter: '#E4DCFD',
          light: '#A996F8',
          main: '#6950E8',
          dark: '#3828A7',
          darker: '#180F6F',
          contrastText: '#FFFFFF',
        }),
        'primary-2': createPaletteChannel({
          lighter: '#E6F7F4',
          light: '#80D4C4',
          main: '#009C79',
          dark: '#007A5E',
          darker: '#005A46',
          contrastText: '#FFFFFF',
        }),
        'error-2': createPaletteChannel({
          lighter: '#FFE6E6',
          light: '#FF8080',
          main: '#FF2000',
          dark: '#CC1A00',
          darker: '#991300',
          contrastText: '#FFFFFF',
        }),
      },
    },
    dark: {
      palette: {
        primary: createPaletteChannel({
          lighter: '#E4DCFD',
          light: '#A996F8',
          main: '#6950E8',
          dark: '#3828A7',
          darker: '#180F6F',
          contrastText: '#FFFFFF',
        }),
        'primary-2': createPaletteChannel({
          lighter: '#E6F7F4',
          light: '#80D4C4',
          main: '#009C79',
          dark: '#007A5E',
          darker: '#005A46',
          contrastText: '#FFFFFF',
        }),
        'error-2': createPaletteChannel({
          lighter: '#FFE6E6',
          light: '#FF8080',
          main: '#FF2000',
          dark: '#CC1A00',
          darker: '#991300',
          contrastText: '#FFFFFF',
        }),
      },
    },
  },
};
