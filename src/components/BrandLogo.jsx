export default function BrandLogo({ compact = false, tagline = false, className = '', light = false }) {
  return <span className={`brand-logo ${light ? 'brand-logo--on-dark' : ''} inline-flex items-center gap-2 ${className}`} aria-label="Navi">
    <span className={`brand-logo__mark ${compact ? 'h-8 w-8' : 'h-10 w-10'} shrink-0`}><img src="/navi-mark-blue.png" alt="" className="h-full w-full object-contain" /></span>
    {!compact && <span className="leading-none"><span className="brand-logo__type text-2xl font-extrabold tracking-tight">Na<span>v</span>i</span>{tagline && <span className="brand-logo__tagline mt-1 block text-[10px] font-semibold tracking-wide">Navigate. Engage. Grow.</span>}</span>}
  </span>;
}
