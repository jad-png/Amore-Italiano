# Amore Italiano Safi

Restaurant website for Amore Italiano in Safi, built with Next.js and TypeScript.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss`
- ESLint

## Requirements

- Node.js 18+ recommended
- npm

## Installation

```bash
npm install
```

## Development

Start the local development server:

```bash
npm run dev
```

Open the site at `http://localhost:3000`.

## Production Build

Create a production build:

```bash
npm run build
```

Run the production server after building:

```bash
npm run start
```

## Code Quality

Lint the project:

```bash
npm run lint
```

Type-check the project:

```bash
npm run typecheck
```

## Project Structure

- `app/` Next.js routes, layout, metadata, sitemap, and robots file
- `components/` Shared UI sections such as navbar, footer, gallery, and modal
- `public/images/` Static images used across the site

## Available Pages

- `/` Home page
- `/adresse` Address and location page
- `/contact` Contact page
- `/forum` Forum page
- `/histoire` Story and history page
- `/menu` Menu page
- `/safi` Safi page

## Notes

- The site uses local assets from `public/`, including images and a hero video.
- Metadata, Open Graph data, and restaurant structured data are configured in `app/layout.tsx`.
- There are currently no environment variables required for local development.

## Deployment

This is a standard Next.js app and can be deployed to any platform that supports Node.js apps, including Vercel.
