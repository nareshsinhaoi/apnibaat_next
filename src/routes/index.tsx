import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BreakingStrip, LeadStories, NewsGrid } from "@/components/newsroom";
import { Newsletter } from "@/components/site-chrome";
import { categoriesQuery } from "@/lib/api";
import { DisplayAd } from "@/components/google-ads";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "अपनीबात — ताज़ा हिंदी समाचार और विश्लेषण" },
      { name: "description", content: "देश, दुनिया, राजनीति, व्यापार, विज्ञान, टेक्नोलॉजी और विचार की ताज़ा हिंदी खबरें — अपनीबात पर।" },
      { property: "og:title", content: "अपनीबात — ताज़ा हिंदी समाचार" },
      { property: "og:description", content: "स्वतंत्र हिंदी समाचार और गहन विश्लेषण।" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://apnibaat.com/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: cats } = useQuery(categoriesQuery());
  const top = (cats ?? []).filter((c) => c.parent_id === "0");

  return (
    <>
      <BreakingStrip />
      <LeadStories />

      {/* Category chips */}
      <div className="content-shell flex gap-2 overflow-x-auto py-6 [scrollbar-width:none] sm:flex-wrap">
        <Link
          to="/news"
          className="shrink-0 rounded-full bg-primary px-4 py-2 font-sans text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          सभी खबरें
        </Link>
        {top.map((c) => (
          <Link
            key={c.id}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="shrink-0 rounded-full border border-border bg-card px-4 py-2 font-sans text-xs font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <NewsGrid title="नवीनतम समाचार" filters={{ per_page: 8 }} />

      {/* Ad slot between sections */}
      <div className="content-shell">
        <DisplayAd size="billboard" />
      </div>

      <div className="border-y border-border bg-muted/40">
        <NewsGrid title="ट्रेंडिंग" filters={{ trending: true, per_page: 4 }} />
      </div>

      <Newsletter />

      <NewsGrid title="संपादक की पसंद" filters={{ featured: true, per_page: 4 }} />
    </>
  );
}