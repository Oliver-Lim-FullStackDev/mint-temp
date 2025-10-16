import Image from 'next/image';
import { Box } from '@mint/ui/components/core';
import { Text } from '@mint/ui/components';

interface PageHeaderProps {
  title: string;
  description: string;
  withBg?: boolean;
  showInfoIcon?: boolean;
  onInfoClick?: () => void;
}

export function PageHeader({ title, description, withBg, showInfoIcon, onInfoClick }: PageHeaderProps) {
    return (
        <Box sx={{ textAlign: 'center', width: '100%', mb: 3, position: 'relative' }}>
            {withBg && <Image
                style={{ width: '100%', position: 'absolute', objectPosition: 'center', left: 0, top: "-60px" }}
                src="/assets/background/bg-title-glow.png"
                alt="Background"
                width={400}
                height={200}
                className="object-cover object-center"
                priority
            />}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, position: 'relative', zIndex: 1 }}>
              <Text
                  variant="h2"
                  fontWeight={900}
                  sx={{
                      textAlign: 'center',
                      textTransform: 'uppercase',
                  }}
              >
                  {title}
              </Text>
              {showInfoIcon && onInfoClick && (
                <Box
                  component="button"
                  onClick={onInfoClick}
                  sx={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  <Image
                    src="/assets/images/info/info.svg"
                    alt={`${title} information`}
                    width={33}
                    height={32}
                    style={{
                      fontSize: 'inherit',
                    }}
                  />
                </Box>
              )}
            </Box>

            <Text
                variant="body2"
                sx={{
                    color: 'var(--secondary-main)',
                    textAlign: 'center',
                    fontWeight: '700',
                    position: 'relative'
                }}
            >
                {description}
            </Text>
        </Box>
    )
}
