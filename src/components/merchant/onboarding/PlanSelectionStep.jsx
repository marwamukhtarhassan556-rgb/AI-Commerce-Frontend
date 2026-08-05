import { useState } from 'react';
import { subscriptionsApi } from '../../../api/integrationApi';
import { 
  Check, 
  HelpCircle, 
  CheckCircle2, 
  X, 
  ArrowLeft, 
  Save, 
  ArrowRight, 
  Coins, 
  Infinity as InfinityIcon 
} from 'lucide-react';

export default function PlanSelectionStep({ onNext, onBack }) {
  const [selectedPlanModal, setSelectedPlanModal] = useState(null);
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [activePlan, setActivePlan] = useState({ name: 'Professional', price: '$100' });
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState('');

  const plans = {
    starter: {
      id: 'starter',
      name: 'STARTER',
      price: '$50',
      period: '/mo',
      tokens: '10,000 Tokens',
      features: ['Basic AI Chat', 'Email Support'],
      popular: false,
      btnText: 'Subscribe to Starter',
      description: 'Perfect for new merchants testing the waters of AI-driven commerce.',
      details: [
        { title: 'Tokens', desc: '10,000 monthly inference tokens.' },
        { title: 'AI Models', desc: 'Access to Llama 3 (Basic) and GPT-3.5 Turbo.' },
        { title: 'Support', desc: 'Standard email support within 48 hours.' },
        { title: 'Channels', desc: 'Connect up to 2 storefronts.' }
      ]
    },
    pro: {
      id: 'pro',
      name: 'PROFESSIONAL',
      price: '$100',
      period: '/mo',
      tokens: '50,000 Tokens',
      features: ['Advanced AI Analysis', 'Priority Support', 'Custom Templates'],
      popular: true,
      btnText: 'Subscribe to Professional',
      description: 'Designed for growing businesses that require advanced automation and higher throughput.',
      details: [
        { title: 'Tokens', desc: '50,000 monthly inference tokens.' },
        { title: 'AI Models', desc: 'Access to GPT-4o, Claude 3.5 Sonnet, and Llama 3 (Advanced).' },
        { title: 'Support', desc: 'Priority support with 4-hour response time.' },
        { title: 'Automation', desc: 'Full access to inventory and sales automation tools.' },
        { title: 'Channels', desc: 'Unlimited storefront connections.' }
      ]
    },
    enterprise: {
      id: 'enterprise',
      name: 'ENTERPRISE',
      price: '$5,000',
      period: '/mo',
      tokens: 'Basic AI Sales Starter',
      features: ['Full Model Access', 'Unlimited Scale'],
      popular: false,
      btnText: 'Subscribe to Enterprise',
      description: 'The ultimate power for massive scale operations requiring dedicated infrastructure.',
      details: [
        { title: 'Tokens', desc: 'Unlimited AI Sales Starter package included.' },
        { title: 'AI Models', desc: 'Dedicated instance of GPT-4o and custom model fine-tuning.' },
        { title: 'Support', desc: 'Dedicated account manager and 24/7 technical hotline.' },
        { title: 'Infrastructure', desc: 'Single-tenant database and isolated compute resources.' }
      ]
    }
  };

  const handleSubscribe = async (plan) => {
    setError('');
    setSubscribing(true);
    try {
      const { data } = await subscriptionsApi.createCheckoutSession(plan.id);
      if (!data?.checkoutUrl) throw new Error('Checkout URL was not returned.');
      window.location.href = data.checkoutUrl;
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Could not activate the subscription. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans text-slate-800">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-blue-700 font-bold text-lg">Merchant Onboarding</h1>
        <button className="text-blue-600 hover:bg-slate-50 p-2 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-200 w-full mx-auto px-4 py-8 mb-24">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-blue-600 font-medium">Step 3 of 5</span>
            <span className="text-slate-500 font-medium">60% Complete</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-[60%] transition-all duration-300"></div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Select Your Plan</h2>
          <p className="text-slate-600">Choose the scale that fits your business needs. You can change your plan at any time.</p>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.values(plans).map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-xl p-6 flex flex-col justify-between relative transition-all duration-200 border ${
                plan.popular 
                  ? 'border-2 border-blue-600 shadow-md scale-105 md:scale-100' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-2">{plan.name}</span>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 text-sm ml-1">{plan.period}</span>
                </div>

                <div className="border-t border-slate-100 pt-4 mb-6">
                  <div className="flex items-center gap-2 mb-3 font-semibold text-sm text-slate-900">
                    {plan.id === 'enterprise' ? <InfinityIcon className="w-4 h-4 text-blue-600" /> : <Coins className="w-4 h-4 text-blue-600" />}
                    <span>{plan.tokens}</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => setSelectedPlanModal(plan)}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                    : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Banner with Office Image */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div 
            className="w-full h-64 bg-cover bg-center" 
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAFhhT0DtkhMJzGqeAjM_sksSny1jacN4HPGeoF0gLnNcb0tqXwKwxdL87Etlcr9KniZNz6LhljrknDxIJeVjNIa5sv7HwSxzo6Pc7w_TBT_tlOiNqURf-V2pRYPgaTZ0WWTrZhC2Nly9XPYN4R3zr-IsZdNtum3SCaS2-FZNnyU4JR1J_DHch6VK6J_8BCxs_eevnAPSaZwgwBh7bIQS-Naw5tXtJz9h3dUwVx_pnVyaMEaKZfCmu8')` }}
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Scaling with Confidence</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our infrastructure handles millions of transactions per second. Whichever plan you choose, you're backed by industry-leading security and uptime guarantees.
            </p>
          </div>
        </div>

      </main>

      {/* Plan Details Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-150 w-full p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedPlanModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-blue-600">Plan Details</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{selectedPlanModal.name}</h3>
              <p className="text-xl font-bold text-blue-600 mb-2">{selectedPlanModal.price}{selectedPlanModal.period}</p>
              <p className="text-slate-600 text-sm">{selectedPlanModal.description}</p>
            </div>

            <div className="space-y-3 mb-6 max-h-62.5 overflow-y-auto">
              <h4 className="text-xs uppercase font-semibold text-slate-500">All Features Included:</h4>
              {selectedPlanModal.details.map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{f.title}</p>
                    <p className="text-xs text-slate-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setSelectedPlanModal(null)}
                className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              {error && <p className="self-center text-sm text-red-600" role="alert">{error}</p>}
              <button 
                onClick={() => handleSubscribe(selectedPlanModal)}
                disabled={subscribing}
                className="flex-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 shadow-md"
              >
                {subscribing ? 'Subscribing…' : selectedPlanModal.btnText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success State Overlay */}
      {showSuccessState && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
          <div className="max-w-100 w-full text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Subscription Confirmed!</h3>
            <p className="text-slate-600 text-sm mb-6">
              Your <span className="font-bold text-blue-600">{activePlan.name}</span> plan is now active. Your token balance has been updated.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Billing Cycle</span>
                <span className="font-medium text-slate-900">Monthly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Next Payment</span>
                <span className="font-medium text-slate-900">Oct 24, 2026</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                <span className="text-slate-500 font-medium">Amount</span>
                <span className="text-lg font-bold text-blue-600">{activePlan.price}.00</span>
              </div>
            </div>

            <button 
              onClick={onNext}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-lg"
            >
              Continue to Store Setup
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-40">
        <div className="max-w-125 mx-auto flex justify-between items-center gap-4">
          <button 
            onClick={onBack}
            className="flex flex-col items-center text-slate-500 hover:text-blue-600 text-xs font-medium"
          >
            <ArrowLeft className="w-5 h-5 mb-0.5" />
            <span>Back</span>
          </button>
          
          <button className="flex flex-col items-center text-slate-500 hover:text-blue-600 text-xs font-medium">
            <Save className="w-5 h-5 mb-0.5" />
            <span>Save Draft</span>
          </button>

          <button 
            onClick={onNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-blue-700 shadow-sm"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

    </div>
  );
}
