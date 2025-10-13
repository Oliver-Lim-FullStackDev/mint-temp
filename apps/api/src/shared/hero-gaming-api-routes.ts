/**
 * Constants for Hero Gaming API endpoints
 */
export const HeroGamingApiRoutes = {
  /**
   * Endpoint for user registration
   */
  register: '/register',
  /**
   * Endpoint for session creation
   */
  session: '/session',
  /**
   * Endpoint for session creation
   */
  me: '/me',
  /**
   * Endpoint for game search
   */
  gamesSearch: `/games/search`,
  /**
   * Endpoint for game details
   */
  gameById: (id: string) => `/games/${id}`,
  /**
   * Endpoint for wallet addresses
   */
  walletAddresses: '/wallet_addresses',
  /**
   * Endpoint for specific wallet address
   */
  walletAddressById: (id: string) => `/wallet_addresses/${id}`,
  /**
   * Endpoint for payments/transactions (legacy - replaced by authorize/transfer)
   */
  payments: '/mint/payments',
  /**
   * Endpoint for payment authorization (new two-step flow)
   */
  paymentsAuthorize: '/mint/v2/payments/authorize',
  /**
   * Endpoint for payment transfer (new two-step flow)
   */
  paymentsTransfer: '/mint/v2/payments/transfer',
  /**
   * Endpoint for receipts/transaction history
   */
  receipts: '/receipts',
  /**
   * Endpoint for campaigns/missions
   */
  campaigns: '/ctool/campaigns?show_all=true',
  /**
   * Endpoint for opting into campaigns
   */
  optedInCampaigns: '/my/opted_in_campaigns',
  /**
   * Endpoint for LeaderBoard
   */
  leaderboardCampaigns: '/ctool/campaigns/mint-leaderboard',
  /**
   * Endpoint for user inventory
   */
  inventory: '/inventory',
  /**
   * Endpoint for specific inventory item
   */
  inventoryItem: (id: string) => `/inventory/${id}`,
  /**
   * Mint-specific endpoints
   */
  mint: {
    /**
     * Endpoint for Telegram authentication
     */
    telegramAuth: '/mint/telegram_auth',
    /**
     * Endpoint for Ton authentication
     */
    tonAuth: '/mint/ton_wallet_auth',

    /**
     * Mint Wallet endpoints (FreePlay, MintySpins, Games)
     */
    balance: '/mint/balance',
    debit: '/mint/debit',
    credit: '/mint/credit',

    /**
     * Endpoint for session refresh
     */
    refreshSession: '/mint/sessions/refresh',
  },
  /**
   * Admin endpoints
   */
  admin: {
    /**
     * Endpoint for fetching players (used by partners)
     */
    players: '/central_admin/players',
  },
};
