"use client";

import { memo, useCallback } from 'react';
import { InfoDialog, Text } from '@mint/ui/components';
import { useInfoDialog } from '@mint/ui/hooks';
import { PageHeader } from '@/components/headers/page-header';

export function RankingInfoHeader() {
  const { isOpen, openDialog, closeDialog, title, content } = useInfoDialog();

  const handleInfoClick = useCallback(() => {
    openDialog(
      'Ranks',
      <>
        <Text variant='body2'>
          Welcome to Ranks. Every MintBuck you bet moves you up the monthly leaderboard. Hit the top 10 by <b>23:59 on the last day of the month </b> to claim prizes and serious bragging rights. Bet more, climb faster. Glory awaits.
        </Text>
      </>
    );
  }, [openDialog]);
  return (
    <div>
      {/* Page Header */}

      <PageHeader
        title="RANKS"
        description="Connect. Play. Grind. Win."
        withBg
        showInfoIcon
        onInfoClick={handleInfoClick}
      />
      {/* Info Dialog */}
      <InfoDialog
        open={isOpen}
        onClose={closeDialog}
        title={title}
        content={content}
      />
    </div>
  )
}


export default memo(RankingInfoHeader)
