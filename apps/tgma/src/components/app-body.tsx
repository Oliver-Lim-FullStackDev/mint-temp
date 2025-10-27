import React from 'react';
import { TelegramSafeTop } from 'src/modules/telegram/components/telegram-safe-top';

type Props = { children: React.ReactNode };

export default async function AppBody({ children }: Props) {
  return (
    <body
      style={{
        backgroundColor: 'black',
        position: 'relative',
      }}
      data-tg={1}
    >
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-MSGD53PH"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      <TelegramSafeTop />

      {children}
    </body>
  );
}
