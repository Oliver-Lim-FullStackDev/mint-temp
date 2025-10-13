const ROOTS = {
  AUTH: '/auth',
  CASINOS: '/casinos',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  casinos: {
    root: ROOTS.CASINOS,
    details: (id: string) => `${ROOTS.CASINOS}/${id}`,
  },
  rankings: '/rankings',
  earn: '/earn',
  store: '/store',

  support: '/support',
  about: '/about-us',
  contact: '/contact-us',

  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',

  // AUTH
  auth: {
    signIn: '/sign-in',
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
  },

  // DASHBOARD TODO for v2.0
  /* dashboard: {
    root: ROOTS.DASHBOARD,
    topup: `${ROOTS.DASHBOARD}/top-up`,
    referrals: `${ROOTS.DASHBOARD}/referrals`,

    account: {
      root: `${ROOTS.DASHBOARD}/account`,
      profile: `${ROOTS.DASHBOARD}/account/profile`,
      wallets: `${ROOTS.DASHBOARD}/account/wallets`,
      history: `${ROOTS.DASHBOARD}/account/history`,
      transactions: `${ROOTS.DASHBOARD}/account/transactions`,
      // not sure we'll need this yet
      // edit: (id: string) => `${ROOTS.DASHBOARD}/account/${id}/edit`,
    }
  }*/
};
