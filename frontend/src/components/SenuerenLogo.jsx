import React from "react";

/**
 * Senueren logo mark — pure SVG, scales at any size, no raster dependency.
 * Two interlocking tilted orbits with circuit segment breaks and a brand gradient.
 *
 * Usage:
 *   <SenuerenLogo className="h-9 w-9" />
 *   <SenuerenLogo className="h-10 w-10" />
 */
const SenuerenLogo = ({ className = "h-9 w-9", title = "Senueren" }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={title}
    data-testid="senueren-logo-svg"
  >
    <defs>
      {/* Brand gradient — blue → cyan → teal (matches .logo-gradient in App.css) */}
      <linearGradient id="senueren-ring-grad" x1="0%" y1="10%" x2="100%" y2="90%">
        <stop offset="0%" stopColor="#4A9FD8" />
        <stop offset="55%" stopColor="#00FFD4" />
        <stop offset="100%" stopColor="#00E5CC" />
      </linearGradient>

      {/* Tight inner glow — keeps the mark crisp at small sizes */}
      <filter id="senueren-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="0.7" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Soft outer halo behind the mark */}
      <radialGradient id="senueren-halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00FFD4" stopOpacity="0.22" />
        <stop offset="65%" stopColor="#00FFD4" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background halo */}
    <circle cx="50" cy="50" r="46" fill="url(#senueren-halo)" />

    {/* The two interlocking orbits */}
    <g
      fill="none"
      stroke="url(#senueren-ring-grad)"
      strokeWidth="5"
      strokeLinecap="round"
      filter="url(#senueren-glow)"
    >
      {/* Ring A — tilted clockwise; a couple of clean circuit gaps */}
      <ellipse
        cx="50"
        cy="50"
        rx="36"
        ry="14"
        transform="rotate(-28 50 50)"
        strokeDasharray="60 4 40 4 110 4"
      />
      {/* Ring B — tilted counter-clockwise; offset gaps for variation */}
      <ellipse
        cx="50"
        cy="50"
        rx="36"
        ry="14"
        transform="rotate(28 50 50)"
        strokeDasharray="50 4 60 4 100 4"
      />
    </g>

    {/* Tiny tech-node accents — evoke the circuit detail of the source mark */}
    <g fill="#00FFD4">
      <circle cx="50" cy="50" r="1.6" opacity="0.95" />
      <circle cx="82" cy="36" r="1.1" opacity="0.85" />
      <circle cx="18" cy="64" r="1.1" opacity="0.85" />
    </g>
  </svg>
);

export default SenuerenLogo;
