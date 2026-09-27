import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rss")({
  head: () => ({
    meta: [
      { title: "RSS फ़ीड — अपनीबात" },
      { name: "description", content: "अपनीबात की RSS फ़ीड सब्सक्राइब करें।" },
    ],
  }),
  component: RssPage,
});

function RssPage() {
  return (
    <article className="content-shell max-w-3xl py-12 sm:py-16">
      <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">
        फ़ीड
      </p>
      <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
        RSS फ़ीड
      </h1>
      <div className="article-body mt-8">
        <p>अपनीबात की फ़ीड को अपने पसंदीदा RSS रीडर में सब्सक्राइब करें।</p>
        <ul>
          <li>
            <strong>मुख्य फ़ीड:</strong>{" "}
            <a href="/rss.xml">/rss.xml</a>
          </li>
          <li>
            <strong>सभी खबरें:</strong>{" "}
            <a href="/feed/news.xml">/feed/news.xml</a>
          </li>
          <li>
            <strong>श्रेणीवार:</strong>{" "}
            <code>/feed/category/&lt;slug&gt;.xml</code>
          </li>
        </ul>
      </div>
    </article>
  );
}