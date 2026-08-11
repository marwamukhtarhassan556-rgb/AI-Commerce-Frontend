import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, Bot, Check, ChevronRight, CircleHelp, Headphones,
  LineChart, MessageCircleMore, PackageCheck, Play, Send, ShieldCheck,
  ShoppingBag, Sparkles, Star, WandSparkles,
} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import './landing.css';

const features = [
  [Headphones, 'AI Chat & Support', 'Resolve customer questions instantly and keep your shoppers happy around the clock.'],
  [Sparkles, 'Smart Recommendations', 'Recommend products and bundles from your catalog at exactly the right moment.'],
  [PackageCheck, 'Abandoned Cart Recovery', 'Bring shoppers back with timely, relevant AI-powered follow-ups.'],
  [BarChart3, 'Analytics & Insights', 'Understand customer intent, support quality, and sales impact in one place.'],
];

const plans = [
  ['Starter', '$49', 'For growing stores getting started with AI.', ['AI chat assistant', 'Knowledge base', 'Basic analytics', 'Email support'], 'Start Free Trial'],
  ['Growth', '$149', 'For stores ready to turn support into growth.', ['Everything in Starter', 'Smart recommendations', 'Cart recovery', 'Advanced analytics'], 'Start Free Trial'],
  ['Scale', '$299', 'For high-volume teams that need more control.', ['Everything in Growth', 'Custom integrations', 'Priority support', 'Team workspace'], 'Start Free Trial'],
  ['Enterprise', 'Custom', 'A tailored plan for your organization.', ['Unlimited conversations', 'Dedicated support', 'Custom onboarding', 'SLA & security review'], 'Book a Demo'],
];

export default function LandingPage() {
  return <div className="landing-page min-h-screen bg-white text-[#0d2342]">
    <Navbar />
    <main className="pt-[73px]">
      <section className="navi-hero px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.95fr_1.05fr]">
          <div className="navi-hero-copy">
            <p className="navi-eyebrow"><Sparkles size={14} /> AI-powered e-commerce assistant</p>
            <h1>Your AI Navigator<br />for <span>E-commerce Success</span></h1>
            <p className="navi-lede">Turn every customer conversation into a better shopping experience. Navi understands your store, supports shoppers, and helps your business grow.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="navi-button navi-button-main" to="/register">Start Free Trial <ArrowRight size={17} /></Link>
              <a className="navi-button navi-button-outline" href="#how-it-works"><Play size={16} fill="currentColor" /> See How It Works</a>
            </div>
            <div className="navi-hero-points">
              <span><MessageCircleMore /> AI chat support 24/7</span>
              <span><WandSparkles /> Personalized recommendations</span>
              <span><LineChart /> Clear business insights</span>
            </div>
          </div>

          <div className="navi-hero-visual" aria-label="Navi platform preview">
            <div className="navi-orbit navi-orbit-one" /><div className="navi-orbit navi-orbit-two" />
            <div className="navi-dashboard-window">
              <aside><span className="navi-mini-brand"><img src="/navi-mark-blue.png" alt="" />Navi</span><span className="active">Overview</span><span>Conversations</span><span>Tickets</span><span>Knowledge base</span><span>Products</span></aside>
              <div className="navi-dashboard-content"><div className="navi-dashboard-head"><b>Store Overview</b><small>This week <ChevronRight size={13} /></small></div><div className="navi-kpis"><div><small>Conversations</small><b>2,540</b><em>↗ 18.6%</em></div><div><small>Tickets</small><b>1,120</b><em>↗ 12.4%</em></div><div><small>Revenue impact</small><b>$128,430</b><em>↗ 28.6%</em></div></div><div className="navi-chart"><div><b>Conversations over time</b><small>● This week &nbsp; ○ Last week</small></div><svg viewBox="0 0 390 110" role="img" aria-label="Growth chart"><path d="M4 88 C45 79 44 53 86 65 S120 40 150 58 S203 26 233 44 S283 23 310 35 S354 12 386 20" /><path className="muted" d="M4 94 C45 72 63 84 86 78 S128 61 150 75 S190 49 233 70 S286 42 310 57 S347 47 386 38" /></svg></div></div>
            </div>
            <div className="navi-revenue-card"><span>Revenue impact</span><b>$128,430</b><em>↗ 28.6%</em><div className="navi-sparkline" /></div>
            <div className="navi-chat-card"><div className="navi-chat-title"><span><img src="/navi-mark-blue.png" alt="" /></span><b>Navi Assistant</b><i>Online</i></div><p className="user">How can I help you today?</p><p className="bot">I found 3 popular products your customers are loving.</p><div className="navi-products"><span>Running shoes<br /><b>$89</b></span><span>Wireless headphones<br /><b>$129</b></span></div><div className="navi-message">Ask anything <Send size={14} /></div></div>
          </div>
        </div>
      </section>

      <section className="navi-trust px-5 py-9 md:px-8"><p>Trusted by forward-thinking e-commerce brands</p><div><span>LUXORA</span><span>BOHÈME</span><span>avif.</span><span>THREADS</span><span>SOUQAN</span><span>BRANDLY</span></div></section>

      <section id="features" className="navi-section px-5 py-20 md:px-8"><div className="mx-auto max-w-7xl"><div className="navi-section-heading"><p className="navi-eyebrow"><Sparkles size={14} /> Everything in one place</p><h2>AI that understands your shoppers<br />and grows your business</h2></div><div className="navi-feature-grid">{features.map(([Icon, title, copy]) => <article key={title} className="navi-feature-card"><span className="navi-feature-icon"><Icon size={21} /></span><h3>{title}</h3><p>{copy}</p><a href="#how-it-works">Learn more <ArrowRight size={14} /></a></article>)}</div></div></section>

      <section id="integrations" className="navi-platform-section px-5 pb-20 md:px-8"><div className="navi-platform-shell mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.82fr_1.18fr]"><div className="navi-platform-copy"><p className="navi-eyebrow"><ShoppingBag size={14} /> Built for your store</p><h2>Manage, analyze and optimize your entire customer journey</h2><p>Connect your e-commerce platform and let Navi turn daily conversations into decisions you can act on.</p><ul><li><Check /> Unified customer conversations</li><li><Check /> AI-powered recommendations</li><li><Check /> Automated insights and reporting</li><li><Check /> Secure, simple integrations</li></ul><Link to="/register" className="navi-button navi-button-main">Explore Platform <ArrowRight size={17} /></Link></div><div className="navi-analytics"><div className="navi-analytics-side"><b><img src="/navi-mark-blue.png" alt="" /> Navi</b><span className="active">Overview</span><span>Conversations</span><span>Tickets</span><span>Analytics</span></div><div className="navi-analytics-main"><header><b>Overview</b><small>May 1 – May 7</small></header><div className="navi-analytics-kpis"><b>2,540 <small>Conversations</small></b><b>1,320 <small>Tickets resolved</small></b><b>$128,430 <small>Revenue impact</small></b><b>4.32% <small>Conversion rate</small></b></div><div className="navi-analytics-chart"><b>Conversation growth</b><svg viewBox="0 0 410 130"><path d="M5 105 C49 101 52 71 88 85 S120 56 150 69 S192 27 227 61 S270 42 300 53 S353 12 405 25" /></svg></div></div></div></div></section>

      <section id="pricing" className="navi-pricing px-5 py-20 md:px-8"><div className="mx-auto max-w-7xl"><div className="navi-section-heading"><p className="navi-eyebrow"><Sparkles size={14} /> Simple, transparent pricing</p><h2>Choose the plan that grows with you</h2><p>Start free, upgrade when you are ready, and keep full control of your plan.</p></div><div className="navi-plan-grid">{plans.map(([name, price, description, benefits, cta], index) => <article className={`navi-plan ${index === 1 ? 'featured' : ''}`} key={name}>{index === 1 && <span className="navi-popular">Most popular</span>}<h3>{name}</h3><p>{description}</p><div className="navi-plan-price">{price === 'Custom' ? <b>Custom</b> : <><b>{price}</b><small>/ month</small></>}</div><ul>{benefits.map(benefit => <li key={benefit}><Check size={15} />{benefit}</li>)}</ul><Link to={name === 'Enterprise' ? '/signin' : '/register'} className="navi-button navi-plan-button">{cta}</Link></article>)}</div></div></section>

      <section id="how-it-works" className="navi-final-cta px-5 pb-20 md:px-8"><div className="mx-auto max-w-7xl"><div><p className="navi-eyebrow"><Sparkles size={14} /> Ready to grow?</p><h2>Start your journey with Navi today</h2><p>Join merchants building smarter customer experiences with an AI assistant that understands their store.</p><div className="mt-7 flex flex-wrap gap-3"><Link className="navi-button navi-button-main" to="/register">Start Free Trial <ArrowRight size={17} /></Link><Link className="navi-button navi-button-outline" to="/signin">Talk to Sales</Link></div></div><div className="navi-final-mark"><img src="/navi-mark-blue.png" alt="Navi shopping bag" /><span><MessageCircleMore /></span><span><Sparkles /></span></div></div></section>
    </main>
    <Footer />
  </div>;
}
