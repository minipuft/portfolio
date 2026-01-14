'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useScrollProgress } from '@/lib/hooks/useMomentumScroll';
import {
  clampIntensity,
  createProgram,
  normalizePalette,
  type PaletteUnit,
  type ShimmerPalette,
} from '@/lib/shaders/shimmerRuntime';

type ShimmerQuality = 'low' | 'medium' | 'high';

const QUALITY_SETTINGS: Record<ShimmerQuality, { maxDpr: number; renderScale: number; targetFps: number }> = {
  low: { maxDpr: 1.25, renderScale: 0.7, targetFps: 24 },
  medium: { maxDpr: 1.5, renderScale: 0.85, targetFps: 30 },
  high: { maxDpr: 2.0, renderScale: 1.0, targetFps: 45 },
};

interface ShimmerShaderProps {
  intensity?: number;
  palette?: Partial<ShimmerPalette>;
  quality?: ShimmerQuality;
}

export default function ShimmerShader({ intensity, palette, quality = 'high' }: ShimmerShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const scrollProgress = useScrollProgress();
  const scrollRef = useRef(scrollProgress);
  const intensityRef = useRef(clampIntensity(intensity));
  const paletteRef = useRef<PaletteUnit>(normalizePalette(palette));

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    intensityRef.current = clampIntensity(intensity);
  }, [intensity]);

  useEffect(() => {
    paletteRef.current = normalizePalette(palette);
  }, [palette]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const scrollLocation = gl.getUniformLocation(program, 'u_scroll');
    const intensityLocation = gl.getUniformLocation(program, 'u_intensity');
    const colorALocation = gl.getUniformLocation(program, 'u_color_a');
    const colorBLocation = gl.getUniformLocation(program, 'u_color_b');
    const colorCLocation = gl.getUniformLocation(program, 'u_color_c');

    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const qualitySettings = QUALITY_SETTINGS[quality];
    const maxDpr = qualitySettings.maxDpr;
    const renderScale = qualitySettings.renderScale;
    const targetFrameMs = 1000 / qualitySettings.targetFps;
    let rafId: number | null = null;
    let lastFrame = 0;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr) * renderScale;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (resolutionLocation) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      }
    };

    const render = (now: number) => {
      const shouldAnimate = !reducedMotion;
      const paletteValues = paletteRef.current;
      if (!shouldAnimate) {
        if (timeLocation) gl.uniform1f(timeLocation, 0);
        if (scrollLocation) gl.uniform1f(scrollLocation, scrollRef.current);
        if (intensityLocation) gl.uniform1f(intensityLocation, intensityRef.current);
        if (colorALocation) gl.uniform3f(colorALocation, paletteValues.a[0], paletteValues.a[1], paletteValues.a[2]);
        if (colorBLocation) gl.uniform3f(colorBLocation, paletteValues.b[0], paletteValues.b[1], paletteValues.b[2]);
        if (colorCLocation) gl.uniform3f(colorCLocation, paletteValues.c[0], paletteValues.c[1], paletteValues.c[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        return;
      }

      if (now - lastFrame < targetFrameMs) {
        rafId = requestAnimationFrame(render);
        return;
      }
      lastFrame = now;

      if (timeLocation) gl.uniform1f(timeLocation, now * 0.001);
      if (scrollLocation) gl.uniform1f(scrollLocation, scrollRef.current);
      if (intensityLocation) gl.uniform1f(intensityLocation, intensityRef.current);
      if (colorALocation) gl.uniform3f(colorALocation, paletteValues.a[0], paletteValues.a[1], paletteValues.a[2]);
      if (colorBLocation) gl.uniform3f(colorBLocation, paletteValues.b[0], paletteValues.b[1], paletteValues.b[2]);
      if (colorCLocation) gl.uniform3f(colorCLocation, paletteValues.c[0], paletteValues.c[1], paletteValues.c[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      rafId = requestAnimationFrame(render);
    };

    resize();
    if (reducedMotion) {
      render(0);
    } else {
      rafId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [reducedMotion, quality]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-60 mix-blend-soft-light"
      aria-hidden="true"
    />
  );
}
