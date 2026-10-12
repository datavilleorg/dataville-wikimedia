'use client';

import { useState, useCallback } from 'react';
import { TRACKED_ENTITIES } from '@/lib/wikipediaData';
import { useArticlePayload } from '@/hooks/useWikipediaData';
import { FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';

interface PayloadViewerProps {
  selectedEntity: string | null;
  onSelectEntity: (wikiTitle: string) => void;
}

export default function PayloadViewer({ selectedEntity, onSelectEntity }: PayloadViewerProps) {
  const [copied, setCopied] = useState(false);
  const { payload, error } = useArticlePayload(selectedEntity);

  const activeEntity = TRACKED_ENTITIES.find(e => e.wiki_title === selectedEntity);
  const endpointSlug = activeEntity
    ? encodeURIComponent(activeEntity.wiki_title.replace(/_/g, ' '))
    : 'Apple%20Inc.';

  const handleCopy = useCallback(() => {
    if (!payload) return;
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [payload]);

  return (
    <div>
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold text-maroon">Article Payload</h2>
          <p className="text-xs text-maroon/50">Live response from the Dataville Wikipedia API</p>
        </div>
        <div className="flex-shrink-0">
          <select
            value={selectedEntity ?? ''}
            onChange={e => onSelectEntity(e.target.value)}
            className="text-xs border border-[#E5D5C5] rounded-lg px-3 py-1.5 bg-white text-maroon focus:outline-none focus:ring-1 focus:ring-maroon/30"
          >
            {TRACKED_ENTITIES.map(e => (
              <option key={e.wiki_title} value={e.wiki_title}>{e.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5D5C5] overflow-hidden">
        {/* Endpoint bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#f5f0eb] border-b border-[#E5D5C5]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">GET</span>
            <code className="text-xs text-maroon/70 font-mono">
              api.dataville.com/wiki/{endpointSlug}
            </code>
          </div>
          <div className="flex items-center gap-2">
            {payload && (
              <a
                href={payload.metadata.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-maroon/50 hover:text-maroon transition-colors"
              >
                Wikipedia <FiExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] text-maroon/50 hover:text-maroon transition-colors"
            >
              {copied ? <FiCheck className="w-3 h-3 text-green-600" /> : <FiCopy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* JSON body */}
        {payload ? (
          <pre className="bg-[#1e1e2e] text-[#cdd6f4] p-5 text-xs font-mono leading-relaxed overflow-x-auto max-h-[440px] overflow-y-auto">
{JSON.stringify(payload, null, 2)}
          </pre>
        ) : error ? (
          <div className="bg-[#1e1e2e] h-48 flex items-center justify-center px-6">
            <p className="text-xs text-[#f5c2c2] text-center max-w-md">{error}</p>
          </div>
        ) : (
          <div className="bg-[#1e1e2e] h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#cdd6f4]" />
          </div>
        )}

        {/* Attribution footer: comes from the response, so it stays correct per article */}
        <div className="px-4 py-2 bg-[#f5f0eb] border-t border-[#E5D5C5] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] text-maroon/50">
            {payload ? (
              <>
                {payload.attribution.attribution} ·{' '}
                <a href={payload.attribution.license.url} target="_blank" rel="noopener noreferrer" className="underline">
                  {payload.attribution.license.identifier}
                </a>
              </>
            ) : (
              'Source: Wikipedia via the Dataville API'
            )}
          </span>
          <span className="text-[10px] text-maroon/40">
            {payload
              ? `Last edited on Wikipedia ${new Date(payload.last_updated).toLocaleDateString()}`
              : 'api.dataville.com'}
          </span>
        </div>
      </div>
    </div>
  );
}
