# Brian Wang’s Food Guide

A focused, interactive food guide for Brian's Austin, Houston, and Las Vegas recommendations. Built with Astro and TypeScript as a static site suitable for Cloudflare Pages.

## Run locally first

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Astro prints the localhost URL, normally `http://localhost:4321`. Use this local version to review the layout, interactions, responsive behavior, and copy before setting up hosting.

Useful checks:

```bash
npm run check
npm test
npm run build
npm run preview
```

`npm run preview` serves the production build locally, normally at `http://localhost:4321`.

## Edit the guide

- Edit `src/data/recommendations.ts` for cities, restaurant recommendations, personal notes, suggested orders, and tiers.
- Set each restaurant's `tier` to `"recommended"` or `"favorite"`. The combined All list is shown by default.
- Every recommendation uses real `{ lat, lng }` coordinates to place it on the Austin-area map.
- Add a real `directionsUrl` to a recommendation to show its external Directions link.
- Add a city center and zoom level when expanding the guide to another city.

The interactive map uses Leaflet and OpenStreetMap tiles with visible attribution. The card list retains all recommendation details for accessibility. Austin, Houston, and Las Vegas are configured, and the data structure supports adding more cities later.

## Deploy after localhost approval

The site builds to static files in `dist` and does not need secrets, a database, or a map API key.

1. Push the reviewed project to a GitHub or GitLab repository.
2. In Cloudflare, open **Workers & Pages**, create a Pages application, and import the repository.
3. Use these build settings:
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy the generated preview URL, then connect a custom domain only when ready.

Cloudflare will create preview deployments for subsequent pull requests or branch changes when Git integration is enabled.
