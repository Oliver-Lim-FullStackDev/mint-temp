/**
 * Export additional UI libs and components
 * Avoids multi-version compatibility issues
 */


export { LoadingButton } from '@mui/lab';

export { styled } from '@mui/material/styles';

export { varAlpha } from 'minimal-shared/utils';

export { Typography } from './components/typography';


// Custom Components
export { iconButtonClasses } from '@mui/material/IconButton';

// Custom Typography with color configuration


export { clamp, debounce, merge, throttle } from 'es-toolkit';

export { GlassDialog } from './components/glass-dialog/glass-dialog';

// Custom Components
export { GlassBox } from '../../../apps/webapp/src/components/glass-box';
export { GlassCard } from '../../../apps/webapp/src/components/glass-card';

export { StyledTableContainer, TabButton, type TabType } from '../../../apps/webapp/src/components/table';

// esToolkit (export only what we actually use)
export { Avatar, Box, CircularProgress, Divider, Table, TableCell, TableHead, TableRow } from '@mui/material';
// Emotion React (tree-shakable named exports)
export {
  css, Global, jsx, keyframes, ThemeContext, ThemeProvider, useTheme, withTheme
} from '@emotion/react';

export { Button, Dialog, FormControl, InputLabel, LinearProgress, Select, Stack, Switch, TableContainer, TablePagination } from '@mui/material';
export { AnimatePresence, m, motion, useAnimation, useInView, useMotionValue, useTransform } from 'framer-motion';

// Minimal Shared Lib (export only what we actually use)
export { Alert, Card, Checkbox, Chip, Container, DialogContent, Drawer, Grid, IconButton, InitColorSchemeScript, InputAdornment, Link, MenuItem, MenuList, Paper, Skeleton, TableBody, TableSortLabel, useColorScheme, useMediaQuery } from '@mui/material';
// Framer Motion (named exports only for tree-shaking)
export type { CardProps } from '@mui/material';
export type { GlassDialogProps } from './components/glass-dialog/glass-dialog';

export type { BoxProps, Breakpoint, ButtonProps, DialogProps, IconButtonProps, SlideProps, SxProps, TablePaginationProps, TableRowProps, Theme, TypographyProps } from '@mui/material';
export type { GlassBoxProps, GlassBoxVariant } from '../../../apps/webapp/src/components/glass-box';
export type { GlassCardProps } from '../../../apps/webapp/src/components/glass-card';

