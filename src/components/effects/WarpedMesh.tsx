'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useNormalizedScrollVelocity } from '@/lib/hooks/useScrollVelocity';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useColorBreathing } from '@/lib/hooks/useColorBreathing';

const vertexShader = `
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uWaveAmplitude;
  uniform float uWaveFrequency;

  varying float vElevation;

  void main() {
    vec3 pos = position;

    // Create wave pattern
    float wave1 = sin(pos.x * uWaveFrequency + uTime * 0.5) * uWaveAmplitude;
    float wave2 = sin(pos.y * uWaveFrequency * 0.8 + uTime * 0.3) * uWaveAmplitude * 0.5;

    // Add scroll-based distortion
    float scrollWave = sin(pos.x * 2.0 + pos.y * 2.0 + uTime) * uScrollVelocity * 0.3;

    pos.z += wave1 + wave2 + scrollWave;
    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColorLow;
  uniform vec3 uColorHigh;
  uniform float uOpacity;

  varying float vElevation;

  void main() {
    // Gradient based on elevation
    float mixFactor = (vElevation + 0.5) * 0.5;
    vec3 color = mix(uColorLow, uColorHigh, mixFactor);

    gl_FragColor = vec4(color, uOpacity);
  }
`;

interface WarpedGridProps {
  colorLow?: string;
  colorHigh?: string;
  breathingColor?: string; // Animated color from breathing hook
  opacity?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
}

function WarpedGrid({
  colorLow = '#16161e',
  colorHigh = '#7aa2f7',
  breathingColor,
  opacity = 0.15,
  waveAmplitude = 0.3,
  waveFrequency = 1.5,
}: WarpedGridProps) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const scrollVelocity = useNormalizedScrollVelocity();
  const reducedMotion = useReducedMotion();

  // Use breathing color if provided, otherwise use colorHigh
  const activeColorHigh = breathingColor || colorHigh;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uWaveAmplitude: { value: reducedMotion ? 0 : waveAmplitude },
      uWaveFrequency: { value: waveFrequency },
      uColorLow: { value: new THREE.Color(colorLow) },
      uColorHigh: { value: new THREE.Color(activeColorHigh) },
      uOpacity: { value: opacity },
    }),
    [colorLow, activeColorHigh, opacity, waveAmplitude, waveFrequency, reducedMotion]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uScrollVelocity.value +=
        (scrollVelocity - materialRef.current.uniforms.uScrollVelocity.value) * 0.1;

      // Update breathing color in real-time
      if (breathingColor) {
        materialRef.current.uniforms.uColorHigh.value.set(breathingColor);
      }
    }
  });

  // Scale grid to cover viewport
  const gridWidth = viewport.width * 1.5;
  const gridHeight = viewport.height * 1.5;

  return (
    <points ref={meshRef}>
      <planeGeometry args={[gridWidth, gridHeight, 50, 50]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

interface WarpedMeshProps {
  className?: string;
  colorLow?: string;
  colorHigh?: string;
  opacity?: number;
  enableBreathing?: boolean;
}

export default function WarpedMesh({
  className = '',
  colorLow,
  colorHigh = '#7aa2f7',
  opacity,
  enableBreathing = true,
}: WarpedMeshProps) {
  const reducedMotion = useReducedMotion();

  // Color breathing for living aesthetics
  const breathing = useColorBreathing({
    baseColor: colorHigh,
    hueRange: 10,
    saturationRange: 8,
    lightnessRange: 5,
    breathDuration: 10,
    scrollInfluence: 0.4,
  });

  const activeColor = enableBreathing && !reducedMotion ? breathing.color : colorHigh;

  // Static fallback for reduced motion
  if (reducedMotion) {
    return (
      <div
        className={`pointer-events-none ${className}`}
        style={{
          background: `radial-gradient(ellipse at center, ${colorHigh}10 0%, transparent 70%)`,
        }}
      />
    );
  }

  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <WarpedGrid
          colorLow={colorLow}
          colorHigh={colorHigh}
          breathingColor={activeColor}
          opacity={opacity}
        />
      </Canvas>
    </div>
  );
}
