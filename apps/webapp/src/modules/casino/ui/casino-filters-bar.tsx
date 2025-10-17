'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, InputAdornment, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup } from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';
import type { CasinoProviderOption, CasinoSortOrder } from '../types';

type CasinoFiltersBarProps = {
  search: string;
  provider: string;
  order: CasinoSortOrder;
  providers: CasinoProviderOption[];
  onSearchChange: (value: string) => void;
  onProviderChange: (value: string) => void;
  onOrderChange: (value: CasinoSortOrder) => void;
};

const SEARCH_DEBOUNCE_MS = 400;

export function CasinoFiltersBar({
  search,
  provider,
  order,
  providers,
  onSearchChange,
  onProviderChange,
  onOrderChange,
}: CasinoFiltersBarProps) {
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

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
        alignItems: 'center',
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
      />

      <Select
        value={provider}
        onChange={(event) => onProviderChange(event.target.value as string)}
        displayEmpty
      >
        {providerOptions.map((option) => (
          <MenuItem key={option.value || 'all'} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <ToggleButtonGroup
        value={order}
        exclusive
        onChange={(_event, value) => {
          if (value) {
            onOrderChange(value);
          }
        }}
        color="primary"
      >
        <ToggleButton value="ASC" sx={{ textTransform: 'none', px: 2 }}>
          <Iconify icon="solar:sort-linear-outline" width={18} style={{ marginRight: 8 }} /> A-Z
        </ToggleButton>
        <ToggleButton value="DESC" sx={{ textTransform: 'none', px: 2 }}>
          <Iconify icon="solar:sort-vertical-outline" width={18} style={{ marginRight: 8 }} /> Z-A
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
