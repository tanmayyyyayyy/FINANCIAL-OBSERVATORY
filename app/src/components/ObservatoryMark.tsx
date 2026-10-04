interface ObservatoryMarkProps {
  size?: number;
  className?: string;
}

export function ObservatoryMark({ size = 22, className }: ObservatoryMarkProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13.25" stroke="currentColor" strokeOpacity=".38" />
      <circle cx="16" cy="16" r="8.25" stroke="currentColor" strokeOpacity=".72" />
      <path d="M16 3v5m0 16v5M3 16h5m16 0h5" stroke="currentColor" strokeLinecap="round" />
      <path d="m12.2 19.8 2.15-6.1 5.45-2.45-2.3 6.2-5.3 2.35Z" fill="currentColor" />
      <circle cx="16" cy="16" r="1.4" fill="#08090b" />
    </svg>
  );
}
