import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialForm = {
  storeName: '',
  websiteUrl: '',
  monthlyOrders: '',
}

function RegisterStep2Page() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/register/step-3')
  }

  return (
    <main className="flex min-h-screen w-full bg-background font-body-md text-on-surface antialiased">
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-2xl md:flex" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #4F46E5 100%)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #4F46E5 0%, transparent 50%), radial-gradient(circle at 80% 70%, #3525CD 0%, transparent 50%)' }}></div>
        </div>
        <div className="relative z-10 flex items-center gap-sm">
          <div className="rounded-lg border border-white/20 bg-white/10 p-xs backdrop-blur-md">
            <span className="material-symbols-outlined text-[32px] text-white">hub</span>
          </div>
          <h1 className="font-headline-md text-headline-md tracking-tight text-white">CommerceMind AI</h1>
        </div>
        <div className="relative z-10 flex flex-grow flex-col items-center justify-center">
          <div className="grid grid-cols-4 gap-md opacity-40">
            {[
              { icon: 'store', delay: '0s' },
              { icon: 'analytics', delay: '0.5s' },
              { icon: 'sync', delay: '1s' },
              { icon: 'inventory_2', delay: '1.5s' },
              { icon: 'payments', delay: '0.2s' },
              { icon: 'bolt', delay: '0.7s' },
              { icon: 'group', delay: '1.2s' },
              { icon: 'shopping_cart', delay: '1.7s' },
            ].map(({ icon, delay }) => (
              <div key={icon} className="float-animation flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/10" style={{ animationDelay: delay }}>
                <span className="material-symbols-outlined text-white">{icon}</span>
              </div>
            ))}
          </div>
          <div className="mt-2xl max-w-sm text-center">
            <h2 className="mb-md font-headline-lg text-headline-lg text-white">Seamless Multi-Channel Operations</h2>
            <p className="font-body-lg text-body-lg text-white/70">Connect your entire ecosystem to a single, intelligent hub designed for growth.</p>
          </div>
        </div>
        <div className="relative z-10">
          <p className="font-label-sm text-label-sm text-white/50">© 2024 CommerceMind AI Global Systems. Ver 2.4.0</p>
        </div>
      </section>

      <section className="flex w-full flex-col overflow-y-auto bg-surface px-md py-2xl md:w-1/2 md:px-3xl">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-2xl flex w-full items-center gap-xs">
            <div className="h-1.5 flex-1 rounded-full bg-primary"></div>
            <div className="h-1.5 flex-1 rounded-full bg-primary"></div>
            <div className="h-1.5 flex-1 rounded-full bg-outline-variant"></div>
          </div>

          <div className="mb-xl">
            <p className="mb-sm font-label-sm text-label-sm text-on-surface-variant">Step 2 of 3</p>
            <h2 className="mb-xs font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">Tell us about your store</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">We use this to train your AI on your specific business domain.</p>
          </div>

          <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="store_name">Store Name</label>
              <input
                className="w-full rounded-lg border border-outline bg-white px-md py-sm text-on-surface outline-none transition-all placeholder:text-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
                id="store_name"
                name="storeName"
                onChange={handleChange}
                placeholder="Aura Skin Lab"
                type="text"
                value={formData.storeName}
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="website_url">Website URL / Domain</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-md text-[18px] text-outline">language</span>
                <input
                  className="w-full rounded-lg border border-outline bg-white py-sm pl-xl pr-md text-on-surface outline-none transition-all placeholder:text-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20"
                  id="website_url"
                  name="websiteUrl"
                  onChange={handleChange}
                  placeholder="auraskinlab.com"
                  type="text"
                  value={formData.websiteUrl}
                />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="monthly_orders">Estimated Monthly Orders</label>
              <div className="relative">
                <select
                  className="w-full cursor-pointer appearance-none rounded-lg border border-outline bg-white px-md py-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  id="monthly_orders"
                  name="monthlyOrders"
                  onChange={handleChange}
                  value={formData.monthlyOrders}
                >
                  <option disabled hidden value="">Select volume</option>
                  <option value="under_100">Under 100</option>
                  <option value="100_500">100-500</option>
                  <option value="500_plus">500+</option>
                </select>
                <span className="pointer-events-none absolute right-md top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">keyboard_arrow_down</span>
              </div>
            </div>

            <button className="mt-md flex w-full items-center justify-center gap-sm rounded-lg bg-primary py-md font-headline-md text-headline-md text-on-primary shadow-[0px_4px_20px_rgba(15,23,42,0.05)] transition-all hover:bg-primary-container active:scale-[0.98]" type="submit">
              Continue to Connect Channels
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="mt-2xl flex flex-col items-center gap-lg">
            <button className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-primary" type="button" onClick={() => navigate('/register')}>
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Account Info
            </button>
            <div className="flex w-full items-center justify-between border-t border-outline-variant pt-2xl opacity-60">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                <span className="font-label-sm text-label-sm">Secure Data Encryption</span>
              </div>
              <button className="font-label-sm text-label-sm hover:underline" type="button">Need help?</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RegisterStep2Page
