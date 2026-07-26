import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'

const cards = [
  { title: 'Revenue pulse', value: '$84.2K', detail: 'Week over week +18.4%' },
  { title: 'Automations', value: '27', detail: 'Live flows active now' },
  { title: 'Customer care', value: '91%', detail: 'Resolution score' },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-950/20">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">CommerceMind AI dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Your AI-led commerce command center</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            This mock dashboard completes the onboarding journey and shows the next step in the product experience.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
                <p className="text-sm text-slate-400">{card.title}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                <p className="mt-2 text-sm text-slate-400">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
