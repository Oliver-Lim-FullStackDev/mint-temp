'use client';

import { Box, ToggleButton, ToggleButtonGroup } from '@mint/ui/components/core';
import { Text } from '@mint/ui/components';
import type { GamesCategoryOption } from '../filters.types';

type GamesCategoryNavProps = {
  categories: GamesCategoryOption[];
  activeCategory: string;
  onSelect: (slug: string) => void;
};

export function GamesCategoryNav({ categories, activeCategory, onSelect }: GamesCategoryNavProps) {
  return (
    <Box
      sx={{
        overflowX: 'auto',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        fullWidth
        value={activeCategory}
        onChange={(_event, value) => {
          if (value) {
            onSelect(value);
          }
        }}
        sx={{ flexWrap: 'nowrap', display: 'inline-flex', width: '100%' }}
      >
        {categories.map((category) => (
          <ToggleButton
            key={category.slug}
            value={category.slug}
            sx={{
              textTransform: 'none',
              px: 2,
              whiteSpace: 'nowrap',
              flex: 1,
              background: 'var(--grey-8, color(display-p3 0.5882 0.6039 0.6275 / 0.08))',
              '&.Mui-selected': {
                fontWeight: 700,
              },
            }}
          >
            <Text variant="body3">
              {category.label}
              {category.slug !== 'all' ? ` (${category.count})` : ''}
            </Text>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
