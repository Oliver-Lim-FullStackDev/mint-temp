import React from 'react';
import Link from 'next/link';
import { Text } from '@mint/ui/components';

export default function MaybeLink({ children, href, ...others }: { children: React.ReactNode, href?: string, [key: string]: any }) {
    return href ? (
        <Link href={href} style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <Text {...others}>
            {children}
          </Text>
        </Link>
    ) : (
        <Text {...others}>
            {children}
        </Text>
    )
}
