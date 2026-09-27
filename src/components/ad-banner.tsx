// src/components/ad-banner.tsx
import type { AdSlot } from "@/lib/ads";

type Props = {
  ad: AdSlot;
  position?: string;
  className?: string;
};

export function AdBanner({ ad, position = "header", className = "" }: Props) {
  const hasImage = ad?.desktop_image || ad?.mobile_image;

  return (
    <div
      className={`content-shell flex gap-2 overflow-x-auto py-4 [scrollbar-width:none] sm:flex-wrap ${className}`}
    >
      <div className="webAds topads advertiseTxt" data-position={position}>
        <div className="advertise">
          {hasImage ? (
            <>
              {ad.desktop_image && (
                <a
                  href={ad.desktop_link || ad.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden w-full md:block"
                >
                  <img
                    src={ad.desktop_image}
                    alt={ad.alt || "Advertisement"}
                    className="block h-auto w-full object-contain"
                  />
                </a>
              )}

              {ad.mobile_image && (
                <a
                  href={ad.mobile_link || ad.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full md:hidden"
                >
                  <img
                    src={ad.mobile_image}
                    alt={ad.alt || "Advertisement"}
                    className="block h-auto w-full object-contain"
                  />
                </a>
              )}
            </>
          ) : (
            <span className="advertise-placeholder">Ad Space</span>
          )}
        </div>
      </div>
    </div>
  );
}