import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    googletag?: {
      cmd: Array<() => void>;
      defineSlot: (...args: unknown[]) => unknown;
      defineOutOfPageSlot: (...args: unknown[]) => unknown;
      display: (id: string) => void;
      pubads: () => {
        refresh: (slots?: unknown[]) => void;
        set: (k: string, v: string) => void;
        enableSingleRequest: () => void;
        collapseEmptyDivs: () => void;
      };
      enableServices: () => void;
      enums: { OutOfPageFormat: { INTERSTITIAL: unknown } };
    };
    __apnibaatAds?: {
      displaySlot: unknown;
      anchorSlot: unknown;
      interstitialSlot: unknown;
    };
  }
}

const DISPLAY_SLOT_ID = "div-gpt-ad-display";
const REFRESH_MS = 32_000;

type AdSlotProps = {
  /** Container width — controls wrapper sizing so the layout reserves space. */
  size?: "leaderboard" | "billboard" | "rectangle";
  className?: string;
  /** Label shown above the ad ("विज्ञापन"). Pass null to hide. */
  label?: string | null;
};

const SIZE_CLASSES: Record<NonNullable<AdSlotProps["size"]>, string> = {
  // 970x250 / 750x200 / 750x300 area
  billboard: "mx-auto w-full max-w-[970px] min-h-[250px]",
  // 728x90 / 320x100 / 750x300 area
  leaderboard: "mx-auto w-full max-w-[750px] min-h-[100px]",
  // 300x250 / 300x600
  rectangle: "mx-auto w-full max-w-[320px] min-h-[250px]",
};

/**
 * Renders the in-content GPT display slot. Only renders one per page —
 * Google recommends a single "display" unit reused across the page.
 */
export function DisplayAd({ size = "billboard", className = "", label = "विज्ञापन" }: AdSlotProps) {
  const [mounted, setMounted] = useState(false);
  const displayed = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || displayed.current) return;
    const g = window.googletag;
    if (!g) return;

    g.cmd.push(() => {
      if (displayed.current) return;
      g.display(DISPLAY_SLOT_ID);
      displayed.current = true;

      // Refresh every 32s while the page stays open
      const timer = setInterval(() => {
        g.cmd.push(() => {
          const slot = window.__apnibaatAds?.displaySlot;
          if (slot) g.pubads().refresh([slot]);
        });
      }, REFRESH_MS);

      // Cleanup when component unmounts
      return () => clearInterval(timer);
    });
  }, [mounted]);

  if (!mounted) {
    return (
      <div className={`my-6 ${className}`} aria-hidden="true">
        <div className={`${SIZE_CLASSES[size]} rounded-md bg-muted/50`} />
      </div>
    );
  }

  return (
    <div className={`my-6xxxxxxx ${className}`}>
      {/* {label ? (
        <p className="mb-1 text-center font-sans text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
      ) : null} */}
      <div className={`${SIZE_CLASSES[size]} overflow-hidden rounded-md`}>
        <div id={DISPLAY_SLOT_ID} className="h-full w-full" />
      </div>
    </div>
  );
}

/**
 * Anchor ad — sticky at the bottom of the viewport. Mount once near the root.
 */
export function AnchorAd() {
  const [mounted, setMounted] = useState(false);
  const [hasCreative, setHasCreative] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const displayed = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || displayed.current) return;
    const g = window.googletag;
    if (!g) return;

    // Skip entirely if the anchor slot was not defined in __root.tsx
    if (!window.__apnibaatAds?.anchorSlot) return;

    g.cmd.push(() => {
      if (displayed.current) return;
      g.display("div-gpt-ad-anchor");
      displayed.current = true;
    });
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;

    const check = () => {
      if (el.querySelector("iframe")) setHasCreative(true);
    };
    check();

    const observer = new MutationObserver(check);
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-x-0 bottom-0 z-40 flex justify-center transition-transform duration-300 ${
        hasCreative ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ minHeight: 0 }}
    >
      <div
        id="div-gpt-ad-anchor"
        className={`overflow-hidden ${
          hasCreative
            ? "bg-background/95 shadow-[0_-4px_20px_-8px_oklch(0.2_0.02_260_/_0.2)] backdrop-blur"
            : ""
        }`}
      />
    </div>
  );
}

/**
 * Interstitial ad — full-screen takeover. Fires automatically when services are enabled.
 * Mount once near the root. No visible container needed.
 */
export function InterstitialAd() {
  useEffect(() => {
    const g = window.googletag;
    if (!g) return;
    g.cmd.push(() => {
      const slot = window.__apnibaatAds?.interstitialSlot;
      if (slot) g.pubads().refresh([slot]);
    });
  }, []);

  return null;
}