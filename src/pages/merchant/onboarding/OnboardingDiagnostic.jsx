import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'

const steps = [
  'Scanning your storefront signals',
  'Mapping intent and customer journey',
  'Preparing your AI growth playbook',
]

export default function OnboardingDiagnostic() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)
  const activeStep = useMemo(() => {
    if (progress >= 70) return steps[2]
    if (progress >= 30) return steps[1]
    return steps[0]
  }, [progress])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        const next = current + 6
        if (next >= 100) {
          clearInterval(interval)
          setComplete(true)
          return 100
        }
        return next
      })
    }, 220)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (complete) {
      const timer = window.setTimeout(() => navigate('/dashboard'), 1400)
      return () => window.clearTimeout(timer)
    }
  }, [complete, navigate])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-on-background">
      <Navbar />

      <div className={`success-overlay ${complete ? 'active' : ''}`}>
        <div className="p-xl text-center">
          <div className="mx-auto mb-xl flex h-24 w-24 items-center justify-center rounded-full bg-secondary-container text-secondary animate-bounce">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: 'FILL 1' }}>check_circle</span>
          </div>
          <h2 className="mb-md text-headline-lg font-headline-lg text-on-surface">AI Integration Successful</h2>
          <p className="mb-2xl text-body-lg font-body-lg text-on-surface-variant">Preparing your personalized merchant dashboard...</p>
          <div className="mx-auto h-2 w-full max-w-sm overflow-hidden rounded-full bg-surface-container-low">
            <div className="h-full animate-[loading_2s_ease-in-out_infinite] bg-primary" style={{ width: '100%', transition: 'width 2s' }}></div>
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 pb-24 pt-32 md:px-2xl">
        <section className="mb-xl text-center">
          <div className="mb-md inline-flex items-center gap-xs rounded-full border border-primary/20 bg-primary-container/10 px-md py-xs text-primary">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: 'FILL 1' }}>analytics</span>
            <span className="text-label-sm font-label-sm uppercase tracking-wider">Analysis Complete</span>
          </div>
          <h1 className="mb-sm text-headline-lg-mobile font-headline-lg-mobile text-on-surface md:text-headline-lg md:font-headline-lg">
            Your Store AI Diagnostic is Ready 🔍
          </h1>
          <p className="mx-auto max-w-2xl text-body-lg font-body-lg text-on-surface-variant">
            We scanned your website and channels. Here is what CommerceMind AI will optimize today:
          </p>
        </section>

        <div className="mb-2xl grid grid-cols-1 gap-lg md:grid-cols-3">
          <div className="bento-card relative overflow-hidden rounded-xl border-t-4 border-t-error p-lg group">
            <div className="scanning-line"></div>
            <div className="mb-md flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-container">
                <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: 'FILL 1' }}>trending_down</span>
              </div>
              <span className="rounded-full bg-error-container px-sm py-1 text-label-sm font-label-sm text-on-error-container">High Impact</span>
            </div>
            <h3 className="mb-xs text-left text-headline-md font-headline-md text-on-surface">Estimated Lost Revenue</h3>
            <div className="mb-sm text-display-metrics font-display-metrics text-error">
              $1,240<span className="text-xl font-headline-md">/month</span>
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant">Due to delayed support replies across Facebook and WhatsApp.</p>
          </div>

          <div className="bento-card relative overflow-hidden rounded-xl border-t-4 border-t-[#F59E0B] p-lg">
            <div className="mb-md flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-fixed">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: 'FILL 1' }}>question_answer</span>
              </div>
              <span className="rounded-full bg-tertiary-fixed px-sm py-1 text-label-sm font-label-sm text-on-tertiary-fixed">Urgent Fix</span>
            </div>
            <h3 className="mb-xs text-left text-headline-md font-headline-md text-on-surface">Unaddressed Customer FAQs</h3>
            <div className="mb-sm text-display-metrics font-display-metrics text-[#F59E0B]">
              37 <span className="text-xl font-headline-md">Missing Answers</span>
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant">Critical gaps found in warranty &amp; shipping policies based on crawl.</p>
          </div>

          <div className="bento-card relative overflow-hidden rounded-xl border-t-4 border-t-secondary p-lg">
            <div className="mb-md flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container">
                <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: 'FILL 1' }}>energy_savings_leaf</span>
              </div>
              <span className="rounded-full bg-secondary-container px-sm py-1 text-label-sm font-label-sm text-on-secondary-container">Opportunity</span>
            </div>
            <h3 className="mb-xs text-left text-headline-md font-headline-md text-on-surface">Recoverable Revenue</h3>
            <div className="mb-sm text-display-metrics font-display-metrics text-secondary">
              +$410<span className="text-xl font-headline-md">/week</span>
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant">Projected growth via automated AI-driven cart recovery workflows.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-lg md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="h-full rounded-xl border border-outline-variant/30 bg-surface-container-low p-xl backdrop-blur-sm">
              <h4 className="mb-md text-headline-md font-headline-md text-on-surface">AI Insights &amp; Benchmarking</h4>
              <ul className="space-y-md">
                <li className="flex items-start gap-md">
                  <span className="material-symbols-outlined mt-1 text-primary" style={{ fontVariationSettings: 'FILL 1' }}>check_circle</span>
                  <div>
                    <span className="block text-body-lg font-body-lg font-bold text-on-surface">Product Crawl Successful</span>
                    <span className="text-body-md font-body-md text-on-surface-variant">1,402 SKUs synced with CommerceMind knowledge base.</span>
                  </div>
                </li>
                <li className="flex items-start gap-md">
                  <span className="material-symbols-outlined mt-1 text-primary" style={{ fontVariationSettings: 'FILL 1' }}>check_circle</span>
                  <div>
                    <span className="block text-body-lg font-body-lg font-bold text-on-surface">Sentiment Baseline Established</span>
                    <span className="text-body-md font-body-md text-on-surface-variant">Customer satisfaction is currently 14% below industry average.</span>
                  </div>
                </li>
                <li className="flex items-start gap-md">
                  <span className="material-symbols-outlined mt-1 text-primary" style={{ fontVariationSettings: 'FILL 1' }}>check_circle</span>
                  <div>
                    <span className="block text-body-lg font-body-lg font-bold text-on-surface">Channel Connectivity</span>
                    <span className="text-body-md font-body-md text-on-surface-variant">Shopify, Instagram, and Klaviyo ready for automation.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="group relative md:col-span-5">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-secondary-fixed opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200"></div>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-xl">
              <img alt="E-commerce analytics dashboard visualization" className="h-full w-full object-cover opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU9y8MTmglnNFFyl-6C9XfRs1zBooSm1GcjdJy3Rs0020G7bvC1GqzRGxAiZ8tjnL_ab8M8lxcpPfEw5ShP1_gRE2YQT2TzP-EXMJEk-_uClurBh-nGsOUePun31FvyA3RwKQobn7kcu1iv5sp8i1GwGo8JTyRaFPUpnMElJljrL4EKuyVyThiD6-8VD2ORKi7-H1z_xcJv4hr9I1ZWZ0yLH3aKxYi_5wA5ux6aTTlgbbRXkOLBquhrM-fCHgOm_nX0R6AgfQJtU1q" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-lg">
                <div className="text-white">
                  <p className="mb-base text-label-sm font-label-sm uppercase opacity-80">Live Context Engine</p>
                  <p className="text-headline-md font-headline-md">AI Model Calibrated to Your Store Data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3xl text-center">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-outline-variant/50 bg-surface-container-low/70 p-6">
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-gradient-to-r from-primary via-indigo-500 to-secondary transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-label-sm font-label-sm uppercase tracking-wider text-primary">{progress}% complete</div>
            <div className="rounded-full border border-primary/20 bg-primary-container/10 px-md py-xs text-body-md font-body-md text-primary">{activeStep}</div>
            <button className="indigo-glow flex items-center gap-md rounded-full bg-primary px-3xl py-xl text-headline-md font-headline-md text-on-primary transition-all hover:scale-105 active:scale-95 animate-float" type="button" onClick={() => setComplete(true)}>
              Activate AI &amp; Go to Dashboard 🚀
            </button>
            <p className="text-body-md font-body-md text-on-surface-variant">Join 4,200+ merchants optimizing their scale.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
