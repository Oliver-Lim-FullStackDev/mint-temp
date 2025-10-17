'use client';

import { Box, ToggleButton, ToggleButtonGroup } from '@mint/ui/components/core';
import { Text } from '@mint/ui/components';
import type { CasinoCategoryOption } from '../types';

type CasinoCategoryNavProps = {
  categories: CasinoCategoryOption[];
  activeCategory: string;
  onSelect: (slug: string) => void;
};

export function CasinoCategoryNav({ categories, activeCategory, onSelect }: CasinoCategoryNavProps) {
  return (
    <Box sx={{ overflowX: 'auto', width: '100%' }}>
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={activeCategory}
        onChange={(_event, value) => {
          if (value) {
            onSelect(value);
          }
        }}
        sx={{ flexWrap: 'nowrap', display: 'inline-flex' }}
      >
        {categories.map((category) => (
          <ToggleButton
            key={category.slug}
            value={category.slug}
            sx={{
              textTransform: 'none',
              px: 2,
              whiteSpace: 'nowrap',
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
