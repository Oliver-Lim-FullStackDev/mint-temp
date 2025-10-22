import type { Metadata } from 'next';

import { SportsView } from './view';

export const metadata: Metadata = {
  title: 'Mint.io | Sports',
  description:
    'MINT Sportsbook',
};


export default function Page() {
  return <SportsView />;
}
