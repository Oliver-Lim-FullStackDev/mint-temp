'use client';

import TabSelector, { TabOption } from 'src/components/core/tab-selector';
import { useUI } from 'src/modules/ui/use-ui';
import { Box } from '@mint/ui/components/core';
import { memo, useCallback } from 'react';

const tabOptions: TabOption[] = [
    { id: 'month', label: 'MBX Bet This Month', value: 'month' },
    { id: 'alltime', label: 'MBX Bet All Time', value: 'alltime' },
];

export function RankingTabSelector() {
    const { leaderboardSelectedTab, setLeaderboardTab } = useUI();

    const tabSelectorBoxStyles = {
        mb: 3,
        width: '100%'
    }

    const handleTabChange = useCallback((option: TabOption) => {
        setLeaderboardTab(option.value);
    }, [setLeaderboardTab]);
    return (
        <Box sx={tabSelectorBoxStyles}>
            <TabSelector
                options={tabOptions}
                selectedValue={leaderboardSelectedTab}
                onSelectionChange={handleTabChange}
                isWide
            />
        </Box>
    )
}


export default memo(RankingTabSelector);
