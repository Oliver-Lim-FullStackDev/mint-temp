'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, InputAdornment, MenuItem, Select, TextField } from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';
import type { GamesProviderOption, GamesSortOrder } from '../filters.types';

type GamesFiltersBarProps = {
  search: string;
  provider: string;
  order: GamesSortOrder;
  providers: GamesProviderOption[];
  onSearchChange: (value: string) => void;
  onProviderChange: (value: string) => void;
  onOrderChange: (value: GamesSortOrder) => void;
};

const SEARCH_DEBOUNCE_MS = 400;

export function GamesFiltersBar({
  search,
  provider,
  order,
  providers,
  onSearchChange,
  onProviderChange,
  onOrderChange,
}: GamesFiltersBarProps) {
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      if (searchValue.trim() === search.trim()) return;
      onSearchChange(searchValue);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(handler);
    };
  }, [onSearchChange, search, searchValue]);

  const providerOptions = useMemo(() => [{ value: '', label: 'All providers' }, ...providers], [providers]);
  const sortOptions: { value: GamesSortOrder; label: string }[] = useMemo(
    () => [
      { value: 'ASC', label: 'A-Z' },
      { value: 'DESC', label: 'Z-A' },
    ],
    [],
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        alignItems: 'center',
        gridTemplateColumns: {
          xs: '2fr 3fr', // two columns for mobile
          md: '3fr 2fr 3fr', // three columns from md up
          lg: '10fr 2fr 3fr', // wider layout on large screens
        },
        gridTemplateAreas: {
          xs: `
        "search search"
        "order provider"
      `,
          md: `
        "search order provider"
      `,
        },
      }}
    >
      <TextField
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder="Search games"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="solar:magnifer-outline" width={20} />
            </InputAdornment>
          ),
        }}
        sx={{ gridArea: 'search' }}
      />

      <Select
        value={order}
        onChange={(event) => onOrderChange(event.target.value as GamesSortOrder)}
        displayEmpty
        renderValue={(value) => sortOptions.find((option) => option.value === value)?.label ?? 'Sort'}
        sx={{ gridArea: 'order' }}
      >
        {sortOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <Select
        value={provider}
        onChange={(event) => onProviderChange(event.target.value as string)}
        displayEmpty
        sx={{ gridArea: 'provider' }}
      >
        {providerOptions.map((option) => (
          <MenuItem key={option.value || 'all'} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
