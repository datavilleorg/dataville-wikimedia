'use client';

import { useState } from 'react';
import { EditEvent, SectionType } from '@/types/wikipedia';

interface EditEventFeedProps {
  events: EditEvent[];
  isLive: boolean;
  onToggleLive: () => void;
}

const SECTION_COLORS: Record<SectionType, string> = {
  founding_year: 'bg-blue-100 text-blue-700',
  product_description: 'bg-amber-100 text-amber-700',
  controversies: 'bg-red-100 text-red-700',
  executive_roster: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-600',
};

const SECTION_DOT: Record<SectionType, string> = {
  founding_year: 'bg-blue-400',
  product_description: 'bg-amber-400',
  controversies: 'bg-red-500',
  executive_roster: 'bg-purple-500',
  other: 'bg-gray-400',
};

function formatTimeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffS = Math.floor(diffMs / 1000);
  if (diffS < 60) return `${diffS}s ago`;
  const diffM = Math.floor(diffS / 60);
  if (diffM < 60) return `${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  return `${diffH}h ago`;
}

export default function EditEventFeed({ events, isLive, onToggleLive }: EditEventFeedProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-maroon">Edit Stream (simulated)</h2>
          <p className="text-xs text-maroon/50">Simulated events showing the payload shape; not real Wikipedia edits</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-maroon/60">
            <span className={`inline-block w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'Running' : 'Paused'}
          </div>
          <button
            onClick={onToggleLive}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              isLive
                ? 'border-maroon/20 text-maroon/70 hover:bg-maroon/5'
                : 'bg-maroon text-white border-maroon'
            }`}
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
        {events.map(event => (
          <div
            key={event.event_id}
            className="rounded-xl border border-[#E5D5C5] bg-cream/40 hover:bg-cream transition-colors"
          >
            <div
              className="flex items-start gap-3 p-3 cursor-pointer"
              onClick={() => toggleExpand(event.event_id)}
            >
              <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${SECTION_DOT[event.edit.section_type]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-maroon">{event.article.entity_name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${SECTION_COLORS[event.edit.section_type]}`}>
                    {event.edit.section}
                  </span>
                  {event.kb_refresh_recommended && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
                      KB refresh
                    </span>
                  )}
                  {event.edit.is_bot && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                      bot
                    </span>
                  )}
                </div>
                <p className="text-xs text-maroon/60 mt-0.5 truncate">{event.edit.change_summary}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-maroon/40">{event.edit.editor}</span>
                  <span className="text-[10px] text-maroon/30">·</span>
                  <span className={`text-[10px] font-mono ${event.edit.bytes_changed >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {event.edit.bytes_changed >= 0 ? '+' : ''}{event.edit.bytes_changed}B
                  </span>
                  <span className="text-[10px] text-maroon/30">·</span>
                  <span className="text-[10px] text-maroon/40">{formatTimeAgo(event.timestamp)}</span>
                </div>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-maroon/30 flex-shrink-0 mt-1 transition-transform ${expandedId === event.event_id ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {expandedId === event.event_id && (
              <div className="border-t border-[#E5D5C5] px-3 pb-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-maroon/30 mt-3 mb-2">Webhook Payload</p>
                <pre className="bg-[#1e1e2e] text-[#cdd6f4] rounded-lg p-3 text-[10px] font-mono leading-relaxed overflow-x-auto">
{JSON.stringify(event, null, 2)}
                </pre>
                <div className="flex gap-2 mt-2">
                  {event.signals.map(sig => (
                    <span key={sig} className="px-2 py-0.5 rounded-full bg-maroon/10 text-maroon/60 text-[10px] font-mono">
                      {sig}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
