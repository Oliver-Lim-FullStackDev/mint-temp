import { Box } from '@mint/ui/components/core';

/**
 * AppBackground
 *
 * Abstract glowing teal background, responsive for desktop, tablet, and mobile.
 * Renders softly blurred gradient blobs positioned absolutely behind all content.
 *
 * Use by wrapping your layout:
 *
 * <div className="relative overflow-hidden min-h-screen bg-black">
 *   <AppBackground />
 *   <YourMainContent />
 * </div>
 */
export function AppBackground() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: 'black',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <Box
        component="img"
        src="assets/background/mountain-bg.png"
        alt="Background gradient"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </Box>
  );
}
