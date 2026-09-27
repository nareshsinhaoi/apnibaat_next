import { useQuery } from "@tanstack/react-query";
import { formatDate, newsQuery, type NewsFilters, type NewsItem } from "@/lib/api";
import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, RefreshCw, UserRound } from "lucide-react";


function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-sm bg-muted ${className}`} />;
}

/** Matches NewsCard layout exactly — used on home, category, subcategory, news, byline */
export function NewsCardSkeleton() {
  return (
    <article className="news-card flex flex-col" aria-hidden="true">
      {/* Image */}
      <div className="aspect-[16/10] w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Category pill */}
        <SkeletonLine className="h-3 w-20" />
        {/* Title lines */}
        <SkeletonLine className="mt-3 h-4 w-full" />
        <SkeletonLine className="mt-2 h-4 w-4/5" />
        {/* Excerpt lines (only for non-compact) */}
        <SkeletonLine className="mt-3 h-3 w-full" />
        <SkeletonLine className="mt-2 h-3 w-3/4" />
        {/* Meta row */}
        <div className="mt-auto flex items-center gap-2 pt-4">
          <SkeletonLine className="h-3 w-16" />
          <SkeletonLine className="h-3 w-14" />
        </div>
      </div>
    </article>
  );
}

/** Renders a full responsive grid of NewsCardSkeleton with the same column counts */
export function NewsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton used inside the leading hero section on the home page */
export function LeadStorySkeleton() {
  return (
    <section className="content-shell pt-8 sm:pt-10" aria-hidden="true">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.75fr)]">
        {/* Hero lead */}
        <div className="relative flex min-h-[300px] items-end overflow-hidden rounded-xl bg-muted sm:min-h-[420px] lg:min-h-[480px]">
          <div className="relative w-full p-6 sm:p-9">
            <SkeletonLine className="h-3 w-24 bg-secondary" />
            <SkeletonLine className="mt-4 h-7 w-full max-w-xl bg-secondary" />
            <SkeletonLine className="mt-2 h-7 w-3/4 max-w-lg bg-secondary" />
            <SkeletonLine className="mt-4 h-3 w-40 bg-secondary" />
          </div>
        </div>
        {/* Side stories */}
        <div className="grid divide-y divide-border overflow-hidden rounded-xl border border-border bg-card md:grid-cols-3 md:divide-x md:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex min-w-0 gap-4 p-4 md:flex-col lg:flex-row">
              <div className="h-20 w-24 shrink-0 animate-pulse rounded-md bg-muted md:h-28 md:w-full lg:h-20 lg:w-24" />
              <div className="min-w-0 flex-1 py-1">
                <SkeletonLine className="h-2.5 w-16" />
                <SkeletonLine className="mt-3 h-3 w-full" />
                <SkeletonLine className="mt-2 h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Breaking strip skeleton — thin animated bar */
export function BreakingStripSkeleton() {
  return (
    <div className="border-b border-border bg-breaking text-breaking-foreground" aria-hidden="true">
      <div className="content-shell flex items-center gap-3 py-2.5">
        <div className="h-6 w-20 shrink-0 animate-pulse rounded-full bg-background/30" />
        <div className="h-3 flex-1 max-w-md animate-pulse rounded-sm bg-background/25" />
      </div>
    </div>
  );
}


export function SectionTitle({ children, action }: { children: string; action?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-3">
      <h2 className="section-rule">{children}</h2>
      {action ? (
        <span className="shrink-0 font-sans text-[0.68rem] font-bold uppercase tracking-wide text-primary">
          {action} →
        </span>
      ) : null}
    </div>
  );
}

export function EmptyNewsGrid({ title = "नवीनतम समाचार" }: { title?: string }) {
  return (
    <section className="content-shell py-10 sm:py-16">
      <SectionTitle action="सभी देखें">{title}</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="news-card" key={index}>
            <div className="aspect-[16/10] bg-muted" />
            <div className="p-5">
              <span className="inline-block h-4 w-20 rounded-sm bg-secondary" />
              <div className="mt-4 h-4 w-full rounded-sm bg-muted" />
              <div className="mt-2 h-4 w-3/4 rounded-sm bg-muted" />
              <div className="mt-7 h-3 w-2/5 rounded-sm bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DataWaiting({ kind }: { kind: "समाचार" | "श्रेणी" | "लेखक" }) {
  const Icon = kind === "लेखक" ? UserRound : FileText;
  return (
    <div className="content-shell py-20">
      <div className="mx-auto max-w-xl border-y border-border py-14 text-center">
        <Icon className="mx-auto size-9 text-primary" aria-hidden="true" />
        <h1 className="mt-5 font-display text-3xl font-bold text-foreground">
          {kind} की जानकारी जल्द उपलब्ध होगी
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
          वास्तविक प्रकाशित सामग्री इस पृष्ठ पर शीघ्र दिखाई देगी।
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wide text-primary transition-opacity hover:opacity-80"
        >
          मुखपृष्ठ पर जाएँ <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export function LeadPlaceholder() {
  return (
    <section className="content-shell pt-8 sm:pt-10">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.75fr)]">
        <div className="relative flex min-h-[300px] items-end overflow-hidden rounded-xl bg-ink sm:min-h-[420px] lg:min-h-[480px]">
          <div className="absolute inset-0 grid place-items-center opacity-30">
            <RefreshCw className="size-10 animate-spin-slow text-paper sm:size-12" />
          </div>
          <div className="relative w-full bg-lead-fade p-6 sm:p-9">
            <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.16em] text-breaking-soft">
              मुख्य समाचार
            </span>
            <h1 className="mt-3 max-w-2xl font-display text-2xl font-bold leading-snug text-paper sm:text-4xl lg:text-5xl">
              आज की प्रमुख खबरें यहाँ दिखाई देंगी
            </h1>
          </div>
        </div>
        <div className="grid divide-y divide-border overflow-hidden rounded-xl border border-border bg-card md:grid-cols-3 md:divide-x md:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
          {["ताज़ा अपडेट", "लोकप्रिय समाचार", "विशेष रिपोर्ट"].map((label) => (
            <div className="flex min-w-0 gap-4 p-4 md:flex-col lg:flex-row" key={label}>
              <div className="h-20 w-24 shrink-0 rounded-md bg-muted md:h-24 md:w-full lg:h-20 lg:w-24" />
              <div className="min-w-0 flex-1 py-1">
                <span className="font-sans text-[0.62rem] font-bold uppercase text-primary">{label}</span>
                <div className="mt-3 h-3 w-full max-w-32 rounded-sm bg-muted" />
                <div className="mt-2 h-3 w-3/4 max-w-24 rounded-sm bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Live API components ----------

export function NewsCard({ item, compact = false }: { item: NewsItem; compact?: boolean }) {
  return (
    <article className="news-card group flex flex-col">
      <Link to="/article/$slug" params={{ slug: item.slug }} className="block overflow-hidden">
        {item.featured_image ? (
          <img
            src={item.featured_image}
            alt={item.image_alt || item.title}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-[16/10] bg-muted" />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {item.category?.slug ? (
          <Link
            to="/category/$slug"
            params={{ slug: item.category.slug }}
            className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary transition-opacity hover:opacity-80"
          >
            {item.category.name}
          </Link>
        ) : null}
        <Link
          to="/article/$slug"
          params={{ slug: item.slug }}
          className="mt-2 font-editorial text-base font-bold leading-snug text-foreground transition-colors hover:text-primary sm:text-lg"
        >
          {item.title}
        </Link>
        {!compact && item.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.excerpt}</p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-x-2 pt-4 font-sans text-[0.7rem] text-muted-foreground">
          {item.byline?.slug ? (
            <Link
              to="/byline/$slug"
              params={{ slug: item.byline.slug }}
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              {item.byline.name}
            </Link>
          ) : null}
          <span>{formatDate(item.published_at)}</span>
          {item.read_time ? <span>· {item.read_time} मिनट</span> : null}
        </div>
      </div>
    </article>
  );
}

// function GridSkeleton({ n = 4 }: { n?: number }) {
//   return (
//     <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
//       {Array.from({ length: n }).map((_, i) => (
//         <div className="news-card animate-pulse" key={i}>
//           <div className="aspect-[16/10] bg-muted" />
//           <div className="p-5">
//             <div className="h-3 w-16 bg-muted" />
//             <div className="mt-3 h-4 w-full bg-muted" />
//             <div className="mt-2 h-4 w-3/4 bg-muted" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

export function NewsGrid({
  title,
  filters,
  paginate = false,
  onPage,
  viewAll,
}: {
  title: string;
  filters: NewsFilters;
  paginate?: boolean;
  onPage?: (p: number) => void;
  viewAll?: { to: string; params?: Record<string, string>; search?: Record<string, unknown> };
}) {
  const { data, isLoading, isError } = useQuery(newsQuery(filters));
  const skeletonCount = filters.per_page && filters.per_page < 4 ? filters.per_page : 4;

  return (
    <section className="content-shell py-10 sm:py-14">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-3">
        <h2 className="section-rule">{title}</h2>
        {viewAll ? (
          <Link
            to={viewAll.to as never}
            params={viewAll.params as never}
            search={viewAll.search as never}
            className="shrink-0 font-sans text-[0.68rem] font-bold uppercase tracking-wide text-primary transition-opacity hover:opacity-80"
          >
            सभी देखें →
          </Link>
        ) : null}
      </div>

      {isLoading ? (
        <NewsGridSkeleton count={skeletonCount} />
      ) : isError ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          खबरें लोड नहीं हो सकीं। कृपया थोड़ी देर बाद पुनः प्रयास करें।
        </p>
      ) : !data?.items.length ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          इस समय कोई खबर उपलब्ध नहीं है।
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </div>
      )}

      {paginate && data?.meta && data.meta.last_page > 1 ? (
        <div className="mt-10 flex items-center justify-center gap-3 font-sans text-sm">
          <button
            disabled={data.meta.current_page <= 1}
            onClick={() => onPage?.(data.meta!.current_page - 1)}
            className="rounded-full border border-border px-5 py-2 font-semibold transition-colors hover:bg-muted disabled:opacity-40"
          >
            ← पिछला
          </button>
          <span className="text-muted-foreground">
            {data.meta.current_page} / {data.meta.last_page}
          </span>
          <button
            disabled={data.meta.current_page >= data.meta.last_page}
            onClick={() => onPage?.(data.meta!.current_page + 1)}
            className="rounded-full border border-border px-5 py-2 font-semibold transition-colors hover:bg-muted disabled:opacity-40"
          >
            अगला →
          </button>
        </div>
      ) : null}
    </section>
  );
}

export function BreakingStrip() {
  const { data, isLoading } = useQuery(newsQuery({ breaking: true, per_page: 5 }));

  if (isLoading) return <BreakingStripSkeleton />;
  const items = data?.items ?? [];
  if (!items.length) return null;

  return (
    <div className="border-b border-border bg-breaking text-breaking-foreground">
      <div className="content-shell flex items-center gap-3 overflow-hidden py-2.5 font-sans text-xs">
        <span className="shrink-0 rounded-full bg-background px-3 py-1 font-extrabold uppercase tracking-wide text-breaking">
          ब्रेकिंग
        </span>
        <div className="flex gap-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
          {items.map((n) => (
            <Link
              key={n.id}
              to="/article/$slug"
              params={{ slug: n.slug }}
              className="font-semibold transition-opacity hover:opacity-90 hover:underline"
            >
              {n.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LeadStories() {
  const featured = useQuery(newsQuery({ featured: true, per_page: 4 }));
  const latest = useQuery(newsQuery({ per_page: 4 }));
  const pool = [...(featured.data?.items ?? []), ...(latest.data?.items ?? [])].filter(
    (n, i, a) => a.findIndex((x) => x.id === n.id) === i,
  );

  if (featured.isLoading || latest.isLoading) return <LeadStorySkeleton />;
  if (!pool.length) return <LeadPlaceholder />;

  const [lead, ...side] = pool;
  if (!lead) return <LeadPlaceholder />;

  // ...rest of the render stays the same
  return (
    <section className="content-shell pt-8 sm:pt-10">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.75fr)]">
        <Link
          to="/article/$slug"
          params={{ slug: lead.slug }}
          className="group relative flex min-h-[300px] items-end overflow-hidden rounded-xl bg-ink sm:min-h-[420px] lg:min-h-[480px]"
        >
          {lead.featured_image ? (
            <img
              src={lead.featured_image}
              alt={lead.image_alt || lead.title}
              className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : null}
          <div className="relative w-full bg-lead-fade p-6 sm:p-9">
            <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.16em] text-breaking-soft">
              {lead.category?.name || "मुख्य समाचार"}
            </span>
            <h1 className="mt-3 max-w-2xl font-display text-2xl font-bold leading-snug text-paper sm:text-4xl">
              {lead.title}
            </h1>
            <p className="mt-3 font-sans text-xs text-paper/75">
              {lead.byline?.name} · {formatDate(lead.published_at)}
            </p>
          </div>
        </Link>

        <div className="grid divide-y divide-border overflow-hidden rounded-xl border border-border bg-card md:grid-cols-3 md:divide-x md:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
          {side.slice(0, 3).map((n) => (
            <Link
              key={n.id}
              to="/article/$slug"
              params={{ slug: n.slug }}
              className="group flex min-w-0 gap-4 p-4 transition-colors hover:bg-muted/40 md:flex-col lg:flex-row"
            >
              {n.featured_image ? (
                <img
                  src={n.featured_image}
                  alt={n.image_alt || n.title}
                  loading="lazy"
                  className="h-20 w-24 shrink-0 rounded-md object-cover md:h-28 md:w-full lg:h-20 lg:w-24"
                />
              ) : (
                <div className="h-20 w-24 shrink-0 rounded-md bg-muted" />
              )}
              <div className="min-w-0 flex-1">
                <span className="font-sans text-[0.62rem] font-bold uppercase tracking-wide text-primary">
                  {n.category?.name}
                </span>
                <p className="mt-1 line-clamp-3 font-editorial text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {n.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}