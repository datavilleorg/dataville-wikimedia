'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiExternalLink } from 'react-icons/fi';
import EditEventFeed from '@/components/wikipedia/EditEventFeed';
import EntityMonitor from '@/components/wikipedia/EntityMonitor';
import RiskFlagPanel from '@/components/wikipedia/RiskFlagPanel';
import PayloadViewer from '@/components/wikipedia/PayloadViewer';
import { useEditEvents, useRiskFlags, useWikipediaStats } from '@/hooks/useWikipediaData';
import { TRACKED_ENTITIES } from '@/lib/wikipediaData';

export default function WikipediaTrackerPage() {
  const [selectedEntity, setSelectedEntity] = useState<string>(TRACKED_ENTITIES[0].wiki_title);

  const { events, isLive, toggleLive } = useEditEvents();
  const { flags } = useRiskFlags();
  const stats = useWikipediaStats(events);

  const handleSelectEntity = (wikiTitle: string) => {
    setSelectedEntity(wikiTitle);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Top nav */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#E5D5C5]">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <a href="https://dataville.com" className="flex items-center gap-3">
            <Image src="/Mailbox_Full (2).svg" alt="Dataville icon" width={24} height={24} />
            <Image src="/dataville-logo.svg" alt="Dataville" width={100} height={18} />
          </a>
          <a
            href="https://dataville.com"
            className="text-sm font-medium text-maroon hover:underline flex items-center gap-1"
          >
            dataville.com <FiExternalLink className="h-3 w-3" />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-[#E5D5C5] bg-white p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-maroon">Wikipedia Knowledge Base Tracker</h1>
              <p className="mt-1 text-sm text-maroon/70">
                Company knowledge-base tracking with source-linked Wikipedia data from the Dataville API
              </p>
              <p className="mt-0.5 text-xs text-maroon/50">
                Live article data via Dataville · simulated edit stream · {TRACKED_ENTITIES.length} entities monitored
              </p>
            </div>

            <div className="flex gap-6 text-center flex-shrink-0">
              <div>
                <p className="text-2xl font-bold text-maroon">{stats.entities_monitored}</p>
                <p className="text-xs text-maroon/50">Entities</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-maroon">{stats.edits_detected_24h}</p>
                <p className="text-xs text-maroon/50">Edits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.risk_flags_active}</p>
                <p className="text-xs text-maroon/50">Risk Flags</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.kb_refreshes_triggered}</p>
                <p className="text-xs text-maroon/50">KB Refreshes</p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl border border-[#E5D5C5] bg-white divide-y divide-maroon/10">
          <div className="px-6 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-maroon/40 mb-1">Featured use case</p>
            <h2 className="text-base font-bold text-maroon">Wikipedia Knowledge Base Refresh</h2>
            <p className="mt-1.5 text-sm text-maroon/70 leading-relaxed">
              Query Wikipedia articles through the Dataville API and receive structured, clean article content
              ready for knowledge base pipelines. Surface signals from founding year changes, product description
              updates, controversy edits, and executive roster changes — exactly the payload shape you&apos;d wire
              into a knowledge base refresh pipeline.
            </p>
          </div>

          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-maroon/10">
            <div className="px-6 py-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-maroon/40 mb-3">Why use Dataville</h3>
              <ul className="space-y-2.5 text-sm text-maroon/70">
                {[
                  'One API call returns clean, structured Wikipedia article content — no dumps, scraping or wikitext parsing',
                  'Kept fresh from Wikimedia Enterprise snapshots plus hourly update batches, so you run no ingestion',
                  'Every response carries its source URL, license and attribution, ready to cite',
                  'The same key and response shape for SEC EDGAR and every other Dataville source',
                ].map(item => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-maroon/40 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 py-5">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-maroon/40 mb-3">Data source</h3>
              <div className="text-sm text-maroon/70 space-y-3">
                <ul className="space-y-2">
                  {[
                    ['Live (Dataville API)', 'Article text, abstract, categories, last-edit time, license and attribution'],
                    ['Simulated', 'The edit event stream and its signals, to show the webhook payload you would build'],
                    ['Curated', 'Risk categories, hand-picked per company for this demo'],
                    ['Payload', 'The unmodified response from GET api.dataville.com/wiki/{title}'],
                  ].map(([label, value]) => (
                    <li key={label} className="flex gap-2.5">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-maroon/40 flex-shrink-0" />
                      <span><span className="font-medium text-maroon">{label}:</span> {value}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://app.dataville.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-maroon hover:underline font-medium"
                >
                  View Dataville API
                  <FiExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://app.dataville.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 inline-flex items-center gap-1 text-xs text-maroon hover:underline font-medium"
                >
                  Get an API key
                  <FiExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Live Edit Stream */}
        <div className="rounded-2xl border border-[#E5D5C5] bg-white p-6">
          <EditEventFeed events={events} isLive={isLive} onToggleLive={toggleLive} />
        </div>

        {/* Entity Monitor + Risk Flags */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#E5D5C5] bg-white p-6">
            <EntityMonitor
              editEvents={events}
              riskFlags={flags}
              selectedEntity={selectedEntity}
              onSelectEntity={handleSelectEntity}
            />
          </div>

          <div className="rounded-2xl border border-[#E5D5C5] bg-white p-6">
            <RiskFlagPanel flags={flags} onSelectEntity={handleSelectEntity} />
          </div>
        </div>

        {/* Payload Viewer */}
        <div className="rounded-2xl border border-[#E5D5C5] bg-white p-6">
          <PayloadViewer selectedEntity={selectedEntity} onSelectEntity={handleSelectEntity} />
        </div>
      </main>
    </div>
  );
}
