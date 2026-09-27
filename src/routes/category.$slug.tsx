import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DataWaiting, NewsGrid } from "@/components/newsroom";
import { categoriesQuery } from "@/lib/api";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const name = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
    return {
      meta: [
        { title: `${name} समाचार — अपनीबात` },
        { name: "description", content: `${name} से जुड़ी ताज़ा हिंदी खबरें, विश्लेषण और रिपोर्ट — अपनीबात पर।` },
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
  const { data, isLoading, isError } = useQuery(categoriesQuery());
  const category = data?.find((c) => c.slug === slug);
  const subs = category ? data!.filter((c) => c.parent_id === category.id) : [];

  if (!isLoading && (isError || !category)) return <DataWaiting kind="श्रेणी" />;

  return (
    <>
      <div className="border-b border-border bg-muted/30">
        <div className="content-shell py-10 sm:py-14">
          <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">
            श्रेणी
          </p>
          {category ? (
            <>
              <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {category.name}
              </h1>
              {category.description ? (
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                  {category.description}
                </p>
              ) : null}
              <p className="mt-4 font-sans text-xs font-bold uppercase tracking-wide text-primary">
                {category.news_count} खबरें
              </p>
              {subs.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {subs.map((s) => (
                    <Link
                      key={s.id}
                      to="/subcategory/$slug"
                      params={{ slug: s.slug }}
                      className="rounded-full border border-border bg-card px-4 py-2 font-sans text-xs font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-4 h-10 w-60 animate-pulse rounded-sm bg-muted" />
          )}
        </div>
      </div>
      <NewsGrid title="इस श्रेणी की खबरें" filters={{ category: slug, per_page: 12 }} />
    </>
  );
}