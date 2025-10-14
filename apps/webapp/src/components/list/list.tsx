import {
  Box,
  Grid,
  Stack,
  Button,
  CircularProgress } from '@mint/ui';
import { paths } from '@/routes/paths';

import { ListItemSkeleton } from './list-skeleton';
import { ListItem, PostItemLatest } from './list-item';

// ----------------------------------------------------------------------

type Props = {
  posts: IPostItem[];
  loading?: boolean;
};

type IPostItem = {
  id: string;
  title: string;
  imageUrl: string;
  provider: string;
  displayProvider: string;
};

export function List({ posts, loading }: Props) {
  const renderLoading = () => (
    <Box
      sx={{
        gap: 3,
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
      }}
    >
      <ListItemSkeleton />
    </Box>
  );

  const renderList = () => (
    <Grid container spacing={3}>
      {posts.slice(0, 3).map((post, index) => (
        <Grid
          key={post.id}
          sx={{ display: { xs: 'none', lg: 'block' } }}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: index === 0 ? 6 : 3,
          }}
        >
          <PostItemLatest post={post} index={index} detailsHref={paths.casinos.details(post.title)} />
        </Grid>
      ))}

      {posts.slice(0, 3).map((post) => (
        <Grid
          key={post.id}
          sx={{ display: { lg: 'none' } }}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
          }}
        >
          <ListItem post={post} detailsHref={paths.casinos.details(post.title)} />
        </Grid>
      ))}

      {posts.slice(3, posts.length).map((post) => (
        <Grid
          key={post.id}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
          }}
        >
          <ListItem post={post} detailsHref={paths.casinos.details(post.title)} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      {loading ? renderLoading() : renderList()}

      {posts.length > 8 && (
        <Stack sx={{ mt: 8, alignItems: 'center' }}>
          <Button
            size="large"
            variant="outlined"
            startIcon={<CircularProgress size={18} color="inherit" />}
          >
            Load more
          </Button>
        </Stack>
      )}
    </>
  );
}
