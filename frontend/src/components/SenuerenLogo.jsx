import React from "react";

/**
 * Senueren "SEN" logo — refined chrome wordmark with comet swoosh.
 *
 * Restored from the original comet-swoosh identity, but tightened:
 *   • palette aligned with the site's institutional cyan → emerald gradient
 *   • cleaner arc geometry, no visual noise
 *   • sharper letterforms with a subtle bevel (no muddy dark outline)
 *   • disciplined comet head with a short motion streak
 *   • softer, opacity-only pulse — no jumpy scale animation
 *
 * Two exports:
 *   <SenuerenLogo />       — navbar-sized mark  (2:1 aspect, scales via height)
 *   <SenuerenLogoFull />   — hero-sized variant + tagline
 */

const LogoDefs = ({ id }) => (
  <defs>
    {/* Chrome fill — vertical highlight/mid/deep bands, palette-matched */}
    <linearGradient id={`sen-chrome-${id}`} x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%"  stopColor="#F1FBFA" />
      <stop offset="16%" stopColor="#FFFFFF" />
      <stop offset="38%" stopColor="#7DE7D8" />
      <stop offset="58%" stopColor="#22D3EE" />
      <stop offset="82%" stopColor="#10B981" />
      <stop offset="100%" stopColor="#0E7C60" />
    </linearGradient>

    {/* Top edge highlight — creates the polished-chrome sheen */}
    <linearGradient id={`sen-edge-${id}`} x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%"  stopColor="#FFFFFF" stopOpacity="0.95" />
      <stop offset="9%"  stopColor="#FFFFFF" stopOpacity="0.55" />
      <stop offset="22%" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>

    {/* Bevel shadow — subtle depth beneath the letters */}
    <linearGradient id={`sen-bevel-${id}`} x1="50%" y1="55%" x2="50%" y2="100%">
      <stop offset="0%"  stopColor="#050B1A" stopOpacity="0" />
      <stop offset="100%" stopColor="#050B1A" stopOpacity="0.55" />
    </linearGradient>

    {/* Swoosh trail — fades in from behind the letters, ignites toward the comet head */}
    <linearGradient id={`sen-arc-${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%"  stopColor="#3B82F6" stopOpacity="0" />
      <stop offset="28%" stopColor="#3B82F6" stopOpacity="0.75" />
      <stop offset="66%" stopColor="#22D3EE" stopOpacity="1" />
      <stop offset="100%" stopColor="#E7FFFA" stopOpacity="1" />
    </linearGradient>

    {/* Soft glow for the arc + comet */}
    <filter id={`sen-glow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* Radial glow for the comet head */}
    <radialGradient id={`sen-head-${id}`} cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stopColor="#FFFFFF" stopOpacity="1" />
      <stop offset="28%" stopColor="#22D3EE" stopOpacity="0.9" />
      <stop offset="72%" stopColor="#3B82F6" stopOpacity="0.28" />
      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
    </radialGradient>

    {/* Soft drop for letter depth */}
    <filter id={`sen-drop-${id}`} x="-10%" y="-10%" width="120%" height="130%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" />
      <feOffset dx="1.5" dy="2.5" result="off" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

/* ────────────────────────────────────────────────────────────────────
   Reusable inner artwork — same design, parameterised by defs-id.
   ──────────────────────────────────────────────────────────────────── */
const LogoArtwork = ({ id, showTagline = false }) => (
  <>
    {/* Restrained starfield (only visible at larger sizes) */}
    <g fill="#22D3EE" opacity="0.55">
      <circle cx="36"  cy="32"  r="0.7" />
      <circle cx="362" cy="22"  r="0.5" />
      <circle cx="58"  cy="172" r="0.6" />
      <circle cx="282" cy="180" r="0.5" />
      <circle cx="128" cy="18"  r="0.4" />
    </g>

    {/* Swoosh — wide under-glow (behind everything) */}
    <path
      d="M 58 158 Q 100 55, 232 52 Q 316 50, 368 34"
      stroke={`url(#sen-arc-${id})`}
      strokeWidth="14"
      fill="none"
      strokeLinecap="round"
      opacity="0.32"
      filter={`url(#sen-glow-${id})`}
    />
    {/* Swoosh — main arc */}
    <path
      d="M 58 158 Q 100 55, 232 52 Q 316 50, 368 34"
      stroke={`url(#sen-arc-${id})`}
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
      filter={`url(#sen-glow-${id})`}
    />
    {/* Swoosh — thin bright core */}
    <path
      d="M 78 152 Q 118 62, 236 57 Q 314 55, 366 36"
      stroke="#E7FFFA"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
      opacity="0.85"
    />

    {/* Sparkle particles along the arc */}
    <g fill="#E7FFFA">
      <circle cx="92"  cy="120" r="1.1" opacity="0.75" />
      <circle cx="140" cy="88"  r="0.9" opacity="0.7"  />
      <circle cx="192" cy="66"  r="1"   opacity="0.8"  />
      <circle cx="258" cy="55"  r="1.1" opacity="0.85" />
      <circle cx="312" cy="48"  r="0.9" opacity="0.75" />
    </g>

    {/* SEN letters — drop-shadowed chrome fill */}
    <g filter={`url(#sen-drop-${id})`}>
      <text
        x="200"
        y="142"
        textAnchor="middle"
        fontFamily="'Archivo Black','Outfit','Inter',system-ui,sans-serif"
        fontWeight="900"
        fontSize="112"
        letterSpacing="-3"
        fontStyle="italic"
        fill={`url(#sen-chrome-${id})`}
      >
        SEN
      </text>
    </g>
    {/* Bevel underlay — dark gradient inside letters (renders only where it overlaps) */}
    <text
      x="200"
      y="142"
      textAnchor="middle"
      fontFamily="'Archivo Black','Outfit','Inter',system-ui,sans-serif"
      fontWeight="900"
      fontSize="112"
      letterSpacing="-3"
      fontStyle="italic"
      fill={`url(#sen-bevel-${id})`}
      opacity="0.6"
      style={{ mixBlendMode: "multiply" }}
    >
      SEN
    </text>
    {/* Top chrome highlight */}
    <text
      x="200"
      y="142"
      textAnchor="middle"
      fontFamily="'Archivo Black','Outfit','Inter',system-ui,sans-serif"
      fontWeight="900"
      fontSize="112"
      letterSpacing="-3"
      fontStyle="italic"
      fill={`url(#sen-edge-${id})`}
    >
      SEN
    </text>

    {/* Comet head — motion streak + pulsing orb */}
    <g className="sen-comet">
      {/* Streak trail behind the head, matching the arc direction */}
      <path
        d="M 344 42 L 366 35"
        stroke="#E7FFFA"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
        filter={`url(#sen-glow-${id})`}
      />
      <circle cx="368" cy="34" r="20" fill={`url(#sen-head-${id})`} />
      <circle cx="368" cy="34" r="4.8" fill="#FFFFFF" filter={`url(#sen-glow-${id})`} />
      <circle cx="368" cy="34" r="2.2" fill="#FFFFFF" />
    </g>

    {showTagline && (
      <text
        x="200"
        y="188"
        textAnchor="middle"
        fontFamily="'Outfit','Inter',system-ui,sans-serif"
        fontWeight="500"
        fontSize="12"
        letterSpacing="8"
        fill="#8FA3C4"
      >
        AUTONOMOUS  •  DETERMINISTIC  •  SOVEREIGN
      </text>
    )}
  </>
);

/* Shared animation styles — softer, opacity-only pulse (no jumpy scale). */
const LOGO_STYLE = `
  @keyframes sen-pulse {
    0%, 100% { opacity: 0.78; }
    50%      { opacity: 1;    }
  }
  .sen-comet { animation: sen-pulse 3.2s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .sen-comet { animation: none; opacity: 1; }
  }
`;

/* ── Small navbar mark ── */
export const SenuerenLogo = ({ className = "h-10 w-auto", title = "Senueren" }) => (
  <svg
    viewBox="0 0 400 200"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={title}
    data-testid="senueren-logo-svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <LogoDefs id="nav" />
    <style>{LOGO_STYLE}</style>
    <LogoArtwork id="nav" />
  </svg>
);

/* ── Full hero-sized logo (same mark + tagline underneath) ── */
export const SenuerenLogoFull = ({ className = "w-full max-w-lg", title = "Senueren" }) => (
  <svg
    viewBox="0 0 400 220"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={title}
    data-testid="senueren-logo-full-svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <LogoDefs id="hero" />
    <style>{LOGO_STYLE}</style>
    <LogoArtwork id="hero" showTagline />
  </svg>
);

export default SenuerenLogo;
