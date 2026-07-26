import { Link } from 'react-router-dom'
import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'

// تعريف المتغير عالمياً عشان الـ React يشوفه في أي مكان في الصفحة
const heroImg = "https://via.placeholder.com/800x600"; 

export default function LandingPage( ) {
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
            Turn Your Chat & Custom Store into an <span className="text-primary">Automated Sales Engine.</span>
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
          {/* هنا بيتم استخدام heroImg، والآن هي معرفة فوق */}
          <div className="relative mx-auto mt-2xl max-w-5xl">
             <img src={heroImg} alt="Hero" className="rounded-2xl shadow-2xl" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
