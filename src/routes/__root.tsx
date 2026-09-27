import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteFooter, SiteHeader, ScrollToTop } from "../components/site-chrome";
import { AnchorAd, InterstitialAd } from "@/components/google-ads";

const SITE_URL = "https://apnibaat.com";
const Ad_SITE_URL = "https://www.maryadainvestment.in";
const GPT_ACCOUNT = "/23135356965"; // replace with your network/unit path

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-extrabold text-primary">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
          पृष्ठ नहीं मिला
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          आप जिस पृष्ठ को खोज रहे हैं वह मौजूद नहीं है या स्थानांतरित हो गया है।
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            मुखपृष्ठ पर जाएँ
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          यह पृष्ठ लोड नहीं हो सका
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          कुछ तकनीकी समस्या आ गई है। कृपया पुनः प्रयास करें।
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            पुनः प्रयास करें
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            मुखपृष्ठ पर जाएँ
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "अपनीबात — हिंदी समाचार और विश्लेषण" },
      {
        name: "description",
        content:
          "स्वतंत्र हिंदी समाचार, विचार और गहन विश्लेषण — देश, दुनिया, राजनीति, व्यापार, विज्ञान और टेक्नोलॉजी।",
      },
      { name: "author", content: "अपनीबात" },
      { name: "theme-color", content: "#b91c1c" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: "अपनीबात" },
      { property: "og:locale", content: "hi_IN" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "अपनीबात — हिंदी समाचार और विश्लेषण" },
      { property: "og:description", content: "स्वतंत्र हिंदी समाचार और गहन विश्लेषण।" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@apnibaat" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "canonical", href: SITE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://securepubads.g.doubleclick.net" },
      { rel: "preconnect", href: "https://pagead2.googlesyndication.com" },
      { rel: "dns-prefetch", href: "https://tpc.googlesyndication.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      // 0. Taboola Loader Script (ADD THIS)
      {
        children: `
          window._taboola = window._taboola || [];
          _taboola.push({ article: 'auto' });
          !function (e, f, u, i) {
            if (!document.getElementById(i)) {
              e.async = 1; e.src = u; e.id = i;
              f.parentNode.insertBefore(e, f);
            }
          }(document.createElement('script'),
            document.getElementsByTagName('script')[0],
            '//cdn.taboola.com/libtrc/jagrannewmedia-jagran/loader.js',
            'tb_loader_script');
          if (window.performance && typeof window.performance.mark == 'function') {
            window.performance.mark('tbl_ic');
          }
        `,
      },
      // 1. GPT loader — must come before the config script
      {
        src: "https://securepubads.g.doubleclick.net/tag/js/gpt.js",
        async: true,
      },
      // 2. GPT slot configuration
      {
        children: `
          window.googletag = window.googletag || {cmd: []};
          window.__apnibaatAds = { displaySlot: null, anchorSlot: null, interstitialSlot: null };
          googletag.cmd.push(function() {
            var g = googletag;
            var ads = window.__apnibaatAds;

            ads.displaySlot = g.defineSlot(
              '${GPT_ACCOUNT}/display',
              [[320, 480], [750, 300], [300, 100], [750, 200], [970, 250]],
              'div-gpt-ad-display'
            ).addService(g.pubads());

            // Anchor + Interstitial are disabled for now — uncomment when ready.
            // ads.anchorSlot = g.defineSlot(
            //   '${GPT_ACCOUNT}/Anchor',
            //   [[300, 600], [300, 100], [300, 250]],
            //   'div-gpt-ad-anchor'
            // ).addService(g.pubads());

            // ads.interstitialSlot = g.defineOutOfPageSlot(
            //   '${GPT_ACCOUNT}/interstitial',
            //   g.enums.OutOfPageFormat.INTERSTITIAL
            // ).addService(g.pubads());

            g.pubads().set("page_url", "${Ad_SITE_URL}");
            g.pubads().enableSingleRequest();
            g.pubads().collapseEmptyDivs();
            g.enableServices();
          });
        `,
      },
      // 3. Organization structured data
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          name: "अपनीबात",
          url: SITE_URL,
          description: "स्वतंत्र हिंदी समाचार और गहन विश्लेषण।",
          inLanguage: "hi-IN",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="hi">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <ScrollToTop />
        <AnchorAd />
        {/* <InterstitialAd /> */}
      </div>
    </QueryClientProvider>
  );
}