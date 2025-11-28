import type { SVGProps } from "react";

export function CineScopeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 7.5L4 16.5" />
      <path d="M20 16.5L4 7.5" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
