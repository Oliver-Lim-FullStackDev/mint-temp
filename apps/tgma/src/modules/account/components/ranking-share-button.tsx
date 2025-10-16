'use client';

import { memo, useCallback } from 'react';
import { InfoDialog, Text } from '@mint/ui/components';
import { Button } from '@mint/ui/components/core';
import { useTheme } from '@mint/ui/components/core/styles';
import { useInfoDialog } from '@mint/ui/hooks';
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
