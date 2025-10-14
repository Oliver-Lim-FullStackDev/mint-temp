'use client';

import { Text } from '@/components/core/text';
import { Box, Dialog, IconButton, Typography } from '@mint/ui';

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string | React.ReactNode;
  noCloseBtn?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function InfoDialog({
  open,
  onClose,
  title,
  content,
  noCloseBtn,
  maxWidth = 'sm'
}: InfoDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="info-dialog-title"
      maxWidth={maxWidth}
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'color(display-p3 0.1294 0.1373 0.1529)',
          boxShadow: '0 4px 24px 0 color(display-p3 1 1 1 / 0.08) inset, 0 1px 1px 0 color(display-p3 0.0886 1 0.8937 / 0.25) inset, 0 -1px 1px 0 color(display-p3 0 0 0 / 0.25) inset, 0 0 2px 0 color(display-p3 0 0 0 / 0.20), 0 12px 24px -4px color(display-p3 0 0 0 / 0.12)',
          backdropFilter: 'blur(4px)',
          p: 4,
          maxWidth: 500,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }
      }}
    >
      {/* Close button (X) in top right */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          color: '#FFFFFF',
          width: 32,
          height: 32,
          minWidth: 32,
          minHeight: 32,
          borderRadius: '50%',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          },
          '& .MuiTouchRipple-root': {
            borderRadius: '50%',
          },
        }}
      >
        ✕
      </IconButton>

      {/* Title */}
      <Typography
        id="info-dialog-title"
        variant="h4"
        component="h2"
        sx={{
          color: '#FFFFFF',
          fontWeight: 700,
          mb: 3,
          pr: 6, // Space for close button
        }}
      >
        {title}
      </Typography>

      {/* Content */}
      {typeof content === 'string' ? (
        <Text
          variant="body1"
          sx={{
            color: '#FFFFFF',
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          {content}
        </Text>
      ) : (
        <Box sx={{ mb: 4 }}>
          {content}
        </Box>
      )}

      {/* Close button */}
      {!noCloseBtn && <Box sx={{ textAlign: 'center' }}>
        <Box
          component="button"
          onClick={onClose}
          sx={{
            bgcolor: '#3a3f47',
            color: 'color(display-p3 0.5686 0.6196 0.6706 / 0.80)',
            border: 'none',
            borderRadius: 1,
            px: 4,
            py: 2,
            fontFamily: '"Red Hat Text"',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '26px',
            cursor: 'pointer',
            width: '100%',
            '&:hover': {
              bgcolor: '#4a4f57',
            },
            '&:active': {
              bgcolor: '#2a2f37',
            },
          }}
        >
          Close
        </Box>
      </Box>}
    </Dialog>
  );
}
