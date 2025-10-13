import type { Metadata } from 'next';
import { HomeView } from './view';

export const metadata: Metadata = {
  title: 'Mint.io | Get Minted',
  description: '...',
};

export default function Page() {
  return <HomeView />;
}
