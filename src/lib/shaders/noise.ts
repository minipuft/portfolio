export const noiseVertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const noiseFragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_strength;
uniform float u_chroma;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time * 0.9;
  float scale = 0.9 + 0.1 * sin(u_time * 0.2);
  vec2 chroma = vec2(u_chroma / u_resolution.x, 0.0);

  float nR = hash((uv + chroma) * u_resolution * scale + t);
  float nG = hash(uv * u_resolution * scale + t * 1.2);
  float nB = hash((uv - chroma) * u_resolution * scale - t * 0.8);

  vec3 grain = vec3(nR, nG, nB);
  grain = mix(vec3(0.5), grain, u_strength);

  float flicker = 0.9 + 0.1 * sin(u_time * 0.7);
  float alpha = clamp(u_strength * 0.5 * flicker, 0.0, 0.6);
  gl_FragColor = vec4(grain, alpha);
}
`;
