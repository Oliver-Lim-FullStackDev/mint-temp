'use client';

import TelegramLayout from 'src/modules/telegram/layouts/telegram-layout';
import { paths } from 'src/routes/paths';
import { ComingSoon } from '../coming-soon';

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <TelegramLayout>
    <ComingSoon
          title="404"
          description="Ooops! You’ve Slipped on the Ice!"
          image="/assets/background/404-minty-bear.png"
          imageAlt="Minty"
          customWidth="500px"
          customHeight="auto"
          mainDescription="This page is colder than the South Pole. Head back and warm up with some games."
          badgeText='Play & Win'
          badgeBgColor='var(--secondary-main)'
          badgeTextColor='#293C00'
          badgeButtonLink={paths.casinos.root}
        />
    
    </TelegramLayout>
  );
}
