'use client';

import { useMemo } from 'react';
import { TRACKED_ENTITIES } from '@/lib/wikipediaData';
import { useEntityPayloads } from '@/hooks/useWikipediaData';
import { EditEvent, RiskFlag } from '@/types/wikipedia';

interface EntityMonitorProps {
  editEvents: EditEvent[];
  riskFlags: RiskFlag[];
  selectedEntity: string | null;
  onSelectEntity: (wikiTitle: string) => void;
}

export default function EntityMonitor({ editEvents, riskFlags, selectedEntity, onSelectEntity }: EntityMonitorProps) {
  const { payloads } = useEntityPayloads();

  const entityStats = useMemo(() => {
    const editCounts: Record<string, number> = {};
    for (const event of editEvents) {
      const title = event.article.entity_name;
      editCounts[title] = (editCounts[title] ?? 0) + 1;
    }

    const riskCounts: Record<string, number> = {};
    for (const flag of riskFlags) {
      riskCounts[flag.entity_name] = (riskCounts[flag.entity_name] ?? 0) + 1;
    }

    return TRACKED_ENTITIES.map(entity => ({
      entity,
      edits: editCounts[entity.name] ?? 0,
      // Real: when the article was last edited on Wikipedia, from Dataville.
      lastEdit: payloads.get(entity.wiki_title)?.last_updated ?? null,
      riskCount: riskCounts[entity.name] ?? 0,
    })).sort((a, b) => b.edits - a.edits);
  }, [editEvents, riskFlags, payloads]);

  function formatTimeAgo(isoString: string | null): string {
    if (!isoString) return '—';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffM = Math.floor(diffMs / 60000);
    if (diffM < 1) return 'just now';
    if (diffM < 60) return `${diffM}m ago`;
    const diffH = Math.floor(diffM / 60);
    if (diffH < 48) return `${diffH}h ago`;
    return `${Math.floor(diffH / 24)}d ago`;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-maroon">Monitored Entities</h2>
        <p className="text-xs text-maroon/50">
          Last Wikipedia edit is live from Dataville; edit counts come from the simulated stream. Click a company to view its payload.
        </p>
      </div>

      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
        {entityStats.map(({ entity, edits, lastEdit, riskCount }) => (
          <div
            key={entity.wiki_title}
            onClick={() => onSelectEntity(entity.wiki_title)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
              selectedEntity === entity.wiki_title
                ? 'bg-maroon text-white'
                : 'bg-cream/50 hover:bg-cream text-maroon'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold truncate ${selectedEntity === entity.wiki_title ? 'text-white' : 'text-maroon'}`}>
                  {entity.name}
                </p>
                {riskCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    selectedEntity === entity.wiki_title ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                  }`}>
                    {riskCount} flag{riskCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className={`text-[10px] ${selectedEntity === entity.wiki_title ? 'text-white/60' : 'text-maroon/50'}`}>
                {entity.category} · edited on Wikipedia {formatTimeAgo(lastEdit)}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`text-sm font-bold ${selectedEntity === entity.wiki_title ? 'text-white' : 'text-maroon'}`}>
                {edits}
              </p>
              <p className={`text-[10px] ${selectedEntity === entity.wiki_title ? 'text-white/60' : 'text-maroon/50'}`}>
                sim. edits
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
