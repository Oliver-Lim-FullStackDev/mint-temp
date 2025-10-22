import { Text } from '@mint/ui/components';
import { Box, Button, Stack } from '@mint/ui/components/core';
import { useTheme } from '@mint/ui/components/core/styles';

export default function AffiliateProgram() {
    const theme = useTheme();

    return (
        <Stack spacing={3}>
            <Box>
                <Text variant="body3" color="text-secondary" sx={{ mb: 2 }}>
                    Join our affiliate program and earn rewards for referring new users.
                </Text>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        }
                    }}
                >
                    Learn More
                </Button>
            </Box>
        </Stack>
    )
}
