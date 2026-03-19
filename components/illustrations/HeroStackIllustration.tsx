// Simple stack illustration for the hero panel. Colors align to Panda palette.
export function HeroStackIllustration() {
  return (
    <svg
      role="img"
      aria-label="Stack illustration"
      viewBox="0 0 160 140"
      className="h-20 w-24 text-[#fb7232]"
      fill="none"
    >
      <rect x="20" y="20" width="120" height="80" rx="14" fill="#fff3ec" stroke="#fb7232" strokeWidth="3" />
      <rect x="32" y="36" width="96" height="16" rx="6" fill="#fb7232" opacity="0.15" />
      <rect x="32" y="60" width="64" height="14" rx="6" fill="#fb7232" opacity="0.25" />
      <rect x="32" y="82" width="42" height="10" rx="5" fill="#fb7232" opacity="0.35" />
      <circle cx="54" cy="108" r="10" fill="#fb7232" opacity="0.2" />
      <path d="M90 108c0-8 8-14 18-14s18 6 18 14" stroke="#fb7232" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 36h52" stroke="#fb7232" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 60h36" stroke="#fb7232" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 82h24" stroke="#fb7232" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
