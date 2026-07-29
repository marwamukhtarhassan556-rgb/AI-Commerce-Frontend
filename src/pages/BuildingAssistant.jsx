function BuildingAssistantPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-8 text-on-surface">
      <div className="fixed inset-0 z-0">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjNyCw0Xed7IMMTzEkKqwV8ET7Z9dbBpK_k2n1zEIcJ59Xoe81RoHeOBN9oKIFBcWKvXJewwcJPl9X1rdwqnD6tuWLhEUZHIJQqqpBUZ8CSaQVxqYyQkLpnDAq9q6TA5vCocqbKz_izrJRyDVQEHholdvNpnTmbH7KDTrHhM6nhUnShC_UH5She6Vp6jDM0iAZAmd1lDwIdhbHQku15TMwaNBvVTT1CdRI2hEb4VNzBiGc4E4ysbXDzwbfrm9RCQhrxDwrA-OI03Dx')" }}></div>
        <div className="absolute inset-0 bg-surface/60 backdrop-blur-[8px]"></div>
      </div>

      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-4 py-sm md:px-lg">
        <div className="text-headline-md font-headline-md text-primary">CommerceMind AI</div>
        <div className="flex items-center gap-xs text-label-sm font-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          Assistant ready
        </div>
      </header>

      <main className="relative z-10 flex w-full max-w-6xl flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest/90 p-4 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] md:flex-row md:p-6">
        <aside className="mb-4 flex w-full flex-col rounded-2xl border border-outline-variant bg-surface p-4 md:mb-0 md:w-[320px] md:pr-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[24px]">smart_toy</span>
            </div>
            <div>
              <p className="text-headline-md font-headline-md text-on-surface">CommerceMind</p>
              <p className="text-label-sm font-label-sm text-on-surface-variant">AI store assistant</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-outline-variant bg-surface-container p-4">
            <div className="flex items-center justify-between">
              <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Live context</p>
              <span className="rounded-full bg-secondary-container px-2 py-1 text-[10px] font-bold text-on-secondary-container">Online</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="text-body-md font-body-md text-on-surface">Website synced</p>
                <p className="text-label-sm font-label-sm text-on-surface-variant">1,402 SKUs indexed</p>
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="text-body-md font-body-md text-on-surface">Replies ready</p>
                <p className="text-label-sm font-label-sm text-on-surface-variant">24/7 with brand voice</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-outline-variant bg-surface-container-low p-4">
            <p className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Suggested actions</p>
            <div className="mt-3 space-y-2">
              <button className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-left text-body-md font-body-md text-on-surface">Recommend best-seller</button>
              <button className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-left text-body-md font-body-md text-on-surface">Handle return question</button>
              <button className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-left text-body-md font-body-md text-on-surface">Offer cart recovery</button>
            </div>
          </div>
        </aside>

        <section className="flex flex-1 flex-col rounded-2xl border border-outline-variant bg-white md:ml-4">
          <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-4">
            <div>
              <p className="text-headline-md font-headline-md text-on-surface">Assistant conversation</p>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Live support channel</p>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-label-sm font-label-sm text-primary">AI active</div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-surface-container-low p-4">
            <div className="max-w-[85%] self-start rounded-2xl rounded-tl-none bg-surface-container p-3 text-body-md font-body-md text-on-surface shadow-sm">
              I can help with product recommendations, returns, and order updates.
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-none bg-primary p-3 text-body-md font-body-md text-white shadow-sm">
              Recommend the best product for a luxury gift under $250.
            </div>
            <div className="max-w-[85%] self-start rounded-2xl rounded-tl-none bg-surface-container p-3 text-body-md font-body-md text-on-surface shadow-sm">
              Absolutely — I’d suggest the Precision Brewer Pro and include a 15% loyalty offer.
            </div>
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-none bg-primary p-3 text-body-md font-body-md text-white shadow-sm">
              Perfect. Add the return policy summary too.
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-outline-variant bg-white p-4">
            <input className="flex-1 rounded-lg border border-outline-variant px-3 py-3 text-body-md font-body-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Type a message..." type="text" />
            <button className="rounded-lg bg-primary px-4 py-3 text-white" type="button">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default BuildingAssistantPage
