export const presets = {
  fadeIn: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1, duration: 0.8, ease: 'power3.out' },
  },
  fadeInUp: {
    from: { autoAlpha: 0, y: 40 },
    to: { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' },
  },
  fadeInDown: {
    from: { autoAlpha: 0, y: -40 },
    to: { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' },
  },
  fadeInLeft: {
    from: { autoAlpha: 0, x: -40 },
    to: { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power3.out' },
  },
  fadeInRight: {
    from: { autoAlpha: 0, x: 40 },
    to: { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power3.out' },
  },
  hoverPop: {
    scale: 1.05,
    duration: 0.3,
    ease: 'back.out(1.7)',
  },
  hoverReset: {
    scale: 1,
    duration: 0.3,
    ease: 'power3.out',
  },
  stagger: {
    each: 0.1,
  },
  staggerFast: {
    each: 0.05,
  },
  staggerSlow: {
    each: 0.15,
  },
} as const;

export type PresetKey = keyof typeof presets;
export type AnimationPreset = (typeof presets)[PresetKey];
