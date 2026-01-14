'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { noiseFragmentShader, noiseVertexShader } from '@/lib/shaders/noise';

type NoiseQuality = 'low' | 'medium' | 'high';

const QUALITY_SETTINGS: Record<NoiseQuality, { maxDpr: number; renderScale: number; targetFps: number }> = {
  low: { maxDpr: 1.0, renderScale: 0.6, targetFps: 20 },
  medium: { maxDpr: 1.25, renderScale: 0.8, targetFps: 26 },
  high: { maxDpr: 1.5, renderScale: 1.0, targetFps: 30 },
};

const DEFAULT_STRENGTH = 0.22;
const DEFAULT_CHROMA = 1.6;

function clampStrength(value: number | undefined): number {
  if (value === undefined || Number.isNaN(value)) return DEFAULT_STRENGTH;
  return Math.max(0, Math.min(0.6, value));
}

function clampChroma(value: number | undefined): number {
  if (value === undefined || Number.isNaN(value)) return DEFAULT_CHROMA;
  return Math.max(0, Math.min(6, value));
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, noiseVertexShader);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, noiseFragmentShader);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  return program;
}

interface NoiseShaderProps {
  strength?: number;
  chroma?: number;
  quality?: NoiseQuality;
}

export default function NoiseShader({ strength, chroma, quality = 'medium' }: NoiseShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const strengthRef = useRef(clampStrength(strength));
  const chromaRef = useRef(clampChroma(chroma));

  useEffect(() => {
    strengthRef.current = clampStrength(strength);
  }, [strength]);

  useEffect(() => {
    chromaRef.current = clampChroma(chroma);
  }, [chroma]);

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
    const strengthLocation = gl.getUniformLocation(program, 'u_strength');
    const chromaLocation = gl.getUniformLocation(program, 'u_chroma');

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
      if (reducedMotion) {
        if (timeLocation) gl.uniform1f(timeLocation, 0);
      } else {
        if (now - lastFrame < targetFrameMs) {
          rafId = requestAnimationFrame(render);
          return;
        }
        lastFrame = now;
        if (timeLocation) gl.uniform1f(timeLocation, now * 0.001);
      }

      if (strengthLocation) gl.uniform1f(strengthLocation, strengthRef.current);
      if (chromaLocation) gl.uniform1f(chromaLocation, chromaRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reducedMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    resize();
    render(0);
    if (!reducedMotion) {
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
      className="absolute inset-0 h-full w-full opacity-45 mix-blend-overlay"
      aria-hidden="true"
    />
  );
}
