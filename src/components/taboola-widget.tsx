// src/components/taboola-widget.tsx
import { useEffect, useRef } from 'react';

// Extend the window interface for TypeScript
declare global {
  interface Window {
    _taboola: any[];
  }
}

interface TaboolaWidgetProps {
  containerId: string;
  mode?: string; // e.g., 'thumbnails-a'
  placement?: string; // e.g., 'Below Article Thumbnails'
  targetType?: string; // e.g., 'mix'
  publisher?: string;
  pageType?: string; // e.g., 'article'
}

export function TaboolaWidget({
  containerId,
  mode = 'thumbnails-a',
  placement = 'Below Article Thumbnails',
  targetType = 'mix',
  publisher = 'YOUR_PUBLISHER_NAME',
  pageType = 'article',
}: TaboolaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the queue if it doesn't exist (safe guard)
    window._taboola = window._taboola || [];

    // Only push the config if the container is actually in the DOM
    if (containerRef.current) {
      window._taboola.push({
        mode: mode,
        container: containerId,
        placement: placement,
        target_type: targetType,
        publisher: publisher,
        page_type: pageType,
      });
    }

    // Clean up the container on unmount to prevent stale references
    return () => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [containerId, mode, placement, targetType, publisher, pageType]);

  return <div id={containerId} ref={containerRef} />;
}