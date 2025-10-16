import React from 'react';
type Props = { children: React.ReactNode };

export default async function AppBody({ children }: Props) {
  return (
    <body
      style={{
        backgroundColor: 'black',
        position: 'relative',
        paddingTop: 'env(safe-area-inset-top, 0px)'
      }}
    >
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-MSGD53PH"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      {children}
    </body>
  );
}
