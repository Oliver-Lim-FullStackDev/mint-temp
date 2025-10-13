// 'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { GlassBox, Text } from '@mint/ui/components';
import { Box, Stack } from '@mint/ui/components/core';
import { Table, TableBody, TableCell, TableRow } from '@mint/ui/components/table';
import { Iconify } from '@mint/ui/components/iconify';

type RewardMap = Record<string, number>;

type MultiplierRow = {
  key: string;
  label: string;
  multiplier: number;
  imageUrl: string;
};

type WinComboRow = {
  key: string;
  label: string;
  imageUrl: string;
  rewards: RewardMap;
  special?: boolean;
};

type Visuals = {
  multipliers: MultiplierRow[];
  winCombos: WinComboRow[];
};

type Props =
  | { config: { visuals: Visuals } } // accepts full slotGameConfig
  | { config: Visuals };             // or just visuals

// Trim trailing ".0" and redundant zeros from decimals
function trimTrailingZeroDecimal(n: number): string {
  const s = String(n);
  return s.endsWith('.0') ? s.slice(0, -2) : s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

function renderCurrencyIcon(code: string) {
  if (code === 'MBX') return <Iconify icon="mint:buck-icon" width={24} />;
  if (code === 'XPP') return <Image alt="XP" src="/assets/icons/components/ic-xp.svg" width={20} height={20} />;
  if (code === 'RTP') return <Iconify icon="mint:raffle-ticket-icon" width={24} />;
  return null;
}

export function MintGameSlotsWinsTable(props: Props) {
  const visuals: Visuals = 'visuals' in props.config ? props.config.visuals : (props.config as Visuals);

  const rows = useMemo<WinComboRow[]>(() => visuals?.winCombos ?? [], [visuals]);

  // Collect all reward codes in consistent order: MBX first, then RTP, then XPP
  const codes = useMemo(() => {
    // Define the preferred order
    const preferredOrder = ['MBX', 'RTP', 'XPP'];
    const acc: string[] = [];
    const seen = new Set<string>();

    // First add currencies in preferred order if they exist
    preferredOrder.forEach(currency => {
      for (const r of rows) {
        if (r.rewards?.[currency] && Number(r.rewards[currency]) !== 0 && !seen.has(currency)) {
          seen.add(currency);
          acc.push(currency);
          break;
        }
      }
    });

    // Then add any remaining currencies in first-seen order
    for (const r of rows) {
      for (const [k, v] of Object.entries(r.rewards ?? {})) {
        if (!seen.has(k) && Number(v ?? 0) !== 0) {
          seen.add(k);
          acc.push(k);
        }
      }
    }
    return acc;
  }, [rows]);

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {/* Multipliers strip (one fluid row, 0.5 gap) */}
      {!!visuals?.multipliers?.length && (
        <Box
          display="flex"
          gap={0.5}
          flexWrap="nowrap"
          sx={{ pb: 0.5 }}
        >
          {visuals.multipliers.map((m) => {
            const mult = trimTrailingZeroDecimal(m.multiplier);
            return (
              <GlassBox
                key={m.key}
                variant="glass"
                sx={{
                  px: 1,
                  py: 0.75,
                  borderRadius: 1.5,
                  display: 'flex',
                  justifyContent: 'center',
                  flex: '1 1 0',     // equal widths
                  minWidth: 0,       // prevent overflow issues
                }}
              >
                <Stack alignItems="center" textAlign="center">
                  <Image alt={m.label} src={m.imageUrl} width={24} height={24} />
                  <Text variant="caption" color="primary">{m.label}</Text>
                  <Text variant="h3">{mult}x</Text>
                </Stack>
              </GlassBox>
            );
          })}
        </Box>
      )}

      {/* Symbols table */}
      <GlassBox variant="glass" sx={{ px: 1, py: 0.5, borderRadius: 1.5, color: 'white' }}>
        <Table size="small" sx={{ tableLayout: 'auto', width: '100%' }}>
          <colgroup>
            <col /> {/* Left column grows as needed */}
            {codes.map((c) => (
              <col key={c} style={{ width: '1px' }} />
            ))}
          </colgroup>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                {/* Left: icon + label (50%) */}
                <TableCell sx={{ px: 0.5, py: 0.5, whiteSpace: 'nowrap' }}>
                  <Box display="flex" alignItems="center" gap={1} overflow="hidden">
                    <Image alt={row.label} src={row.imageUrl} width={24} height={24} />
                    <Text
                      variant="caption"
                      sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        display: 'inline-block',
                      }}
                    >
                      {row.label}
                    </Text>
                  </Box>
                </TableCell>

                {/* Right: reward columns (aligned vertically) */}
                {codes.map((code) => {
                  const raw = row.rewards?.[code];
                  return (
                    <TableCell
                      key={code}
                      sx={{
                        px: 0.5,
                        py: 0.5,
                        whiteSpace: 'nowrap',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                      title={code}
                    >
                      {raw ? (
                        <Box display="inline-flex" alignItems="center" gap={0.5}>
                          {/* fixed-width icon box so numbers align perfectly across rows */}
                          <Box
                            sx={{ width: 24, display: 'inline-flex', justifyContent: 'center' }}
                            aria-hidden
                          >
                            {renderCurrencyIcon(code)}
                          </Box>
                          <Text variant="caption">{raw}</Text>
                        </Box>
                      ) : (
                        // keep empty cell for column alignment
                        <Box />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassBox>
    </Box>
  );
}
