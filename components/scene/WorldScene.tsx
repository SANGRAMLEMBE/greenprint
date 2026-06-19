'use client';

import { useFootprintStore } from '@/lib/store/footprint';
import { committedSavingsKg } from '@/lib/actions/data';

/**
 * A living landscape pinned behind the whole app. Its "health" is driven by the
 * user's projected footprint: a high footprint gives hazy skies and factory
 * smoke; as actions are committed and the number falls, the world heals —
 * clearer sky, greener hills, a wind turbine fades in, the smoke thins out.
 *
 * Purely decorative (aria-hidden) and all motion stops under prefers-reduced-motion.
 */

// The two ends of the "health" scale, in tonnes CO₂e/yr. At the Paris target the
// world is pristine; up at a heavy-consumption footprint it's fully polluted.
// Everything in between is interpolated.
const PRISTINE_TCO2E = 2;
const POLLUTED_TCO2E = 16;
// Before anyone has calculated a footprint, show a hopeful-but-not-perfect scene.
const DEFAULT_HEALTH = 0.72;

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Blend two hex colours; t=0 → polluted colour, t=1 → healthy colour. */
function mix(polluted: string, healthy: string, t: number) {
  const a = hexToRgb(polluted);
  const b = hexToRgb(healthy);
  const r = Math.round(lerp(a.r, b.r, t));
  const g = Math.round(lerp(a.g, b.g, t));
  const bl = Math.round(lerp(a.b, b.b, t));
  return `rgb(${r}, ${g}, ${bl})`;
}

function palette(h: number) {
  return {
    skyTop: mix('#c9bfa6', '#bfe6ff', h),
    skyMid: mix('#ddd3bb', '#e9f7ff', h),
    skyLow: mix('#ece4d2', '#f3faf0', h),
    sun: mix('#d9b46a', '#ffd54a', h),
    hillBack: mix('#b7b596', '#bce6c6', h),
    hillMid: mix('#9aa06a', '#73c98a', h),
    ground: mix('#6f7440', '#2f9e54', h),
    river: mix('#8a9298', '#6cc4ef', h),
    leaf: mix('#7e7d44', '#1e9e57', h),
    leafDark: mix('#5f6236', '#147a41', h),
    trunk: mix('#5a4a36', '#6b4f33', h),
    building: mix('#7c7468', '#9fb0a4', h),
    smoke: mix('#8a8378', '#cfd8d8', h),
  };
}

/** A simple pine tree built from a trunk and three stacked canopies. */
function Pine({
  x,
  y,
  s,
  leaf,
  leafDark,
  trunk,
  delay,
}: {
  x: number;
  y: number;
  s: number;
  leaf: string;
  leafDark: string;
  trunk: string;
  delay: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className={`svg-sway animate-sway ${delay}`}>
      <rect x={-4} y={-14} width={8} height={20} rx={2} className="scene-tween" fill={trunk} />
      <polygon points="0,-70 26,-30 -26,-30" className="scene-tween" fill={leafDark} />
      <polygon points="0,-58 22,-22 -22,-22" className="scene-tween" fill={leaf} />
      <polygon points="0,-44 18,-12 -18,-12" className="scene-tween" fill={leafDark} />
    </g>
  );
}

/** A soft cloud made of overlapping blobs, drifting across the sky. */
function Cloud({ y, scale, opacity, duration, delay }: { y: number; scale: number; opacity: number; duration: string; delay: string }) {
  return (
    <g className={`animate-cloud-cross ${duration} ${delay}`} opacity={opacity}>
      <g transform={`translate(0 ${y}) scale(${scale})`}>
        <ellipse cx={0} cy={0} rx={46} ry={28} fill="#ffffff" />
        <ellipse cx={40} cy={8} rx={40} ry={24} fill="#ffffff" />
        <ellipse cx={-38} cy={10} rx={34} ry={20} fill="#ffffff" />
        <ellipse cx={6} cy={-14} rx={30} ry={20} fill="#ffffff" />
      </g>
    </g>
  );
}

export function WorldScene() {
  const { result, input, committedActionIds } = useFootprintStore();

  // Projected footprint = current total minus whatever actions are committed.
  let footprint: number | null = null;
  if (result) {
    const savedT = input ? committedSavingsKg(input, committedActionIds) / 1000 : 0;
    footprint = Math.max(0, result.totalTCO2ePerYear - savedT);
  }

  // Map the footprint onto 0–1: 1 = pristine (at/under the Paris target),
  // 0 = fully polluted (at/over the heavy-consumption end).
  const health =
    footprint === null
      ? DEFAULT_HEALTH
      : clamp((POLLUTED_TCO2E - footprint) / (POLLUTED_TCO2E - PRISTINE_TCO2E));
  const pollution = 1 - health;
  const c = palette(health);

  return (
    <div className="fixed inset-0 -z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMax slice"
        role="presentation"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="scene-tween" stopColor={c.skyTop} />
            <stop offset="55%" className="scene-tween" stopColor={c.skyMid} />
            <stop offset="100%" className="scene-tween" stopColor={c.skyLow} />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" className="scene-tween" stopColor={c.sun} stopOpacity={0.55 * health + 0.1} />
            <stop offset="100%" stopColor={c.sun} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect x={0} y={0} width={1200} height={800} fill="url(#sky)" />

        {/* Sun + glow + rotating rays */}
        <circle cx={985} cy={165} r={150} fill="url(#sunGlow)" />
        <g transform="translate(985 165)">
          <g className="svg-spin animate-spin-slow" opacity={0.35 + 0.4 * health}>
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x={-2}
                y={-128}
                width={4}
                height={34}
                rx={2}
                className="scene-tween"
                fill={c.sun}
                transform={`rotate(${i * 30})`}
              />
            ))}
          </g>
          <circle r={62} className="scene-tween" fill={c.sun} />
        </g>

        {/* Clouds */}
        <Cloud y={120} scale={1.1} opacity={0.9} duration="[animation-duration:75s]" delay="[animation-delay:-10s]" />
        <Cloud y={210} scale={0.8} opacity={0.7} duration="[animation-duration:95s]" delay="[animation-delay:-45s]" />
        <Cloud y={90} scale={0.65} opacity={0.6} duration="[animation-duration:120s]" delay="[animation-delay:-80s]" />

        {/* Hills (back to front) */}
        <path
          d="M0,520 C220,460 380,500 600,470 C820,440 1000,500 1200,470 L1200,800 L0,800 Z"
          className="scene-tween"
          fill={c.hillBack}
        />
        <path
          d="M0,600 C200,560 420,600 640,575 C880,548 1040,600 1200,575 L1200,800 L0,800 Z"
          className="scene-tween"
          fill={c.hillMid}
        />

        {/* Wind turbine on the mid hill — fades in as the world gets healthier */}
        <g transform="translate(300 560)" opacity={clamp(health * 1.3 - 0.2)}>
          <rect x={-3} y={-70} width={6} height={70} rx={3} fill="#eef2ee" />
          <g transform="translate(0 -70)" className="svg-spin animate-spin-slow">
            <rect x={-3} y={-46} width={6} height={46} rx={3} fill="#eef2ee" />
            <rect x={-3} y={-46} width={6} height={46} rx={3} fill="#eef2ee" transform="rotate(120)" />
            <rect x={-3} y={-46} width={6} height={46} rx={3} fill="#eef2ee" transform="rotate(240)" />
            <circle r={5} fill="#cfd8cf" />
          </g>
        </g>

        {/* Ground */}
        <path d="M0,650 C260,615 520,650 760,635 C980,621 1080,648 1200,635 L1200,800 L0,800 Z" className="scene-tween" fill={c.ground} />

        {/* River winding down to the foreground */}
        <path
          d="M560,640 C540,690 660,720 620,800 L760,800 C740,720 720,690 720,650 Z"
          className="scene-tween animate-shimmer"
          fill={c.river}
        />

        {/* Forest */}
        <Pine x={120} y={730} s={1.3} leaf={c.leaf} leafDark={c.leafDark} trunk={c.trunk} delay="[animation-delay:0s]" />
        <Pine x={190} y={745} s={1.0} leaf={c.leaf} leafDark={c.leafDark} trunk={c.trunk} delay="[animation-delay:-1.5s]" />
        <Pine x={70} y={760} s={1.1} leaf={c.leaf} leafDark={c.leafDark} trunk={c.trunk} delay="[animation-delay:-3s]" />
        <Pine x={250} y={770} s={1.25} leaf={c.leaf} leafDark={c.leafDark} trunk={c.trunk} delay="[animation-delay:-2s]" />
        <Pine x={1080} y={745} s={1.15} leaf={c.leaf} leafDark={c.leafDark} trunk={c.trunk} delay="[animation-delay:-0.8s]" />
        <Pine x={1140} y={760} s={0.95} leaf={c.leaf} leafDark={c.leafDark} trunk={c.trunk} delay="[animation-delay:-2.4s]" />
        {/* Extra lush trees that only appear in a healthy world */}
        <g opacity={clamp(health * 1.4 - 0.3)}>
          <Pine x={330} y={780} s={1.0} leaf={c.leaf} leafDark={c.leafDark} trunk={c.trunk} delay="[animation-delay:-1.1s]" />
          <Pine x={1010} y={775} s={0.9} leaf={c.leaf} leafDark={c.leafDark} trunk={c.trunk} delay="[animation-delay:-3.3s]" />
        </g>

        {/* Industrial skyline on the right with smokestacks */}
        <g transform="translate(840 560)">
          <rect x={0} y={0} width={70} height={90} className="scene-tween" fill={c.building} />
          <rect x={80} y={-30} width={54} height={120} className="scene-tween" fill={c.building} />
          <rect x={144} y={20} width={60} height={70} className="scene-tween" fill={c.building} />
          {/* Smokestacks */}
          <rect x={96} y={-60} width={16} height={36} className="scene-tween" fill={c.building} />
          <rect x={30} y={-26} width={14} height={30} className="scene-tween" fill={c.building} />

          {/* Smoke puffs — opacity scales with pollution, so they vanish when clean */}
          <g opacity={clamp(pollution * 1.2)}>
            <circle cx={104} cy={-64} r={10} className="animate-smoke-rise scene-tween" fill={c.smoke} />
            <circle cx={104} cy={-64} r={13} className="animate-smoke-rise scene-tween [animation-delay:-1.3s]" fill={c.smoke} />
            <circle cx={104} cy={-64} r={9} className="animate-smoke-rise scene-tween [animation-delay:-2.6s]" fill={c.smoke} />
            <circle cx={37} cy={-30} r={8} className="animate-smoke-rise scene-tween [animation-delay:-0.7s]" fill={c.smoke} />
            <circle cx={37} cy={-30} r={11} className="animate-smoke-rise scene-tween [animation-delay:-2s]" fill={c.smoke} />
          </g>
        </g>

        {/* A couple of birds drifting high up (only in a clearer sky) */}
        <g opacity={clamp(health * 1.2 - 0.2)} className="animate-cloud-cross [animation-duration:110s] [animation-delay:-30s]">
          <path d="M500,180 q8,-8 16,0 q8,-8 16,0" fill="none" stroke="#4b5563" strokeWidth={2.5} strokeLinecap="round" />
          <path d="M560,205 q6,-6 12,0 q6,-6 12,0" fill="none" stroke="#4b5563" strokeWidth={2} strokeLinecap="round" />
        </g>
      </svg>

      {/* Soft top fade so content over the sky always stays readable */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sand/80 to-transparent" />
    </div>
  );
}
