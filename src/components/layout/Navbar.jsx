import { Link } from 'react-router-dom'
import BrandLogo from '../BrandLogo'

export default function Navbar({ tagline = false }) {
  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-outline-variant bg-surface px-4 py-sm md:px-lg">
      <Link to="/" className="flex items-center gap-2">
        <BrandLogo tagline={tagline} className={tagline ? 'landing-nav-brand' : ''} />
      </Link>
      <nav className="hidden items-center gap-xl md:flex">
        <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#features">Features</a>
        <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#pricing">Pricing</a>
        <a className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#integrations">Integrations</a>
      </nav>
      <div className="flex items-center gap-sm">
        <Link to="/signin" className={`${tagline ? 'landing-signin ' : ''}rounded-lg border border-outline-variant px-lg py-sm text-label-sm font-label-sm text-on-surface-variant transition-all hover:border-primary hover:text-primary`}>
          Sign In
        </Link>
      </div>
    </header>
  )
}
