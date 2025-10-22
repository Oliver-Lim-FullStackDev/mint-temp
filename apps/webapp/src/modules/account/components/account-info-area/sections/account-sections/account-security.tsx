import { Text } from '@mint/ui/components';
import { Box, Button, Stack } from '@mint/ui/components/core';
import { alpha, useTheme } from '@mint/ui/components/core/styles';

export default function AccountSecurity() {
    const theme = useTheme();

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Text variant="subtitle2" color="text-primary">
                        Login Method
                    </Text>
                    <Text variant="body3" color="text-secondary">
                        Email and Password
                    </Text>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        maxHeight: '24px',
                        color: theme.palette.primary.light,
                        backgroundColor: alpha(theme.palette.primary.main, 0.16),
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        }
                    }}
                >
                    Connected
                </Button>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Text variant="subtitle2" color="text-primary">
                        Two-Factor Authentication
                    </Text>
                    <Text variant="body3" color="text-secondary">
                        Add extra security to your account
                    </Text>
                </Box>
                <Button
                    variant="contained"
                    size="medium"
                    sx={{
                        backgroundColor: theme.palette.grey['9Channel'],
                        '&:hover': {
                            backgroundColor: theme.palette.grey['600Channel'],
                        }
                    }}
                >
                    Configure
                </Button>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Text variant="subtitle2" color="text-primary">
                        Sessions
                    </Text>
                    <Text variant="body3" color="text-secondary">
                        Check all of your sessions on all devices
                    </Text>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        backgroundColor: theme.palette.error.main,
                        '&:hover': {
                            backgroundColor: theme.palette.error.dark,
                        }
                    }}
                >
                    Log Out
                </Button>
            </Stack>
        </Stack>
    )
}
