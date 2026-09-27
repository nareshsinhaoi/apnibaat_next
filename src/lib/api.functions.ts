import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BASE = "https://apnibaat.modulelabs.in/api";

// Fetched on the server because the backend doesn't allow direct browser calls (CORS).
export const fetchApi = createServerFn({ method: "GET" })
  .validator((d) =>
    z
      .object({
        path: z.string().regex(/^\/(bylines|categories|settings|search|sitemap|news|news\/[A-Za-z0-9-]+)$/),
        params: z.record(z.string(), z.string().max(200)).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const qs = data.params ? `?${new URLSearchParams(data.params)}` : "";
    const res = await fetch(`${BASE}${data.path}${qs}`, { headers: { Accept: "application/json" } });
    if (res.status === 404) return JSON.stringify({ data: null, meta: null });
    if (!res.ok) throw new Error(`API ${data.path} failed: ${res.status}`);
    const json = (await res.json()) as { success: boolean; data: unknown; meta?: unknown };
    if (!json.success) return JSON.stringify({ data: null, meta: null });
    return JSON.stringify({ data: json.data, meta: json.meta ?? null });
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((d) => z.object({ email: z.string().trim().email().max(255) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const res = await fetch(`${BASE}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      return { ok: !!json.success, message: json.message ?? "" };
    } catch (e) {
      console.error(e);
      return { ok: false, message: "" };
    }
  });
