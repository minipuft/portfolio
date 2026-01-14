export const shimmerVertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const shimmerFragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scroll;
uniform float u_intensity;
uniform vec3 u_color_a;
uniform vec3 u_color_b;
uniform vec3 u_color_c;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float tSlow = u_time * 0.035;
  float tFast = u_time * 0.12;
  float warp = fbm(p * 1.1 + vec2(-tSlow, tSlow * 1.1));
  float n = fbm(p * 2.3 + vec2(tSlow, -tSlow * 0.7));
  float micro = noise(p * 12.0 + tFast);
  float shimmer = smoothstep(0.2, 0.9, n);

  float blobY = mix(0.03, 0.82, u_scroll);
  vec2 blobCenter = vec2(0.5 + warp * 0.02, blobY);
  float blob = smoothstep(0.6, 0.0, distance(uv + vec2(0.0, warp * 0.05), blobCenter));

  float ripple = sin((p.x + warp * 0.3) * 8.0 + tFast) * sin((p.y - warp * 0.2) * 10.0 - tFast * 1.1);
  float caustic = smoothstep(0.2, 0.9, ripple * 0.5 + 0.5);
  float glimmer = mix(shimmer, caustic, 0.5) * (0.25 + 0.75 * blob);
  glimmer += micro * 0.08;

  float hueShift = fbm(p * 1.9 + vec2(tSlow * 0.8, tSlow));
  vec3 color = mix(u_color_a, u_color_b, hueShift);
  color = mix(color, u_color_c, shimmer * 0.65);

  float bottomGlow = smoothstep(0.0, 0.95, 1.0 - uv.y);
  bottomGlow = pow(bottomGlow, 0.85);
  float pulse = 0.82 + 0.18 * sin(u_time * 0.45 + hueShift * 6.2831 + blob * 1.2);
  float intensity = u_intensity * mix(0.55, 1.0, bottomGlow * (0.35 + 0.65 * u_scroll));
  color *= glimmer * intensity * pulse;
  float alpha = clamp(glimmer * 0.5, 0.0, 0.6);
  gl_FragColor = vec4(color, alpha);
}
`;
