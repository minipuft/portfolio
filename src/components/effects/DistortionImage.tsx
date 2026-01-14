'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useNormalizedScrollVelocity } from '@/lib/hooks/useScrollVelocity';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const vertexShader = `
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uDistortionStrength;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Wave distortion based on scroll velocity
    float wave = sin(pos.y * 3.0 + uTime * 0.5) * uScrollVelocity * uDistortionStrength;
    pos.x += wave;

    // Subtle vertical wave
    float verticalWave = sin(pos.x * 2.0 + uTime * 0.3) * uScrollVelocity * uDistortionStrength * 0.5;
    pos.y += verticalWave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uScrollVelocity;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    // RGB shift based on scroll velocity
    float shift = uScrollVelocity * 0.01;

    float r = texture2D(uTexture, vUv + vec2(shift, 0.0)).r;
    float g = texture2D(uTexture, vUv).g;
    float b = texture2D(uTexture, vUv - vec2(shift, 0.0)).b;

    vec4 color = vec4(r, g, b, 1.0);

    gl_FragColor = color;
  }
`;

interface DistortionMeshProps {
  imageSrc: string;
  distortionStrength?: number;
}

function DistortionMesh({ imageSrc, distortionStrength = 0.1 }: DistortionMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const scrollVelocity = useNormalizedScrollVelocity();
  const reducedMotion = useReducedMotion();

  const texture = useTexture(imageSrc);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uDistortionStrength: { value: reducedMotion ? 0 : distortionStrength },
    }),
    [texture, distortionStrength, reducedMotion]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Smoothly interpolate scroll velocity
      materialRef.current.uniforms.uScrollVelocity.value +=
        (scrollVelocity - materialRef.current.uniforms.uScrollVelocity.value) * 0.1;
    }
  });

  // Calculate aspect ratio to maintain image proportions
  const image = texture.image as HTMLImageElement | undefined;
  const imageAspect = image ? image.width / image.height : 1;
  const viewportAspect = viewport.width / viewport.height;

  let width = viewport.width;
  let height = viewport.height;

  if (imageAspect > viewportAspect) {
    height = width / imageAspect;
  } else {
    width = height * imageAspect;
  }

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[width, height, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

interface DistortionImageProps {
  src: string;
  alt: string;
  className?: string;
  distortionStrength?: number;
}

export default function DistortionImage({
  src,
  alt,
  className = '',
  distortionStrength = 0.1,
}: DistortionImageProps) {
  const reducedMotion = useReducedMotion();

  // Fallback to regular image for reduced motion
  if (reducedMotion) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} aria-label={alt}>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <DistortionMesh imageSrc={src} distortionStrength={distortionStrength} />
      </Canvas>
    </div>
  );
}
