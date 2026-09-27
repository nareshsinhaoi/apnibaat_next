import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { DataWaiting, NewsGrid } from "@/components/newsroom";
import { DisplayAd } from "@/components/google-ads";
import { categoriesQuery } from "@/lib/api";
import { AdBanner } from "@/components/ad-banner";
import { headerAd } from "@/lib/ads";

export const Route = createFileRoute("/category/$slug")({
  validateSearch: z.object({
    page: z.number().int().min(1).optional(),
  }),
  head: ({ params }) => {
    const name = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
    return {
      meta: [
        { title: `${name} समाचार — अपनीबात` },
        {
          name: "description",
          content: `${name} से जुड़ी ताज़ा हिंदी खबरें, विश्लेषण और रिपोर्ट — अपनीबात पर।`,
        },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: `${name} समाचार — अपनीबात` },
        { property: "og:description", content: `${name} श्रेणी की ताज़ा हिंदी खबरें।` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { page = 1 } = Route.useSearch();
  const navigate = useNavigate({ from: "/category/$slug" });

  const { data, isLoading, isError } = useQuery(categoriesQuery());
  const category = data?.find((c) => c.slug === slug);
  const subs = category ? data!.filter((c) => c.parent_id === category.id) : [];

  if (!isLoading && (isError || !category)) return <DataWaiting kind="श्रेणी" />;

  

  return (
    <>
      {/* ===== Category Hero ===== */}
      <section className="border-b border-border bg-gradient-to-b from-muted/40 to-background">
        <div className="content-shell py-7 sm:py-9">
          {/* Breadcrumb / eyebrow */}
          <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary">
            श्रेणी
          </p>

          {category ? (
            <>
              {/* Title + count inline */}
              <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                  {category.name}
                </h1>
                {/* <span className="font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {category.news_count ?? 0} खबरें
                </span> */}
              </div>

              {/* Description */}
              {category.description ? (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {category.description}
                </p>
              ) : null}

              {/* Subcategory chips */}
              {subs.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {subs.map((s) => (
                    <Link
                      key={s.id}
                      to="/subcategory/$slug"
                      params={{ slug: s.slug }}
                      className="rounded-full border border-border bg-card px-3.5 py-1.5 font-sans text-xs font-bold text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-3 space-y-3">
              <div className="h-9 w-64 animate-pulse rounded-sm bg-muted" />
              <div className="h-4 w-40 animate-pulse rounded-sm bg-muted" />
            </div>
          )}
        </div>
      </section>


      {/* Advertisement Strip */}
      <AdBanner ad={headerAd} position="header" />
      {/* Advertisement Strip end here */}

      

      <NewsGrid
        title="इस श्रेणी की खबरें"
        filters={{ category: slug, per_page: 12, page }}
        paginate
        onPage={(p) => {
          navigate({
            search: p > 1 ? { page: p } : {},
            resetScroll: false,
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Ad above grid */}
      <div className="content-shell flex gap-2 overflow-x-auto py-4 [scrollbar-width:none] sm:flex-wrap">
        <div className="webAds topads advertiseTxt" data-position="header">
          <div className="advertise">
            <DisplayAd size="leaderboard" />
          </div>
        </div>
      </div>

    </>
  );
}