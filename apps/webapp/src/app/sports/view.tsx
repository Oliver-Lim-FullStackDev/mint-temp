import { apiFetch } from '@mint/client';
import { EmptyContent } from '@mint/ui/components';
import { Container } from '@mint/ui/components/core';
import Betby from 'src/modules/sportsbook/components/betby';

export async function SportsView() {
  let response;
  try {
    response = await apiFetch('/sportsbook/auth');
  } catch (err: unknown) {
    console.info('Error loading sportsbook configuration')
  }

  if (!response) {
    return <EmptyContent filled title="Sportsbook under development..." />
  }

  const {
    token,
    scriptUrl,
    brandId,
    themeName,
  } = response;

  return (
    <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Betby
        scriptUrl={scriptUrl}
        brandId={brandId}
        themeName={themeName}
        token={token}
        // Optional cosmetics (kept close to your original props)
        cssUrls={[
          'https://fonts.googleapis.com/css2?family=Exo:wght@600;700;800;900&family=Inter:wght@400;500;600&display=swap',
        ]}
        fontFamilies={['"Exo"', '"Inter"', 'Helvetica', 'Arial', 'sans-serif']}
        lang="en"
        stickyTop={64}
        betSlipOffsetTop={64 + 70}
        betSlipOffsetBottom={16}
        betSlipZIndex={40}
        onBannerClick={(data) => {
          const link = data?.link;
          if (!link) return;
          if (data.customAction) {
            // internal nav
            window.history.pushState({}, '', link);
          } else {
            window.open(link, '_blank');
          }
        }}
        onLogin={() => (window.location.href = '/?login')}
        onRecharge={() => (window.location.href = '/?deposit')}
        onRegister={() => (window.location.href = '/?register')}
        onSessionRefresh={() => window.location.reload()}
        onTokenExpired={async () => {
          // (Optional) refresh JWT client-side; small, contained client work
          const token = await apiFetch('/my/betby_jwt_token');
          return token;
        }}
        style={{ minHeight: 800, width: '100%' }}
      />
    </Container>
  )
}
