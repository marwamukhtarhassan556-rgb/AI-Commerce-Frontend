import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const channels = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Business',
    description: 'Connect to automate conversations',
    icon: 'chat_bubble',
    accent: 'bg-[#E8F5E9] text-[#2E7D32]',
    status: 'Connected',
    connected: true,
  },
  {
    id: 'instagram',
    title: 'Instagram Direct',
    description: 'Connect to automate DMs',
    icon: 'photo_camera',
    accent: 'bg-[#FCE4EC] text-[#C2185B]',
    status: 'Available',
    connected: false,
  },
  {
    id: 'tiktok',
    title: 'TikTok Shop',
    description: 'Sync products & manage orders',
    icon: 'shopping_bag',
    accent: 'bg-[#131B2E] text-[#FAF8FF]',
    status: 'Available',
    connected: false,
  },
]

function RegisterStep3Page() {
  const navigate = useNavigate()
  const [selectedChannels, setSelectedChannels] = useState(() => new Set(['whatsapp']))

  const toggleChannel = (id) => {
    setSelectedChannels((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const selectedCount = useMemo(() => selectedChannels.size, [selectedChannels])

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/diagnostic')
  }

  return (
    <main className="flex min-h-screen flex-col bg-background font-body-md text-on-surface md:flex-row">
      <section className="relative hidden items-center justify-center overflow-hidden p-2xl md:flex md:w-1/2" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #4F46E5 100%)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #4F46E5 0%, transparent 50%), radial-gradient(circle at 80% 70%, #3525CD 0%, transparent 50%)' }}></div>
        </div>
        <div className="relative z-10 w-full max-w-lg text-white">
          <div className="mb-xl flex items-center gap-sm">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: 'FILL 1' }}>hub</span>
            <h1 className="font-headline-lg text-headline-lg tracking-tight">CommerceMind AI</h1>
          </div>
          <div className="grid grid-cols-4 gap-md opacity-90">
            <div className="flex aspect-square items-center justify-center rounded-xl border border-white/20 bg-white/10 p-md backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">chat</span>
            </div>
            <div className="flex aspect-square translate-y-4 scale-90 items-center justify-center rounded-xl border border-white/20 bg-white/20 p-md backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">shopping_cart</span>
            </div>
            <div className="flex aspect-square items-center justify-center rounded-xl border border-white/20 bg-white/10 p-md backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">trending_up</span>
            </div>
            <div className="flex aspect-square translate-y-[-10px] items-center justify-center rounded-xl border border-white/20 bg-white/20 p-md backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>
            <div className="-translate-x-4 rounded-xl border border-white/20 bg-white/20 p-md backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
            <div className="flex aspect-square scale-110 items-center justify-center rounded-xl border border-white/40 bg-white/30 p-md backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">language</span>
            </div>
            <div className="flex aspect-square items-center justify-center rounded-xl border border-white/20 bg-white/10 p-md backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">dashboard</span>
            </div>
            <div className="translate-x-4 rounded-xl border border-white/20 bg-white/20 p-md backdrop-blur-md">
              <span className="material-symbols-outlined text-3xl">sync</span>
            </div>
          </div>
          <div className="mt-2xl max-w-sm">
            <p className="font-body-lg text-body-lg leading-relaxed text-white/80">Synchronize your sales data and customer interactions across all platforms in real-time.</p>
          </div>
        </div>
      </section>

      <section className="relative flex w-full items-center justify-center bg-surface p-lg md:w-1/2 md:p-2xl">
        <div className="w-full max-w-md">
          <div className="mb-2xl flex gap-xs">
            <div className="h-1.5 flex-1 rounded-full bg-primary opacity-40"></div>
            <div className="h-1.5 flex-1 rounded-full bg-primary opacity-40"></div>
            <div className="h-1.5 flex-1 rounded-full bg-primary"></div>
          </div>

          <header className="mb-xl">
            <h2 className="mb-sm font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">Connect your sales channels</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Select where your AI Assistant will interact with customers and drive sales.</p>
          </header>

          <form className="mb-2xl space-y-md" onSubmit={handleSubmit}>
            {channels.map((channel) => {
              const isActive = selectedChannels.has(channel.id)
              const isConnected = channel.connected
              return (
                <div key={channel.id} className={`flex items-center justify-between rounded-xl border p-lg transition-all duration-300 ${isActive ? 'border-primary bg-surface-container-low' : 'border-outline-variant bg-surface hover:border-primary-container hover:bg-surface-container-low'}`}>
                  <div className="flex items-center gap-md">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${channel.accent}`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: 'FILL 1' }}>{channel.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-body-lg font-bold text-on-surface">{channel.title}</h3>
                      <p className="mt-xs font-label-sm text-on-surface-variant">{channel.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    {isConnected ? (
                      <div className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-2xl text-secondary" style={{ fontVariationSettings: 'FILL 1' }}>check_circle</span>
                      </div>
                    ) : (
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input checked={isActive} className="peer sr-only" onChange={() => toggleChannel(channel.id)} type="checkbox" />
                        <div className={`relative h-6 w-11 rounded-full transition-colors ${isActive ? 'bg-primary-container' : 'bg-outline-variant'}`}>
                          <div className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              )
            })}

            <button className="flex w-full items-center justify-center gap-sm rounded-xl bg-primary py-lg font-bold text-on-primary shadow-[0px_4px_20px_rgba(79,70,229,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]" type="submit">
              Generate My AI Assistant ⚡
            </button>
          </form>

          <div className="text-center">
            <button className="flex items-center justify-center gap-xs font-label-sm text-on-surface-variant transition-colors hover:text-primary" type="button" onClick={() => navigate('/register/step-2')}>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Store Details
            </button>
          </div>

          <footer className="mt-xl hidden items-center justify-between px-2xl text-on-surface-variant/60 md:flex">
            <p className="font-label-sm">© 2024 CommerceMind AI</p>
            <div className="flex gap-md">
              <span className="font-label-sm">Privacy Policy</span>
              <span className="font-label-sm">Security</span>
            </div>
          </footer>
        </div>
      </section>
    </main>
  )
}

export default RegisterStep3Page
