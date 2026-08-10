export default function BrandLogo({ compact = false, tagline = false, className = '', light = false }) {
  const wordColor = light ? 'text-white' : 'text-slate-950';
  return <span className={`inline-flex items-center gap-2 ${className}`} aria-label="Navi">
    <span className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} shrink-0 overflow-hidden rounded-xl bg-white/95 p-0.5 shadow-sm`}><img src="/navi-mark.png" alt="" className="h-full w-full object-contain" /></span>
    {!compact && <span className="leading-none"><span className={`text-2xl font-extrabold tracking-tight ${wordColor}`}>Na<span className="text-[#68b63c]">v</span>i</span>{tagline && <span className={`mt-1 block text-[10px] font-semibold tracking-wide ${light ? 'text-slate-300' : 'text-slate-500'}`}>Navigate. Engage. Grow.</span>}</span>}
  </span>;
}
