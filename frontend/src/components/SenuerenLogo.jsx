import React from "react";

/**
 * Senueren "SEN" logo mark — pure SVG chrome wordmark with comet swoosh.
 *
 * Wide aspect ratio (2:1). Set height via className; width scales via viewBox.
 * Example: <SenuerenLogo className="h-10 w-auto" />
 */
const SenuerenLogo = ({ className = "h-10 w-auto", title = "Senueren" }) => (
  <svg
    viewBox="0 0 400 200"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={title}
    data-testid="senueren-logo-svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      {/* Chrome fill — bright highlight band at top, teal/cyan core, deeper blue base */}
      <linearGradient id="senChromeFill" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#DFF9F4" />
        <stop offset="18%" stopColor="#FFFFFF" />
        <stop offset="38%" stopColor="#5BD9D0" />
        <stop offset="55%" stopColor="#00FFD4" />
        <stop offset="78%" stopColor="#00E5CC" />
        <stop offset="100%" stopColor="#4A9FD8" />
      </linearGradient>

      {/* Subtle white edge highlight along the top of the letters */}
      <linearGradient id="senChromeEdge" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="8%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>

      {/* Swoosh trail: fades in from left, brightens toward the comet head */}
      <linearGradient id="senSwoosh" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4A9FD8" stopOpacity="0" />
        <stop offset="25%" stopColor="#4A9FD8" stopOpacity="0.7" />
        <stop offset="65%" stopColor="#00FFD4" stopOpacity="1" />
        <stop offset="100%" stopColor="#E0FFFC" stopOpacity="1" />
      </linearGradient>

      {/* Soft glow for the swoosh */}
      <filter id="senSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Radial glow for the comet head */}
      <radialGradient id="senCometGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="25%" stopColor="#00FFD4" stopOpacity="0.9" />
        <stop offset="70%" stopColor="#4A9FD8" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#4A9FD8" stopOpacity="0" />
      </radialGradient>

      {/* Drop shadow for letter depth */}
      <filter id="senDrop" x="-10%" y="-10%" width="120%" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
        <feOffset dx="2" dy="3" result="off" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.55" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Subtle starfield — renders only at larger sizes, invisible at nav size */}
    <g opacity="0.5" fill="#00FFD4">
      <circle cx="30" cy="30" r="0.6" />
      <circle cx="360" cy="25" r="0.5" />
      <circle cx="50" cy="170" r="0.6" />
      <circle cx="380" cy="160" r="0.5" />
      <circle cx="120" cy="15" r="0.4" />
      <circle cx="280" cy="180" r="0.5" />
    </g>

    {/* Swoosh — broad under-glow */}
    <path
      d="M 60 155 Q 80 60, 220 55 Q 320 52, 368 35"
      stroke="url(#senSwoosh)"
      strokeWidth="16"
      fill="none"
      strokeLinecap="round"
      opacity="0.35"
      filter="url(#senSoftGlow)"
    />
    {/* Swoosh — main arc */}
    <path
      d="M 60 155 Q 80 60, 220 55 Q 320 52, 368 35"
      stroke="url(#senSwoosh)"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
      filter="url(#senSoftGlow)"
    />
    {/* Swoosh — thin bright core */}
    <path
      d="M 80 150 Q 100 65, 225 60 Q 315 58, 365 38"
      stroke="#E0FFFC"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      opacity="0.85"
    />

    {/* Sparkle particles */}
    <g fill="#E0FFFC">
      <circle cx="75" cy="150" r="1.3" opacity="0.9" />
      <circle cx="105" cy="120" r="0.9" opacity="0.7" />
      <circle cx="135" cy="95" r="1" opacity="0.8" />
      <circle cx="175" cy="72" r="0.8" opacity="0.7" />
      <circle cx="245" cy="55" r="1.1" opacity="0.9" />
      <circle cx="305" cy="48" r="0.9" opacity="0.8" />
      <circle cx="340" cy="40" r="1" opacity="0.85" />
    </g>

    {/* SEN letters — chrome fill with drop shadow */}
    <g filter="url(#senDrop)">
      <text
        x="200"
        y="140"
        textAnchor="middle"
        fontFamily="'Archivo Black','Outfit',system-ui,sans-serif"
        fontWeight="900"
        fontSize="110"
        letterSpacing="-4"
        fontStyle="italic"
        fill="url(#senChromeFill)"
      >
        SEN
      </text>
    </g>
    {/* Dark outline for crisp edge */}
    <text
      x="200"
      y="140"
      textAnchor="middle"
      fontFamily="'Archivo Black','Outfit',system-ui,sans-serif"
      fontWeight="900"
      fontSize="110"
      letterSpacing="-4"
      fontStyle="italic"
      fill="none"
      stroke="#0A2038"
      strokeWidth="1.2"
      opacity="0.7"
    >
      SEN
    </text>
    {/* Top chrome highlight */}
    <text
      x="200"
      y="140"
      textAnchor="middle"
      fontFamily="'Archivo Black','Outfit',system-ui,sans-serif"
      fontWeight="900"
      fontSize="110"
      letterSpacing="-4"
      fontStyle="italic"
      fill="url(#senChromeEdge)"
    >
      SEN
    </text>

    {/* Comet head */}
    <circle cx="368" cy="35" r="22" fill="url(#senCometGlow)" />
    <circle cx="368" cy="35" r="5.5" fill="#FFFFFF" filter="url(#senSoftGlow)" />
    <circle cx="368" cy="35" r="2.5" fill="#FFFFFF" />
  </svg>
);

export default SenuerenLogo;
