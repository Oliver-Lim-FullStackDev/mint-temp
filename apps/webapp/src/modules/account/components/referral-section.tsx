'use client';

import { useEffect, useState } from 'react';
import { Box, Button, Stack } from '@mint/ui/components/core';
import { GlassBox, Text } from '@mint/ui/components';

export interface ReferralSectionProps {
  referralLink?: string | null;
  referralCount?: number;
  onCopy?: (link: string) => void;
  shouldHighlight?: boolean;
}

export const ReferralSection: React.FC<ReferralSectionProps> = ({
  referralLink = 'mint.io/eUhd4K',
  referralCount = 7,
  onCopy,
  shouldHighlight = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Handle highlight effect when opened from invite button
  useEffect(() => {
    if (shouldHighlight) {
      setIsHighlighted(true);
      // Remove highlight after 3 seconds
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [shouldHighlight]);

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      onCopy?.(referralLink);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Box>
      <Stack sx={{ my: '16px', position: 'relative' }}>
        <Text
          variant='h5'
          color="white"
          sx={{
            fontSize: '18px !important',
            fontWeight: '700 !important',
            textAlign: 'center',
          }}
        >
          Refer friends and earn XP!
        </Text>
        <Text
          variant="body2"
          color="white"
          sx={{
            fontSize: '14px !important',
            fontWeight: 400,
            textAlign: 'center',
          }}
        >
          Invite friends to earn XP, and level up. The more you bring, the more you bank.
        </Text>
      </Stack>
      <GlassBox
        variant="glass-box"
        sx={{
          p: 2,
          borderRadius: 2.5,
        }}
      >
        {/* Header with referral text and friends count */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Text
            variant="caption"
            color="rgba(255, 255, 255, 0.9)"
            sx={{
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            Your referral link:
          </Text>

          <Text
            variant="caption"
            color="white"
            sx={{
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            {referralCount} Friends Accepted
          </Text>
        </Stack>

        {/* Referral link input with copy button */}
        <GlassBox
          variant="glass"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 1.5,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            px: 2,
            py: 1.5,
            position: 'relative',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{
              display: 'flex',
              flex: '1 1 auto',
              overflow: 'hidden',
              minWidth: 0,
            }}>
            <Text
              variant="body1"
              color="rgba(255, 255, 255, 0.9)"
              sx={{
                fontWeight: 500,
                userSelect: 'all',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0, // Allow flex item to shrink below content size
                flex: '1 1 auto',
                width: 0,
              }}
            >
              {referralLink}
            </Text>
            </Box>

            <Button
              onClick={handleCopy}
              sx={{
                backgroundColor: 'var(--brand-primary-blue-main)',
                color: '#000',
                fontWeight: 700,
                fontSize: '12px',
                height: '32px',
                px: 2,
                borderRadius: 1,
                textTransform: 'none',
                minWidth: '60px', // Set minimum width to prevent button from shrinking
                flexShrink: 0, // Prevent button from shrinking
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  backgroundColor: '#00D4B0',
                },
                '&:active': {
                  backgroundColor: '#00B89A',
                },
                // Shine/ping animation when highlighted
                ...(isHighlighted && {
                  animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite, shine 2s ease-in-out infinite',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                    animation: 'shine-sweep 2s ease-in-out infinite',
                  },
                  '@keyframes ping': {
                    '75%, 100%': {
                      transform: 'scale(1.05)',
                      opacity: 0.8,
                    },
                  },
                  '@keyframes shine': {
                    '0%, 100%': {
                      boxShadow: '0 0 5px #00F1CB, 0 0 10px #00F1CB, 0 0 15px #00F1CB',
                    },
                    '50%': {
                      boxShadow: '0 0 10px #00F1CB, 0 0 20px #00F1CB, 0 0 30px #00F1CB',
                    },
                  },
                  '@keyframes shine-sweep': {
                    '0%': {
                      left: '-100%',
                    },
                    '100%': {
                      left: '100%',
                    },
                  },
                }),
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </Stack>
        </GlassBox>
      </GlassBox>
    </Box>
  );
};
