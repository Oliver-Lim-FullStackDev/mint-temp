import { Text } from '@mint/ui/components';
import { Box, Button, Stack } from '@mint/ui/components/core';
import { useTheme } from '@mint/ui/components/core/styles';

export default function TransactionHistory() {
    const theme = useTheme();

    return (
        <Stack spacing={3}>
            <Box>
                <Text variant="body3" color="text-secondary" sx={{ mb: 2 }}>
                    View your complete transaction history and account activity.
                </Text>
                <Button
                    variant="outlined"
                    sx={{
                        color: theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.common.white,
                        }
                    }}
                >
                    View History
                </Button>
            </Box>
        </Stack>
    )
}
