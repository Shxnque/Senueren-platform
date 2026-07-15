import React from "react";

/**
 * Senueren logo — Saturn-ring emblem + wordmark.
 *
 * Two exports:
 *   <SenuerenLogo />       — navbar-sized "SEN" ring mark
 *   <SenuerenLogoFull />   — hero-sized ring + "SENUEREN" wordmark + tagline
 *
 * Aesthetic anchors: deep-space navy field, brushed-blue-to-emerald gradient,
 * circuit-etched ring, subtle inner glow. No mascots, no clutter.
 */

const RingDefs = ({ id }) => (
  <defs>
    {/* Blue → emerald ring gradient (matches wordmark) */}
    <linearGradient id={`ring-${id}`} x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stopColor="#3B82F6" />
      <stop offset="50%" stopColor="#22D3EE" />
      <stop offset="100%" stopColor="#10B981" />
    </linearGradient>
    {/* Highlight along the top edge of the ring */}
    <linearGradient id={`ring-hi-${id}`} x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
      <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>
    {/* Inner-orb gradient */}
    <radialGradient id={`orb-${id}`} cx="40%" cy="35%" r="75%">
      <stop offset="0%" stopColor="#1B3B70" />
      <stop offset="55%" stopColor="#0B1E3A" />
      <stop offset="100%" stopColor="#050B1A" />
    </radialGradient>
    <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    {/* Wordmark gradient */}
    <linearGradient id={`word-${id}`} x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stopColor="#4F8CFF" />
      <stop offset="55%" stopColor="#22D3EE" />
      <stop offset="100%" stopColor="#34D399" />
    </linearGradient>
  </defs>
);

/* ── Small navbar mark ── */
export const SenuerenLogo = ({ className = "h-10 w-auto", title = "Senueren" }) => (
  <svg viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label={title} preserveAspectRatio="xMidYMid meet">
    <RingDefs id="nav" />

    {/* Saturn-ring emblem centred at (40, 40) */}
    <g transform="translate(40 40)">
      {/* Outer glow disc */}
      <ellipse cx="0" cy="0" rx="34" ry="14" fill="none" stroke="url(#ring-nav)" strokeWidth="1.5" opacity="0.35" filter="url(#glow-nav)" />
      {/* Inner orb */}
      <circle cx="0" cy="0" r="18" fill="url(#orb-nav)" stroke="#22D3EE" strokeWidth="0.6" opacity="0.9" />
      {/* Ring band (elliptical) */}
      <ellipse cx="0" cy="0" rx="32" ry="11" fill="none" stroke="url(#ring-nav)" strokeWidth="4" transform="rotate(-18)" />
      <ellipse cx="0" cy="0" rx="32" ry="11" fill="none" stroke="url(#ring-hi-nav)" strokeWidth="1.4" transform="rotate(-18)" />
      {/* Two tiny segment gaps to suggest engineered plates */}
      <line x1="-32" y1="0" x2="-26" y2="0" stroke="#050B1A" strokeWidth="4" transform="rotate(-18)" />
      <line x1="26" y1="0" x2="32" y2="0" stroke="#050B1A" strokeWidth="4" transform="rotate(-18)" />
    </g>

    {/* SEN wordmark */}
    <text
      x="90"
      y="52"
      fontFamily="'Outfit','Inter',system-ui,sans-serif"
      fontWeight="800"
      fontSize="36"
      letterSpacing="1"
      fill="url(#word-nav)"
    >
      SEN
    </text>
  </svg>
);

/* ── Full hero-sized logo (ring + SENUEREN + tagline) ── */
export const SenuerenLogoFull = ({ className = "w-full max-w-lg", title = "Senueren" }) => (
  <svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label={title} preserveAspectRatio="xMidYMid meet">
    <RingDefs id="hero" />

    {/* Emblem centered at (320, 130) */}
    <g transform="translate(320 130)">
      {/* Wide glow disc behind */}
      <ellipse cx="0" cy="0" rx="170" ry="70" fill="none" stroke="url(#ring-hero)" strokeWidth="1.2" opacity="0.18" filter="url(#glow-hero)" />

      {/* Back half of ring (behind orb) */}
      <path d="M -125 0 A 125 46 0 0 1 125 0" fill="none" stroke="url(#ring-hero)" strokeWidth="14" transform="rotate(-16)" strokeLinecap="butt" />

      {/* Inner orb */}
      <circle cx="0" cy="0" r="78" fill="url(#orb-hero)" stroke="#22D3EE" strokeWidth="0.8" opacity="0.95" />
      {/* Faint orb inner texture (concentric arcs) */}
      <g fill="none" stroke="#22D3EE" strokeWidth="0.6" opacity="0.35">
        <circle cx="0" cy="0" r="55" />
        <circle cx="0" cy="0" r="38" />
        <circle cx="0" cy="0" r="20" />
      </g>
      {/* Highlight glint on orb */}
      <ellipse cx="-24" cy="-28" rx="22" ry="10" fill="#FFFFFF" opacity="0.12" />

      {/* Front half of ring (in front of orb) */}
      <path d="M -125 0 A 125 46 0 0 0 125 0" fill="none" stroke="url(#ring-hero)" strokeWidth="14" transform="rotate(-16)" strokeLinecap="butt" />
      {/* Ring highlight along top edge */}
      <path d="M -122 -3 A 125 46 0 0 0 122 -3" fill="none" stroke="url(#ring-hi-hero)" strokeWidth="3.5" transform="rotate(-16)" strokeLinecap="butt" opacity="0.9" />

      {/* Two engineered plate gaps */}
      <g transform="rotate(-16)">
        <line x1="-118" y1="0" x2="-102" y2="0" stroke="#050B1A" strokeWidth="14" />
        <line x1="102" y1="0" x2="118" y2="0" stroke="#050B1A" strokeWidth="14" />
        <line x1="-10" y1="46" x2="10" y2="46" stroke="#050B1A" strokeWidth="14" />
      </g>

      {/* Small “light tip” at ring end */}
      <circle cx="126" cy="-38" r="3" fill="#E0FFFC" filter="url(#glow-hero)" />
      <circle cx="-126" cy="38" r="2.5" fill="#7DD3FC" opacity="0.85" />
    </g>

    {/* Wordmark */}
    <text
      x="320"
      y="250"
      textAnchor="middle"
      fontFamily="'Outfit','Inter',system-ui,sans-serif"
      fontWeight="800"
      fontSize="64"
      letterSpacing="6"
      fill="url(#word-hero)"
    >
      SENUEREN
    </text>

    {/* Tagline */}
    <text
      x="320"
      y="288"
      textAnchor="middle"
      fontFamily="'Outfit','Inter',system-ui,sans-serif"
      fontWeight="400"
      fontSize="13"
      letterSpacing="12"
      fill="#8FA3C4"
    >
      AUTOMATE  •  INNOVATE  •  ELEVATE
    </text>
  </svg>
);

export default SenuerenLogo;
