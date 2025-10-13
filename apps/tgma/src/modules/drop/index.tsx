'use client';

import Image from 'next/image';
import { Box, Typography, Button } from '@mint/ui/components/core';
import { GlassCard } from '@mint/ui/components';
import Loader from '@mint/ui/components/loading-screen/loader';
import { useDrop, DropData, DropSectionItem } from './hooks/useDrop';

export function Drops() {
  const { data, isLoading } = useDrop();
  const drops: DropData = data || { qualify: [], boosters: [] };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', pl: 2, justifyContent: 'center', alignItems: 'flex-start', gap: 1.25, alignSelf: 'stretch', padding: '16px' }}>
      <Box
        sx={{
          display: 'flex',
          height: 140,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
          borderRadius: 2,
          boxShadow: '0px 4px 24px 0px rgba(255, 255, 255, 0.08) inset, 0px 1px 1px 0px rgba(0, 255, 228, 0.25) inset, 0px -1px 1px 0px rgba(0, 0, 0, 0.25) inset, 0px 0px 2px 0px rgba(0, 0, 0, 0.20), 0px 12px 24px -4px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(4px)',
          overflow: 'hidden',
          mb: 1
        }}
      >
        <Image
          src="/assets/images/missions/banner.png"
          alt="Missions Banner"
          width={400}
          height={140}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      {/* Required to Qualify Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1, mt: 1 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', flex: 1 }}>
          Required to Qualify
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
          0/{drops.qualify.length}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {isLoading ? (
          <Loader />
        ) : (
          drops.qualify.map((item: DropSectionItem) => (
            <GlassCard
              key={item.id}
              sx={{
                display: 'flex',
                width: '100%',
                padding: 2,
                alignItems: 'center',
                gap: 2,
                flexDirection: 'row',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                <Typography
                  sx={{
                    overflow: 'hidden',
                    color: 'white',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '22px',
                    letterSpacing: '0px',
                  }}
                >
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      color: 'white',
                      textOverflow: 'ellipsis',
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '18px',
                      letterSpacing: '0px',
                    }}
                  >
                    {item.exp}
                  </Typography>
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      color: 'white',
                      textOverflow: 'ellipsis',
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '18px',
                      letterSpacing: '0px',
                    }}
                  >
                    🎟️ {item.tickets}
                  </Typography>
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      color: 'white',
                      textOverflow: 'ellipsis',
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '18px',
                      letterSpacing: '0px',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Box>
              <Button
                sx={{
                  display: 'flex',
                  height: 30,
                  padding: '0px 24px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: 1,
                  background: '#00F9C7',
                  color: '#000',
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': {
                    background: '#00F9C7',
                  },
                }}
              >
                {item.actionLabel}
              </Button>
            </GlassCard>
          ))
        )}
      </Box>
      {/* $MINT Allocation Boosters Section */}
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mt: 4, mb: 1 }}>
        $MINT Allocation Boosters
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {isLoading ? (
          <Loader />
        ) : (
          drops.boosters.map((item: DropSectionItem) => (
            <GlassCard
              key={item.id}
              sx={{
                display: 'flex',
                width: '100%',
                padding: 2,
                alignItems: 'center',
                gap: 2,
                flexDirection: 'row',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                <Typography
                  sx={{
                    overflow: 'hidden',
                    color: 'white',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '22px',
                    letterSpacing: '0px',
                  }}
                >
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      color: 'white',
                      textOverflow: 'ellipsis',
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '18px',
                      letterSpacing: '0px',
                    }}
                  >
                    {item.exp}
                  </Typography>
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      color: 'white',
                      textOverflow: 'ellipsis',
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '18px',
                      letterSpacing: '0px',
                    }}
                  >
                    🎟️ {item.tickets}
                  </Typography>
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      color: 'white',
                      textOverflow: 'ellipsis',
                      fontSize: '12px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '18px',
                      letterSpacing: '0px',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Box>
              <Button
                sx={{
                  display: 'flex',
                  height: 30,
                  padding: '0px 24px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: 1,
                  background: '#00F9C7',
                  color: '#000',
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': {
                    background: '#00F9C7',
                  },
                }}
              >
                {item.actionLabel}
              </Button>
            </GlassCard>
          ))
        )}
      </Box>
    </Box>
  );
}

export default Drops;
