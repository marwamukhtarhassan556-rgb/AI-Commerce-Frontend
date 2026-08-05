import { 
  HelpCircle, 
  Power, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  ArrowLeft, 
  Save, 
  ArrowRight 
} from 'lucide-react';

export default function StoreIntegrationStep({ onNext, onBack, onSkip }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans text-slate-800 pb-20">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-blue-700 font-bold text-lg">Merchant Onboarding</h1>
        <button className="text-blue-600 hover:bg-slate-50 p-2 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="grow flex items-center justify-center p-4 md:p-8">
        <div className="max-w-137.5 w-full bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col items-center shadow-sm">
          
          {/* Progress Section */}
          <div className="w-full mb-8 text-center">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">STEP 5 OF 5</span>
              <span className="text-xs font-bold text-blue-600">Store Setup: 2 of 2</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-full"></div>
            </div>
          </div>

          {/* Center Power Icon */}
          <div className="w-20 h-20 bg-slate-100/80 rounded-2xl flex items-center justify-center mb-6 text-slate-500">
            <Power className="w-10 h-10 stroke-[1.5]" />
          </div>

          {/* Content Headings */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connect Your E-commerce Store</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              This is where you'll connect your existing store's data for integration. This step is coming soon.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col items-center gap-3">
            <button 
              disabled 
              className="w-full h-11 bg-slate-200/70 text-slate-400 font-medium text-sm rounded-lg flex items-center justify-center cursor-not-allowed"
            >
              Connect
            </button>
            <button 
              onClick={onSkip || onNext}
              className="text-blue-600 text-sm font-medium hover:underline py-1 transition-all"
            >
              Skip for now
            </button>
          </div>

          {/* Visual Context Grid Icons */}
          <div className="mt-8 w-full border-t border-slate-100 pt-6">
            <div className="grid grid-cols-3 gap-4 opacity-25">
              <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                <Package className="w-7 h-7" />
              </div>
              <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                <BarChart3 className="w-7 h-7" />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Floating Bottom Navbar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2.5 px-4 z-40">
        <div className="max-w-112.5 mx-auto flex justify-between items-center">
          
          <button 
            onClick={onBack}
            className="flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 px-3 py-1 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mb-0.5" />
            <span>Back</span>
          </button>

          <button 
            className="flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 px-3 py-1 text-xs font-medium transition-colors"
          >
            <Save className="w-5 h-5 mb-0.5" />
            <span>Save Draft</span>
          </button>

          <button 
            onClick={onNext}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </footer>

    </div>
  );
}