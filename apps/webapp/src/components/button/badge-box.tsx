import { Box } from '@mui/material';
import { Text } from '../core';
import MaybeLink from './maybe-link-button';

interface Props {
    textVariant?: React.ComponentProps<typeof Text>['variant'];
    badgeText: string;
    bgColor?: string;
    color?: string;
    bold?: boolean;
    badgeButtonLink?: string;
    isSmall?: boolean
}

export default function BadgeBox({
    badgeText,
    bgColor,
    color,
    textVariant,
    borderRadius = '8px',
    bold,
    badgeButtonLink,
    isSmall,
    ...other
}: (Props & React.ComponentProps<typeof Box>)) {
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }} {...other}>
            <Box
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 1,
                    borderRadius: borderRadius,
                    maxHeight: isSmall ? '24px' : "30px",
                    background: bgColor || 'rgba(0, 190, 225, 0.16)',
                }}
            >
                <MaybeLink
                    href={badgeButtonLink}
                    variant={textVariant || 'subtitle2'}
                    sx={{
                        color: color || '#00FCF7',
                        fontWeight: bold ? '900' : '700',
                        textAlign: 'center',
                    }}
                >
                    {badgeText || 'Launching Soon'}
                </MaybeLink>
            </Box>
        </Box>
    )
}
