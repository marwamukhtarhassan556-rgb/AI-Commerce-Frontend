export default function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface py-lg">
      <div className="flex w-full flex-col items-center justify-between gap-lg px-lg md:flex-row">
        <div className="mb-sm md:mb-0">
          <span className="text-headline-md font-headline-md text-primary">CommerceMind AI</span>
        </div>
        <p className="order-3 text-label-sm font-label-sm text-on-surface-variant md:order-2">
          © 2024 CommerceMind AI. All rights reserved.
        </p>
        <div className="order-2 mb-sm flex gap-lg md:order-3 md:mb-0">
          <a className="text-label-sm font-label-sm text-on-surface-variant transition-colors hover:text-primary" href="#">Privacy Policy</a>
          <a className="text-label-sm font-label-sm text-on-surface-variant transition-colors hover:text-primary" href="#">Terms of Service</a>
          <a className="text-label-sm font-label-sm text-on-surface-variant transition-colors hover:text-primary" href="#">Help Center</a>
        </div>
      </div>
    </footer>
  )
}
