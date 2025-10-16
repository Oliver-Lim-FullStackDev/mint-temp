'use client';

import React, { useState } from 'react';
import { GlassBox, Text } from '@mint/ui/components';
import {
  StyledTableContainer,
  TabButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TabType
} from '@mint/ui/components/table';
import {
  Link,
  Skeleton,
  Stack,
} from '@mint/ui/components/core';
import { RouterLink } from '@mint/ui/minimals/routes/components';
import { useReceiptsList } from '@/modules/store/hooks/useReceipts';
import type { Receipt } from '@/modules/store/types';
import { SubProvider } from '@/modules/store/types/sub-provider.enum';
import { useUI } from '@/modules/ui/use-ui';
import { paths } from '@/routes/paths';
import type { HistoryTransaction } from '../hooks/useAccountData';
import { useAccountHistory } from '../hooks/useAccountData';

interface HistoryTransactionsProps {
  apiConfig?: any;
  maxRows?: number;
}

export const HistoryTransactions: React.FC<HistoryTransactionsProps> = ({
  apiConfig,
  maxRows = 9
}) => {
  const { data: history, isLoading: historyLoading } = useAccountHistory(apiConfig);
  const { receipts, isLoading: receiptsLoading } = useReceiptsList();
  const [activeTab, setActiveTab] = useState<TabType>('purchases');
  const { closeAccountDrawer } = useUI();

  const isLoading = historyLoading || receiptsLoading;
  const displayHistory = history?.slice(0, maxRows) || [];
  const purchaseHistory = receipts?.slice(0, maxRows) || [];

  const getTableHeaders = () => {
    if (activeTab === 'purchases') {
      return ['Date', 'Amount', 'Status', 'Currency'];
    }
    return ['Date', 'Daily Plays', 'Raffles', 'MintBucks'];
  };

  const getTableData = () => {
    if (activeTab === 'purchases') {
      return purchaseHistory;
    }
    return displayHistory;
  };

  const afterClick = ()=> {
    closeAccountDrawer();
  }

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Text variant="h6" fontWeight="bold" color="white">
          History
        </Text>
        <GlassBox variant="glass-box" sx={{ p: 2, borderRadius: 1.5 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Skeleton variant="text" width={80} height={32} />
              <Skeleton variant="text" width={80} height={32} />
            </Stack>
            {Array.from({ length: 3 }).map((_, index) => (
              <Stack key={index} direction="row" spacing={1} alignItems="center">
                <Skeleton variant="text" width={60} height={16} />
                <Skeleton variant="text" width={35} height={16} />
                <Skeleton variant="text" width={35} height={16} />
                <Skeleton variant="text" width={50} height={16} />
              </Stack>
            ))}
          </Stack>
        </GlassBox>
      </Stack>
    );
  }

  const headers = getTableHeaders();
  const rows = getTableData();

  return (
    <Stack spacing={2} sx={{ pt: 2 }}>
      <Text variant="h6" fontWeight="bold" color="white">
        Purchase History
      </Text>

      <GlassBox variant="glass-box" sx={{ py: 2, pr: 2, borderRadius: 1.5, color: 'white' }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={0} sx={{ px: '12px' }}>
            {/* Commented until we develop Game history
            <TabButton
              active={activeTab === 'game_play'}
              onClick={() => setActiveTab('game_play')}
            >
              <Text variant="body2">
                Game Play
              </Text>
            </TabButton>*/}
            <TabButton
              active={activeTab === 'purchases'}
              onClick={() => setActiveTab('purchases')}
            >
              <Text variant="body2">
                Purchases
              </Text>
            </TabButton>
          </Stack>
          <StyledTableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableCell
                      key={header}
                      variant='head'
                      sx={{
                        width: 'max-content',
                        whiteSpace: 'nowrap',
                        fontSize: '0.65rem',
                        padding: '8px 4px'
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {!!rows.length ? (
                  rows.map((item, idx) => (
                  activeTab === 'purchases' ? (
                    <TableRow key={(item as Receipt).transactionId}>
                      <TableCell sx={{ width: 'max-content', whiteSpace: 'nowrap', padding: '6px 4px' }}>
                        <Text variant="body2" fontSize="0.65rem">
                          {(item as Receipt).createdAt ? new Date((item as Receipt).createdAt).toLocaleDateString() : '-'}
                        </Text>
                      </TableCell>
                      <TableCell sx={{ width: 'max-content', whiteSpace: 'nowrap', padding: '6px 4px' }}>
                        <Text variant="body2" fontSize="0.65rem" fontWeight="bold">
                          {(item as Receipt).amountCents !== undefined && (item as Receipt).currency ? `${((item as Receipt).amountCents / 100).toFixed(2)}` : '-'}
                        </Text>
                      </TableCell>
                      <TableCell sx={{ width: 'max-content', whiteSpace: 'nowrap', padding: '6px 4px' }}>
                        <Text
                          variant="body2"
                          fontSize="0.65rem"
                          color="text.secondary"
                        >
                          {(item as Receipt).type === 'DepositTransaction' ? 'Deposit' : 'Withdrawal'}
                        </Text>
                      </TableCell>
                      <TableCell sx={{ width: 'max-content', whiteSpace: 'nowrap', padding: '6px 4px' }}>
                        <Text variant="body2" fontSize="0.65rem" fontWeight="bold">
                          {(item as Receipt).subProvider === SubProvider.TON ? 'TON' : (item as Receipt).subProvider || '-'}
                        </Text>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={(item as HistoryTransaction).id}>
                      <TableCell sx={{ width: 'max-content', whiteSpace: 'nowrap', padding: '6px 4px' }}>
                        <Text variant="body2" fontSize="0.65rem">
                          {(item as HistoryTransaction).date || '-'}
                        </Text>
                      </TableCell>
                      <TableCell sx={{ width: 'max-content', whiteSpace: 'nowrap', padding: '6px 4px' }}>
                        <Text variant="body2" fontSize="0.65rem" fontWeight="bold">
                          {(item as HistoryTransaction).dailyPlays !== undefined ? (item as HistoryTransaction).dailyPlays : '-'}
                        </Text>
                      </TableCell>
                      <TableCell sx={{ width: 'max-content', whiteSpace: 'nowrap', padding: '6px 4px' }}>
                        <Text variant="body2" fontSize="0.65rem" fontWeight="bold">
                          {(item as HistoryTransaction).raffles !== undefined ? (item as HistoryTransaction).raffles : '-'}
                        </Text>
                      </TableCell>
                      <TableCell sx={{ width: 'max-content', whiteSpace: 'nowrap', padding: '6px 4px' }}>
                        <Text variant="body2" fontSize="0.65rem" fontWeight="bold">
                          {(item as HistoryTransaction).coins !== undefined && (item as HistoryTransaction).coins !== null ? (item as HistoryTransaction).coins?.toLocaleString() : '-'}
                        </Text>
                      </TableCell>
                    </TableRow>
                  )
                ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={headers.length} sx={{ py: 4 }} align="center">
                      <Text variant="body2" component="span" mr={0.5}>
                        {activeTab === 'purchases' ? 'No purchases, yet.' : 'No records found.'}
                      </Text>
                      {activeTab === 'purchases' && (
                        <Link onClick={afterClick} component={RouterLink} href={paths.store}>
                          Visit Store
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Stack>
      </GlassBox>
    </Stack>
  );
};
