import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AIDiagnosticPage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(64)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 99) {
          window.clearInterval(interval)
          setComplete(true)
          return 99
        }
        return Math.min(value + Math.floor(Math.random() * 5) + 1, 99)
      })
    }, 500)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!complete) return undefined
    const timer = window.setTimeout(() => navigate('/building-assistant'), 1400)
    return () => window.clearTimeout(timer)
  }, [complete, navigate])

  const statusLabel = useMemo(() => {
    if (progress >= 90) return 'Finalizing'
    if (progress >= 70) return 'Optimizing'
    return 'Analyzing'
  }, [progress])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 text-on-surface">
      <div className="fixed inset-0 z-0">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjNyCw0Xed7IMMTzEkKqwV8ET7Z9dbBpK_k2n1zEIcJ59Xoe81RoHeOBN9oKIFBcWKvXJewwcJPl9X1rdwqnD6tuWLhEUZHIJQqqpBUZ8CSaQVxqYyQkLpnDAq9q6TA5vCocqbKz_izrJRyDVQEHholdvNpnTmbH7KDTrHhM6nhUnShC_UH5She6Vp6jDM0iAZAmd1lDwIdhbHQku15TMwaNBvVTT1CdRI2hEb4VNzBiGc4E4ysbXDzwbfrm9RCQhrxDwrA-OI03Dx')" }}></div>
        <div className="absolute inset-0 bg-surface/60 backdrop-blur-[8px]"></div>
      </div>

      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-4 py-sm md:px-lg">
        <div className="text-headline-md font-headline-md text-primary">CommerceMind AI</div>
        <div className="flex items-center gap-xs text-label-sm font-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">lock</span>
          Secure Processing Environment
        </div>
      </header>

      <main className="relative z-10 w-full max-w-[560px] px-md">
        <div className="flex flex-col items-center overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-xl text-center shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
          <div className="mb-lg">
            <div className="mx-auto mb-md flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
            </div>
            <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight md:text-headline-lg-mobile">
              Building your Custom AI Assistant...
            </h1>
            <p className="mt-sm text-body-md font-body-md text-on-surface-variant">
              Analyzing your commerce ecosystem to generate a bespoke brand voice.
            </p>
          </div>

          <div className="relative mb-xl h-48 w-48">
            <svg className="h-full w-full animate-spin-slow" viewBox="0 0 192 192">
              <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="4"></circle>
              <circle className="text-primary" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="552.92" strokeDashoffset={552.92 - (552.92 * progress) / 100} strokeLinecap="round" strokeWidth="4"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-display-metrics font-display-metrics leading-none text-primary">{progress}%</div>
              <div className="mt-xs text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant">{statusLabel}</div>
            </div>
          </div>

          <div className="w-full space-y-md">
            <div className="flex items-center justify-between rounded-lg border border-secondary-container/30 bg-secondary-container/10 p-md transition-all duration-500">
              <div className="flex items-center gap-md">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-on-secondary-container">
                  <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: 'FILL 1' }}>check</span>
                </div>
                <span className="text-body-md font-body-md text-on-surface">Connecting social media channels...</span>
              </div>
              <span className="text-label-sm font-label-sm font-bold uppercase tracking-wider text-on-secondary-container">Done</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-secondary-container/30 bg-secondary-container/10 p-md transition-all duration-500">
              <div className="flex items-center gap-md">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-on-secondary-container">
                  <span className="material-symbols-outlined text-[16px] text-white" style={{ fontVariationSettings: 'FILL 1' }}>check</span>
                </div>
                <span className="text-body-md font-body-md text-on-surface">Scanning website URL &amp; Return policies...</span>
              </div>
              <span className="text-label-sm font-label-sm font-bold uppercase tracking-wider text-on-secondary-container">Done</span>
            </div>
            <div className="pulse-active flex items-center justify-between rounded-lg border-2 border-primary bg-primary-container/5 p-md shadow-sm">
              <div className="flex items-center gap-md">
                <div className="flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-primary">
                  <span className="material-symbols-outlined text-[16px] text-white">bolt</span>
                </div>
                <span className="text-body-md font-body-md font-semibold text-primary">Training AI on your store's custom voice...</span>
              </div>
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></span>
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></span>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container p-md opacity-40 grayscale">
              <div className="flex items-center gap-md">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-outline">
                  <span className="material-symbols-outlined text-[14px] text-outline">pending</span>
                </div>
                <span className="text-body-md font-body-md text-on-surface-variant">Deploying conversational logic...</span>
              </div>
              <span className="text-label-sm font-label-sm italic text-on-surface-variant">Pending</span>
            </div>
          </div>

          <div className="mt-xl w-full border-t border-outline-variant pt-lg">
            <div className="flex items-center justify-center gap-sm text-label-sm font-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
              System synchronization in progress. Please do not refresh.
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 z-50 flex w-full flex-col items-center justify-between px-lg py-md text-label-sm font-label-sm text-on-surface-variant md:flex-row">
        <div>© 2024 CommerceMind AI. All rights reserved.</div>
        <div className="mt-sm flex gap-lg md:mt-0">
          <a className="transition-colors hover:text-primary" href="#">Privacy Policy</a>
          <a className="transition-colors hover:text-primary" href="#">Terms of Service</a>
          <a className="transition-colors hover:text-primary" href="#">Help Center</a>
        </div>
      </footer>
    </div>
  )
}

export default AIDiagnosticPage
