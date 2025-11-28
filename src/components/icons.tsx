import type { SVGProps } from "react";

export function MOVIIFYLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 400 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(120 25% 35%)' }} /> 
          <stop offset="50%" style={{ stopColor: 'hsl(0 50% 45%)' }} />
          <stop offset="100%" style={{ stopColor: 'hsl(0 0% 12%)' }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Star sparkle filter */}
        <symbol id="star-sparkle" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" />
        </symbol>
      </defs>

      {/* Stylized Film Reel / Play Button Icon */}
      <g transform="translate(35, 50)" filter="url(#glow)">
        <circle cx="0" cy="0" r="30" fill="none" stroke="url(#neonGradient)" strokeWidth="4" />
        <path d="M -12 -18 L 15 0 L -12 18 Z" fill="hsl(var(--foreground))" />
        
        {/* Star sparkles */}
        <use href="#star-sparkle" x="-35" y="-35" width="10" height="10" className="text-green-300 opacity-80 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <use href="#star-sparkle" x="20" y="25" width="8" height="8" className="text-red-300 opacity-70 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <use href="#star-sparkle" x="28" y="-15" width="12" height="12" className="text-gray-400 opacity-90 animate-pulse" />

        {/* Film reel holes */}
        <g fill="hsl(var(--background))">
            <rect x="-28" y="-22" width="4" height="4" rx="1" />
            <rect x="-28" y="-14" width="4" height="4" rx="1" />
            <rect x="-28" y="-6" width="4" height="4" rx="1" />
            <rect x="-28" y="2" width="4" height="4" rx="1" />
            <rect x="-28" y="10" width="4" height="4" rx="1" />
            <rect x="-28" y="18" width="4" height="4" rx="1" />
        </g>
      </g>
      
      {/* Typography "MOVIIFY" */}
      <text 
        x="80" 
        y="70" 
        fontFamily="Playfair Display, serif"
        fontSize="70" 
        fontWeight="bold"
        fill="url(#neonGradient)" 
        filter="url(#glow)"
        letterSpacing="2"
      >
        MOVIIFY
      </text>
    </svg>
  );
}
