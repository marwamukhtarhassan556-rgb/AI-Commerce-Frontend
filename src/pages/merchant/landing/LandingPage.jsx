import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart2, BarChart3, Check, ChevronDown, LayoutGrid,
  Megaphone, Menu, MessageCircle, MessageSquare, Package, Play, Send, Settings,
  ShoppingCart, Sparkles, Tag, Ticket, Users, Zap,
} from 'lucide-react';
import './landing.css';

const logo = '/assets/logos/logo.png';
const bag = '/assets/bag.png';
const PLANS_API_URL = 'https://aisales123.runasp.net/api/admin/plans';

const features = [
  [MessageCircle, 'AI Chat & Support', 'Resolve customer questions instantly and provide a 24/7 support experience that delights.'],
  [Tag, 'Smart Recommendations', 'Personalized product recommendations that increase AOV and drive more conversions.'],
  [ShoppingCart, 'Abandoned Cart Recovery', 'AI-powered campaigns and smart incentives to win back lost customers and recover revenue.'],
  [BarChart3, 'Analytics & Insights', 'Real-time insights about your customers, conversations, and performance in one powerful dashboard.'],
];

const metricsData = [
  { label: 'Total Conversations', value: 2540, change: '↑ 18.6%' },
  { label: 'Orders Influenced', value: 1320, change: '↑ 24.8%' },
  { label: 'Revenue Impact', value: 128430, prefix: '$', change: '↑ 28.6%' },
  { label: 'Conversion Rate', value: 4.32, suffix: '%', decimals: 2, change: '↑ 12.4%' },
];

const sidebarLinks = [
  [LayoutGrid, 'Overview'],
  [MessageSquare, 'Conversations'],
  [Ticket, 'Tickets'],
  [Users, 'Customers'],
  [Package, 'Products'],
  [Sparkles, 'Recommendations'],
  [Megaphone, 'Campaigns'],
  [BarChart2, 'Analytics'],
  [Zap, 'Integrations'],
  [Settings, 'Settings'],
];

/* ---------- small animation hooks ---------- */

function usePrefersReducedMotion() {
  // Lazy-init from the media query directly, instead of setting state
  // synchronously inside an effect on mount.
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

// NOTE: now restarts every time `start` flips false -> true, so the counters
// replay whenever their section re-enters the viewport (scrolling up or down).
function useCountUp(target, start, duration = 700) {
  const [value, setValue] = useState(0);
  const prevStart = useRef(false);

  useEffect(() => {
    if (start === prevStart.current) return undefined;
    prevStart.current = start;

    if (!start) {
      // Defer so we're not calling setState synchronously in the effect body.
      const id = setTimeout(() => setValue(0), 0);
      return () => clearTimeout(id);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = setTimeout(() => setValue(target), 0);
      return () => clearTimeout(id);
    }

    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      if (p < 1) {
        setValue(target * eased);
        raf = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return value;
}

function handleButtonGlow(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
}

/* ---------- presentational bits ---------- */

function Brand({ compact = false, light = false }) {
  return <img className={`navi-brand ${compact ? 'navi-brand--compact' : ''} ${light ? 'navi-brand--light' : ''}`} src={logo} alt="Navi" />;
}

/* Lucide's icon set intentionally excludes brand/trademark logos, so these
   social icons are small inline SVGs instead of a lucide-react import —
   no extra dependency, and no risk of an import breaking on a library
   update. */
function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h4v11H4z" />
      <path d="M6 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M12 9h4v1.5c.7-1.1 2-1.8 3.5-1.5 2 .4 3.5 2.2 3.5 4.3V20h-4v-6c0-1-.8-1.8-1.8-1.8S15.5 13 15.5 14v6H12z" />
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.2-.8.5-1.7.8-2.6 1a3.7 3.7 0 0 0-6.3 3.4A10.6 10.6 0 0 1 4.1 4.6a3.7 3.7 0 0 0 1.1 4.9 3.7 3.7 0 0 1-1.7-.5 3.7 3.7 0 0 0 2.9 3.6c-.5.1-1.1.2-1.6.1a3.7 3.7 0 0 0 3.4 2.6A7.4 7.4 0 0 1 2 16.7a10.5 10.5 0 0 0 5.7 1.7c6.8 0 10.6-5.8 10.6-10.8v-.5c.8-.5 1.5-1.2 2-2z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4h-2.5A3.5 3.5 0 0 0 9 7.5V10H6.5v3H9v7h3v-7h2.5l.5-3H12V7.8c0-.7.5-1.3 1.2-1.3H15z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Product({ name, price, tone, rating = '4.8', image }) {
  // `navi-shoe` still renders the tinted silhouette as a fallback
  // background — if `image` is missing or fails to load, the card still
  // looks intentional instead of showing a broken image icon.
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = image && !imgFailed;
  return (
    <div className="navi-product">
      <div className={`navi-shoe navi-shoe--${tone}`}>
        {showImage && (
          <img
            src={image}
            alt={name}
            className="navi-shoe-img"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
      <span>{name}</span>
      <b>{price}</b>
      <small>★ {rating}</small>
    </div>
  );
}

function Metric({ label, value, change, prefix = '', suffix = '', decimals = 0, start }) {
  const count = useCountUp(value, start);
  const display = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString('en-US');
  return (
    <article>
      <small>{label}</small>
      <b>{prefix}{display}{suffix}</b>
      <em>{change}</em>
    </article>
  );
}

function formatPrice(price) {
  if (price === null || price === undefined) return 'Custom';
  const num = Number(price);
  if (Number.isNaN(num)) return 'Custom';
  return num === 0 ? 'Free' : `$${num % 1 === 0 ? num.toFixed(0) : num}`;
}

export default function LandingPage() {
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState(null);

  const reducedMotion = usePrefersReducedMotion();

  // hero chat demo state machine
  const [phase, setPhase] = useState('user-sent'); // user-sent -> ai-typing -> answered -> resetting -> loop
  const [cycle, setCycle] = useState(0);

  // hero parallax tilt
  const heroVisualRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // hero counters / sparkline draw-in trigger
  const [heroReady, setHeroReady] = useState(false);
  const heroRevenueCount = useCountUp(128430, heroReady);
  const heroConversionCount = useCountUp(4.32, heroReady);

  // dashboard metrics / chart draw-in trigger
  const dashboardRef = useRef(null);
  const [dashInView, setDashInView] = useState(false);

  // platform section parallax tilt (mirrors the hero visual)
  const platformVisualRef = useRef(null);
  const [platformTilt, setPlatformTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let isMounted = true;

    async function fetchPlans() {
      try {
        setPlansLoading(true);
        const res = await fetch(PLANS_API_URL);
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        const data = await res.json();
        if (!isMounted) return;

        const activePlans = (Array.isArray(data) ? data : [])
          .filter((plan) => plan.planStatus === 'active')
          .sort((a, b) => Number(a.planPrice) - Number(b.planPrice));

        setPlans(activePlans);
        setPlansError(null);
      } catch (err) {
        if (isMounted) setPlansError(err.message || 'Failed to load plans');
      } finally {
        if (isMounted) setPlansLoading(false);
      }
    }

    fetchPlans();
    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll-reveal for sections: toggles `is-visible` on/off as elements
  // enter/leave the viewport, so the reveal animation replays every time you
  // scroll back to a section (either direction), instead of firing once.
  useEffect(() => {
    const revealTargets = document.querySelectorAll('.navi-feature-section, .navi-feature-grid article, .navi-platform, .navi-pricing, .navi-plan-grid article, .navi-cta, .navi-footer');
    let featureIndex = 0;
    let planIndex = 0;
    revealTargets.forEach((target) => {
      target.classList.add('navi-reveal');
      if (target.matches('.navi-feature-grid article')) {
        target.style.setProperty('--reveal-delay', `${featureIndex * 40}ms`);
        featureIndex += 1;
      }
      if (target.matches('.navi-plan-grid article')) {
        target.style.setProperty('--reveal-delay', `${planIndex * 40}ms`);
        planIndex += 1;
      }
    });
    const revealAll = () => revealTargets.forEach((target) => target.classList.add('is-visible'));

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealAll();
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.14 });

    revealTargets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [plans, reducedMotion]);

  // drive the looping hero chat demo
  useEffect(() => {
    if (reducedMotion) {
      // Defer so we're not calling setState synchronously in the effect body.
      const id = setTimeout(() => setPhase('answered'), 0);
      return () => clearTimeout(id);
    }

    const duration = {
      'user-sent': 900,
      'ai-typing': 1100,
      'answered': 3400,
      'resetting': 500,
    }[phase];

    const next = {
      'user-sent': 'ai-typing',
      'ai-typing': 'answered',
      'answered': 'resetting',
      'resetting': 'user-sent',
    }[phase];

    const timer = setTimeout(() => {
      if (phase === 'resetting') setCycle((c) => c + 1);
      setPhase(next);
    }, duration);

    return () => clearTimeout(timer);
  }, [phase, reducedMotion]);

  // let the hero visual "arrive" a beat after load, then count up + draw sparklines
  useEffect(() => {
    if (reducedMotion) {
      const id = setTimeout(() => setHeroReady(true), 0);
      return () => clearTimeout(id);
    }
    const t = setTimeout(() => setHeroReady(true), 550);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  // Trigger dashboard counters / line draw-in whenever it scrolls into view,
  // and reset them when it scrolls back out — so re-entering replays it.
  useEffect(() => {
    if (reducedMotion) {
      const id = setTimeout(() => setDashInView(true), 0);
      return () => clearTimeout(id);
    }
    const node = dashboardRef.current;
    if (!node || !('IntersectionObserver' in window)) {
      const id = setTimeout(() => setDashInView(true), 0);
      return () => clearTimeout(id);
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setDashInView(entry.isIntersecting);
      });
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  function handleHeroMove(e) {
    const rect = heroVisualRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x, y });
  }
  function handleHeroLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const tiltStyle = (depth) => (reducedMotion ? undefined : {
    transform: `translate3d(${tilt.x * depth}px, ${tilt.y * depth * 0.85}px, 0)`,
  });

  // same tilt mechanic as the hero, applied to the "how it works" dashboard
  function handlePlatformMove(e) {
    const rect = platformVisualRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setPlatformTilt({ x, y });
  }
  function handlePlatformLeave() {
    setPlatformTilt({ x: 0, y: 0 });
  }

  const platformTiltStyle = (depth) => (reducedMotion ? undefined : {
    transform: `translate3d(${platformTilt.x * depth}px, ${platformTilt.y * depth * 0.85}px, 0)`,
  });

  return (
    <div className="navi-page">
      <header className="navi-header">
        <Link to="/" aria-label="Navi home" className="navi-brand-link">
          <Brand />
          <span className="navi-brand-tagline">Navigate. Engage. Grow.</span>
        </Link>
        <nav>
          <a href="#product">Product <ChevronDown /></a>
          <a href="#solutions">Solutions <ChevronDown /></a>
          <a href="#resources">Resources <ChevronDown /></a>
          <a href="#pricing">Pricing</a>
          <a href="#company">Company <ChevronDown /></a>
        </nav>
        <div className="navi-header-actions">
          <Link to="/signin" className="navi-signin-link">Sign in</Link>
          <Link className="navi-blue-button navi-book" to="/register" onMouseMove={handleButtonGlow}>Book a Demo</Link>
          <button className="navi-menu" aria-label="Open menu"><Menu /></button>
        </div>
      </header>

      <main>
        <section className="navi-hero" id="product">
          <div className="navi-hero-copy">
            <p className="navi-eyebrow">✦ &nbsp; AI-Powered E-commerce Assistant</p>
            <h1>Your AI Navigator<br />for E-commerce<br /><em>Success</em></h1>
            <p className="navi-lead">Navi helps you deliver exceptional shopping experiences, increase conversions, and grow your revenue with the power of AI.</p>
            <div className="navi-buttons">
              <Link className="navi-blue-button" to="/register" onMouseMove={handleButtonGlow}>Start Free Trial <ArrowRight /></Link>
              <a className="navi-outline-button" href="#how-it-works" onMouseMove={handleButtonGlow}>See How It Works <span className="navi-play"><Play fill="currentColor" /></span></a>
            </div>
            <div className="navi-hero-perks">
              <span><MessageCircle /> <b>AI Chat Assistant<small>24/7 Smart Support</small></b></span>
              <span><Tag /> <b>Personalized<small>Recommendations</small></b></span>
              <span><BarChart3 /> <b>Data-Driven<small>Growth</small></b></span>
            </div>
          </div>

          <div
            className="navi-hero-visual"
            ref={heroVisualRef}
            onMouseMove={reducedMotion ? undefined : handleHeroMove}
            onMouseLeave={reducedMotion ? undefined : handleHeroLeave}
          >
            {/* Background Blob Shape */}
            <div className="navi-orbit" />

            {/* SVG Orbit / Dashed Circular Decoration */}
            <svg className="navi-dashed-circle navi-dashed-circle-orbit" viewBox="0 0 500 500">
              <circle cx="250" cy="250" r="230" fill="none" stroke="#0867ed" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.35" />
              <circle cx="440" cy="140" r="14" fill="#0867ed" opacity="0.1" />
              <circle cx="440" cy="140" r="6" fill="#0867ed" />
            </svg>

            {/* Navi Assistant Chat Window — plays a looping live demo */}
            <div className="navi-chat-window" style={tiltStyle(6)}>
              <div className="navi-window-head">
                <Brand compact />
                <b>Navi Assistant<small>● Online</small></b>
                <i className="navi-window-controls">• • • &nbsp; ×</i>
              </div>
              <p className="navi-question">👋 &nbsp;How can I help you today?</p>

              <div className={`navi-thread ${phase === 'resetting' ? 'navi-thread--fading' : ''}`} key={cycle}>
                <div className="navi-user-message">
                  I’m looking for running shoes under $120
                  <small>10:30 AM ✓✓</small>
                </div>

                {phase === 'ai-typing' && (
                  <div className="navi-typing-bubble" aria-hidden="true">
                    <Brand compact />
                    <span className="navi-typing-dots"><i /><i /><i /></span>
                  </div>
                )}

                {phase === 'answered' && (
                  <>
                    <div className="navi-answer">
                      <Brand compact />
                      <div>
                        Great! Here are the best options for you.
                        <small>10:31 AM</small>
                      </div>
                    </div>
                    <div className="navi-products">
                      <Product tone="one" name="Air Zoom Pegasus 40" price="$109.99" rating="4.8" image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80" />
                      <Product tone="two" name="Adidas Ultraboost 22" price="$119.00" rating="4.7" image="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&auto=format&fit=crop&q=80" />
                      <Product tone="three" name="Asics Gel-Kayano 29" price="$114.99" rating="4.9" image="https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400&auto=format&fit=crop&q=80" />
                    </div>
                  </>
                )}
              </div>

              <div className="navi-ask">Ask anything... <span><Send /></span></div>
            </div>

            {/* Revenue Impact Floating Card */}
            <div className="navi-impact" style={tiltStyle(12)}>
              <small>Revenue Impact</small>
              <b>${Math.round(heroRevenueCount).toLocaleString('en-US')} <em>↑ 28.6%</em></b>
              <span>vs last 30 days</span>
              <div className="navi-line-chart-graphic">
                <svg viewBox="0 0 120 46" className="navi-sparkline-svg">
                  <defs>
                    <linearGradient id="grad-blue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0867ed" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0867ed" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,38 Q20,29 40,31 T80,17 T120,10 L120,44 L0,44 Z" fill="url(#grad-blue)" />
                  <path
                    pathLength="1"
                    className={`navi-draw ${heroReady ? 'is-visible' : ''}`}
                    d="M0,38 Q20,29 40,31 T80,17 T120,10"
                    fill="none" stroke="#0867ed" strokeWidth="2.5" strokeLinecap="round"
                  />
                  <circle className={`navi-dot-reveal ${heroReady ? 'is-visible' : ''}`} cx="120" cy="10" r="3.5" fill="#0867ed" />
                </svg>
              </div>
            </div>

            {/* Conversion Rate Floating Card */}
            <div className="navi-conversion" style={tiltStyle(16)}>
              <small>Conversion Rate</small>
              <b>{heroConversionCount.toFixed(2)}% <em>↑ 12.4%</em></b>
              <span>vs last 30 days</span>
              <div className="navi-conversion-chart-graphic">
                <svg viewBox="0 0 120 46" className="navi-sparkline-svg">
                  <path d="M0,33 Q30,38 60,21 T120,13 L120,44 L0,44 Z" fill="url(#grad-blue)" />
                  <path
                    pathLength="1"
                    className={`navi-draw ${heroReady ? 'is-visible' : ''}`}
                    d="M0,33 Q30,38 60,21 T120,13"
                    fill="none" stroke="#0867ed" strokeWidth="2.5" strokeLinecap="round"
                  />
                  <circle className={`navi-dot-reveal ${heroReady ? 'is-visible' : ''}`} cx="120" cy="13" r="3.5" fill="#0867ed" />
                </svg>
              </div>
            </div>

            {/* Floating Navi Shopping Bag Icon */}
            <div className="navi-floating-bag" style={tiltStyle(20)}>
              <div className="navi-bag-inner">
                <Brand compact />
              </div>
            </div>
          </div>
        </section>

        <section className="navi-trusted">
          <p>Trusted by forward-thinking e-commerce brands</p>
          <div>
            <b>LUXORA</b>
            <b>BOHÈME</b>
            <b>avit.</b>
            <b>Urbanic</b>
            <b>SOUQAN</b>
            <b>BRANDLY</b>
          </div>
        </section>

        <section className="navi-section navi-feature-section" id="solutions">
          <p className="navi-section-label">Everything you need</p>
          <h2>AI that understands your shoppers<br />and grows your business</h2>
          <div className="navi-feature-grid">
            {features.map(([Icon, title, text]) => (
              <article key={title}>
                <span className="navi-icon-circle"><Icon /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <a href="#how-it-works">Learn more <ArrowRight /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="navi-platform" id="how-it-works">
          <div className="navi-platform-copy">
            <p className="navi-section-label">All-in-one platform</p>
            <h2>Manage, analyze and optimize<br />your entire customer journey</h2>
            <ul>
              <li><Check />Unify conversations across all channels</li>
              <li><Check />Understand customer intent with AI</li>
              <li><Check />Automate workflows and campaigns</li>
              <li><Check />Measure impact and drive growth</li>
            </ul>
            <a className="navi-blue-button" href="#pricing" onMouseMove={handleButtonGlow}>Explore Platform <ArrowRight /></a>
          </div>

          {/* Mirrors the hero visual: layered parallax on mouse move + a gentle
              float once it's arrived + a staggered reveal of its internals */}
          <div
            className="navi-platform-visual"
            ref={platformVisualRef}
            onMouseMove={reducedMotion ? undefined : handlePlatformMove}
            onMouseLeave={reducedMotion ? undefined : handlePlatformLeave}
          >
            <div className="navi-platform-orbit" style={platformTiltStyle(16)} />

            <div
              className={`navi-platform-visual-inner ${dashInView ? 'is-floating' : ''}`}
              style={platformTiltStyle(8)}
            >
              <div className="navi-dashboard" ref={dashboardRef}>
                <aside className={dashInView ? 'is-visible' : ''}>
                  <div className="navi-dash-brand"><Brand /></div>
                  {sidebarLinks.map(([Icon, label], i) => (
                    <a key={label} className={i === 0 ? 'active' : ''}>
                      <Icon /> {label}
                    </a>
                  ))}
                </aside>
                <div className="navi-dash-content">
                  <header>Overview <span>May 1 - May 31 <ChevronDown /></span></header>
                  <div className={`navi-metric-row ${dashInView ? 'is-visible' : ''}`}>
                    {metricsData.map((m) => (
                      <Metric key={m.label} {...m} start={dashInView} />
                    ))}
                  </div>
                  <div className={`navi-dash-charts ${dashInView ? 'is-visible' : ''}`}>
                    <article className="navi-chart-card-main">
                      <div className="navi-chart-head">
                        <b>Conversations Over Time</b>
                        <div className="navi-chart-legend">
                          <span><i className="navi-dot navi-dot-blue" /> This Week</span>
                          <span><i className="navi-dot navi-dot-light" /> Last Week</span>
                        </div>
                      </div>
                      <div className="navi-chart-svg">
                        <svg viewBox="0 0 300 90" className="navi-dashboard-line-svg">
                          <path d="M0,65 Q30,45 60,60 T120,40 T180,50 T240,25 T300,35" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                          <path d="M0,55 Q30,30 60,45 T120,20 T180,30 T240,10 T300,20 L300,90 L0,90 Z" fill="url(#grad-blue)" />
                          <path
                            pathLength="1"
                            className={`navi-draw navi-draw--delayed ${dashInView ? 'is-visible' : ''}`}
                            d="M0,55 Q30,30 60,45 T120,20 T180,30 T240,10 T300,20"
                            fill="none" stroke="#0867ed" strokeWidth="2.5"
                          />
                        </svg>
                      </div>
                    </article>
                    <article className="navi-chart-card-donut">
                      <b>Top Intents</b>
                      <div className="navi-donut-container">
                        <div className={`navi-donut ${dashInView ? 'is-visible' : ''}`}><span /></div>
                        <ul className="navi-donut-legend">
                          <li><i className="navi-dot" style={{ background: '#0867ed' }} /> Product Info <span>38%</span></li>
                          <li><i className="navi-dot" style={{ background: '#3ca4ff' }} /> Order & Shipping <span>25%</span></li>
                          <li><i className="navi-dot" style={{ background: '#70baff' }} /> Returns <span>18%</span></li>
                          <li><i className="navi-dot" style={{ background: '#a8d5ff' }} /> Discounts <span>12%</span></li>
                          <li><i className="navi-dot" style={{ background: '#d8ebff' }} /> Others <span>10%</span></li>
                        </ul>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="navi-section navi-pricing" id="pricing">
          <p className="navi-section-label">Simple, transparent pricing</p>
          <h2>Choose the plan that grows with you</h2>
          <div className="navi-toggle">
            <b>Monthly</b>
            <span>Annual (Save 20%)</span>
          </div>

          {plansLoading && <p className="navi-pricing-note">Loading plans…</p>}
          {!plansLoading && plansError && (
            <p className="navi-pricing-note">Couldn't load plans right now. Please try again later.</p>
          )}

          {!plansLoading && !plansError && (
            <div className="navi-plan-grid">
              {plans.map((plan) => {
                const enabledFeatures = (plan.features || []).filter((f) => f.enabled);

                return (
                  <article key={plan.id}>
                    <h3>{plan.planName}</h3>
                    <p>{plan.planDescription}</p>
                    <strong>
                      {formatPrice(plan.planPrice)}
                      {Number(plan.planPrice) > 0 && <small>/month</small>}
                    </strong>
                    <span>
                      {plan.trialDays ? `${plan.trialDays}-day free trial` : 'Billed monthly'}
                    </span>
                    <ul>
                      {enabledFeatures.map((feature) => (
                        <li key={feature.featureId}><Check />{feature.featureName}</li>
                      ))}
                    </ul>
                    <Link
                      to="/register"
                      className="navi-plan-button"
                      onMouseMove={handleButtonGlow}
                    >
                      Start Free Trial
                    </Link>
                  </article>
                );
              })}
            </div>
          )}

          <small className="navi-pricing-note">All plans include a free trial. No credit card required.</small>
        </section>

        <section className="navi-cta">
          <div>
            <p>Ready to grow?</p>
            <h2>Start your journey with Navi today</h2>
            <span>Join hundreds of e-commerce brands that are using AI to deliver better experiences and achieve remarkable growth.</span>
          </div>
          <div className="navi-cta-actions">
            <Link className="navi-blue-button" to="/register" onMouseMove={handleButtonGlow}>Start Free Trial</Link>
            <Link className="navi-outline-button" to="/register" onMouseMove={handleButtonGlow}>Book a Demo</Link>
          </div>
          <div className="navi-cta-bag">
            <img src={bag} alt="" className="navi-cta-bag-image" />
          </div>
        </section>
      </main>

      <footer className="navi-footer" id="company">
        <div className="navi-footer-top">
          <div>
            <Brand light />
            <span className="navi-footer-tagline">Navigate. Engage. Grow.</span>
            <div className="navi-social">
              <a href="#company" aria-label="LinkedIn"><IconLinkedin /></a>
              <a href="#company" aria-label="Twitter"><IconTwitter /></a>
              <a href="#company" aria-label="Facebook"><IconFacebook /></a>
              <a href="#company" aria-label="Instagram"><IconInstagram /></a>
            </div>
          </div>
          {[
            ['Product', 'Features', 'Integrations', 'Pricing', "What's New"],
            ['Solutions', 'E-commerce', 'Customer Support', 'Marketing', 'Operations'],
            ['Resources', 'Blog', 'Guides', 'Case Studies', 'Help Center'],
            ['Company', 'About Us', 'Careers', 'Partners', 'Contact Us']
          ].map(([heading, ...links]) => (
            <div key={heading}>
              <b>{heading}</b>
              {links.map(x => <a key={x} href="#resources">{x}</a>)}
            </div>
          ))}
          <div>
            <b>Stay Updated</b>
            <p>Subscribe to our newsletter</p>
            <label>
              <input placeholder="Enter your email" />
              <button><Send /></button>
            </label>
          </div>
        </div>
        <div className="navi-footer-bottom">
          <span>© 2026 Navi. All rights reserved.</span>
          <span>Privacy Policy &nbsp; Terms of Service &nbsp; Cookies</span>
        </div>
      </footer>
    </div>
  );
}