import Link from "next/link";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-ink">LiveStocks</span>
          </Link>
          <Link href="/" className="rounded-full border border-border px-4 py-2 text-[0.8rem] font-medium text-ink-muted transition-colors hover:bg-panel-raised hover:text-ink">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-2 text-[0.85rem] text-ink-muted">Last updated: {lastUpdated}</p>
          <div className="legal-content mt-10 space-y-6 text-[0.95rem] leading-relaxed text-ink-secondary">
            {children}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-[0.78rem] text-ink-muted">
            &copy; {new Date().getFullYear()} LiveStocks by Khurram | All rights reserved. Not investment advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
