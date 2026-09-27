import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Search } from "lucide-react";
import { NewsGrid } from "@/components/newsroom";

export const Route = createFileRoute("/news")({
  validateSearch: z.object({
    page: z.number().int().min(1).optional(),
    q: z.string().max(100).optional(),
  }),
  head: ({ match }) => {
    const q = (match.search as { q?: string })?.q;
    const title = q ? `"${q}" के खोज परिणाम — अपनीबात` : "सभी समाचार — अपनीबात";
    return {
      meta: [
        { title },
        { name: "description", content: "अपनीबात की सभी प्रकाशित हिंदी खबरें एक स्थान पर। ताज़ा और महत्वपूर्ण समाचारों की पूरी सूची।" },
        { property: "og:title", content: title },
        { property: "og:description", content: "ताज़ा और महत्वपूर्ण हिंदी समाचारों की सूची।" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(q ? [{ name: "robots", content: "noindex, follow" }] : []),
      ],
    };
  },
  component: NewsListing,
});

function NewsListing() {
  const { page = 1, q } = Route.useSearch();
  const navigate = useNavigate({ from: "/news" });

  return (
    <>
      <div className="border-b border-border bg-muted/30">
        <div className="content-shell py-10 sm:py-14">
          <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">
            न्यूज़रूम
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {q ? `"${q}" के परिणाम` : "सभी समाचार"}
          </h1>
          <form
            className="mt-6 flex max-w-lg gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const v = String(new FormData(e.currentTarget).get("q") ?? "").trim();
              navigate({ search: v ? { q: v } : {} });
            }}
          >
            <label htmlFor="news-q" className="sr-only">खोजें</label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="news-q"
                name="q"
                defaultValue={q}
                maxLength={100}
                placeholder="खबरें खोजें…"
                className="h-12 w-full rounded-full border border-input bg-background pl-11 pr-4 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              className="h-12 shrink-0 rounded-full bg-primary px-6 font-sans text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              aria-label="खोजें"
            >
              खोजें
            </button>
          </form>
        </div>
      </div>
      <NewsGrid
        title={q ? "खोज परिणाम" : "समाचार सूची"}
        filters={{ page, per_page: 12, ...(q ? { q } : {}) }}
        paginate
        onPage={(p) => {
          navigate({ search: { ...(q ? { q } : {}), page: p } });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </>
  );
}