import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatDate, newsNeighborsQuery } from "@/lib/api";

/* ---------- Types ---------- */

interface NeighborItem {
  slug: string;
  title: string;
  featured_image?: string | null;
  image_alt?: string | null;
  published_at: string;
  category?: { name?: string } | null;
}

interface StoryNavProps {
  slug: string;
}

/* ---------- Main component ---------- */

export function StoryNav({ slug }: StoryNavProps) {
  const { data } = useQuery(newsNeighborsQuery(slug));
  const prev = (data?.prev ?? null) as NeighborItem | null;
  const next = (data?.next ?? null) as NeighborItem | null;

  if (!prev && !next) return null;

  return (
    <>
      {/* ---------- Desktop: two cards below the story ---------- */}
      <nav
        aria-label="लेख नेविगेशन"
        className="hidden grid-cols-2 gap-4 border-t border-border pt-8 md:grid"
      >
        <NavCard kind="prev" item={prev} />
        <NavCard kind="next" item={next} />
      </nav>

      {/* ---------- Mobile: floating arrows on left/right edges ---------- */}
      <MobileArrows prev={prev} next={next} />
    </>
  );
}

/* ---------- Desktop card ---------- */

function NavCard({
  kind,
  item,
}: {
  kind: "prev" | "next";
  item: NeighborItem | null;
}) {
  const isPrev = kind === "prev";
  const Icon = isPrev ? ArrowLeft : ArrowRight;
  const label = isPrev ? "पिछली खबर" : "अगली खबर";

  if (!item) {
    return (
      <div
        className={`hidden rounded-xl border border-dashed border-border bg-card/40 p-5 sm:flex sm:min-h-[112px] sm:items-center ${
          isPrev ? "justify-start" : "justify-end text-right"
        }`}
      >
        <p className="font-sans text-xs text-muted-foreground">
          {isPrev ? "पिछली खबर उपलब्ध नहीं" : "अगली खबर उपलब्ध नहीं"}
        </p>
      </div>
    );
  }

  return (
    <Link
      to="/article/$slug"
      params={{ slug: item.slug }}
      className={`news-card group flex items-start gap-4 p-4 transition-colors hover:border-primary/40 ${
        isPrev ? "" : "flex-row-reverse text-right"
      }`}
    >
      {item.featured_image ? (
        <div className="shrink-0 overflow-hidden rounded-md">
          <img
            src={item.featured_image}
            alt={item.image_alt || item.title}
            loading="lazy"
            className="h-20 w-24 object-cover transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-28"
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <span
          className={`inline-flex items-center gap-1.5 font-sans text-[0.62rem] font-bold uppercase tracking-[0.14em] text-primary ${
            isPrev ? "" : "flex-row-reverse"
          }`}
        >
          <Icon className="size-3" aria-hidden="true" />
          {label}
        </span>

        <p className="mt-1 line-clamp-2 font-editorial text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">
          {item.title}
        </p>

        <p className="mt-1 font-sans text-[0.68rem] text-muted-foreground">
          {item.category?.name ? `${item.category.name} · ` : ""}
          {formatDate(item.published_at)}
        </p>
      </div>
    </Link>
  );
}

/* ---------- Mobile floating arrows (UPDATED) ---------- */

function MobileArrows({
  prev,
  next,
}: {
  prev: NeighborItem | null;
  next: NeighborItem | null;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-1/2 z-40 -translate-y-1/2 md:hidden">
      <div className="flex items-center justify-between">
        {prev ? (
          <Link
            to="/article/$slug"
            params={{ slug: prev.slug }}
            aria-label="पिछली खबर"
            /* 
              Shape: tall rounded-right pill matching the image.
              Color: uses your primary color (red/pink).
              Border: thin light inner border like the reference.
            */
            //className="pointer-events-auto flex h-[88px] w-10 items-center justify-center rounded-r-xl border-y border-r border-white/40 bg-primary text-primary-foreground shadow-md transition-opacity active:opacity-80"
            className="pointer-events-auto flex h-[88px] w-6 items-center justify-center rounded-r-xl border-white/30 bg-primary/60 text-white shadow-sm backdrop-blur-sm transition-all active:bg-primary/80"
          >
            <ArrowLeft className="size-5" strokeWidth={3} />
          </Link>
        ) : (
          <span aria-hidden="true" className="h-[88px] w-10" />
        )}

        {next ? (
          <Link
            to="/article/$slug"
            params={{ slug: next.slug }}
            aria-label="अगली खबर"
            //className="pointer-events-auto flex h-[88px] w-10 items-center justify-center rounded-l-xl border-y border-l border-white/40 bg-primary text-primary-foreground shadow-md transition-opacity active:opacity-80"
            className="pointer-events-auto flex h-[88px] w-6 items-center justify-center rounded-l-xl  border-white/30 bg-primary/60 text-white shadow-sm backdrop-blur-sm transition-all active:bg-primary/80"
          >
            <ArrowRight className="size-5" strokeWidth={3} />
          </Link>
        ) : (
          <span aria-hidden="true" className="h-[88px] w-10" />
        )}
      </div>
    </div>
  );
}