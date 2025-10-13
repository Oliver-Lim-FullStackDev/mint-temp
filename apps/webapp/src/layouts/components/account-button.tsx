import type { IconButtonProps } from '@mint/ui/components/core';
import { Avatar } from '@mint/ui/components/core';


// ----------------------------------------------------------------------

export type AccountButtonProps = IconButtonProps & {
  photoURL: string;
  displayName: string;
  openAccountDrawer: () => void;
};

export function AccountButton({ photoURL, displayName, sx, openAccountDrawer, ...other }: AccountButtonProps) {
  return (
    <Avatar
      onClick={openAccountDrawer}
      src={photoURL} alt={displayName} sx={{
        width: 32,
        height: 32,
        fontSize: '3rem',
        border: '1px solid var(--primary-blue-main, #00F1CB)',
        fontWeight: 'bold',
        backgroundColor: '#D8D9DB',
        position: 'relative',
        zIndex: 1,
        cursor: 'pointer',
      }}

    >
      {displayName?.charAt(0).toUpperCase()}
    </Avatar>
  );
}
