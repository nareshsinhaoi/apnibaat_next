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
  const blocks = useMemo(() => splitHtmlIntoBlocks(html), [html]);

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
        <div key={i}>
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
 * Splits a single HTML string into blocks.
 * Each block is a top-level element (paragraph, heading, image, list, etc.).
 */
function splitHtmlIntoBlocks(html: string): Array<{ type: string; html: string }> {
  if (!html) return [];

  // If running in the browser, use DOMParser for safe parsing.
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

        blocks.push({ type, html: el.outerHTML });
      } else if (
        node.nodeType === Node.TEXT_NODE &&
        node.textContent &&
        node.textContent.trim()
      ) {
        // Wrap stray text in a paragraph
        blocks.push({
          type: "paragraph",
          html: `<p>${escapeHtml(node.textContent)}</p>`,
        });
      }
    });

    return blocks;
  }

  // SSR fallback — simple regex split (safe for well-formed HTML from publisher)
  const parts = html.match(/<(?:p|h[1-6]|figure|ul|ol|blockquote|img)[^>]*>[\s\S]*?<\/(?:p|h[1-6]|figure|ul|ol|blockquote)>|<img[^>]*\/?>/gi);
  if (!parts) return [{ type: "paragraph", html: `<p>${html}</p>` }];

  return parts.map((part) => {
    const tagMatch = part.match(/^<(\w+)/);
    const tag = tagMatch ? tagMatch[1].toLowerCase() : "other";
    let type = "other";
    if (tag === "p") type = "paragraph";
    else if (/^h[1-6]$/.test(tag)) type = "heading";
    else if (tag === "figure") type = "figure";
    else if (tag === "img") type = "image";
    else if (tag === "ul" || tag === "ol") type = "list";
    else if (tag === "blockquote") type = "quote";
    return { type, html: part };
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}