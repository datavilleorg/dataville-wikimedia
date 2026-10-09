'use client';

import { RiskFlag, RiskLevel } from '@/types/wikipedia';

interface RiskFlagPanelProps {
  flags: RiskFlag[];
  onSelectEntity: (wikiTitle: string) => void;
}

const RISK_STYLES: Record<RiskLevel, { badge: string; dot: string; border: string }> = {
  high: {
    badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
    border: 'border-red-200',
  },
  medium: {
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-400',
    border: 'border-amber-200',
  },
  low: {
    badge: 'bg-gray-100 text-gray-600',
    dot: 'bg-gray-400',
    border: 'border-gray-200',
  },
};

const RISK_LEVEL_ORDER: RiskLevel[] = ['high', 'medium', 'low'];

export default function RiskFlagPanel({ flags, onSelectEntity }: RiskFlagPanelProps) {
  const grouped = RISK_LEVEL_ORDER.reduce<Record<RiskLevel, RiskFlag[]>>(
    (acc, level) => {
      acc[level] = flags.filter(f => f.risk_level === level);
      return acc;
    },
    { high: [], medium: [], low: [] }
  );

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-maroon">Risk Flags</h2>
        <p className="text-xs text-maroon/50">Curated risk categories per company (demo data, not derived from the API)</p>
      </div>

      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {RISK_LEVEL_ORDER.map(level => {
          const items = grouped[level];
          if (items.length === 0) return null;
          const styles = RISK_STYLES[level];

          return (
            <div key={level}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-maroon/50">
                  {level} risk · {items.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {items.map((flag, idx) => (
                  <div
                    key={`${flag.entity_name}-${flag.risk_category}-${idx}`}
                    onClick={() => onSelectEntity(flag.wiki_title)}
                    className={`flex items-start justify-between gap-3 px-3 py-2.5 rounded-lg border cursor-pointer hover:bg-cream transition-colors ${styles.border} bg-white`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-maroon truncate">{flag.entity_name}</p>
                      <p className="text-[11px] text-maroon/60 mt-0.5">{flag.risk_category}</p>
                    </div>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles.badge}`}>
                      {level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {flags.length === 0 && (
          <div className="h-32 flex items-center justify-center text-maroon/40 text-sm">
            No risk flags detected
          </div>
        )}
      </div>
    </div>
  );
}
