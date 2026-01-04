export const presets = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 0.5, ease: 'power2.out' },
  },
  fadeInUp: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
  },
  fadeInDown: {
    from: { opacity: 0, y: -30 },
    to: { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
  },
  fadeInLeft: {
    from: { opacity: 0, x: -30 },
    to: { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
  },
  fadeInRight: {
    from: { opacity: 0, x: 30 },
    to: { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
  },
  hoverPop: {
    scale: 1.05,
    duration: 0.2,
    ease: 'back.out(1.7)',
  },
  hoverReset: {
    scale: 1,
    duration: 0.2,
    ease: 'power2.out',
  },
  stagger: {
    each: 0.08,
  },
  staggerFast: {
    each: 0.05,
  },
  staggerSlow: {
    each: 0.12,
  },
} as const;

export type PresetKey = keyof typeof presets;
export type AnimationPreset = (typeof presets)[PresetKey];
