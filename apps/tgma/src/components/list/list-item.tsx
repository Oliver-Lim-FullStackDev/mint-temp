import type { BoxProps, CardProps, Theme } from '@mint/ui/components/core';

import { varAlpha } from '@mint/ui/minimal-shared';
import {
  Box,
  Link,
  Card,
  CardContent
} from '@mint/ui/components/core'

import { RouterLink } from '@mint/ui/minimals/routes/components';
import { AvatarShape } from '@mint/ui/minimals/assets/illustrations';
import { Image } from '@mint/ui/components/image';
import { Iconify } from '@mint/ui/components/iconify';

// ----------------------------------------------------------------------

type IPostItem = {
  id: string;
  title: string;
  imageUrl: string;
  provider: string;
  displayProvider: string;
};

type PostItemProps = CardProps & {
  post: IPostItem;
  detailsHref: string;
};

export function ListItem({ post, detailsHref, sx, ...other }: PostItemProps) {
  return (
    <Card sx={sx} {...other}>
      <Box sx={{ position: 'relative' }}>
        <AvatarShape
          sx={{
            left: 0,
            zIndex: 9,
            width: 88,
            height: 36,
            bottom: -16,
            position: 'absolute',
          }}
        />

        {/*<Avatar
          alt={post.author.name}
          src={post.author.avatarUrl}
          sx={{
            left: 24,
            zIndex: 9,
            bottom: -24,
            position: 'absolute',
          }}
        />*/}

        <Image alt={post.title} src={post.imageUrl} ratio="4/3" />
      </Box>

      <CardContent sx={{ pt: 6 }}>
        <Link
          component={RouterLink}
          href={detailsHref}
          color="inherit"
          variant="subtitle2"
          sx={(theme: Theme) => ({
            ...theme.mixins.maxLine({ line: 2, persistent: theme.typography.subtitle2 }),
          })}
        >
          {post.title}
        </Link>

        <InfoBlock
          provider={post.displayProvider}
        />
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

type PostItemLatestProps = {
  post: IPostItem;
  index: number;
  detailsHref: string;
};

export function PostItemLatest({ post, index, detailsHref }: PostItemLatestProps) {
  const postSmall = index === 1 || index === 2;

  return (
    <Card>
      {/*<Avatar
        alt={post.author.name}
        src={post.author.avatarUrl}
        sx={{
          top: 24,
          left: 24,
          zIndex: 9,
          position: 'absolute',
        }}
      />*/}

      <Image
        alt={post.title}
        src={post.imageUrl}
        ratio="4/3"
        sx={{ height: 360 }}
        slotProps={{
          overlay: {
            sx: (theme) => ({
              bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.64),
            }),
          },
        }}
      />

      <CardContent
        sx={{
          width: 1,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }}
      >
        {/*<Typography variant="caption" component="div" sx={{ mb: 1, opacity: 0.64 }}>
          {fDate(post.createdAt)}
        </Typography>*/}

        <Link
          component={RouterLink}
          href={detailsHref}
          color="inherit"
          variant={postSmall ? 'subtitle2' : 'h5'}
          sx={(theme: Theme) => ({
            ...theme.mixins.maxLine({
              line: 2,
              persistent: postSmall ? theme.typography.subtitle2 : theme.typography.h5,
            }),
          })}
        >
          {post.title}
        </Link>

        <InfoBlock
          provider={post.displayProvider}
          sx={{ opacity: 0.64, color: 'common.white' }}
        />
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

type InfoBlockProps = BoxProps & Pick<IPostItem, 'provider'>;

function InfoBlock({ sx, provider, ...other }: InfoBlockProps) {
  return (
    <Box
      sx={[
        () => ({
          mt: 3,
          gap: 1.5,
          display: 'flex',
          typography: 'caption',
          color: 'text.disabled',
          justifyContent: 'flex-end',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
        <Iconify width={16} icon="solar:eye-bold" />
        {provider}
      </Box>
    </Box>
  );
}
