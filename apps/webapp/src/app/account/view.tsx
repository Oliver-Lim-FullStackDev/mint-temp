'use client';

import { AccountInfoArea, type TabData } from 'src/modules/account/components/account-info-area';
import AccountSecurity from 'src/modules/account/components/account-info-area/sections/account-sections/account-security';
import ProfileInformation from 'src/modules/account/components/account-info-area/sections/account-sections/profile-information';
import ResponsibleGaming from 'src/modules/account/components/account-info-area/sections/account-sections/responsible-gaming';
import AffiliateProgram from 'src/modules/account/components/account-info-area/sections/affiliate-sections/affiliate-program';
import TransactionHistory from 'src/modules/account/components/account-info-area/sections/transactions-sections/transaction-history';
import { useUIStore } from 'src/modules/ui/ui-store';
import { paths } from 'src/routes/paths';
import { Container } from '@mint/ui/components/core';
import { useRouter } from 'next/navigation';


export default function AccountPageView() {
  const router = useRouter();
  const { accountSelectedTab, setAccountTab } = useUIStore();

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setAccountTab(tabId);
    if (tabId === 'account') {
      // For the default account tab, just go to /account without hash
      router.push(paths.account, { scroll: false });
    } else {
      // For other tabs, add the hash
      router.push(`${paths.account}#${tabId}`, { scroll: false });
    }
  };

  const accountTabs: TabData[] = [
    {
      id: 'account',
      label: 'Account',
      sections: [
        {
          id: 'account-security',
          title: 'Account and Security',
          icon: 'account-dropdown:mint-icon',
          content: <AccountSecurity />,
        },
        {
          id: 'responsible-gaming',
          title: 'Responsible Gaming',
          icon: 'account-responsible-section:mint-icon',
          content: <ResponsibleGaming />,
        },
        {
          id: 'profile-information',
          title: 'Profile Information',
          icon: 'account-notification-section:mint-icon',
          content: <ProfileInformation />,
        },
      ],
    },
    {
      id: 'affiliate',
      label: 'Affiliate',
      sections: [
        {
          id: 'affiliate-program',
          title: 'Affiliate Program',
          icon: 'affiliate-dropdown:mint-icon',
          content: <AffiliateProgram />,
        },
      ],
    },
    {
      id: 'transactions',
      label: 'Transactions',
      sections: [
        {
          id: 'transaction-history',
          title: 'Transaction History',
          icon: 'transactions-dropdown:mint-icon',
          content: <TransactionHistory />,
        },
      ],
    },
  ];

  return (
    <Container disableGutters maxWidth="xl" sx={{ p: 2, minHeight: '100vh' }}>
      <AccountInfoArea
        title="Account"
        tabs={accountTabs}
        defaultActiveTab={accountSelectedTab}
        onTabChange={handleTabChange}
        key={accountSelectedTab}
      />
    </Container>
  );
}
