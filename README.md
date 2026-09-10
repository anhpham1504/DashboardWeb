# FPT Polytechnic Website Dashboard

The FPT Polytechnic Website Dashboard keeps frequently used links in a searchable, categorized collection and opens every website in a new browser tab.

## Tech stack

- Next.js 16 App Router, React 19, and strict TypeScript
- Tailwind CSS 4 with reusable Radix/shadcn-style UI primitives
- Prisma ORM with SQLite
- Zod validation, Lucide icons, next-themes, and Sonner toasts

## Features

- Create, edit, delete, search, filter, sort, and open website shortcuts
- Safe URL normalization and protocol validation
- Automatic favicons with a visual fallback
- Category CRUD with website counts and `SetNull` deletion behavior
- Grid/list views, responsive navigation, light/dark themes
- Loading, empty, error, confirmation, modal, and toast states
- Keyboard-accessible controls and dialogs

## Project structure

```text
prisma/                 Schema, migrations, and seed data
src/app/                Pages and API route handlers
src/components/         Layout, feature, and UI components
src/hooks/              Reusable React hooks
src/lib/                Prisma, API, URL, and utility helpers
src/repositories/       Database access layer
src/services/           Business logic layer
src/schemas/            Zod validation schemas
src/types/              Shared application types
```

## Installation

Requirements: Node.js 20+ and npm.

On Windows, double-click `run.bat`. It installs dependencies when needed,
prepares Prisma and starts the website at `http://localhost:3000`.

Manual setup:

```bash
npm install
```

## Environment setup

Copy `.env.example` to `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Set `NEXT_PUBLIC_SITE_URL` to the public origin in production so metadata,
the sitemap, robots file, and social-sharing images use canonical URLs.

## Prisma migration

```bash
npx prisma migrate dev
```

## Database seed

```bash
npx prisma db seed
```

The seed adds Development, AI Tools, Work, and Study categories plus the
curated showcase websites. Empty legacy categories are removed safely; the
Victionary English product is assigned to Study.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Automated browser checks

```bash
npm run test:e2e
```

The Playwright suite covers the four public pages in light and dark mode at
desktop and mobile sizes. It also checks horizontal overflow, the About quick
navigation, mobile navigation, and the generated SEO endpoints.

## Production

```bash
npm run build
npm start
```

SQLite is intended for a single local dashboard instance. This repository
intentionally includes the local `.env` configuration and starter database so
the current showcase can run immediately on another computer. Do not add
passwords, tokens, or production credentials to the committed `.env` file.

## FPT Digital Showcase

`/` is the public student-product exhibition. `/systems` retains the full
directory, search, filters, sorting and website management. `/categories`
retains category management.
`/about` is the dedicated department introduction page, separated from the
product homepage. Navigation and footer links point to it; legacy `/#about`
links are forwarded to `/about` in the browser.

Search and sharing metadata are generated through `/sitemap.xml`, `/robots.txt`,
`/opengraph-image.png`, and `/twitter-image.png`.

The system directory includes live collection counts, student/external-tool
filters, accessible grid/list views, account-access notes and usage guidance.
Collection statistics remain independent of search and category filters.
Default student-product descriptions are enriched from the editorial catalog;
custom descriptions saved by users take precedence. Its warm light/dark palette
is scoped to the directory and does not modify category pages.

The homepage selects the five verified student applications in
`src/lib/showcase.ts`: Anh Em Motor, My Interview, V-Shield, Victionary English
and SHB Agents. Other tools stay in the directory. Names and destinations are
read from the database on each homepage request; an app removed from the
database also disappears from the exhibition. Editorial descriptions, order,
category labels and cover filenames are maintained in the showcase catalog.

Square 3D promotional posters are stored in `public/showcase/`;
their format, generation prompts and replacement guidelines are documented there.
Covers are explicitly labeled as illustrations, not actual screenshots.
Login-only products are labeled.
No student identities, awards or usage figures are fabricated.

Presentation components and responsive light/dark styles are isolated in
`src/components/showcase/`. The homepage is server-rendered for discoverability.
