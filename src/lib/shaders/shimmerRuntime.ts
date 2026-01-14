import { shimmerFragmentShader, shimmerVertexShader } from './shimmer';

export type ShimmerPalette = {
  a: string;
  b: string;
  c: string;
};

export type PaletteUnit = {
  a: [number, number, number];
  b: [number, number, number];
  c: [number, number, number];
};

export const DEFAULT_PALETTE: ShimmerPalette = {
  a: '#7dcfff',
  b: '#bb9af7',
  c: '#ff9e64',
};

export const DEFAULT_INTENSITY = 0.7;

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

export function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, shimmerVertexShader);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shimmerFragmentShader);
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

export function clampIntensity(value: number | undefined): number {
  if (value === undefined || Number.isNaN(value)) return DEFAULT_INTENSITY;
  return Math.max(0, Math.min(1.2, value));
}

function hexToUnit(hex: string | undefined, fallback: [number, number, number]): [number, number, number] {
  if (!hex) return fallback;
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return fallback;
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
  ];
}

export function normalizePalette(palette?: Partial<ShimmerPalette>): PaletteUnit {
  const merged = { ...DEFAULT_PALETTE, ...palette };
  return {
    a: hexToUnit(merged.a, [0.49, 0.78, 1.0]),
    b: hexToUnit(merged.b, [0.73, 0.6, 0.97]),
    c: hexToUnit(merged.c, [1.0, 0.62, 0.39]),
  };
}
