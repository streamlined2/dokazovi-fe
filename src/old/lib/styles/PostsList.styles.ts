import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { SCREEN_BREAKPOINTS } from 'styles/theme';

export const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      masonryGrid: {
        display: 'flex',
        width: '100%',
      },
      masonryColumn: {
        marginRight: theme.spacing(2),
        '&:last-of-type': {
          margin: 0,
        },
      },
      masonryItem: {
        marginBottom: theme.spacing(2),
      },
    }),
  { name: 'PostsList' },
);

export const MASONRY_BREAKPOINTS = {
  default: 3,
  [SCREEN_BREAKPOINTS.md]: 2,
  [SCREEN_BREAKPOINTS.sm]: 1,
};
