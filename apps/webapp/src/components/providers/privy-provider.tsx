'use client';

import { PrivyClientConfig, PrivyProvider } from '@privy-io/react-auth';

const MINT_LOGO = `${process.env.NEXT_PUBLIC_MINT_URL}/logo/logo-full.svg`;
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;


export default function PrivyProviders({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={PRIVY_APP_ID}
            config={PRIVY_CONFIG}
        >
            {children}
        </PrivyProvider>
    );
}


const PRIVY_CONFIG : PrivyClientConfig = {
    "appearance": {
        "accentColor": "#ffffff",
        "theme": "#07141a",
        "showWalletLoginFirst": false,
        "logo": MINT_LOGO,
        "walletChainType": "ethereum-only",
        "walletList": [
            "detected_ethereum_wallets",
            "metamask",
            "coinbase_wallet",
            "base_account",
            "rainbow",
            "wallet_connect"
        ]
    },
    "loginMethods": [
        "email",
        "google",
        "apple",
        "telegram",
    ],
    "fundingMethodConfig": {
        "moonpay": {
            "useSandbox": true
        }
    },
    "embeddedWallets": {
        "showWalletUIs": true,
        "ethereum": {
            "createOnLogin": "users-without-wallets"
        },
    },
    "mfa": {
        "noPromptOnMfaRequired": false
    },
}