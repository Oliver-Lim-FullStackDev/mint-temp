import React from 'react';
import Image from 'next/image';
import { Box, Stack } from '@mint/ui/components/core';
import { GlassBox, Text, TextVariant } from '@mint/ui/components';
import { Iconify } from '@mint/ui/components/iconify';


interface TextItem {
    text: string;
    variant?: TextVariant
    color?: string;
    fontSize?: string;
    fontWeight?: number;
}

interface Award {
    type: 'XPP' | 'MBX' | 'RTP' | 'STARS';
    amount: string | number;
    prefix?: string;
}

interface RankCardProps {
    height?: number;
    icon?: React.ReactNode;
    texts?: TextItem[];
    awards?: Award[];
    isFirst?: boolean;
}

const renderIcon = (type: 'XPP' | 'MBX' | 'RTP' | 'STARS') => {
    switch (type) {
        case 'XPP':
            return <Image alt="ic-xp" src="/assets/icons/components/ic-xp.svg" width={16} height={16} />;
        case 'MBX':
            return <Iconify icon="mint:buck-icon" width={16} height={16} />;
        case 'RTP':
            return <Iconify icon="mint:raffle-ticket-icon" width={16} height={16} />;
        case 'STARS':
            return <Iconify icon="mint:telegram-stars" width={16} height={16} />;
        default:
            return null;
    }
};

const RankCard = ({ height = 170, icon, texts = [], awards = [], isFirst = false }: RankCardProps) => {
    return (
        <GlassBox
            variant='glass-box'
            sx={{
                width: 160,
                overflow: 'hidden',
                height: isFirst ? height + 20 : height,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                mt: isFirst ? 0 : 2,
                p: 1,
                pb: 2,
                borderRadius: 1,
                background: isFirst
                    ? "linear-gradient(0deg, rgba(0, 245, 201, 0.24) 0%, rgba(0, 245, 201, 0.24) 100%), var(--components-backdrop, rgba(18, 28, 38, 0.48))"
                    : "linear-gradient(0deg, rgba(20, 28, 37, 0.48), rgba(20, 28, 37, 0.48)), linear-gradient(0deg, rgba(0, 245, 201, 0.14), rgba(0, 245, 201, 0.14))",
            }}
        >
            {icon}

            <Stack spacing={0.25} alignItems="center">
                {texts.map((textItem, index) => (
                    <Text
                        key={index}
                        variant={textItem.variant || 'body2'}
                        sx={{
                            color: textItem.color || 'white',
                            fontSize: textItem.fontSize,
                            fontWeight: textItem.fontWeight || 400,
                            textAlign: 'center',
                            lineHeight: 1,
                        }}
                    >
                        {textItem.text}
                    </Text>
                ))}

                {awards.length > 0 && (
                    <Stack spacing={0.25} alignItems="center" sx={{ mt: 1 }}>
                        {awards.map((award, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Text
                                    variant="body2"
                                    sx={{
                                        color: award.type === 'STARS' ? 'var(--warning-light)' : 'white',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        lineHeight: 1,
                                    }}
                                >
                                    {award.prefix || ''}
                                </Text>
                                {renderIcon(award.type)}
                                <Text
                                    variant="body2"
                                    sx={{
                                        color: award.type === 'STARS' ? 'var(--warning-light)' : 'white',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        lineHeight: 1,
                                    }}
                                >
                                    {award.amount}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Stack>

        </GlassBox>
    );
};

export default RankCard;
