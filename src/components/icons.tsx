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
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
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

        <g id="film-reel-icon">
            <circle cx="35" cy="50" r="32" fill="none" stroke="url(#metallicGradient)" strokeWidth="4" />
            <circle cx="35" cy="50" r="12" fill="hsl(var(--background))" stroke="url(#metallicGradient)" strokeWidth="2"/>
            
            {/* Cutouts */}
            <path d="M 35,24 a 26,26 0 0 1 0,52 a 22,22 0 0 0 0,-52" fill="hsl(var(--background))" />
            <path d="M 59,35 a 26,26 0 0 1 -52,0 a 22,22 0 0 0 52,0" transform="rotate(60 35 50)" fill="hsl(var(--background))" />
            <path d="M 59,35 a 26,26 0 0 1 -52,0 a 22,22_ 0 0 0 52,0" transform="rotate(-60 35 50)" fill="hsl(var(--background))" />
            
            <circle cx="35" cy="50" r="30" fill="none" stroke="hsl(var(--background))" strokeWidth="4" />

            {/* Film Holes */}
             <g fill="url(#metallicGradient)">
                <rect x="11" y="22" width="4" height="4" rx="1" transform="rotate(-20 13 24)"/>
                <rect x="18" y="15" width="4" height="4" rx="1" transform="rotate(-10 20 17)"/>
                <rect x="28" y="10" width="4" height="4" rx="1" transform="rotate(0 30 12)"/>
                <rect x="39" y="10" width="4" height="4" rx="1" transform="rotate(15 41 12)"/>
                <rect x="50" y="15" width="4" height="4" rx="1" transform="rotate(25 52 17)"/>
                <rect x="58" y="23" width="4" height="4" rx="1" transform="rotate(35 60 25)"/>

                <rect x="11" y="72" width="4" height="4" rx="1" transform="rotate(20 13 74)"/>
                <rect x="18" y="80" width="4" height="4" rx="1" transform="rotate(10 20 82)"/>
                <rect x="28" y="85" width="4" height="4" rx="1" transform="rotate(0 30 87)"/>
                <rect x="39" y="85" width="4" height="4" rx="1" transform="rotate(-15 41 87)"/>
                <rect x="50" y-="80" width="4" height="4" rx="1" transform="rotate(-25 52 82)"/>
                <rect x="58" y="72" width="4" height="4" rx="1" transform="rotate(-35 60 74)"/>
             </g>
        </g>
      </defs>

      {/* Film Reel Icon */}
      <use href="#film-reel-icon" x="0" y="0" filter="url(#softGlow)" />
      
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
