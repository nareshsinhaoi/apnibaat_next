import { createFileRoute } from "@tanstack/react-router";
import { API_BASE_URL, API_PATHS } from "@/lib/api";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // 1. Fetch the JSON from your PHP API
          const res = await fetch(`${API_BASE_URL}${API_PATHS.sitemap}`);
          if (!res.ok) throw new Error("Failed to fetch sitemap data");
          
          const json = await res.json();
          const urls = json.data || [];

          // 2. Build the XML string
          let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
          xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

          // Add Homepage
          xml += '  <url>\n';
          xml += '    <loc>https://apnibaat-sze0.onrender.com/</loc>\n';
          xml += '    <changefreq>daily</changefreq>\n';
          xml += '    <priority>1.0</priority>\n';
          xml += '  </url>\n';

          // Add Articles
          for (const item of urls) {
            // Convert published_at to ISO 8601 format (W3C Datetime)
            const date = new Date(item.published_at);
            const lastmod = isNaN(date.getTime()) ? '' : `\n    <lastmod>${date.toISOString()}</lastmod>`;
            
            // Format the URL using the production domain
            const loc = `https://apnibaat-sze0.onrender.com/article/${item.slug}`;

            xml += '  <url>\n';
            xml += `    <loc>${loc}</loc>${lastmod}\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.8</priority>\n';
            xml += '  </url>\n';
          }

          xml += '</urlset>';

          // 3. Return the XML response
          return new Response(xml, {
            status: 200,
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600, s-maxage=86400",
            },
          });
        } catch (error) {
          console.error("Sitemap error:", error);
          return new Response("Error generating sitemap", { status: 500 });
        }
      },
    },
  },
});