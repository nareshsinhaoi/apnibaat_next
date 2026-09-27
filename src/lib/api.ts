import { queryOptions } from "@tanstack/react-query";
import { fetchApi } from "./api.functions";

// Single place for all backend API paths.
export const API_BASE_URL = "https://apnibaat.modulelabs.in/api";

export const API_PATHS = {
  bylines: "/bylines",
  categories: "/categories",
  news: "/news",
  newsDetail: (slug: string) => `/news/${slug}`,
  newsletterSubscribe: "/newsletter/subscribe",
  settings: "/settings",
  search: "/search",
  sitemap: "/sitemap",
} as const;

export type Byline = {
  id: string; name: string; slug: string; bio: string | null; avatar: string | null; position: string | null;
  social_twitter: string | null; social_facebook: string | null; social_linkedin: string | null; social_instagram: string | null;
  website: string | null; role: string | null; total_posts: string; status: string; featured: string;
};

export type Category = {
  id: string; name: string; slug: string; description: string | null; parent_id: string;
  featured_image: string | null; status: string; order: string; news_count: string;
};

type Ref = { name: string; slug: string };

export type NewsItem = {
  id: string; title: string; slug: string; excerpt: string | null; featured_image: string | null; image_alt: string | null;
  category: Ref | null; subcategory: Ref | null; byline: Ref | null; published_at: string;
  is_breaking: string; is_featured: string; is_trending: string; read_time: string; views: string;
};

export type NewsDetail = NewsItem & {
  content: string; subtitle: string | null; tags: Ref[]; related: NewsItem[];
  meta_title: string | null; meta_description: string | null; meta_keywords: string | null;
};

export type PageMeta = { current_page: number; last_page: number; total: number; per_page: number };

export type Settings = {
  logo: string | null; site_title: string; tagline: string | null; description: string | null;
  contact_email: string | null; contact_phone: string | null; address: string | null;
};

async function apiGet<T>(path: string, params?: Record<string, string>) {
  return JSON.parse(await fetchApi({ data: { path, params } })) as { data: T | null; meta: PageMeta | null };
}

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: async () =>
      ((await apiGet<Category[]>(API_PATHS.categories)).data ?? [])
        .filter((c) => c.status === "1")
        .sort((a, b) => Number(a.order) - Number(b.order)),
    staleTime: 5 * 60_000,
  });

export const bylinesQuery = () =>
  queryOptions({
    queryKey: ["bylines"],
    queryFn: async () => ((await apiGet<Byline[]>(API_PATHS.bylines)).data ?? []).filter((b) => b.status === "1"),
    staleTime: 5 * 60_000,
  });

export type NewsFilters = {
  page?: number; per_page?: number; category?: string; subcategory?: string; byline?: string;
  breaking?: boolean; featured?: boolean; trending?: boolean; q?: string;
};

export const newsQuery = (f: NewsFilters = {}) =>
  queryOptions({
    queryKey: ["news", f],
    queryFn: async () => {
      const p: Record<string, string> = { page: String(f.page ?? 1), per_page: String(f.per_page ?? 12) };
      for (const k of ["category", "subcategory", "byline", "q"] as const) if (f[k]) p[k] = f[k]!;
      for (const k of ["breaking", "featured", "trending"] as const) if (f[k]) p[k] = "1";
      const r = await apiGet<NewsItem[]>(API_PATHS.news, p);
      return { items: r.data ?? [], meta: r.meta };
    },
    staleTime: 60_000,
  });

export const newsDetailQuery = (slug: string) =>
  queryOptions({
    queryKey: ["news-detail", slug],
    queryFn: async () => (await apiGet<NewsDetail>(API_PATHS.newsDetail(slug))).data,
    staleTime: 60_000,
  });

export const searchQuery = (q: string) =>
  queryOptions({
    queryKey: ["search", q],
    queryFn: async () => (await apiGet<NewsItem[]>(API_PATHS.search, { q })).data ?? [],
    staleTime: 60_000,
  });

export const settingsQuery = () =>
  queryOptions({
    queryKey: ["settings"],
    queryFn: async () => (await apiGet<Settings>(API_PATHS.settings)).data,
    staleTime: 10 * 60_000,
  });

export function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" });
}
