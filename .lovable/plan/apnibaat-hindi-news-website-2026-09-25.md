# ApniBaat Hindi News Website

## Scope
- Build a responsive Hindi-first news homepage inspired by the supplied reference, without copying the screenshot or using its pictured stories.
- Add shared header navigation, light/dark mode switch, breaking-news strip, newsletter form, and footer.
- Add category, subcategory, news listing, article detail, and byline profile pages.
- Keep all content areas in a deliberate API-ready empty/loading state until the real backend details are supplied; no sample stories or third-party live data.

## Visual direction
- Editorial newsroom layout with white/gray surfaces, black typography, deep blue branding, and red breaking-news/action accents.
- Use Syne for interface and display labels, Libre Baskerville for Hindi editorial headlines/body, and DM Sans for utility text.
- Preserve dense, scannable cards and section rhythm from the reference while making mobile navigation and dark mode first-class.

## Behavior
- Persist the selected color theme in the browser and respect the device preference initially.
- Validate newsletter email input in the browser; clearly report that connection is pending until the subscription endpoint is provided.
- Provide navigation across all requested page types with API-ready URL parameters.

## Technical details
- Implement with the project’s TanStack Start stack, the supported equivalent to the requested Next.js architecture in this workspace.
- Use reusable typed content models and shared presentation components so backend responses can be mapped cleanly once endpoint documentation arrives.
- Add unique page metadata for every content route and verify desktop and mobile rendering.
