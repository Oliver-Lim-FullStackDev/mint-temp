import { Box, Stack, Skeleton } from '@mint/ui/components/core';

export default function Loading() {
  return (
    <Box px={2}>
      {/* Header Section - RANKS title and tagline */}
      <Stack spacing={1} sx={{ mb: 3, textAlign: 'center' }}>
        <Skeleton variant="text" width={200} height={60} sx={{ mx: 'auto', borderRadius: 1 }} />
        <Skeleton variant="text" width={250} height={24} sx={{ mx: 'auto', borderRadius: 1 }} />
      </Stack>

      {/* Tab Selector - This Month / All Time */}
      <Stack direction="row" spacing={0} sx={{ mb: 3, justifyContent: 'center' }}>
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: '20px 0 0 20px' }} />
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: '0 20px 20px 0' }} />
      </Stack>

      {/* Podium Section - 1st, 2nd, 3rd place with gift boxes */}
      <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: 'center', alignItems: 'end' }}>
        {/* 2nd Place */}
        <Stack alignItems="center" spacing={1}>
          <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 2 }} />
          <Skeleton variant="text" width={60} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={80} height={20} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={70} height={16} sx={{ borderRadius: 1 }} />
        </Stack>

        {/* 1st Place - Taller */}
        <Stack alignItems="center" spacing={1}>
          <Skeleton variant="rectangular" width={90} height={90} sx={{ borderRadius: 2 }} />
          <Skeleton variant="text" width={60} height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={80} height={20} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={70} height={16} sx={{ borderRadius: 1 }} />
        </Stack>

        {/* 3rd Place */}
        <Stack alignItems="center" spacing={1}>
          <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 2 }} />
          <Skeleton variant="text" width={60} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={80} height={20} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={70} height={16} sx={{ borderRadius: 1 }} />
        </Stack>
      </Stack>

      {/* Runners up info */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, px: 1 }}>
        <Skeleton variant="text" width={120} height={20} sx={{ borderRadius: 1 }} />
        <Skeleton variant="text" width={60} height={20} sx={{ borderRadius: 1 }} />
      </Stack>

      {/* Share Button */}
      <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 3, mb: 3 }} />

      {/* User List - Individual user rows */}
      <Stack spacing={1}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Avatar */}
            <Skeleton variant="circular" width={40} height={40} />

            {/* User info */}
            <Stack flex={1} spacing={0.5}>
              <Skeleton variant="text" width={80} height={20} sx={{ borderRadius: 1 }} />
              <Stack direction="row" alignItems="center" spacing={1}>
                <Skeleton variant="rectangular" width={16} height={16} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" width={60} height={16} sx={{ borderRadius: 1 }} />
              </Stack>
            </Stack>

            {/* Rank */}
            <Skeleton variant="text" width={40} height={24} sx={{ borderRadius: 1 }} />
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
