import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { NewsGrid } from "@/components/newsroom";
import { newsQuery } from "@/lib/api";

export const Route = createFileRoute("/subcategory/$slug")({
  head: ({ params }) => ({ meta: [
    { title: `${params.slug} — अपनीबात उपश्रेणी` }, { name: "description", content: "अपनीबात पर विषय आधारित हिंदी समाचार।" },
    { property: "og:title", content: `${params.slug} — अपनीबात` }, { property: "og:description", content: "विषय आधारित हिंदी समाचार और विश्लेषण।" },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: SubcategoryPage,
});

function SubcategoryPage() {
  const { slug } = Route.useParams();
  const { data } = useQuery(newsQuery({ subcategory: slug, per_page: 12 }));
  const name = data?.items[0]?.subcategory?.name || slug;
  return <><div className="border-b border-border bg-card"><div className="content-shell py-10 sm:py-12"><p className="font-sans text-xs font-bold uppercase text-breaking">उपश्रेणी{data?.items[0]?.category?.name ? ` · ${data.items[0].category.name}` : ""}</p><h1 className="mt-3 font-editorial text-3xl font-bold capitalize sm:text-5xl">{name}</h1></div></div><NewsGrid title="संबंधित खबरें" filters={{ subcategory: slug, per_page: 12 }} /></>;
}
