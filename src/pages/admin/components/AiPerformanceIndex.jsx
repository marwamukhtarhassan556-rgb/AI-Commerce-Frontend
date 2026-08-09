function AiPerformanceIndex() {
  return (
    <div className="admin-glass-card rounded-xl p-8 flex flex-col justify-center items-center text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
        <span className="material-symbols-outlined text-[40px]">psychology</span>
      </div>
      <h3 className="font-outfit text-xl font-bold text-on-surface mb-2">AI Performance Index</h3>
      <div className="font-outfit text-[48px] font-bold text-primary mb-2">94.8</div>
      <p className="text-sm text-on-surface-variant max-w-[280px]">
        AI confidence scoring is currently exceeding historical benchmarks by 4.2%
      </p>
      <button type="button" className="mt-6 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all">
        View Full Report
      </button>
    </div>
  );
}

export default AiPerformanceIndex;
