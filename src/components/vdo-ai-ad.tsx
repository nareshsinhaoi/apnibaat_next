// src/components/vdo-ai-ad.tsx
import { useEffect } from "react";

const VDO_AI_SCRIPT_TYPE = "loadOnUserAction";
const VDO_AI_SCRIPT_SRC = "//a.vdo.ai/core/v-ndtv/vdo.ai.js";
const CONTAINER_ID = "v-ndtv";

export function VdoAiAd() {
//   useEffect(() => {
//     // Guard against double-injection (React strict mode, route changes)
//     const existing = document.querySelector(
//       `script[data-vdo-ai="true"]`
//     ) as HTMLScriptElement | null;
//     if (existing) return;

//     const script = document.createElement("script");
//     script.type = VDO_AI_SCRIPT_TYPE; // keeps the custom type vdo.ai expects
//     script.defer = true;
//     script.async = true;
//     script.src = `${window.location.protocol}${VDO_AI_SCRIPT_SRC}`;
//     script.setAttribute("data-vdo-ai", "true");

//     document.head.appendChild(script);

//     return () => {
//       // Optional cleanup — remove on unmount to avoid stale state on route change
//       const s = document.querySelector(
//         `script[data-vdo-ai="true"]`
//       ) as HTMLScriptElement | null;
//       if (s && s.parentNode) s.parentNode.removeChild(s);
//     };
//   }, []);

useEffect(() => {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) return;

  let loaded = false;

  const inject = () => {
    if (loaded) return;
    loaded = true;

    const script = document.createElement("script");
    script.type = VDO_AI_SCRIPT_TYPE;
    script.defer = true;
    script.async = true;
    script.src = `${window.location.protocol}${VDO_AI_SCRIPT_SRC}`;
    script.setAttribute("data-vdo-ai", "true");
    document.head.appendChild(script);

    observer.disconnect();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) inject();
      });
    },
    { rootMargin: "300px" } // start loading 300px before it's visible
  );

  observer.observe(container);

  return () => observer.disconnect();
}, []);

  return <div id={CONTAINER_ID} />;
}