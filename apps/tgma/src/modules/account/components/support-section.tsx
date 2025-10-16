'use client';

import { GlassBox, Text } from '@mint/ui/components';
import { Link, Stack } from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';

interface SupportSectionProps {
  username: string;
}

export const SupportSection = ({ username }: SupportSectionProps) => {
  return (
    <Stack spacing={1.25} mt={1.25}>
      <Text variant="h6" fontWeight="bold" color="white">
        Support
      </Text>

      {/* Report a bug */}
      <Link
        href={`https://forms.clickup.com/2574244/f/2ehx4-48012/W15QPIRFKYX3Y63473?user_id=${username}`}
        underline="none"
        target="_blank"
        sx={{ '&:hover': { textDecoration: 'none' } }}
      >
        <GlassBox
          variant="glass-box"
          sx={{
            p: 2,
            borderRadius: 1.5,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Iconify icon="profile:report-bug-icon" width={24} height={24} />
              <Text variant="body1" color="white" fontWeight="medium">
                Report a bug
              </Text>
            </Stack>
            <Iconify icon="solar:arrow-right-linear" color="white"  />
          </Stack>
        </GlassBox>
      </Link>

      {/* Help center */}
      <Link
        href="https://mint.io/docs/telegram"
        underline="none"
        target="_blank"
        sx={{ '&:hover': { textDecoration: 'none' } }}
      >
        <GlassBox
          variant="glass-box"
          sx={{
            p: 2,
            borderRadius: 1.5,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Iconify icon="profile:help-center-icon" width={24} height={24} />
              <Text variant="body1" color="white" fontWeight="medium">
                Help center
              </Text>
            </Stack>
            <Iconify icon="solar:arrow-right-linear" color="white" />
          </Stack>
        </GlassBox>
      </Link>

      {/* Legal */}
      {false && <GlassBox
        variant="glass-box"
        sx={{
          p: 2,
          borderRadius: 1.5,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Iconify width={24} height={24} icon="profile:legal-icon" />
            <Text variant="body1" color="white" fontWeight="medium">
              Legal
            </Text>
          </Stack>
          <Iconify icon="solar:arrow-right-linear" sx={{ color: 'white' }} />
        </Stack>
      </GlassBox>}
    </Stack>
  );
};
