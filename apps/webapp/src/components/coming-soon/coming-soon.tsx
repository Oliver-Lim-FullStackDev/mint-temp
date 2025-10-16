import { ReactNode } from 'react';
import Image from 'next/image';
import { Box, Stack } from '@mint/ui/components/core';
import { Text } from '@mint/ui/components';
import BadgeBox from '../button/badge-box';
import { PageHeader } from '../headers/page-header';

interface ComingSoonProps {
    title: string;
    description: string;
    image?: string;
    imageAlt?: string;
    customWidth?: string;
    customHeight?: string;
    mainDescription?: string;
    boldDescription?: string;
    reverseDescriptionPos?: boolean;
    badgeText?: string
    badgeTextColor?: string
    badgeBgColor?: string
    badgeButtonLink?: string
    children?: ReactNode
}

export function ComingSoon({
    title,
    description,
    image,
    imageAlt = "Coming Soon",
    customWidth,
    customHeight,
    mainDescription,
    boldDescription,
    reverseDescriptionPos,
    badgeText,
    badgeTextColor,
    badgeBgColor,
    badgeButtonLink,
    children,
}: ComingSoonProps) {
    return (
        <Box
            sx={{
              position: 'relative',
              width: '100%',
              mx: 'auto',
            }}
        >
            {/* Background Image - Stretched to full height */}
            <Box sx={{ position: 'absolute', inset: 0 }}>
                <Image
                  style={{ objectPosition: 'center', maxHeight: "200px", top: "-50px", }}
                  src="/assets/background/bg-title-glow.png"
                  alt="Background"
                  fill
                  className="object-cover object-center"
                  priority
                />
            </Box>

            {/* Content Container - Centered layout */}
            <Stack
                sx={{
                    position: 'relative',
                    zIndex: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2,
                    py: 1.5
                }}
                spacing={1}
            >
                {/* Header Section - Centered */}
                <PageHeader title={title} description={description} />

                {/* Image Section with Blur Effect - Centered */}
                {image && (
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            mt: "-50px"
                        }}
                    >
                        <Box sx={{ position: 'relative', maxWidth: customWidth ? "unset" : '460px' }}>
                            <Image
                                style={{  height: customHeight || 'auto !important', maxWidth: 'unset', width: customWidth || '400px' }}
                                src={image}
                                alt={imageAlt}
                                width={426}
                                height={240}
                                className="w-full h-auto"
                            />
                        </Box>
                    </Box>
                )}

                {/* Description Section - Centered */}
               {mainDescription && <Box sx={{ textAlign: 'center', width: '100%', maxWidth: '384px', mt: '-32px' }}>
                    <Text
                        variant="body3"
                        sx={{
                            color: '#FFFFFF',
                            textAlign: 'center',
                            fontWeight: reverseDescriptionPos ? '900' : '400',
                        }}
                    >
                        {mainDescription}
                    </Text>
                </Box>}
               {boldDescription && <Text
                    variant="body3"
                    sx={{
                        color: '#FFFFFF',
                        textAlign: 'center',
                        fontWeight: !reverseDescriptionPos ? '900' : '400',
                        mb: 3,
                    }}
                >
                    {boldDescription}
                </Text>}
                { children }
                {/* Coming Soon Tag - Centered */}
                {badgeText && <BadgeBox badgeButtonLink={badgeButtonLink} bgColor={badgeBgColor} color={badgeTextColor}  badgeText={badgeText} />}
            </Stack>
        </Box>
    );
}
