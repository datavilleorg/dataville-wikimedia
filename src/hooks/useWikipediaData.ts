'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TRACKED_ENTITIES,
  generateInitialEditEvents,
  generateEditEvent,
  extractRiskFlags,
  fetchDatavilleArticle,
  generateStats,
} from '@/lib/wikipediaData';
import { EditEvent, RiskFlag, ArticlePayload, WikipediaStats } from '@/types/wikipedia';

let globalEditEvents: EditEvent[] = [];
const globalRiskFlags: RiskFlag[] = extractRiskFlags();
const globalEntityPayloads: Map<string, ArticlePayload> = new Map();
const globalEntityErrors: Map<string, string> = new Map();
let globalPayloadsLoaded = false;
let globalPayloadsLoading = false;
const payloadListeners: Set<() => void> = new Set();

export function useEditEvents() {
  const [events, setEvents] = useState<EditEvent[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Populate initial events only on the client to avoid hydration mismatch
  // (generateInitialEditEvents uses Math.random() and Date.now())
  useEffect(() => {
    if (globalEditEvents.length === 0) {
      globalEditEvents = generateInitialEditEvents(15);
    }
    setEvents([...globalEditEvents]);
  }, []);

  useEffect(() => {
    if (!isLive) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 5000;
      timeoutId = setTimeout(() => {
        const entity = TRACKED_ENTITIES[Math.floor(Math.random() * TRACKED_ENTITIES.length)];
        const newEvent = generateEditEvent(entity);
        globalEditEvents = [newEvent, ...globalEditEvents].slice(0, 50);
        setEvents([...globalEditEvents]);
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [isLive]);

  const toggleLive = useCallback(() => setIsLive(prev => !prev), []);

  return { events, isLive, toggleLive };
}

export function useRiskFlags() {
  return { flags: globalRiskFlags };
}

async function loadAllPayloads() {
  if (globalPayloadsLoading) return;
  globalPayloadsLoading = true;
  // One at a time, so anonymous rate limits aren't spent in a burst.
  for (const entity of TRACKED_ENTITIES) {
    const result = await fetchDatavilleArticle(entity.wiki_title);
    if ('payload' in result) {
      globalEntityPayloads.set(entity.wiki_title, result.payload);
      globalEntityErrors.delete(entity.wiki_title);
    } else {
      globalEntityErrors.set(entity.wiki_title, result.error);
    }
    payloadListeners.forEach(notify => notify());
  }
  globalPayloadsLoaded = true;
  payloadListeners.forEach(notify => notify());
}

export function useEntityPayloads() {
  const [payloads, setPayloads] = useState(new Map(globalEntityPayloads));
  const [errors, setErrors] = useState(new Map(globalEntityErrors));
  const [isLoading, setIsLoading] = useState(!globalPayloadsLoaded);

  useEffect(() => {
    const notify = () => {
      setPayloads(new Map(globalEntityPayloads));
      setErrors(new Map(globalEntityErrors));
      setIsLoading(!globalPayloadsLoaded);
    };
    payloadListeners.add(notify);
    notify();
    loadAllPayloads();
    return () => {
      payloadListeners.delete(notify);
    };
  }, []);

  return { payloads, errors, isLoading };
}

export function useArticlePayload(wikiTitle: string | null): { payload: ArticlePayload | null; error: string | null } {
  const { payloads, errors } = useEntityPayloads();

  return useMemo(() => {
    if (!wikiTitle) return { payload: null, error: null };
    return { payload: payloads.get(wikiTitle) ?? null, error: errors.get(wikiTitle) ?? null };
  }, [wikiTitle, payloads, errors]);
}

export function useWikipediaStats(editEvents: EditEvent[]): WikipediaStats {
  return useMemo(() => generateStats(editEvents, globalRiskFlags), [editEvents]);
}
