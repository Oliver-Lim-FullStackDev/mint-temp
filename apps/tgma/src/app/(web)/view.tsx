'use client';

import Link from 'next/link';
import { Text } from '@mint/ui/components';
import { paths } from '@/routes/paths';
import { ComingSoon } from '@/components/coming-soon';

export function HomeView() {
  return (
    <ComingSoon
      title="$MINT"
      description="$MINT is Dropping Soon, Lock In Your Share!"
      image="/assets/background/home-page-coming-soon.png"
      imageAlt="Minty"
      customWidth="500px"
      customHeight="auto"
      badgeText="Launching Soon"
    >
      <Text variant="body3" centered color="#FFFFFF">
        Every bet you place with MintBucks in the casino pushes your XP higher. The bigger you wager, the bigger the risk — and the more XP you stack! When TGE hits, XP = allocation.
      </Text>
      <Text variant="body3" centered color="#FFFFFF">
        This page will soon show your haul. For now? Keep spinning, keep risking, keep stacking, keep sharing.
      </Text>
      <Text fontWeight="bold" variant="body3" centered color="#FFFFFF"
        sx={{
          mb: 2,
        }}
      >
        Play harder, earn more, lock in a bigger slice of $MINT.
      </Text>
      <Text variant="body3">
        In the meantime why not check out &nbsp;
        <Link style={{ textDecoration: "none", fontWeight: 800, color: 'var(--p-main)' }} href={paths.casinos.details('minty-spins')}>
          <span>
            Minty Spins
          </span>
        </Link>
      </Text>
    </ComingSoon>
  )
}
