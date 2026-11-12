import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { DataWaiting, NewsCard, SectionTitle } from "@/components/newsroom";
import { Newsletter } from "@/components/site-chrome";
import { formatDate, newsDetailQuery } from "@/lib/api";
import { DisplayAd } from "@/components/google-ads";
import { AdBanner } from "@/components/ad-banner";
import { headerAd } from "@/lib/ads";
import { TaboolaWidget } from "@/components/taboola-widget";
import { VdoAiAd } from "@/components/vdo-ai-ad";
import { ArticleWithAds } from "@/components/article-with-ads";
import { StoryNav } from "@/components/story-nav";

const SITE_URL = "https://apnibaat.com";
const TTS_SCRIPT_URL = "https://vanee-v2.wasmer.app/static/js/embed.js";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (root?: HTMLElement) => void;
        createTweet?: (
          id: string,
          el: HTMLElement,
          opts?: Record<string, unknown>
        ) => Promise<HTMLElement | undefined>;
      };
    };
    VaniTTS?: {
      mount: (selector: string, config: Record<string, any>) => void;
    };
  }
}

export const Route = createFileRoute("/article/$slug")({
  loader: ({ context, params }) =>
    context.queryClient
      .ensureQueryData(newsDetailQuery(params.slug))
      .catch(() => null),
  head: ({ loaderData: a, params }) => {
    const title = a
      ? `${a.meta_title || a.title} — अपनीबात`
      : "समाचार विवरण — अपनीबात";
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
        ...(a?.meta_keywords
          ? [{ name: "keywords", content: a.meta_keywords }]
          : []),
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
  const articleContentRef = useRef<HTMLDivElement>(null);

  /**
   * Twitter / X embed loader — bulletproof version.
   *
   * Why this is structured the way it is:
   * 1. `requestAnimationFrame` ensures `ArticleWithAds` has committed its
   *    `dangerouslySetInnerHTML` content before we scan for blockquotes.
   * 2. We never call `twttr.widgets.load()` until `window.twttr.widgets.load`
   *    actually exists (prevents "Cannot read properties of undefined").
   * 3. The script loader uses `platform.twitter.com/widgets.js` — the
   *    `platform.x.com/widgets.js` URL from the raw embed snippet is a
   *    CDN alias that X itself redirects; the canonical loader handles
   *    both `twitter.com` and `x.com` URLs.
   * 4. We strip any stray `<script>` tags from the stored content
   *    (editors sometimes save them), because injecting them via
   *    `innerHTML` never executes them anyway and they show up as text.
   */
  useEffect(() => {
    const container = articleContentRef.current;
    if (!container) return;

    let cancelled = false;

    const renderTweets = async () => {
      // Wait one frame so ArticleWithAds has committed
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      if (cancelled) return;

      const tweets = container.querySelectorAll("blockquote.twitter-tweet");
      if (tweets.length === 0) {
        if (import.meta.env.DEV) {
          console.log("[Twitter] no tweets to render");
        }
        return;
      }

      if (import.meta.env.DEV) {
        console.log(`[Twitter] rendering ${tweets.length} tweet(s)`);
      }

      // Load the widget script once
      const ensureTwttr = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (window.twttr?.widgets?.load) return resolve();

          const existing = document.getElementById(
            "twitter-widgets-script"
          ) as HTMLScriptElement | null;

          if (existing) {
            let tries = 0;
            const interval = window.setInterval(() => {
              if (cancelled) return window.clearInterval(interval);
              if (window.twttr?.widgets?.load) {
                window.clearInterval(interval);
                resolve();
              } else if (++tries > 100) {
                window.clearInterval(interval);
                reject(new Error("timeout"));
              }
            }, 100);
            return;
          }

          const script = document.createElement("script");
          script.id = "twitter-widgets-script";
          script.src = "https://platform.twitter.com/widgets.js";
          script.async = true;
          script.charset = "utf-8";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("script failed"));
          document.head.appendChild(script);
        });
      };

      try {
        await ensureTwttr();
      } catch (err) {
        console.error("[Twitter] failed to load widget script:", err);
        return;
      }

      if (cancelled) return;

      try {
        window.twttr!.widgets!.load(container);
      } catch (err) {
        console.error("[Twitter] widgets.load threw:", err);
      }
    };

    renderTweets();

    return () => {
      cancelled = true;
    };
  }, [a?.content]);

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
      <AdBanner ad={headerAd} position="header" />

      <div className="content-shell grid grid-cols-1 gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
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

          {/* VaniTTS Audio Player — reads the article aloud */}
          
          {/* <div className="my-8">
            <VaniTtsPlayer htmlContent={a.content} />
          </div> */}

          <div ref={articleContentRef}>
            <ArticleWithAds
              html={a.content}
              adPositions={[3, 6, 10]}
              renderAd={(index) => (
                <AdBanner ad={headerAd} position={`inline-${index}`} />
              )}
            />
          </div>

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

          <div className="mt-10">
            <StoryNav slug={slug} />
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-8">
            <DisplayAd size="rectangle" />
          </div>

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

          <div className="mt-8">
            <DisplayAd size="rectangle" />
          </div>
        </aside>
      </div>

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

      <section className="border-y border-border bg-muted/20 py-8">
        <div className="content-shell">
          <div
            className="webAds topads advertiseTxt"
            data-position="below-article"
          >
            <div className="advertise">
              <span className="advertise-placeholder">
                Taboola / MGID Widget — Below Article
              </span>
            </div>
          </div>
        </div>
      </section>

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

/* ===== VaniTTS Player Component ===== */
function VaniTtsPlayer({ htmlContent }: { htmlContent: string }) {
  const hasMounted = useRef(false);

  useEffect(() => {
    // 1. Strip HTML to get plain text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    //let plainText = tempDiv.textContent || tempDiv.innerText || "";
    let plainText = "हम सनसनीखेज़ हेडलाइनों और बिना पुष्टि की खबरों से दूर रहते हैं। प्रकाशन से पहले हर बड़ी रिपोर्ट कम-से-कम दो स्वतंत्र स्रोतों से सत्यापित की जाती है, और जहाँ सरकारी आँकड़े शामिल होते हैं, वहाँ मूल दस्तावेज़ को लेख के साथ लिंक किया जाता है ताकि पाठक स्वयं जाँच सकें। भूल होने पर हम सुधार को स्पष्ट रूप से चिह्नित करते हैं, छिपाते नहीं।";

    // 2. Normalize the text for the TTS engine
    plainText = plainText
      .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width chars
      .replace(/\u00a0/g, " ") // non-breaking space
      .replace(/।/g, ".") // Hindi danda → period
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Bail out if the article has no readable text
    if (!plainText) return;

    const initTts = () => {
      const container = document.getElementById("vanitts-player");
      if (window.VaniTTS && !hasMounted.current && container) {
        // Clear stale player markup (React StrictMode safety)
        container.innerHTML = "";

        window.VaniTTS.mount("#vanitts-player", {
          client: "290001910",
          lang: "hi-IN",
          text: plainText,
          voice: "hi-IN-SwaraNeural",
        });
        hasMounted.current = true;
      }
    };

    // 3. Load the script if not already loaded
    if (!document.getElementById("vanitts-script")) {
      const script = document.createElement("script");
      script.id = "vanitts-script";
      script.src = TTS_SCRIPT_URL;
      script.async = true;
      script.onload = initTts;
      script.onerror = () => {
        console.error("[VaniTTS] failed to load embed script");
      };
      document.body.appendChild(script);
    } else if (window.VaniTTS) {
      initTts();
    } else {
      // Script tag exists but VaniTTS not ready — poll briefly
      let tries = 0;
      const interval = window.setInterval(() => {
        if (window.VaniTTS) {
          window.clearInterval(interval);
          initTts();
        } else if (++tries > 50) {
          window.clearInterval(interval);
          console.error("[VaniTTS] script loaded but VaniTTS never initialized");
        }
      }, 100);
      return () => window.clearInterval(interval);
    }

    return () => {
      hasMounted.current = false;
    };
  }, [htmlContent]);

  return (
    <div className="w-full   p-4">
      <div id="vanitts-player" className="min-h-[60px]" />
    </div>
  );
}