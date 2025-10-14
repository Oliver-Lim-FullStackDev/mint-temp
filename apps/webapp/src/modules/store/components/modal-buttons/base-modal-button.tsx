'use client';

import { Box, Typography, CircularProgress } from '@mint/ui';
import { ModalButtonState } from '../../utils/modal-button-types';

interface BaseModalButtonProps {
  buttonState: ModalButtonState;
  children?: React.ReactNode;
}

export default function BaseModalButton({ buttonState, children }: BaseModalButtonProps) {
  const { canClick, isLoading, buttonText, onClick } = buttonState;

  return (
    <Box
      sx={{
        display: 'flex',
        height: 48,
        minWidth: 64,
        padding: '0px 16px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        alignSelf: 'stretch',
        borderRadius: 1,
        background: canClick
          ? 'color(display-p3 0 0.9451 0.7961 / 0.08)'
          : 'color(display-p3 0.5 0.5 0.5 / 0.08)',
        cursor: canClick ? 'pointer' : 'not-allowed',
        transition: 'background 0.2s',
        opacity: canClick ? 1 : 0.6,
        '&:hover': {
          background: canClick
            ? 'color(display-p3 0 0.9451 0.7961 / 0.12)'
            : 'color(display-p3 0.5 0.5 0.5 / 0.08)',
        },
      }}
      onClick={canClick ? onClick : undefined}
    >
      {isLoading && (
        <CircularProgress size={20} sx={{ color: '#00FFE5', mr: 1 }} />
      )}

      {children}

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontSize: 15,
          lineHeight: 1.6,
          fontWeight: 700,
          color: "#00FFE5"
        }}
      >
        {buttonText}
      </Typography>
    </Box>
  );
}
