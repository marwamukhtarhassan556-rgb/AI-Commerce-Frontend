import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Bot, Cable, CheckCircle2, MessageSquareText, PlayCircle, ShieldCheck, Sparkles, Star } from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import './landing.css';

const steps = [
  ['1', 'Connect Store', 'Sync your Shopify, Salla, or custom store in under two minutes.'],
  ['2', 'AI Implementation', 'Your assistant learns your products and support history.'],
  ['3', 'Track & Scale', 'Monitor customer satisfaction and revenue as you grow.'],
];

const testimonials = [
  ['Sarah Jenkins', 'CEO, Trendify Collective', 'Navi reduced our support ticket volume by 70% in the first month.'],
  ['Mark Rosetti', 'Ops Director, TechGear', 'The sentiment analysis saved dozens of customers before they reached a human.'],
  ['Leila Ahmed', 'Founder, LuxeGlow', 'Easy integration and a stellar support team. Best investment we made this year.'],
];

export default function LandingPage() {
  return <div className="landing-page min-h-screen bg-surface text-on-surface">
    <Navbar />
    <main className="pt-16">
      <section className="landing-hero px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed px-4 py-2 text-xs font-bold text-primary"><Sparkles size={15} /> AI-powered merchant operations</p>
            <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Supercharge your e-commerce store with <span className="text-primary">next-gen AI.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-on-surface-variant">Manage support, track real-time sentiment, and boost your store’s sales with a focused AI workspace built for merchants.</p>
            <div className="mt-8 flex flex-wrap gap-4"><Link className="landing-primary" to="/register">Get started free <ArrowRight size={18} /></Link><a className="landing-secondary" href="#features"><PlayCircle size={18} /> Watch demo</a></div>
          </div>
          <div className="relative mx-auto w-full max-w-xl py-8">
            <div className="landing-growth"><span className="text-xs text-on-surface-variant">Real-time growth</span><div className="mt-2 h-2 rounded-full bg-primary/15"><span className="block h-full w-3/4 rounded-full bg-primary" /></div><strong>+142% Revenue</strong></div>
            <div className="landing-dashboard"><div className="mb-3 flex gap-2"><i className="bg-red-400" /><i className="bg-amber-400" /><i className="bg-emerald-400" /></div><img src="/assets/screenshots/dashboard-preview.svg" alt="Navi merchant dashboard preview" /></div>
          </div>
        </div>
      </section>

      <section className="border-y border-outline-variant bg-surface-container-low px-6 py-7"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row"><div><b className="text-lg">Trusted by 1,000+ growing merchants</b><p className="text-sm text-on-surface-variant">Leading brands choose AICommerce for automated growth.</p></div><div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-on-surface-variant"><span>Shopify</span><span>WooCommerce</span><span>Salla</span><span>Magento</span></div><div className="flex gap-3 text-xs font-bold"><span className="rounded-full bg-primary-fixed px-3 py-2 text-primary"><CheckCircle2 className="mr-1 inline" size={14} />94.2% resolution</span><span className="rounded-full bg-primary-fixed px-3 py-2 text-primary"><Star className="mr-1 inline" size={14} />4.8 CSAT</span></div></div></section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24"><header className="mb-12 text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Powerful features</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Engineered for merchant efficiency</h2></header><div className="grid gap-5 md:grid-cols-12">
        <article className="landing-card landing-feature md:col-span-8"><Bot className="text-primary" size={38} /><h3>Automated AI ticket resolution</h3><p>AICommerce understands customer questions and resolves tracking, returns, FAQs, and more in seconds.</p><div className="landing-chat"><span>Where is my order #5512?</span><b><Bot size={14} /> Your order is in transit and arrives Friday.</b></div></article>
        <article className="landing-card landing-feature md:col-span-4"><MessageSquareText className="text-primary" size={38} /><h3>Sentiment analysis</h3><p>Detect customer mood instantly and prioritize the conversations that matter most.</p><div className="mt-6 space-y-2 text-xs"><span className="block rounded bg-emerald-500/10 p-2 text-emerald-700">“Love the quality!”</span><span className="block rounded bg-red-500/10 p-2 text-red-700">“Still waiting on shipping...”</span></div></article>
        <article className="landing-card landing-feature md:col-span-6"><BarChart3 className="text-primary" size={38} /><h3>Merchant analytics</h3><p>Track revenue, response time, and AI efficiency from one clear dashboard.</p><div className="landing-bars"><i /><i /><i /><i /><i /></div></article>
        <article className="landing-card landing-feature md:col-span-6"><Cable className="text-primary" size={38} /><h3>Seamless integrations</h3><p>Connect your favorite commerce platforms with a single click. No coding required.</p><div className="mt-7 flex gap-3"><span className="landing-icon">S</span><span className="landing-icon">W</span><span className="landing-icon">M</span><span className="landing-icon">+20</span></div></article>
      </div></section>

      <section id="how-it-works" className="bg-surface-container-low px-6 py-24"><div className="mx-auto max-w-7xl"><h2 className="mb-14 text-center text-3xl font-bold">Get started in 3 easy steps</h2><div className="grid gap-10 md:grid-cols-3">{steps.map(([number, title, text]) => <div key={number} className="text-center"><span className="landing-step">{number}</span><h3 className="mt-5 font-bold">{title}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-on-surface-variant">{text}</p></div>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-6 py-24"><h2 className="mb-12 text-center text-3xl font-bold">What merchants are saying</h2><div className="grid gap-5 md:grid-cols-3">{testimonials.map(([name, role, quote]) => <article key={name} className="landing-card p-7"><div className="mb-4 flex text-amber-500">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill="currentColor" />)}</div><p className="min-h-20 text-sm leading-6 text-on-surface-variant">“{quote}”</p><div className="mt-6 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary-fixed font-bold text-primary">{name[0]}</span><div><b className="text-sm">{name}</b><p className="text-xs text-on-surface-variant">{role}</p></div></div></article>)}</div></section>

      <section className="px-6 pb-24"><div className="landing-cta mx-auto max-w-7xl text-center"><ShieldCheck className="mx-auto" size={30} /><h2>Ready to automate your store and double customer happiness?</h2><p>Join thousands of merchants upgrading their customer support with AI.</p><div className="mt-7 flex flex-wrap justify-center gap-4"><Link to="/register" className="landing-cta-main">Start your 14-day free trial</Link><Link to="/signin" className="landing-cta-alt">Sign in to your account</Link></div><small>No credit card required · Cancel anytime</small></div></section>
    </main>
    <Footer />
  </div>;
}
