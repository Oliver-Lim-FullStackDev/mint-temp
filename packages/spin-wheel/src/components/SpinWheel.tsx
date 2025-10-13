// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { Wheel } from 'spin-wheel';

export type Props = {
  numItems: number;
};

export const SpinWheel: React.FC<Props> = ({ numItems }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<any>(null);

  const items = Array.from({ length: numItems }, (_, i) => ({
    label: 'item ' + i,
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Delay wheel init until after DOM layout
    const timeout = setTimeout(() => {
      wheelRef.current = new Wheel(container, {
        items,
        itemLabelRadiusMax: 0.4,
      });
    }, 0); // defer to end of event loop

    return () => {
      clearTimeout(timeout);
      if (wheelRef.current?.remove) {
        wheelRef.current.remove();
      }
    };
  }, [numItems]);

  return (
    <div
      ref={containerRef}
      style={{
        height: 400,
        width: 400,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};
