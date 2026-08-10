import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-outline-variant bg-surface px-4 py-sm md:px-lg">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-headline-md font-headline-md text-primary">CommerceMind AI</span>
      </Link>
      <nav className="hidden items-center gap-xl md:flex">
        <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#features">Features</a>
        <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#pricing">Pricing</a>
        <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#integrations">Integrations</a>
      </nav>
      <div className="flex items-center gap-sm">
        <Link to="/signin" className="rounded-lg border border-outline-variant px-lg py-sm text-label-sm font-label-sm text-on-surface-variant transition-all hover:border-primary hover:text-primary">
          Sign In
        </Link>
      </div>
    </header>
  )
}
