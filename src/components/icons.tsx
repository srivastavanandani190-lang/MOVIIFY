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
        
        <symbol id="play-icon" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" stroke="url(#metallicGradient)" strokeWidth="4" fill="none"/>
            <polygon points="40,30 70,50 40,70" fill="url(#metallicGradient)"/>
        </symbol>
      </defs>

      {/* Play Icon */}
      <use href="#play-icon" x="5" y="15" width="70" height="70" filter="url(#softGlow)"/>
      
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