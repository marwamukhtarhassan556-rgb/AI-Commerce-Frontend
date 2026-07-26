import { Link } from 'react-router-dom'
import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="min-h-screen overflow-x-hidden pt-32 hero-gradient">
        <section className="mx-auto max-w-container-max px-4 text-center md:px-2xl">
          <div className="mb-lg inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-md py-xs shadow-sm transition-all duration-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 glow-emerald"></span>
            </span>
            <span className="text-label-sm font-label-sm text-on-surface-variant">⚡ Loved by 5,000+ independent store owners worldwide</span>
          </div>

          <h1 className="mx-auto mb-md max-w-4xl text-display-metrics font-display-metrics leading-tight text-[#0F172A]">
            Turn Your Chat &amp; Custom Store into an <span className="text-primary">Automated Sales Engine.</span>
          </h1>
          <p className="mx-auto mb-xl max-w-2xl text-body-lg font-body-lg leading-relaxed text-[#4B5563]">
            The 24/7 AI Assistant that answers customer questions, recommends products, and processes returns directly inside your website widget.
          </p>

          <div className="mb-3xl flex flex-col items-center justify-center gap-md transition-all duration-700 md:flex-row">
            <Link className="w-full rounded-xl bg-primary px-xl py-lg text-center font-headline-md text-headline-md text-on-primary shadow-lg transition-all hover:brightness-110 active:scale-95 md:w-auto" to="/register">
              Start Free Trial
            </Link>
            <Link className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface px-xl py-lg font-headline-md text-headline-md text-on-surface transition-colors hover:bg-surface-container md:w-auto" to="/signin">
              <span className="material-symbols-outlined" data-icon="play_circle">play_circle</span>
              Watch Demo
            </Link>
          </div>

          <div className="relative mx-auto mt-2xl max-w-5xl">
            <div className="grid grid-cols-1 items-start gap-lg md:grid-cols-12">
              <div className="group relative md:col-span-7">
                <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
                <div className="glass-card relative overflow-hidden rounded-2xl p-lg transition-transform duration-500 hover:-translate-y-2 premium-shadow">
                  <div className="mb-xl flex items-end justify-between">
                    <div>
                      <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Store Revenue (AI Influenced)</p>
                      <h3 className="text-display-metrics font-display-metrics text-primary">$42,904.00</h3>
                    </div>
                    <div className="flex items-center rounded-full bg-secondary-container px-sm py-1 text-label-sm font-label-sm text-on-secondary-container">
                      <span className="material-symbols-outlined text-[16px]" data-icon="trending_up">trending_up</span>
                      +24%
                    </div>
                  </div>
                  <div className="relative h-48 w-full">
                    <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                      <path d="M0 80 Q 50 70, 100 85 T 200 40 T 300 50 T 400 10" fill="none" stroke="#4F46E5" strokeLinecap="round" strokeWidth="4"></path>
                      <path d="M0 80 Q 50 70, 100 85 T 200 40 T 300 50 T 400 10 L 400 100 L 0 100 Z" fill="url(#grad)" opacity="0.1"></path>
                      <defs>
                        <linearGradient id="grad" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }}></stop>
                          <stop offset="100%" style={{ stopColor: '#4F46E5', stopOpacity: 0 }}></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="mt-md flex items-center justify-between border-t border-outline-variant pt-md">
                    <div className="flex -space-x-2">
                      <img className="h-8 w-8 rounded-full border-2 border-white object-cover" alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiqwMCVNP-IxYv8LOlPFgmQTVzm8boLOZsjcCa9ZdU5FBKWchXKo5fZAcLDJ2vH8GvTIryCF_MSJL4IqwIzPuS3FYztMxdbaKgXbYSYrkXS-ldLZOUfRMkFaNW_IpXFSUl_L5CxyMnXZOl0Nxn30Db-W7imP3v_1oaXK5DpIeCZGM_6bMDRQPkUfcYdJQxDHZ-5T_BQeYG5MRNdvv4nasGtAjDSbMjU5NCSgxNk9Dp67lMvxqQu9oRR33UOPUneSB6smTxa7cqu0v7" />
                      <img className="h-8 w-8 rounded-full border-2 border-white object-cover" alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx2nTGBjrLirxN8gAYgKJ5L50stV0DmEGxWuYMYvTW8fz5kuqvDZnsKOCbXI732oji0nyJXg9UI42dD8RlahR9rPVxnXqLLlMyPNmX2xT2kNQdcleya0WlMJZVCkJS03zLS5aZFTst7yDUtpxyHYzYsnAISNQ0Cc0dK5WP2eFzI35tk2N0jWrcGzpTc3tLKgtz2lmIkELg_BkdNQA3gRyKKzRFTZguw02R8cj7RP3LosmIcWx7q11eTpInQR_C3MW-jFYhrJnSc5-y" />
                      <img className="h-8 w-8 rounded-full border-2 border-white object-cover" alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWyTH2_rLlKsKY20iNTFR9aGIbEaCH6GOEnWDACKfZKGjy7DOz2lWpkr7Fn4_KaCRmGRND8Vn5LRkMpUD6xVMUZH-PSyYvzNy2AKGGiGFL8I00c-6we_HYnTHc4Hxtv26OqLHGKMi1lmcnW6dqT4CoTbtXM7qsA7sn3xQNaFel5Xe3t5f0qHrcUvRMLcbggVeoq6o4rP7PpwiNarPTZMNucYE8hmUd1D5nRNz3mGPWTaC9FKAhsBGsNXh6qaOwphn-fk9Hnp00nzi5" />
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-surface-container-high text-[10px] font-bold">+12</div>
                    </div>
                    <span className="text-label-sm font-label-sm text-on-surface-variant">Live Shopping Sessions</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="glass-card mx-auto w-full max-w-[320px] overflow-hidden rounded-3xl border-2 border-primary/20 premium-shadow">
                  <div className="flex items-center justify-between bg-primary p-md text-on-primary">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                        <span className="material-symbols-outlined text-[18px]" data-icon="smart_toy" style={{ fontVariationSettings: 'FILL 1' }}>smart_toy</span>
                      </div>
                      <div>
                        <p className="text-label-sm font-bold leading-none">CommerceMind Assistant</p>
                        <p className="text-[10px] opacity-80">Always active</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[20px]" data-icon="close">close</span>
                  </div>
                  <div className="flex h-80 flex-col gap-md overflow-y-auto bg-surface-container-low p-md">
                    <div className="max-w-[85%] self-start rounded-xl rounded-tl-none bg-white p-sm text-body-md font-body-md shadow-sm">
                      Looking for something special? I found this for you!
                    </div>
                    <div className="max-w-[90%] self-start rounded-xl border border-outline-variant bg-white p-2 shadow-md">
                      <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-surface-container-low">
                        <img className="h-full w-full object-cover" alt="Premium coffee maker" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3M6NddbaGYwtEtwLNgxpXCKCWvo0j6LJevzkJdkdZVlCeCzq5sORqks4SovidMmoAmygGBPbLKqDYrJENfGQbWWhte3Q0-IvMtqN27Akwm2K1iRh9fTOW_GNQz1ERNNcKi8SSOUlAoonGCW_owCKTsBN5S2EpeKyKsiim294A_ZdaujmAgYhjJ0cVgK8T4R2Oa2-VzFSOl_LcNXUa9CimUVmrVFLKlau9UPINa_rW2vywJYyqFCBrkTwn0qGyaKpHFNPGOhJJPbr3" />
                      </div>
                      <p className="text-body-md font-bold">Precision Brewer Pro</p>
                      <p className="text-body-lg font-bold text-primary">$199.00</p>
                      <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-primary py-2 text-label-sm font-bold text-on-primary">
                        Instant Checkout 💳
                      </button>
                    </div>
                    <div className="max-w-[85%] self-end rounded-xl rounded-tr-none bg-primary/10 p-sm text-body-md font-body-md">
                      That's perfect, checking out now.
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-outline-variant bg-white p-sm">
                    <input className="flex-1 border-none text-body-md focus:ring-0" placeholder="Type a message..." type="text" />
                    <button className="text-primary">
                      <span className="material-symbols-outlined" data-icon="send">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-container-max px-4 py-3xl md:px-2xl">
          <div className="mb-2xl text-center">
            <h2 className="mb-md text-headline-lg font-headline-lg">Supercharge Your Operations</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant">Intelligent tools designed for high-growth commerce brands.</p>
          </div>
          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            <div className="glass-card rounded-2xl p-lg transition-transform hover:scale-[1.01] md:col-span-2">
              <div className="flex flex-col gap-lg md:flex-row">
                <div className="md:w-1/2">
                  <div className="mb-md flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF2FF]">
                    <span className="material-symbols-outlined text-primary" data-icon="all_inbox">all_inbox</span>
                  </div>
                  <h3 className="mb-sm text-headline-md font-headline-md">Unified Social Inbox</h3>
                  <p className="text-body-md font-body-md leading-relaxed text-on-surface-variant">
                    Stop switching tabs. Manage WhatsApp, Instagram, and TikTok conversations in a single, AI-powered dashboard that never misses a lead.
                  </p>
                  <div className="mt-lg flex gap-md">
                    <div className="flex items-center gap-1 text-label-sm font-label-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-emerald-500" data-icon="check_circle">check_circle</span>
                      Auto-tagging
                    </div>
                    <div className="flex items-center gap-1 text-label-sm font-label-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-emerald-500" data-icon="check_circle">check_circle</span>
                      Sentiment analysis
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-sm overflow-hidden rounded-xl border border-outline-variant bg-surface-container p-md md:w-1/2">
                  <div className="flex items-center gap-3 rounded-lg bg-white p-sm shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600" data-icon="chat">chat</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-24 rounded bg-outline-variant"></div>
                      <div className="mt-1 h-2 w-12 rounded bg-outline-variant/40"></div>
                    </div>
                    <span className="rounded-full bg-primary-container px-2 py-0.5 text-[10px] text-on-primary-container">WhatsApp</span>
                  </div>
                  <div className="flex translate-x-4 items-center gap-3 rounded-lg bg-white p-sm shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
                      <span className="material-symbols-outlined text-[16px] text-pink-600" data-icon="photo_camera">photo_camera</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-32 rounded bg-outline-variant"></div>
                      <div className="mt-1 h-2 w-16 rounded bg-outline-variant/40"></div>
                    </div>
                    <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] text-on-secondary-container">Instagram</span>
                  </div>
                  <div className="flex -translate-x-2 items-center gap-3 rounded-lg bg-white p-sm shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                      <span className="material-symbols-outlined text-[16px] text-white" data-icon="music_note">music_note</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-20 rounded bg-outline-variant"></div>
                      <div className="mt-1 h-2 w-10 rounded bg-outline-variant/40"></div>
                    </div>
                    <span className="rounded-full bg-on-surface px-2 py-0.5 text-[10px] text-surface">TikTok</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-lg transition-transform hover:scale-[1.01]">
              <div className="mb-md flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF2FF]">
                <span className="material-symbols-outlined text-primary" data-icon="code">code</span>
              </div>
              <h3 className="mb-sm text-headline-md font-headline-md">Embeddable Widget</h3>
              <p className="mb-lg text-body-md font-body-md text-on-surface-variant">
                Go live in 60 seconds with a single line of JavaScript.
              </p>
              <div className="mt-auto overflow-hidden rounded-lg bg-slate-900 p-md">
                <code className="text-[10px] font-mono text-emerald-400">&lt;script src="https://ai.cm.io/v1/w.js" data-id="CM_039X"&gt;&lt;/script&gt;</code>
              </div>
            </div>

            <div className="glass-card rounded-2xl border-t-4 border-primary p-lg transition-transform hover:scale-[1.01]">
              <div className="mb-md flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF2FF]">
                <span className="material-symbols-outlined text-primary" data-icon="inventory_2">inventory_2</span>
              </div>
              <h3 className="mb-sm text-headline-md font-headline-md">Smart Catalog</h3>
              <div className="group relative mt-md">
                <div className="rounded-xl border border-outline-variant bg-surface-container-low p-sm">
                  <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-white">
                    <img className="h-full w-full object-cover" alt="Premium headphones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwKIWrsOjGKmErjf3EyJlVMIcwKrgT9q32K3dJDbmOFYYUOc6VhyfPxQFuPmkDYNDHp-Laq9YpzLbb6x5XnOgO3nznmP8V8OGYX18gnRQAjdEUoJwx5vA3xH3CT-AKinkG_O0du5Psrkvh4cCBWCJtlbZkQE_llLI5coAMApbdOQPdoEUXskBco_VStRuqQvR26tzg2ga_PcC_s8oVMp12B3oaKU8ClB0HMgIfQPNL2mJjX6bL6J_LL0Jdsd4CfBlE3ZmOf_vL41-x" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-label-sm font-bold">$249.00</span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">15% AI Discount</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-lg transition-transform hover:scale-[1.01] md:col-span-2 md:flex md:items-center md:gap-lg">
              <div className="md:w-1/2">
                <div className="mb-md flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <span className="material-symbols-outlined text-primary" data-icon="assignment_return">assignment_return</span>
                </div>
                <h3 className="mb-sm text-headline-md font-headline-md">Smart Return Portal</h3>
                <p className="text-body-md font-body-md leading-relaxed text-on-surface-variant">
                  Automate the headache of returns. AI validates return reasons, checks policy compliance, and generates shipping labels in seconds.
                </p>
              </div>
              <div className="mt-lg w-full md:mt-0 md:w-1/2">
                <div className="relative overflow-hidden rounded-xl border border-outline-variant bg-white p-md shadow-lg">
                  <div className="mb-4 flex items-center justify-between border-b border-outline-variant pb-2">
                    <span className="text-label-sm font-bold">Return Label #RT-882</span>
                    <span className="material-symbols-outlined text-on-surface-variant" data-icon="picture_as_pdf">picture_as_pdf</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 rounded bg-surface-container-high"></div>
                    <div className="h-3 w-1/2 rounded bg-surface-container-high"></div>
                    <div className="mt-4 flex justify-center rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low py-4">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant" data-icon="qr_code_2">qr_code_2</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 rounded-tl-xl bg-emerald-500 p-2 text-[10px] font-bold text-white">VERIFIED</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-inverse-surface py-3xl text-center text-inverse-on-surface">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="mb-md text-headline-lg font-headline-lg">Ready to scale without more staff?</h2>
            <p className="mb-xl text-body-lg font-body-lg opacity-80">Join thousands of stores automating 70% of their customer interactions today.</p>
            <div className="flex flex-col items-center justify-center gap-md md:flex-row">
              <Link className="w-full rounded-xl bg-primary px-xl py-lg text-center font-headline-md text-headline-md text-on-primary transition-all hover:brightness-110 md:w-auto" to="/register">
                Get Started for Free
              </Link>
              <a className="w-full rounded-xl border border-outline-variant px-xl py-lg font-headline-md text-headline-md transition-all hover:bg-white/5 md:w-auto" href="#integrations">
                Talk to Sales
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
