// src/components/article-with-ads.tsx
import { useMemo, type ReactNode } from "react";

type Props = {
  html: string;
  /** Positions (1-indexed paragraph numbers) after which to inject an ad */
  adPositions?: number[];
  /** Render function for each ad slot */
  renderAd: (index: number) => ReactNode;
};

/**
 * Splits article HTML into blocks and injects ad slots after specific paragraphs.
 * Only counts <p> tags (not headings, images, lists, etc.) when deciding position.
 */
export function ArticleWithAds({
  html,
  adPositions = [3, 6, 10],
  renderAd,
}: Props) {
  const blocks = useMemo(() => splitHtmlIntoBlocks(sanitizeHtml(html)), [html]);

  // Determine which block indices should be followed by an ad
  const adAfterBlockIndex = useMemo(() => {
    const map = new Map<number, number>(); // blockIndex -> adIndex
    let pCount = 0;
    let adIndex = 0;

    blocks.forEach((block, i) => {
      if (block.type === "paragraph") {
        pCount++;
        if (adPositions.includes(pCount) && i < blocks.length - 1) {
          map.set(i, adIndex);
          adIndex++;
        }
      }
    });

    return map;
  }, [blocks, adPositions]);

  return (
    <div className="article-body mt-9">
      {blocks.map((block, i) => (
        <div key={i} className="article-block">
          {/*
            For tweet blockquotes we want the class "twitter-tweet" preserved.
            For everything else, dangerouslySetInnerHTML is fine.
            Either way, X's widgets.js will scan and replace this node
            in-place with a <twitter-widget> iframe.
          */}
          <div dangerouslySetInnerHTML={{ __html: block.html }} />
          {adAfterBlockIndex.has(i) ? (
            <div className="article-inline-ad my-8">
              {renderAd(adAfterBlockIndex.get(i)!)}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/**
 * Cleans up publisher HTML before splitting:
 * - Strips <script> tags (they never execute via innerHTML, only cause warnings)
 * - Strips X/Twitter widget loader script remnants
 * - Normalizes whitespace-only text nodes so they don't become empty blocks
 */
function sanitizeHtml(html: string): string {
  if (!html) return "";

  let cleaned = html;

  // 1. Remove ALL <script>...</script> tags entirely
  cleaned = cleaned.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // 2. Remove any orphan widget loaders (platform.twitter.com, platform.x.com)
  cleaned = cleaned.replace(
    /<script[^>]*platform\.(?:x|twitter)\.com[^>]*>\s*<\/script>/gi,
    ""
  );

  // 3. Remove self-closing / async script shims
  cleaned = cleaned.replace(
    /<script\b[^>]*\/?>(?:<\/script>)?/gi,
    ""
  );

  // 4. Trim whitespace between block-level tags so we don't get empty text nodes
  cleaned = cleaned.replace(/>\s+</g, "><").trim();

  return cleaned;
}

/**
 * Splits a single HTML string into blocks.
 * Each block is a top-level element (paragraph, heading, image, list, blockquote, etc.).
 *
 * Blockquote handling:
 *   - We keep the raw outerHTML for blockquotes (including class="twitter-tweet")
 *   - This preserves whatever attributes the editor saved, which X's widgets.js needs
 */
function splitHtmlIntoBlocks(
  html: string
): Array<{ type: string; html: string }> {
  if (!html) return [];

  // Client side: use DOMParser for safe parsing
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const body = doc.body;
    const blocks: Array<{ type: string; html: string }> = [];

    body.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const tag = el.tagName.toLowerCase();
        let type = "other";

        if (tag === "p") type = "paragraph";
        else if (/^h[1-6]$/.test(tag)) type = "heading";
        else if (tag === "figure") type = "figure";
        else if (tag === "img") type = "image";
        else if (tag === "ul" || tag === "ol") type = "list";
        else if (tag === "blockquote") type = "quote";
        else if (tag === "div") type = "div";
        else if (tag === "pre" || tag === "code") type = "code";
        else if (tag === "table") type = "table";
        else if (tag === "iframe") type = "iframe";
        else if (tag === "video") type = "video";
        else if (tag === "audio") type = "audio";

        // ============================================================
        // BLOCKQUOTE HANDLING — preserve tweets
        // ============================================================
        if (tag === "blockquote") {
          // Check if this blockquote contains a tweet status link.
          // If yes, force class="twitter-tweet" so X's widgets.js
          // will transform it into an embedded tweet.
          const hasStatusLink =
            el.querySelector('a[href*="/status/"]') !== null;

          if (hasStatusLink) {
            // Ensure the class is present
            el.setAttribute("class", "twitter-tweet");
            // Ensure any x.com/twitter.com links use the canonical domain
            el.querySelectorAll<HTMLAnchorElement>(
              'a[href*="twitter.com/"], a[href*="x.com/"]'
            ).forEach((a) => {
              const href = a.getAttribute("href") || "";
              if (href.includes("twitter.com/")) {
                a.setAttribute("href", href.replace("twitter.com/", "x.com/"));
              }
            });

            blocks.push({ type: "tweet", html: el.outerHTML });
            return;
          }

          blocks.push({ type: "quote", html: el.outerHTML });
          return;
        }

        blocks.push({ type, html: el.outerHTML });
      } else if (
        node.nodeType === Node.TEXT_NODE &&
        node.textContent &&
        node.textContent.trim()
      ) {
        blocks.push({
          type: "paragraph",
          html: `<p>${escapeHtml(node.textContent.trim())}</p>`,
        });
      }
    });

    return blocks;
  }

  // SSR fallback — regex based
  const parts = html.match(
    /<(?:p|h[1-6]|figure|ul|ol|blockquote|div|pre|table|iframe|video|audio)[^>]*>[\s\S]*?<\/(?:p|h[1-6]|figure|ul|ol|blockquote|div|pre|table|iframe|video|audio)>|<img[^>]*\/?>/gi
  );

  if (!parts || parts.length === 0) {
    return [{ type: "paragraph", html: `<p>${html}</p>` }];
  }

  return parts.map((part) => {
    const tagMatch = part.match(/^<(\w+)/);
    const tag = tagMatch ? tagMatch[1].toLowerCase() : "other";
    let type = "other";

    if (tag === "p") type = "paragraph";
    else if (/^h[1-6]$/.test(tag)) type = "heading";
    else if (tag === "figure") type = "figure";
    else if (tag === "img") type = "image";
    else if (tag === "ul" || tag === "ol") type = "list";
    else if (tag === "div") type = "div";
    else if (tag === "pre") type = "code";
    else if (tag === "table") type = "table";
    else if (tag === "iframe") type = "iframe";
    else if (tag === "video") type = "video";
    else if (tag === "audio") type = "audio";

    if (tag === "blockquote") {
      // SSR: check for status link in the raw HTML
      const hasStatusLink = /\/status\/\d+/.test(part);
      if (hasStatusLink && !/class=/i.test(part)) {
        // Inject the class attribute
        part = part.replace(/<blockquote/i, '<blockquote class="twitter-tweet"');
      }
      type = hasStatusLink ? "tweet" : "quote";
    }

    return { type, html: part };
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}