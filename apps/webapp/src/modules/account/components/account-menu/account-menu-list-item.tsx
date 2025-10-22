import { Text } from '@mint/ui/components';
import { Divider, MenuItem } from '@mint/ui/components/core';
import { alpha, useTheme } from '@mint/ui/components/core/styles';
import { Iconify } from '@mint/ui/components/iconify';
import { MenuItemData } from './account-menu-list';

export default function AccountMenuListItem({ item, onMenuItemClick }: { item: MenuItemData, onMenuItemClick?: (action: string) => void }) {
    const theme = useTheme();
    const handleItemClick = (action: string) => {
        if (onMenuItemClick) {
            onMenuItemClick(action);
        }
    };
    return (
        <>
            <MenuItem
                onClick={() => handleItemClick(item.action)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(1),
                    color: 'white',
                    px: 1.5,
                    py: 1,
                    borderRadius: 1.5,
                    maxHeight: '38px',
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    },
                }}
            >
                <Iconify sx={{ mt: 1 }} icon={item.icon} width={26} height={26} />
                <Text variant='body2' sx={{ color: 'white' }}>{item.label}</Text>
            </MenuItem>
            {item.showDividerAfter && (
                <Divider sx={{ borderColor: theme.palette.grey[500], my: 0.5 }} />
            )}
        </>
    )
}
