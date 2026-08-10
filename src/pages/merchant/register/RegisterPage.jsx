import { Link } from 'react-router-dom'
import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'
import Button from '../../../components/ui/Button'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-950/20">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Registration flow</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Set up your merchant workspace</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            The flow is mocked for the thesis prototype and can be expanded into multi-step onboarding later.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/onboarding">
              <Button>Continue to AI diagnostic</Button>
            </Link>
            <Link to="/">
              <Button variant="secondary">Back home</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
