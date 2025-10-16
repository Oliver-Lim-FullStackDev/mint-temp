// @ts-nocheck
import confetti from 'canvas-confetti';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Wheel } from 'spin-wheel';
import { Popup } from './popup/popup';

export type Props = {
  numItems: number;
};

export const SpinWheel: React.FC<Props> = ({ numItems }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<any>(null);

  const items = useMemo(() => Array.from({ length: numItems }, (_, i) => ({
    label: `Minted ${10 * (i + 1)}x`,
  })), [numItems]);

  const [showPopup, setShowPopup] = useState(false);
  const [winner, setWinner] = useState('');
  useEffect(() => {
    if (showPopup) {
      startConfetti();
      const timer = setTimeout(() => setShowPopup(false), 5000); // Hide popup after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const startConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Pre-clear the container to prevent duplicate canvas
    container.innerHTML = '';

    // Load overlay image first
    const overlayImage = new Image();
    overlayImage.src = '/logo/spinwheel-overlay.svg';

    overlayImage.onload = () => {
      // Optional: preload main image if needed
      const image = new Image();
      image.src = '/logo/logo-full-small.svg';

      // Clean up any existing wheel instance
      if (wheelRef.current?.remove) {
        wheelRef.current.remove();
      }

      // Create new wheel with loaded overlay
      wheelRef.current = new Wheel(container, {
        borderColor: 'var(--brand-primary-blue-main)',
        lineColor: 'var(--brand-primary-blue-main)',
        borderWidth: 2,
        itemLabelColors: ['#008A72', '#5119B7', '#006C9C', '#118D57'],
        // itemBackgroundColors: ['#C8FFF6', '#EFD6FF', '#CAFDF5', '#D3FCD2'],
        // image,
        overlayImage,
        radius: 0.88,
        items,
        itemLabelRadius: 0.92,
        itemLabelRadiusMax: 0.4,
        itemLabelRotation: 0,
        itemLabelAlign: 'right',
        itemLabelBaselineOffset: -0.13,
        itemLabelFont: 'system-ui',
        rotationSpeedMax: 700,
        rotationResistance: -70,
        onRest: ({ currentIndex, rotation, type}) => {
          setWinner(`Minted ${(currentIndex + 1) * 10}x`);
          setShowPopup(true);
        },
        onSpin: () => setShowPopup(false),
      });
    };

    return () => {
      if (wheelRef.current?.remove) {
        wheelRef.current.remove();
      }
    };
  }, [numItems]);

  return (
    <>
      <div ref={containerRef} style={{ height: 400 }} />

      {showPopup && <Popup>
        <h2>🎉 Congratulations!</h2>
        <h3>You just got <b>{winner}</b>!</h3>
      </Popup>}
    </>
  );
};
