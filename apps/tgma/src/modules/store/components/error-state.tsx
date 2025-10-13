'use client';

import { Box, Typography, Button, Paper, Alert } from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onClear: () => void;
}

export default function ErrorState({ error, onRetry, onClear }: ErrorStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        textAlign: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Iconify
            icon="solar:danger-triangle-bold"
            width={64}
            height={64}
            sx={{ color: 'error.main' }}
          />
        </Box>

        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
          Oops! Something went wrong
        </Typography>

        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="body1">
            {error}
          </Typography>
        </Alert>

        <Box sx={{
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center'
        }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onRetry}
            startIcon={<Iconify icon="solar:refresh-bold" />}
            sx={{
              px: 3,
              py: 1.5,
              minWidth: 120
            }}
          >
            Retry
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClear}
            startIcon={<Iconify icon="solar:close-circle-bold" />}
            sx={{
              px: 3,
              py: 1.5,
              minWidth: 120
            }}
          >
            Close
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
