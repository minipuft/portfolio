'use client';

import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import ShimmerShader from '@/components/effects/ShimmerShader';
import NoiseShader from '@/components/effects/NoiseShader';

const SHIMMER_PALETTE = {
  a: '#7dcfff',
  b: '#bb9af7',
  c: '#ff9e64',
};

const SHIMMER_INTENSITY = 0.8;
const SHIMMER_QUALITY = 'high';
const NOISE_STRENGTH = 0.24;
const NOISE_CHROMA = 1.8;
const NOISE_QUALITY = 'medium';

export default function TextureOverlay() {
  const reducedMotion = useReducedMotion();
  
  if (reducedMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 z-50 h-screen w-screen overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            transform: 'translateZ(0)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-screen w-screen overflow-hidden">
      {/* Shimmer Shader Layer */}
      <ShimmerShader intensity={SHIMMER_INTENSITY} palette={SHIMMER_PALETTE} quality={SHIMMER_QUALITY} />

      {/* Noise Shader Layer */}
      <NoiseShader strength={NOISE_STRENGTH} chroma={NOISE_CHROMA} quality={NOISE_QUALITY} />

      {/* Vignette */}
      <div 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"
      />
    </div>
  );
}
