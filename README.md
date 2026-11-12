# अपनीबात — ApniBaat

> **स्वतंत्र हिंदी समाचार, विचार और गहन विश्लेषण** — देश, दुनिया, राजनीति, व्यापार, विज्ञान और टेक्नोलॉजी।

A production-grade, full-stack Hindi news platform. Built with **CodeIgniter 3 (HMVC)** for the admin/API backend and **TanStack Start + React + TypeScript** for the reader-facing frontend. Fully bilingual content support (Hindi + English), SEO-optimized (AMP, RSS, JSON-LD), and monetized with Google Ad Manager, Taboola, MGID and VDO.ai.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Admin Modules](#admin-modules)
- [Frontend Routes](#frontend-routes)
- [Advertising Integration](#advertising-integration)
- [SEO & Performance](#seo--performance)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**ApniBaat** is a modern Hindi news portal with two distinct halves:

| Layer | Role | Stack |
|-------|------|-------|
| **Backend / CMS** | Article authoring, media management, REST API, RSS, AMP | CodeIgniter 3 · HMVC (MX) · MySQL |
| **Frontend** | Reader experience, article views, search, pagination | TanStack Start · React · TypeScript · Tailwind CSS |

The two layers communicate over a JSON API (`/api/*`). Content authors work exclusively in the CodeIgniter admin, while readers interact with the React frontend.

---

## Tech Stack

### Backend
- **Framework:** CodeIgniter 3.1.x with HMVC (MX Modules)
- **Language:** PHP 7.4+ / 8.1+
- **Database:** MySQL 5.7+ / MariaDB 10.3+
- **Authentication:** Two-step login (password + email OTP)
- **Email:** SendinBlue / Brevo via `NexusSendEmail()` helper
- **Images:** ImageKit.io CDN (avatars, featured images)
- **Storage:** Local temp storage + ImageKit for production media

### Frontend
- **Framework:** TanStack Start (SSR + client routing)
- **Router:** TanStack Router (file-based)
- **Data layer:** TanStack Query (React Query)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **Validation:** Zod

### External Services
| Service | Purpose |
|---------|---------|
| Google Ad Manager (GPT) | Display, anchor, interstitial ads |
| Taboola | Below-article recommendation widget |
| MGID | Secondary recommendation widget |
| VDO.ai | In-article video ads |
| Google Analytics 4 | Traffic analytics |
| ImageKit.io | Image CDN + transformations |
| SendinBlue (Brevo) | Transactional email |
| IANS API | External news ingestion (`cms.iansnews.in`) |

---

## Features

### Content & Authoring
- ✅ Full CRUD for **news articles**, **categories**, **subcategories**, **bylines (authors)** and **tags**
- ✅ WYSIWYG editor (Summernote) with image upload to ImageKit
- ✅ Featured images with auto-generated thumbnails
- ✅ Multi-image gallery per article
- ✅ Draft / Pending / Published / Archived workflow
- ✅ **Breaking**, **Featured**, **Trending** flags
- ✅ Per-article SEO metadata (title, description, keywords, slug)
- ✅ Reading time auto-calculation
- ✅ Inline advertisement injection (after paragraph 3, 6, 10)

### Content Ingestion
- ✅ **IAINIS API integration** — bulk-import news from `xyz.inews.in`
- ✅ Deduplication by external ID
- ✅ Automatic tag extraction from API payload
- ✅ Preserves original image URLs

### Reader Experience
- ✅ Bilingual titles & content (Hindi + English)
- ✅ Category and tag landing pages
- ✅ Author (byline) profile pages
- ✅ Advanced search with pagination
- ✅ Related articles sidebar
- ✅ Prev/Next story navigation
- ✅ Author `VaniTTS` audio playback of articles
- ✅ Embedded X/Twitter post rendering
- ✅ Dark / light theme

### Authentication & Users
- ✅ **Two-step admin login** (password + OTP via email)
- ✅ Role-based access (`super_admin`, `admin`, `editor`, `viewer`)
- ✅ Granular permission matrix
- ✅ Account lockout on repeated OTP failures
- ✅ Email OTP delivery via SendinBlue

### Newsletters
- ✅ Double opt-in subscribe flow
- ✅ Verification and unsubscribe tokens
- ✅ Full subscriber management (list, filter, export CSV)
- ✅ Campaign creation, scheduling, and dispatch
- ✅ Delivery/open/click logging

### SEO & Distribution
- ✅ **AMP pages** for every article
- ✅ **RSS 2.0 feeds** — global, per-category, per-author, per-tag, per-article
- ✅ **Google News RSS** feed variant
- ✅ **XML sitemap** endpoint (`/api/sitemap`)
- ✅ JSON-LD `NewsArticle` + `NewsMediaOrganization` structured data
- ✅ Open Graph and Twitter Card tags
- ✅ Canonical URLs
- ✅ `amphtml` link on standard articles

### Monetization
- ✅ Google Ad Manager (GPT) — display, anchor, interstitial
- ✅ Taboola below-article widget
- ✅ MGID container
- ✅ VDO.ai in-article video
- ✅ Ad slot injection at fixed paragraph positions
- ✅ Responsive desktop/mobile ad images

---

## Project Structure

### Backend (CodeIgniter HMVC)

```
application/
├── modules/
│   ├── admin/           # Admin user management
│   ├── api/             # Public JSON API (used by frontend)
│   ├── auth/            # Two-step login + OTP
│   ├── bylines/         # Authors / journalists
│   ├── categories/      # News categories
│   ├── home/            # Public controller (AMP, category, search)
│   ├── ians_api/        # IANS news importer
│   ├── newsletter/      # Subscribers + campaigns
│   ├── news/            # Articles
│   ├── newsletter/      # Tag followers, subscribers
│   ├── rss/             # RSS feed generator
│   ├── settings/        # Global site settings
│   ├── static_pages/    # About, Careers, Privacy, Terms...
│   ├── subcategories/   # Subcategories
│   └── tags/            # Tags
├── config/
│   ├── routes.php
│   └── imagekit.php
└── helpers/
    ├── common_helper.php
    └── email_helper.php
```

### Frontend (TanStack Start)

```
src/
├── components/
│   ├── site-chrome.tsx        # SiteHeader, SiteFooter, Newsletter
│   ├── newsroom.tsx           # NewsGrid, NewsCard, SectionTitle
│   ├── article-with-ads.tsx   # HTML splitter + inline ad injection
│   ├── taboola-widget.tsx
│   ├── vdo-ai-ad.tsx
│   ├── ad-banner.tsx
│   └── google-ads.tsx         # DisplayAd, AnchorAd, InterstitialAd
├── lib/
│   ├── api.ts                 # Query builders + fetchers
│   ├── api.functions.ts       # Server functions (subscribe, etc.)
│   └── ads.ts                 # Ad slot config
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── article.$slug.tsx
│   ├── category.$slug.tsx
│   ├── subcategory.$slug.tsx
│   ├── byline.$slug.tsx
│   ├── news.tsx               # Search / listing
│   └── ...
└── styles.css
```

---

## Requirements

| Tool | Minimum version |
|------|-----------------|
| PHP | 7.4 (8.1+ recommended) |
| MySQL / MariaDB | 5.7 / 10.3 |
| Composer | 2.x |
| Node.js | 18+ |
| npm / pnpm / yarn | latest |
| Web server | Apache / Nginx |

**PHP extensions required:** `mbstring`, `intl`, `curl`, `json`, `openssl`, `pdo_mysql`, `gd`

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/apnibaat.git
cd apnibaat
```

### 2. Backend setup (CodeIgniter)

```bash
# Install PHP dependencies (ImageKit SDK)
composer install

# Create the database
mysql -u root -p -e "CREATE DATABASE apnibaat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import schema
mysql -u root -p apnibaat < database/schema.sql

# Create the logs directory
mkdir -p application/logs uploads/temp
chmod -R 755 application/logs uploads
```

Configure `application/config/database.php` with your DB credentials.

### 3. Frontend setup (TanStack Start)

```bash
cd frontend
npm install
```

Configure `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. Run locally

```bash
# Backend
php -S localhost:8080 -t public

# Frontend (separate terminal)
cd frontend
npm run dev
```

Visit **http://localhost:3000**.

---

## Configuration

### `application/config/imagekit.php`

```php
$config['ik_public_key']  = 'public_XXXXXXXXXXXXX';
$config['ik_private_key'] = 'private_XXXXXXXXXXXX';
$config['ik_url_endpoint'] = 'https://ik.imagekit.io/your_id';
$config['ik_base_folder']  = '/apnibaat/';
$config['ik_allowed_types'] = 'jpg|jpeg|png|gif|webp';
$config['ik_max_size']      = 5120;
```

### `application/helpers/email_helper.php`

Set your SendinBlue API key inside `NexusSendEmail()`.

### OTP delivery

OTP is generated inside `Auth.php → generate_otp()` and delivered via `send_otp_email()` using the `NexusSendEmail()` helper.

### Advertising (frontend)

Edit `src/lib/ads.ts` to change ad images and links site-wide:

```ts
export const headerAd: AdSlot = {
  desktop_image: "https://...",
  desktop_link: "https://...",
  mobile_image: "https://...",
  mobile_link: "https://...",
  alt: "Advertisement",
};
```

---

## API Reference

All endpoints return a consistent envelope:

```json
{ "success": true, "data": ..., "code": 200 }
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/categories` | All active categories |
| `GET` | `/api/bylines` | All active authors |
| `GET` | `/api/bylines/{slug}` | Author detail |
| `GET` | `/api/news` | Paginated article list |
| `GET` | `/api/news/{slug}` | Full article detail |
| `GET` | `/api/search?q=...` | Full-text search |
| `GET` | `/api/settings` | Site-wide settings |
| `GET` | `/api/sitemap` | All published slugs |
| `POST` | `/api/newsletter/subscribe` | Subscribe |
| `POST` | `/api/newsletter/unsubscribe` | Unsubscribe |
| `GET` | `/api/newsletter/verify?token=...` | Verify email |

### `GET /api/news` filters

| Param | Description |
|-------|-------------|
| `category` | Category slug |
| `subcategory` | Subcategory slug |
| `byline` | Author slug |
| `breaking=1` | Breaking news only |
| `featured=1` | Editor's picks |
| `trending=1` | Trending only |
| `q` | Search term |
| `page` | Page number (default 1) |
| `per_page` | Items per page (default 12, max 50) |
| `sort` | `latest` · `popular` · `oldest` |

### Example

```bash
curl "https://apnibaat.com/api/news?category=politics&per_page=12&page=1"
```

```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "title": "हैडलाइन",
      "slug": "headline-slug",
      "excerpt": "संक्षिप्त सारांश",
      "featured_image": "https://ik.imagekit.io/.../img.jpg",
      "category": { "name": "राजनीति", "slug": "politics" },
      "byline":   { "name": "अंकित अवस्थी", "slug": "ankit-avasthi" },
      "published_at": "2026-11-12T08:00:00+05:30",
      "read_time": "3",
      "views": "0"
    }
  ],
  "meta": { "current_page": 1, "last_page": 20, "total": 240, "per_page": 12 }
}
```

---

## Admin Modules

| Module | URL | Purpose |
|--------|-----|---------|
| Dashboard | `/admin/dashboard` | Stats, charts, recent activity |
| News | `/news` | Article CRUD |
| Categories | `/categories` | Category management |
| Subcategories | `/subcategories` | Subcategory management |
| Bylines | `/bylines` | Author profiles |
| Tags | `/tags` | Tag management |
| Admin Users | `/admin-users` | Staff accounts & permissions |
| Newsletter | `/newsletter` | Subscribers & campaigns |
| Static Pages | `/static-pages` | About, Privacy, Terms, etc. |
| IANS Importer | `/ians-api` | Bulk import external news |

---

## Frontend Routes

| Route | Purpose |
|-------|---------|
| `/` | Home — hero, latest, trending, opinion, videos |
| `/article/{slug}` | Article detail |
| `/category/{slug}` | Category listing |
| `/subcategory/{slug}` | Subcategory listing |
| `/byline/{slug}` | Author profile |
| `/news` | Search & latest news |
| `/tag/{slug}` | Tag listing |
| `/search?q=...` | Search results |
| `/amp/{slug}` | AMP version of article |

---

## Advertising Integration

| Ad Network | Where to configure |
|------------|--------------------|
| Google Ad Manager | `src/components/google-ads.tsx` + `GPT_ACCOUNT` in `__root.tsx` |
| Taboola | `src/components/taboola-widget.tsx` + loader in `__root.tsx` |
| MGID | `src/components/mgid-widget.tsx` (mirror Taboola pattern) |
| VDO.ai | `src/components/vdo-ai-ad.tsx` |
| In-article | `ArticleWithAds` in `src/components/article-with-ads.tsx` |

Ad slots are injected **after paragraph 3, 6, and 10** by default. Adjust positions in:

```tsx
<ArticleWithAds
  html={a.content}
  adPositions={[3, 6, 10]}
  renderAd={(i) => <AdBanner ad={headerAd} position={`inline-${i}`} />}
/>
```

---

## SEO & Performance

- **AMP** pages auto-generated for all published articles (`/amp/{slug}`)
- **RSS 2.0** at `/rss` with per-category `/rss/category/{slug}`, per-author `/rss/author/{slug}`, per-tag `/rss/tag/{slug}` feeds
- **Google News RSS** at `/rss/google-news`
- **JSON-LD** structured data embedded in article and root pages
- **Canonical URLs** on every route
- **Image CDN** (ImageKit) with on-the-fly transformations
- **Server-side rendering** via TanStack Start for instant first paint
- **Lazy ad loading** for Taboola, VDO.ai and display units
- **Preconnected origins** for `fonts.googleapis.com`, `doubleclick.net`, `googletagmanager.com`

---

## Deployment

### Backend
1. Upload the CodeIgniter app.
2. Point your vhost document root to `public/` (or `index.php`).
3. Ensure `uploads/` and `application/logs/` are writable.
4. Set `ENVIRONMENT` to `production` in `index.php`.
5. Import the production database and configure `.env`-style config files.

### Frontend
```bash
cd frontend
npm run build
npm run start
```

Deploy the `.output/` folder to Vercel, Netlify, Fly.io, or your own Node.js host. Set environment variables in your hosting dashboard:

```env
VITE_API_BASE_URL=https://apnibaat.com/api
```

### Recommended reverse proxy (Nginx)

```nginx
server {
    server_name apnibaat.com;

    location /api/  { proxy_pass http://backend:8080/; }
    location /amp/  { proxy_pass http://backend:8080/; }
    location /rss   { proxy_pass http://backend:8080/; }
    location /      { proxy_pass http://frontend:3000/; }
}
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Commit your changes: `git commit -m "feat: add feature"`.
4. Push the branch: `git push origin feature/my-feature`.
5. Open a Pull Request.

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## License

Distributed under the **MIT License**. See `LICENSE` for details.

---

## Acknowledgements

- [CodeIgniter](https://codeigniter.com/)
- [TanStack](https://tanstack.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ImageKit](https://imagekit.io/)
- [Brevo (SendinBlue)](https://www.brevo.com/)
- [IANS](https://www.ians.in/) — external news source

---

<div align="center">

**अपनीबात** — *खबर. विचार. संवाद.*

Made with ❤️ for Hindi journalism

</div>
