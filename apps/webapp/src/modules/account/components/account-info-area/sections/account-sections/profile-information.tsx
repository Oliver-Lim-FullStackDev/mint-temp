import { Text } from '@mint/ui/components';
import { Box, Button, MenuItem, Select, Stack, TextField } from '@mint/ui/components/core';
import { useTheme } from '@mint/ui/components/core/styles';

export default function ProfileInformation() {
    const theme = useTheme();

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Text variant="subtitle2" color="text-secondary">
                        Username
                    </Text>
                    <Text variant="body3" color="text-primary">
                        Your username on Mint, shown on leaderboards and live wins
                    </Text>
                </Box>
                <TextField
                    size="small"
                    defaultValue="Zak"
                    sx={{
                        maxWidth: 200,
                        '& .MuiInputBase-input': {
                            fontWeight: 'bold'
                        }
                    }}
                />
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Text variant="body3" color="text-secondary">
                        Verification
                    </Text>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    sx={{
                        backgroundColor: theme.palette.warning.main,
                        color: theme.palette.common.black,
                        '&:hover': {
                            backgroundColor: theme.palette.warning.dark,
                        }
                    }}
                >
                    Incomplete
                </Button>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Text variant="subtitle2" color="text-secondary">
                        Email Address
                    </Text>
                    <Text variant="body3" color="text-primary">
                        Contact us through
                    </Text>
                </Box>
                <TextField
                    size="small"
                    defaultValue="zm@mint.io"
                    sx={{
                        maxWidth: 250,
                        '& .MuiInputBase-input': {
                            fontWeight: 'bold'
                        }
                    }}
                />
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Text variant="subtitle2" color="text-secondary">
                        Phone Number
                    </Text>
                    <Text variant="body3" color="text-primary">
                        Your phone number, including country code
                    </Text>
                </Box>
                <TextField
                    size="small"
                    defaultValue="+44987654321"
                    sx={{
                        maxWidth: 200,
                        '& .MuiInputBase-input': {
                            fontWeight: 'bold'
                        }
                    }}
                />
            </Stack>

            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'auto' }}>
                {/* Header with title/description on left and button on top right */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                    <Box sx={{ flex: 1, pr: 2 }}>
                        <Text variant="subtitle2" color="text-secondary" sx={{ mb: 1 }}>
                            Address
                        </Text>
                        <Text variant="body3" color="text-primary">
                            Your full address is only used for verification purposes
                        </Text>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.success.main,
                            '&:hover': {
                                backgroundColor: theme.palette.success.dark,
                            },
                            flexShrink: 0,
                            height: 'fit-content'
                        }}
                    >
                        Secure & Encrypted
                    </Button>
                </Stack>

                {/* Input fields with Material Design floating labels */}
                <Stack spacing={3}>
                    <TextField
                        label="Street Address"
                        defaultValue="Donado 97"
                        variant="outlined"
                        size="small"
                        sx={{
                            maxWidth: 400,
                            '& .MuiInputBase-input': {
                                fontWeight: 'bold'
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: theme.palette.text.secondary,
                                '&.Mui-focused': {
                                    color: theme.palette.primary.main,
                                }
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.divider,
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.text.secondary,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                    borderWidth: 2,
                                }
                            }
                        }}
                    />
                    <TextField
                        label="City"
                        defaultValue="Bahía Blanca"
                        variant="outlined"
                        size="small"
                        sx={{
                            maxWidth: 400,
                            '& .MuiInputBase-input': {
                                fontWeight: 'bold'
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: theme.palette.text.secondary,
                                '&.Mui-focused': {
                                    color: theme.palette.primary.main,
                                }
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: theme.palette.divider,
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.text.secondary,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                    borderWidth: 2,
                                }
                            }
                        }}
                    />
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Zip Code"
                            defaultValue="2468"
                            variant="outlined"
                            size="small"
                            sx={{
                                maxWidth: 150,
                                '& .MuiInputBase-input': {
                                    fontWeight: 'bold'
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: theme.palette.text.secondary,
                                    '&.Mui-focused': {
                                        color: theme.palette.primary.main,
                                    }
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.divider,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.text.secondary,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main,
                                        borderWidth: 2,
                                    }
                                }
                            }}
                        />
                        <Select
                            label="Country"
                            defaultValue="Argentina"
                            variant="outlined"
                            size="small"
                            sx={{
                                maxWidth: 200,
                                '& .MuiSelect-select': {
                                    fontWeight: 'bold'
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: theme.palette.text.secondary,
                                    '&.Mui-focused': {
                                        color: theme.palette.primary.main,
                                    }
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.divider,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.text.secondary,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main,
                                        borderWidth: 2,
                                    }
                                }
                            }}
                        >
                            <MenuItem value="Argentina">Argentina</MenuItem>
                            <MenuItem value="Brazil">Brazil</MenuItem>
                            <MenuItem value="Chile">Chile</MenuItem>
                        </Select>
                    </Stack>
                </Stack>
            </Box>
        </Stack>
    )
}
