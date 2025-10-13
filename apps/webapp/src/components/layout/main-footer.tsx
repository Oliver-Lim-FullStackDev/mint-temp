import type { ReactNode } from 'react';
import type { BoxProps } from '@mint/ui/components/core';

import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mint/ui/components/core';
import { Iconify } from '@mint/ui/components/iconify';

type FooterLink = {
  label: string;
  href?: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

type FooterSocialLink = {
  id: string;
  href: string;
  'aria-label': string;
  icon?: ReactNode;
};

export type MainFooterProps = {
  sections?: FooterSection[];
  socialLinks?: FooterSocialLink[];
  disclaimer?: ReactNode;
  logo?: ReactNode;
  sx?: BoxProps['sx'];
};

const DEFAULT_SECTIONS: FooterSection[] = [
  {
    title: 'Casino',
    links: [
      { label: 'Casino' },
      { label: 'Live Casino' },
      { label: 'Predictions' },
      { label: 'Promotions' },
    ],
  },
  {
    title: 'Sports',
    links: [
      { label: 'Sports' },
      { label: 'Live' },
      { label: 'Event Builder' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Provably Fair' },
      { label: 'Partner Program' },
      { label: 'Responsible Gambling' },
      { label: 'Help Center' },
      { label: 'Live Support' },
    ],
  },
  {
    title: 'About Us',
    links: [
      { label: 'Policies' },
      { label: 'Licenses' },
      { label: 'Terms & Conditions' },
    ],
  },
];

const DEFAULT_SOCIAL_LINKS: FooterSocialLink[] = [
  {
    id: 'x',
    href: '#',
    'aria-label': 'Open Mint.io on X',
    icon: <Iconify icon="mingcute:twitter-fill" width={24} height={24} />,
  },
  {
    id: 'youtube',
    href: '#',
    'aria-label': 'Open Mint.io on Telegram',
    icon: <Iconify icon="mingcute:youtube-fill" width={24} height={24} />,
  },
  {
    id: 'discord',
    href: '#',
    'aria-label': 'Open Mint.io on Discord',
    icon: <Iconify icon="mingcute:discord-fill" width={24} height={24} />,
  },
  {
    id: 'instagram',
    href: '#',
    'aria-label': 'Open Mint.io on Instagram',
    icon: <Iconify icon="mingcute:instagram-fill" width={24} height={24} />,
  },
  {
    id: 'linkedin',
    href: '#',
    'aria-label': 'Open Mint.io on Linkedin',
    icon: <Iconify icon="mingcute:linkedin-fill" width={24} height={24} />,
  },
];

const DEFAULT_DISCLAIMER = `You understand that you are providing information to Sage Shark Ltd. The information you provide will only be used to administer mint.io. NO PURCHASE NECESSARY. Void Where Prohibited By Law. Sage Shark Ltd. 18+

Copyright © 2024-25 mint.io. All rights reserved. Mint.io is operated by Sage Shark Ltd. having an address at San Jose, Costa Rica. The promotions are sponsored by Sage Shark Ltd. All payments are processed by Sage Shark Ltd.

Gameplay may be harmful. Please play responsibly.`;

function DefaultFooterLogo() {
  return (
    <Box
      role="img"
      aria-label="Mint.io logo"
      sx={{
        width: { xs: 80, sm: 96, md: 110 },
        height: { xs: 18, sm: 20, md: 22.5 },
      }}>
      <img
        alt="Full logo"
        src='./logo/v2-full-logo.svg'
        width="auto"
        height="40px"
      />
    </Box>
  );
}

function renderDisclaimer(disclaimer?: ReactNode) {
  if (disclaimer) {
    return disclaimer;
  }

  return (
    <Typography
      variant="body2"
      sx={{
        width: '100%',
        color: 'var(--nav-color-text-secondary, rgba(150, 154, 160, 1))',
        fontSize: 12,
        lineHeight: '18px',
        textAlign: { xs: 'center', md: 'left' },
        whiteSpace: 'pre-line',
      }}
    >
      {DEFAULT_DISCLAIMER}
    </Typography>
  );
}

export function MainFooter({
  sections = DEFAULT_SECTIONS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  disclaimer,
  logo,
  sx,
}: MainFooterProps) {
  return (
    <Box
      component="footer"
      sx={[
        {
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          px: { xs: 2, md: 5, lg: 8 },
          pt: { xs: 6, md: 10 },
          pb: {
            xs: 'calc(96px + env(safe-area-inset-bottom, 0px))',
            md: 'calc(140px + env(safe-area-inset-bottom, 0px))',
          },
          boxSizing: 'border-box',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(1, 6, 12, 0) 0%, rgba(1, 6, 12, 0.5) 100%)',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Container
        disableGutters
        maxWidth="xl"
        sx={{ width: '100%' }}
      >
        <Stack spacing={{ xs: 6, md: 8 }} alignItems="stretch">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={4}
          >
            {logo ?? <DefaultFooterLogo />}

            <Stack direction="row" spacing={1} alignItems="center">
              {socialLinks.map((social) => (
                <IconButton
                  key={social.id}
                  component="a"
                  href={social.href}
                  aria-label={social['aria-label']}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2.5,
                    backgroundColor: 'rgba(145, 158, 171, 0.12)',
                    color: 'var(--p-contrast-text)',
                    boxShadow: '0px 0px 16px rgba(0, 241, 203, 0.1)',
                    transition: 'background-color 0.2s ease, transform 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 241, 203, 0.24)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Stack>

          <Box
            component="nav"
            aria-label="Footer navigation"
            sx={{
              width: '100%',
              display: { xs: 'grid', md: 'flex' },
              gap: { xs: 4, md: 6 },
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(2, minmax(0, 1fr))',
              },
              flexWrap: { md: 'wrap' },
              justifyContent: { md: 'space-between'},
            }}
          >
            {sections.map((section) => (
              <Stack
                key={section.title}
                spacing={1.5}
                sx={{
                  minWidth: { md: 160 },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'var(--p-contrast-text)',
                    fontWeight: 600,
                    fontSize: 18,
                    lineHeight: '28px',
                  }}
                >
                  {section.title}
                </Typography>

                <Stack spacing={1.25} alignItems="flex-start">
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href ?? '#'}
                      underline="hover"
                      sx={{
                        color: 'var(--nav-color-text-secondary, rgba(150, 154, 160, 1))',
                        fontSize: 14,
                        lineHeight: '22px',
                        fontWeight: 400,
                        transition: 'color 0.2s ease',
                        '&:hover': {
                          color: 'var(--p-contrast-text)',
                        },
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Box>

          <Box display="flex" justifyContent="center" width="100%">
            {renderDisclaimer(disclaimer)}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
