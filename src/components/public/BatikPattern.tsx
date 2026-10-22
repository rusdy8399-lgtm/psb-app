import React from "react";

interface BatikOverlayProps {
  className?: string;
  patternId?: string;
}

/**
 * BatikOverlay Component
 * Renders a seamless, scalable Indonesian Batik Kawung geometric watermark
 * with customizable opacity and color styling.
 */
export function BatikOverlay({
  className = "opacity-[0.07]",
  patternId = "batik-kawung-pattern",
}: BatikOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      <svg
        className="w-full h-full text-white fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            {/* Central 4-petal Kawung motif */}
            <path
              d="M 28,10 C 18,19 18,37 28,46 C 38,37 38,19 28,10 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M 10,28 C 19,18 37,18 46,28 C 37,38 19,38 10,28 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle cx="28" cy="28" r="2.8" fill="currentColor" />

            {/* Corner quadrants for seamless repeat */}
            {/* Top-Left (0,0) */}
            <path
              d="M 0,-18 C -10,-9 -10,9 0,18 C 10,9 10,-9 0,-18 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M -18,0 C -9,-10 9,-10 18,0 C 9,10 -9,10 -18,0 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle cx="0" cy="0" r="2.8" fill="currentColor" />

            {/* Top-Right (56,0) */}
            <path
              d="M 56,-18 C 46,-9 46,9 56,18 C 66,9 66,-9 56,-18 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M 38,0 C 47,-10 65,-10 74,0 C 65,10 47,10 38,0 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle cx="56" cy="0" r="2.8" fill="currentColor" />

            {/* Bottom-Left (0,56) */}
            <path
              d="M 0,38 C -10,47 -10,65 0,74 C 10,65 10,47 0,38 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M -18,56 C -9,46 9,46 18,56 C 9,66 -9,66 -18,56 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle cx="0" cy="56" r="2.8" fill="currentColor" />

            {/* Bottom-Right (56,56) */}
            <path
              d="M 56,38 C 46,47 46,65 56,74 C 66,65 66,47 56,38 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M 38,56 C 47,46 65,46 74,56 C 65,66 47,66 38,56 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle cx="56" cy="56" r="2.8" fill="currentColor" />

            {/* Symmetric star/diamond accents */}
            <circle cx="14" cy="14" r="1.5" fill="currentColor" />
            <circle cx="42" cy="14" r="1.5" fill="currentColor" />
            <circle cx="14" cy="42" r="1.5" fill="currentColor" />
            <circle cx="42" cy="42" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

interface BatikBorderStripProps {
  className?: string;
  patternId?: string;
}

/**
 * BatikBorderStrip Component
 * Renders an authentic Indonesian Batik Tumpal ornamental trim band,
 * ideal for headers, section headers, and footer borders.
 */
export function BatikBorderStrip({
  className = "h-4 text-amber-400",
  patternId = "batik-tumpal-border",
}: BatikBorderStripProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden select-none pointer-events-none ${className}`}
    >
      <svg
        className="w-full h-full fill-current"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="repeat"
      >
        <defs>
          <pattern
            id={patternId}
            width="36"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            {/* Tumpal triangular motif */}
            <path
              d="M 0,0 L 18,15 L 36,0 Z"
              fill="currentColor"
              fillOpacity="0.22"
              stroke="currentColor"
              strokeWidth="1"
            />
            {/* Inverted mini accent triangle */}
            <path
              d="M 9,0 L 18,8 L 27,0 Z"
              fill="currentColor"
              fillOpacity="0.45"
            />
            {/* Diamond core emblem */}
            <polygon
              points="18,7 21,11 18,15 15,11"
              fill="currentColor"
              fillOpacity="0.85"
            />
            <circle cx="18" cy="11" r="1.3" fill="#FFFBEB" />
            {/* Micro connecting beads along the top */}
            <circle cx="0" cy="2" r="1" fill="currentColor" fillOpacity="0.5" />
            <circle cx="9" cy="2" r="1" fill="currentColor" fillOpacity="0.5" />
            <circle cx="27" cy="2" r="1" fill="currentColor" fillOpacity="0.5" />
            <circle cx="36" cy="2" r="1" fill="currentColor" fillOpacity="0.5" />
            {/* Subtle bottom finish line */}
            <line
              x1="0"
              y1="17.5"
              x2="36"
              y2="17.5"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeOpacity="0.35"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

