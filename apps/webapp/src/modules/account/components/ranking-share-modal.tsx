"use client";

import { Text } from '@/components/core';
import { GlassBox } from '@/components/glass-box';
import { ListItemCoin } from '@/components/list/rankings/list-item-coin';
import { useUserAuth } from '@/modules/telegram/context/user-auth-telegram-provider';
import { Box, Button, Stack } from '@mint/ui';
import { Iconify } from '@mint/ui/components/iconify';
import { alpha, useTheme } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

// Light swipe animation when highlighted
const sxBtnLightSwipe = {
    overflow: 'hidden',
    position: 'relative',
    animation: 'glow 4s ease-in-out infinite',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-150%',
        width: '50%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 20%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)',
        transform: 'skewX(-20deg)',
        animation: 'light-swipe 2s ease-in-out infinite',
        filter: 'blur(0.5px)',
    },
    '&::after': {
        position: 'absolute',
        top: 0,
        left: '-150%',
        width: '30%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent 0%, rgba(0, 241, 203, 0.3) 30%, rgba(0, 241, 203, 0.6) 50%, rgba(0, 241, 203, 0.3) 70%, transparent 100%)',
        transform: 'skewX(-20deg)',
        animation: 'light-swipe 2s ease-in-out infinite 0.1s',
        filter: 'blur(1px)',
    },
    '@keyframes light-swipe': {
        '0%': {
            left: '-150%',
            opacity: 0,
        },
        '10%': {
            opacity: 1,
        },
        '90%': {
            opacity: 1,
        },
        '100%': {
            left: '150%',
            opacity: 0,
        },
    },
    '@keyframes glow': {
        '0%, 100%': {
            boxShadow: '0 0 8px rgba(0, 241, 203, 0.3), 0 0 16px rgba(0, 241, 203, 0.2)',
        },
        '50%': {
            boxShadow: '0 0 12px rgba(0, 241, 203, 0.5), 0 0 24px rgba(0, 241, 203, 0.3)',
        },
    },
}

export default function RankingShareModal({ copyHighlight = true }: { copyHighlight?: boolean }) {
    const { user } = useUserAuth();
    const [copied, setCopied] = useState(false);
    const theme = useTheme()
    // Generate referral link (reused from profile-summary.tsx)
    const referralLink = useMemo(() => {
      if (!user?.player?.referralId) {
          return;
      }

      const { referralId } = user.player;
      // TG user are sent to BOT page
      return `${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}/?startapp=ref=${referralId}`;

      // TODO migrate to webapp
      //  return `${process.env.NEXT_PUBLIC_MINT_URL}/?ref=${referralId}`;
    }, [user?.player?.referralId]);

    const referralCount = user?.player?.referralCount || 0;
    const MBX_per_referral = 100
    const XPP_per_referral = 75

    const MBX_earnings = referralCount * MBX_per_referral
    const XPP_earnings = referralCount * XPP_per_referral

    const handleShareTelegram = useCallback(() => {
        const shareUrl = 'https://t.me/share/url?url=https://t.me/MintDotIO_bot/MINT?startapp=9&src=share&text=Join'; // SHOULD BE A ENV VAR ?
        window.open(shareUrl, '_blank');
    }, []);

    const handleCopy = useCallback(async () => {
        if (!referralLink) return;
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            // Reset copied state after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }, [referralLink]);
    return (
        <>
            <Text
                variant="body2"
                sx={{
                    fontWeight: 400,
                    textAlign: 'center',
                    mb: 3,
                }}
            >
                Invite friends to earn MintBucks and XP. The more people you bring, the more you bank!
            </Text>

            {/* Share & Earn Button */}
            <Button
                fullWidth
                variant="contained"
                onClick={handleShareTelegram}
                sx={{
                    background: 'linear-gradient(135deg, #00F1CB 0%, #00D4B0 100%)',
                    color: theme.palette.common.black,
                    fontWeight: 700,
                    py: 1.5,
                    borderRadius: 1,
                    mb: 2,
                    textTransform: 'none',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #00D4B0 0%, #00B89A 100%)',
                    },
                    ...( copyHighlight && sxBtnLightSwipe)
                }}
            >
                <Text variant="button" sx={{ fontWeight: 700 }}>
                    Share & Earn
                </Text>
            </Button>

            {/* Referral Reward Banner */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    mb: 2,
                    p: 1,
                    borderRadius: 1,
                    background: alpha(theme.palette.secondary.main, 0.08),
                    color: theme.palette.common.white,
                }}
            >
                <Stack direction="row" alignItems="center" spacing={0} sx={{ flex: 1, minWidth: 0, color: theme.palette.secondary.main }}>
                    <Iconify icon='share-earn-modal:mint-store-icon' width={26} height={26} sx={{ pt: 0.5 }} />
                    <Text
                        variant="caption"
                        sx={{ minWidth: 'max-content' }}
                    >
                        For each user referred you earn:
                    </Text>
                </Stack>

                <Stack direction="row" spacing={1.25} alignItems="center">
                    <ListItemCoin
                        MBX={MBX_per_referral}
                        XPP={XPP_per_referral}
                    />
                </Stack>
            </Box>

            <Text
                variant="body2"
                sx={{
                    textAlign: 'center',
                    mb: 2,
                }}
            >
                Or use your referral link below...
            </Text>

            {/* Referral Link Section */}
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
                            variant="body2"
                            sx={{
                                fontWeight: 500,
                                userSelect: 'all',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                minWidth: 0,
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
                            color: theme.palette.common.black,
                            fontWeight: 700,
                            height: '32px',
                            px: 2,
                            borderRadius: 1,
                            textTransform: 'none',
                            minWidth: '60px',
                            flexShrink: 0,
                            '&:hover': {
                                backgroundColor: '#00D4B0',
                            },
                            '&:active': {
                                backgroundColor: '#00B89A',
                            },
                        }}
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                </Stack>
            </GlassBox>

            {/* Friends Activated Section */}
            <Box sx={{ mt: 2 }}>
                <Text
                    variant="body2"
                    color={theme.palette.secondary.main}
                    sx={{
                        fontWeight: 600,
                        textAlign: 'left',
                    }}
                >
                    {referralCount} Friends Activated
                </Text>


                {/* Earnings Display */}
                <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 1 }}>
                    <Text
                        variant="body2"
                        sx={{
                            fontWeight: 400,
                            textAlign: 'left',
                        }}
                    >
                        Your referral earnings:
                    </Text>

                   {(!!MBX_earnings || !!XPP_earnings )&& <ListItemCoin
                      XPP={XPP_earnings}
                      MBX={MBX_earnings}
                    />}
                </Stack>
            </Box>
        </>
    )
}
