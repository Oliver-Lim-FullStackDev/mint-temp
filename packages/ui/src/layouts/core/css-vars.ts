import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function layoutSectionVars(theme: Theme) {
  return {
    // Z-index hierarchy
    '--layout-nav-zIndex': theme.zIndex.appBar,
    '--layout-header-zIndex': 10000, // Main header section
    '--layout-navbar-header-zIndex': 10001, // Navbar header
    '--layout-footer-menu-zIndex': 9999, // Footer menu
    '--layout-main-section-zIndex': 1, // Main content section
    '--layout-modal-zIndex': 10003, // Modals (higher than footer and drawer)
    '--layout-account-drawer-zIndex': 10002, // Account drawer (highest priority)

    // Layout dimensions
    '--layout-nav-mobile-width': '288px',
    '--layout-header-blur': '8px',
    '--layout-header-mobile-height': '64px',
    '--layout-header-desktop-height': '72px',
    '--layout-footer-menu-padding': '60px',
  };
}
