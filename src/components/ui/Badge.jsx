export default function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200 ${className}`.trim()}>
      {children}
    </span>
  )
}
