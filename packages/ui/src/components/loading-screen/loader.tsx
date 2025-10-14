'use client';

import { Box, Typography, CircularProgress } from '@mint/ui';

export default function Loader() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        p: 3,
        textAlign: 'center'
      }}
    >
      <CircularProgress size={48} sx={{ mb: 3 }} />
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Loading...
      </Typography>
    </Box>
  );
}