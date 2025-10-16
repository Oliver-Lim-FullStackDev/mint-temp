'use client';

import { Box, Typography } from '@mint/ui/components/core';
import { CountdownState } from '@/hooks/use8HourDailyRewards';

interface CountdownTimerProps {
  countdown: CountdownState;
  nextSlotHour: number;
  sx?: any;
}

export default function CountdownTimer({ countdown, nextSlotHour, sx }: CountdownTimerProps) {
  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        border: '1px solid #00F9C7',
        borderRadius: '12px',
        p: 1,
        backgroundColor: 'rgba(0, 249, 199, 0.05)',
        ...sx
      }}
    >
      <Typography
          variant="caption"
          sx={{
            color: '#00F9C7',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}
        </Typography>
    </Box>
  );
}
