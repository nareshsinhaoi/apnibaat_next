import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataWaiting, NewsCard, SectionTitle } from "@/components/newsroom";
import { Newsletter } from "@/components/site-chrome";
import { formatDate, newsDetailQuery } from "@/lib/api";
import { DisplayAd } from "@/components/google-ads";

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
      <article className="content-shell max-w-3xl py-10 sm:py-14">
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

        <h1 className="mt-5 font-display text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
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

        {/* Content is authored by the publisher in their own admin panel. */}
        <div className="article-body mt-9" dangerouslySetInnerHTML={{ __html: a.content }} />

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

      <div className="content-shell max-w-3xl">
        <DisplayAd size="leaderboard" />
      </div>

      {a.related?.length ? (
        <section className="content-shell pb-8">
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