import type { SVGProps } from "react";

export function MOVIIFYLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 400 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        {/* Metallic Bronze/Copper Gradient */}
        <linearGradient id="metallicGradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#8C7853" />
          <stop offset="20%" stopColor="#B89B74" />
          <stop offset="50%" stopColor="#E6C99F" />
          <stop offset="80%" stopColor="#B89B74" />
          <stop offset="100%" stopColor="#8C7853" />
        </linearGradient>
        
        {/* Soft Glow Filter */}
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 3D Highlight Filter */}
        <filter id="highlight">
          <feSpecularLighting in="SourceAlpha" surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor="#E6C99F" result="specular">
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specular" />
          <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lit" />
        </filter>
        
        <symbol id="star-sparkle" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,1L9,9L1,12L9,15L12,23L15,15L23,12L15,9L12,1Z" />
        </symbol>
      </defs>

      {/* Stylized Film Reel / Play Button Icon */}
      <g transform="translate(35, 50)" filter="url(#softGlow)">
        <circle cx="0" cy="0" r="30" fill="none" stroke="url(#metallicGradient)" strokeWidth="3" />
        <path d="M -12 -18 L 15 0 L -12 18 Z" fill="hsl(var(--foreground))" />
        
        {/* Star sparkles */}
        <use href="#star-sparkle" x="-35" y="-35" width="8" height="8" className="text-yellow-200 opacity-60 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <use href="#star-sparkle" x="28" y="-15" width="10" height="10" className="text-yellow-100 opacity-80 animate-pulse" />

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
        fill="url(#metallicGradient)" 
        filter="url(#highlight)"
        letterSpacing="2"
      >
        MOVIIFY
      </text>
    </svg>
  );
}
