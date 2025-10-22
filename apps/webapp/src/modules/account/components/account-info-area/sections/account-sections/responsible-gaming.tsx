import { Text } from '@mint/ui/components';
import { Box, MenuItem, Select, Stack, TextField } from '@mint/ui/components/core';

export default function ResponsibleGaming() {
    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={4} alignItems="flex-start" justifyContent="space-between">
                <Box sx={{ flex: 1 }}>
                    <Text variant="subtitle2" color="text-primary" sx={{ mb: 0.5 }}>
                        Purchase Limits
                    </Text>
                    <Text variant="body3" color="text-secondary" sx={{ mb: 2, maxWidth: '500px' }}>
                        Keep it chill. Choose how much you can spend, and we'll hold the line. Drop it whenever.
                    </Text>
                </Box>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box>
                        <Text variant="subtitle2" color="text-secondary" sx={{ mb: 0.5 }}>
                            Duration
                        </Text>
                        <Select
                            size="small"
                            defaultValue="1 Day"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="1 Day">1 Day</MenuItem>
                            <MenuItem value="7 Days">7 Days</MenuItem>
                            <MenuItem value="30 Days">30 Days</MenuItem>
                        </Select>
                    </Box>
                    <Box>
                        <Text variant="subtitle2" color="text-secondary" sx={{ mb: 0.5 }}>
                            Amount
                        </Text>
                        <TextField
                            size="small"
                            defaultValue="0.00"
                            sx={{ maxWidth: 100 }}
                        />
                    </Box>
                </Stack>
            </Stack>

            <Stack direction="row" spacing={4} alignItems="flex-start" justifyContent="space-between">
                <Box sx={{ flex: 1 }}>
                    <Text variant="subtitle2" color="text-primary" sx={{ mb: 0.5 }}>
                        Time Out
                    </Text>
                    <Text variant="body3" color="text-secondary" sx={{ mb: 2, maxWidth: '500px' }}>
                        Taking a break? Cool down first, we'll put your account on pause. No worries, no house. Come back when you're ready.
                    </Text>
                </Box>
                <Box>
                    <Text variant="subtitle2" color="text-secondary" sx={{ mb: 0.5 }}>
                        Duration
                    </Text>
                    <Select
                        size="small"
                        defaultValue="1 Day"
                        sx={{ minWidth: 120 }}
                    >
                        <MenuItem value="1 Day">1 Day</MenuItem>
                        <MenuItem value="7 Days">7 Days</MenuItem>
                        <MenuItem value="30 Days">30 Days</MenuItem>
                    </Select>
                </Box>
            </Stack>
        </Stack>
    )
}
