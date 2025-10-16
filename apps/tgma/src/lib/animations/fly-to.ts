import { animate, cubicBezier } from 'framer-motion';

export function flyTo({
  from,
  to,
  duration = 0.9,
  easing = cubicBezier(0.22, 1, 0.36, 1),
  scale = 0.95,
}: {
  from: HTMLElement;
  to: HTMLElement;
  duration?: number;        // seconds
  easing?: (t: number) => number;
  scale?: number;
}) {
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();

  const clone = from.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    position: 'fixed',
    left: `${fromRect.left}px`,
    top: `${fromRect.top}px`,
    width: `${fromRect.width}px`,
    height: `${fromRect.height}px`,
    margin: '0',
    pointerEvents: 'none',
    transformOrigin: 'center',
    zIndex: '9999',
  });
  document.body.appendChild(clone);

  const startX = fromRect.left + fromRect.width / 2;
  const startY = fromRect.top + fromRect.height / 2;
  const endX = toRect.left + toRect.width / 2;
  const endY = toRect.top + toRect.height / 2;

  const dx = endX - startX;
  const dy = endY - startY;

  // optional: add a slight arc
  const midX = dx * 0.5;
  const midY = dy * 0.5 - Math.max(40, Math.abs(dy) * 0.15);

  const controls = animate(
    clone,
    {
      // keyframes for a subtle arc and scale/opacity
      transform: [
        `translate(0px, 0px) scale(1)`,
        `translate(${midX}px, ${midY}px) scale(${(1 + scale) / 2})`,
        `translate(${dx}px, ${dy}px) scale(${scale})`,
      ],
      opacity: [1, 0.85, 0.6],
    },
    { duration, ease: easing }
  );

  return controls.finished.then(() => clone.remove());
}
