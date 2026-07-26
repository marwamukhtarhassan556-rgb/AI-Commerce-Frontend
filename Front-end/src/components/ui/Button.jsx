const variants = {
  primary: 'bg-slate-950 text-white hover:bg-slate-800 shadow-lg shadow-slate-950/20',
  secondary: 'bg-white/10 text-slate-100 border border-white/20 hover:bg-white/20',
  ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/10',
}

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
