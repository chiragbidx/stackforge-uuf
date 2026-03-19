// Small globe badge illustration for metrics/support blocks.
export function GlobeBadgeIllustration() {
  return (
    <svg
      role="img"
      aria-label="Globe badge"
      viewBox="0 0 64 64"
      className="h-10 w-10 text-[#fb7232]"
      fill="none"
    >
      <circle cx="32" cy="32" r="28" fill="#fff3ec" stroke="#fb7232" strokeWidth="3" />
      <path
        d="M10 32h44M32 10v44M18 18c6 4 10 4 14 0m-14 28c6-4 10-4 14 0m14-28c-6 4-10 4-14 0m14 28c-6-4-10-4-14 0"
        stroke="#fb7232"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="32" cy="32" rx="10" ry="26" stroke="#fb7232" strokeWidth="3" />
    </svg>
  );
}
