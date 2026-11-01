"use client";

export type TabId = "dashboard" | "watchlist" | "heatmap" | "charts";

interface TabNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "watchlist", label: "Watchlist" },
  { id: "heatmap", label: "Heatmap" },
  { id: "charts", label: "Charts" },
];

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="flex items-center gap-1" aria-label="Main navigation">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`rounded-full px-4 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-all duration-200 ${
              isActive
                ? "bg-accent text-ground font-medium"
                : "text-ink-muted hover:text-ink hover:bg-panel-raised"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
