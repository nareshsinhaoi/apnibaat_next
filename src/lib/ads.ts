// src/lib/ads.ts

export type AdSlot = {
  desktop_image?: string;
  desktop_link?: string;
  mobile_image?: string;
  mobile_link?: string;
  alt?: string;
  link?: string;
};

/**
 * Header / leaderboard ad slot — shown at the top of pages.
 * Edit this file to update the ad across the entire site.
 */
export const headerAd: AdSlot = {
  desktop_image: "https://ik.imagekit.io/isaaopk8o/mycrm/advertisement/750x200.png",
  desktop_link: "https://hrms.modulelabs.in/",
  mobile_image: "https://ik.imagekit.io/isaaopk8o/mycrm/advertisement/300x100.png",
  mobile_link: "https://hrms.modulelabs.in/",
  alt: "Special Offer — 6 months free",
};

/**
 * (Optional) Add more slots as your site grows.
 * Reference them by key on any page.
 */
export const adSlots: Record<string, AdSlot> = {
  header: headerAd,
  // sidebar: { ... },
  // inline:  { ... },
  // footer:  { ... },
};