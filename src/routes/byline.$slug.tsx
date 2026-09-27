import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataWaiting, NewsGrid } from "@/components/newsroom";
import { bylinesQuery } from "@/lib/api";

export const Route = createFileRoute("/byline/$slug")({
  head: () => ({ meta: [
    { title: "लेखक परिचय — अपनीबात" }, { name: "description", content: "अपनीबात के लेखक की प्रोफ़ाइल और प्रकाशित खबरें।" },
    { property: "og:title", content: "लेखक परिचय — अपनीबात" }, { property: "og:description", content: "लेखक की प्रोफ़ाइल और सभी लेख।" },
    { property: "og:type", content: "profile" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: BylinePage,
});

function BylinePage() {
  const { slug } = Route.useParams();
  const { data, isLoading, isError } = useQuery(bylinesQuery());
  const b = data?.find((x) => x.slug === slug);
  if (!isLoading && (isError || !b)) return <DataWaiting kind="लेखक" />;
  const socials = b ? ([["X", b.social_twitter], ["Facebook", b.social_facebook], ["LinkedIn", b.social_linkedin], ["Instagram", b.social_instagram], ["वेबसाइट", b.website]] as const).filter(([, u]) => u) : [];

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="content-shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:py-12">
          {b?.avatar ? <img src={b.avatar} alt={b.name} className="size-24 rounded-full object-cover" /> : <div className="grid size-24 place-items-center rounded-full bg-muted font-editorial text-3xl font-bold text-primary">{b?.name.charAt(0)}</div>}
          <div className="min-w-0">
            <p className="font-sans text-xs font-bold uppercase text-breaking">{b?.position || "लेखक"}</p>
            {b ? <h1 className="mt-2 font-editorial text-3xl font-bold sm:text-4xl">{b.name}</h1> : <div className="mt-2 h-9 w-56 animate-pulse rounded-sm bg-muted" />}
            {b?.bio ? <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{b.bio}</p> : null}
            {b ? <p className="mt-2 font-sans text-xs font-bold uppercase text-primary">{b.total_posts} लेख</p> : null}
            {socials.length ? <div className="mt-3 flex flex-wrap gap-3">{socials.map(([l, u]) => <a key={l} href={u!} target="_blank" rel="noopener noreferrer" className="font-sans text-xs font-bold text-primary hover:underline">{l}</a>)}</div> : null}
          </div>
        </div>
      </div>
      <NewsGrid title="लेखक के लेख" filters={{ byline: slug, per_page: 12 }} />
    </>
  );
}
