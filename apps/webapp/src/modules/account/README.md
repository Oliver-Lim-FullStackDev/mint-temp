# Account Module

This module provides a comprehensive account management system with modular components for displaying user profile information, streak data, and transaction history.

## Features

### 📊 Profile Summary
- User avatar and username display
- Games played and wins statistics
- XP level progress with visual progress bar
- Game resources (spins, coins, raffle tickets)

### 🔥 Streak Information
- Current streak counter with visual badge
- Streak rewards display
- Claim functionality for streak rewards
- Best streak tracking

### 📈 Transaction History
- Tabular display of recent transactions
- Transaction type categorization (Game Play, Purchase, Raffle, Reward)
- Daily plays, raffles, and coins tracking
- Responsive table design

## Components

### `ProfileSummary`
Displays user profile information including avatar, stats, XP progress, and resources.

```tsx
import { ProfileSummary } from 'src/modules/account/components';

<ProfileSummary apiConfig={customApiConfig} />
```

### `StreakInfo`
Shows current streak information with claim functionality.

```tsx
import { StreakInfo } from 'src/modules/account/components';

<StreakInfo apiConfig={customApiConfig} />
```

### `HistoryTransactions`
Displays transaction history in a table format.

```tsx
import { HistoryTransactions } from 'src/modules/account/components';

<HistoryTransactions maxRows={5} apiConfig={customApiConfig} />
```

## Hooks

### `useAccountData`
Main hook for fetching all account data.

```tsx
import { useAccountData } from 'src/modules/account/hooks/useAccountData';

const { data, isLoading, error } = useAccountData({
  baseUrl: 'https://api.example.com',
  endpoints: {
    profile: '/user/profile',
    xp: '/user/xp',
    resources: '/user/resources',
    streak: '/user/streak',
    history: '/user/history',
  },
});
```

### Specialized Hooks
- `useProfileStats` - Profile statistics only
- `useXPInfo` - XP and level information
- `useGameResources` - Spins, coins, raffle tickets
- `useStreakInfo` - Streak data and rewards
- `useAccountHistory` - Transaction history

## API Configuration

The module is designed to be API-agnostic. You can configure the endpoints and base URL:

```tsx
const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  endpoints: {
    profile: '/api/account/profile',
    xp: '/api/account/xp',
    resources: '/api/account/resources',
    streak: '/api/account/streak',
    history: '/api/account/history',
  },
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
};
```

## Data Types

### `ProfileStats`
```tsx
interface ProfileStats {
  gamesPlayed: number;
  wins: number;
  profilePicture?: string;
  username: string;
}
```

### `XPInfo`
```tsx
interface XPInfo {
  currentLevel: number;
  currentXP: number;
  maxXP: number;
  levelProgress: number; // percentage 0-100
}
```

### `GameResources`
```tsx
interface GameResources {
  spins: number;
  coins: number;
  raffleTickets: number;
}
```

### `StreakInfo`
```tsx
interface StreakInfo {
  currentStreak: number;
  maxStreak: number;
  streakReward?: {
    type: 'coins' | 'spins' | 'tickets' | 'raffles';
    amount: number;
  };
  canClaim: boolean;
}
```

### `HistoryTransaction`
```tsx
interface HistoryTransaction {
  id: string;
  date: string;
  type: 'game_play' | 'purchase' | 'raffle' | 'reward';
  description: string;
  dailyPlays?: number;
  raffles?: number;
  coins?: number;
}
```

## Styling

The components use Material-UI (MUI) with custom styled components:
- Dark theme with gradient backgrounds
- Responsive design
- Loading states with skeletons
- Consistent spacing and typography
- Custom color schemes for different transaction types

## Integration

The module is integrated into the main account drawer at `/layouts/components/account-drawer.tsx`. The drawer displays all three sections:

1. Profile Summary (top)
2. Streak Information (middle)
3. Transaction History (bottom)

## Development

### Mock Data
The module includes comprehensive mock data for development and testing. The mock data matches the Figma design specifications.

### Error Handling
All hooks include proper error handling and loading states.

### Performance
The module uses React Query for efficient data fetching with:
- 5-minute stale time
- 10-minute garbage collection time
- Automatic refetching on window focus

## Future Enhancements

- Real-time updates for streak and resources
- Pagination for transaction history
- Export functionality for transaction data
- Advanced filtering and sorting options
- Push notifications for streak rewards
- Achievement system integration
