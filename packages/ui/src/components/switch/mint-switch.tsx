import type { SwitchProps as MuiSwitchProps } from '@mui/material';

import { Switch as MuiSwitch } from '@mui/material';

export interface MintSwitchProps extends MuiSwitchProps {
  /**
   * The color of the switch when checked
   * @default '#00F1CB'
   */
  checkedColor?: string;
}

/**
 * Reusable Mint-themed Switch component
 * Pre-styled with the Mint color scheme (#00F1CB for checked state)
 *
 * @example
 * ```tsx
 * <MintSwitch
 *   checked={isEnabled}
 *   onChange={(e) => setIsEnabled(e.target.checked)}
 * />
 *
 * // With custom color
 * <MintSwitch
 *   checked={isEnabled}
 *   onChange={(e) => setIsEnabled(e.target.checked)}
 *   checkedColor="#FF5733"
 * />
 * ```
 */
export function MintSwitch({ checkedColor = '#00F1CB', sx, ...props }: MintSwitchProps) {
  return (
    <MuiSwitch
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: checkedColor,
          '& + .MuiSwitch-track': {
            backgroundColor: checkedColor,
          },
        },
        '& .MuiSwitch-switchBase.Mui-disabled': {
          color: 'rgba(255, 255, 255, 0.3)',
          '& + .MuiSwitch-track': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
}

