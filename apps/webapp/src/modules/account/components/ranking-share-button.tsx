'use client';

import { InfoDialog, Text } from '@/components/core';
import { useInfoDialog } from '@/hooks/useInfoDialog';
import { Button } from '@mint/ui';
import { useTheme } from '@mui/material';
import { memo, useCallback } from 'react';
import RankingShareModal from './ranking-share-modal';

export function RankingShareButton() {
    const theme = useTheme();
    const { isOpen, openDialog, closeDialog, title, content } = useInfoDialog();
    const handleShare = useCallback(() => {
        openDialog(
            'Refer & Earn',
            <>
                <RankingShareModal />
            </>
        );
    }, [openDialog]);

    const shareButtonStyles = {
        bgcolor: theme.palette.primary.main,
        color: 'black',
        fontWeight: 700,
        py: 1.5,
        borderRadius: 1,
        '&:hover': {
            backgroundColor: '#00D4B0',
        },
        '&:active': {
            backgroundColor: '#00B89A',
        },
    }
    return (
        <>
            <Button
                fullWidth
                variant="contained"
                onClick={handleShare}
                sx={shareButtonStyles}
            >
                <Text variant="button">
                    Share & Earn
                </Text>
            </Button>

            <InfoDialog
                open={isOpen}
                onClose={closeDialog}
                title={title}
                content={content}
                noCloseBtn
            />
        </>
    )
}

export default memo(RankingShareButton)
