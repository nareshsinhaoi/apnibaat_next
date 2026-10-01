import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataWaiting, NewsCard, SectionTitle } from "@/components/newsroom";
import { Newsletter } from "@/components/site-chrome";
import { formatDate, newsDetailQuery } from "@/lib/api";
import { DisplayAd } from "@/components/google-ads";
import { AdBanner } from "@/components/ad-banner";
import { headerAd } from "@/lib/ads";
import { TaboolaWidget } from '@/components/taboola-widget';
import { VdoAiAd } from "@/components/vdo-ai-ad";
import { ArticleWithAds } from "@/components/article-with-ads"

const SITE_URL = "https://apnibaat.com";

export const Route = createFileRoute("/article/$slug")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(newsDetailQuery(params.slug)).catch(() => null),
  head: ({ loaderData: a, params }) => {
    const title = a ? `${a.meta_title || a.title} — अपनीबात` : "समाचार विवरण — अपनीबात";
    const desc =
      a?.meta_description ||
      a?.excerpt?.slice(0, 160) ||
      "अपनीबात पर विस्तृत हिंदी समाचार और विश्लेषण।";
    const url = `${SITE_URL}/article/${params.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: a?.title || title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(a?.featured_image
          ? [
              { property: "og:image", content: a.featured_image },
              { property: "og:image:alt", content: a.image_alt || a.title },
              { name: "twitter:image", content: a.featured_image },
            ]
          : []),
        ...(a?.published_at
          ? [{ property: "article:published_time", content: a.published_at }]
          : []),
        ...(a?.byline?.name
          ? [{ property: "article:author", content: a.byline.name }]
          : []),
        ...(a?.category?.name
          ? [{ property: "article:section", content: a.category.name }]
          : []),
        ...(a?.meta_keywords ? [{ name: "keywords", content: a.meta_keywords }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: a
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                headline: a.title,
                description: desc,
                image: a.featured_image ? [a.featured_image] : undefined,
                datePublished: a.published_at,
                author: a.byline?.name
                  ? { "@type": "Person", name: a.byline.name }
                  : undefined,
                publisher: {
                  "@type": "Organization",
                  name: "अपनीबात",
                  logo: { "@type": "ImageObject", url: `${SITE_URL}/AB-1.png` },
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
                articleSection: a.category?.name,
                inLanguage: "hi-IN",
              }),
            },
          ]
        : [],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const initial = Route.useLoaderData();
  const { data: a, isLoading } = useQuery({
    ...newsDetailQuery(slug),
    ...(initial ? { initialData: initial } : {}),
  });

  if (isLoading)
    return (
      <div className="content-shell max-w-3xl animate-pulse py-14">
        <div className="h-4 w-32 bg-muted" />
        <div className="mt-6 h-12 w-full bg-muted" />
        <div className="mt-4 h-12 w-3/4 bg-muted" />
        <div className="mt-8 aspect-[16/9] w-full bg-muted" />
      </div>
    );
  if (!a) return <DataWaiting kind="समाचार" />;

  return (
    <>
      {/* Header Ad */}
      <AdBanner ad={headerAd} position="header" />

      {/* ===== 2-Column Layout: Article + Sidebar ===== */}
      <div className="content-shell grid grid-cols-1 gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        {/* ---------- LEFT: Article ---------- */}
        <article className="min-w-0">
          {a.category?.slug ? (
            <Link
              to="/category/$slug"
              params={{ slug: a.category.slug }}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-sans text-[0.68rem] font-bold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary/15"
            >
              {a.category.name}
              {a.subcategory?.name ? ` · ${a.subcategory.name}` : ""}
            </Link>
          ) : null}

          <h1 className="mt-5 w-full font-display text-3xl font-extrabold leading-[1.5] tracking-tight sm:text-3xl lg:text-3xl">
            {a.title}
          </h1>
          
          {a.subtitle ? (
            <p className="mt-4 text-lg font-normal leading-8 text-muted-foreground sm:text-xl">
              {a.subtitle}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-border py-4 font-sans text-xs text-muted-foreground">
            {a.byline?.slug ? (
              <Link
                to="/byline/$slug"
                params={{ slug: a.byline.slug }}
                className="font-bold text-foreground transition-colors hover:text-primary"
              >
                {a.byline.name}
              </Link>
            ) : null}
            <span>{formatDate(a.published_at)}</span>
            <span className="text-border">·</span>
            <span>{a.read_time} मिनट पढ़ें</span>
            <span className="text-border">·</span>
            <span>{a.views} बार देखा गया</span>
          </div>

          {a.featured_image ? (
            <figure className="mt-8">
              <img
                src={a.featured_image}
                alt={a.image_alt || a.title}
                className="aspect-[16/9] w-full rounded-xl object-cover"
              />
              {a.image_alt ? (
                <figcaption className="mt-2 text-center font-sans text-xs text-muted-foreground">
                  {a.image_alt}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          {/* Content */}
          {/* <div
            className="article-body mt-9"
            dangerouslySetInnerHTML={{ __html: a.content }}
          /> */}
          {/* Content with 3 in-article ads */}
          
          <ArticleWithAds
            html={a.content}
            adPositions={[3, 6, 10]}
            renderAd={(index) => (
              //<DisplayAd size="leaderboard" />
              // or use any of these:
              // <div id={`div-gpt-ad-inline-${index}`} />
              <AdBanner ad={headerAd} position={`inline-${index}`} />
            )}
          />

          {/* Tags */}
          {a.tags?.length ? (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">
              {a.tags.map((t) => (
                <Link
                  key={t.slug}
                  to="/news"
                  search={{ q: t.name }}
                  className="rounded-full bg-muted px-4 py-1.5 font-sans text-xs font-semibold text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          ) : null}
        </article>

        {/* ---------- RIGHT: Sidebar ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {/* Sidebar Ad */}
          <div className="mb-8">
            <DisplayAd size="rectangle" />
          </div>

          {/* Related News */}
          {a.related?.length ? (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-5 flex items-center gap-2 font-sans text-sm font-extrabold uppercase tracking-[0.12em] text-foreground">
                <span className="h-4 w-1 rounded-full bg-primary" />
                संबंधित खबरें
              </h3>
              <div className="flex flex-col gap-5">
                {a.related.slice(0, 5).map((n) => (
                  <RelatedItem key={n.id} item={n} />
                ))}
              </div>
            </div>
          ) : null}

          {/* Sidebar Ad #2 */}
          <div className="mt-8">
            <DisplayAd size="rectangle" />
          </div>
        </aside>
      </div>

       
      {/* ===== Full-Width Taboola / MGID Ad ===== */}
      <section className="border-y border-border bg-muted/20 py-8">
        <div className="content-shell">
          <TaboolaWidget 
            containerId="taboola-below-article-thumbnails" 
            mode="thumbnails-a"
            placement="Below Article Thumbnails"
          />
        </div>
      </section>

      <section className="border-y border-border bg-muted/20 py-8">
        <div className="content-shell">
          <VdoAiAd />
        </div>
      </section>

      {/* ===== Full-Width Taboola / MGID Ad ===== */}
      <section className="border-y border-border bg-muted/20 py-8">
        <div className="content-shell">
          {/* 
            Replace this div with your Taboola / MGID widget script.
            Example:
            <div id="taboola-below-article-thumbnails" />
            or
            <div id="M885913ScriptRootC1234567" />
          */}
          <div className="webAds topads advertiseTxt" data-position="below-article">
            <div className="advertise">
              <span className="advertise-placeholder">
                Taboola / MGID Widget — Below Article
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Related News Grid (Bottom - kept for SEO) ===== */}
      {a.related?.length ? (
        <section className="content-shell pb-8 pt-10 lg:hidden">
          <SectionTitle>संबंधित खबरें</SectionTitle>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.related.slice(0, 4).map((n) => (
              <NewsCard key={n.id} item={n} compact />
            ))}
          </div>
        </section>
      ) : null}

      <Newsletter />
    </>
  );
}

/* ===== Sidebar related news item ===== */
function RelatedItem({ item }: { item: any }) {
  return (
    <Link
      to="/article/$slug"
      params={{ slug: item.slug }}
      className="group flex gap-3"
    >
      {item.featured_image ? (
        <div className="shrink-0 overflow-hidden rounded-md">
          <img
            src={item.featured_image}
            alt={item.image_alt || item.title}
            className="h-16 w-20 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-2 font-display text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {item.title}
        </h4>
        <p className="mt-1 font-sans text-[0.68rem] text-muted-foreground">
          {formatDate(item.published_at)}
        </p>
      </div>
    </Link>
  );
}