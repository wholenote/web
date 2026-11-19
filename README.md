# Brian’s Personal Website

Brian's personal website, built with Astro and TypeScript as a static site suitable for Cloudflare Pages. It currently includes an interactive collection of restaurant recommendations and can expand to include other projects and interests over time.

## Run locally first

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Astro prints the localhost URL, normally `http://localhost:4321`. Use this local version to review the layout, interactions, responsive behavior, and copy before setting up hosting.

If Astro reports an existing development server, use its printed URL or run `npm run dev -- status` and `npm run dev -- stop` from this project. The `astro` executable is installed locally, so a bare `astro dev stop` may not be available in your shell.

Development, type checks, and builds use separate Vite dependency caches. This lets checks run while the preview is open without invalidating its JavaScript imports (`504 Outdated Optimize Dep`).

Useful checks:

```bash
npm run check
npm test
npm run build
npm run preview
```

`npm run preview` serves the production build locally, normally at `http://localhost:4321`.

## Edit the site

Design work follows the project-local [Brian website design skill](skills/brian-website-design/SKILL.md), based on research into Balatro and Vincent Passaro's website. [AGENTS.md](AGENTS.md) directs future agents to apply it. See the [reference research](skills/brian-website-design/references/research.md) and [2026-10-07 design audit](docs/design-audit.md) for the rationale and baseline findings.

- Edit the pages and components in `src` to add or update sections of the website.
- About and Photos are temporarily unpublished. Their header entries are disabled and labeled “Coming soon”; direct visits redirect to Food. Their full content is preserved in `src/pages/resume.astro` and `src/pages/photos.astro`. To reopen them, remove the early redirects in those files and their rules in `public/_redirects`, then restore the header links in `SiteHeader.astro`.
- Edit `src/data/recommendations.ts` for cities, restaurant recommendations, personal notes, suggested orders, and tiers.
- Add photography files to `public/photos`, then list them in `src/data/photography.ts`. Each photo needs a country and neutral alt text; place, year, caption, and a smaller `thumbnail` are optional. Use neutral filenames if you want to avoid giving away the answer.
- Set each restaurant's `tier` to `"recommended"` or `"favorite"`. The combined All list is shown by default.
- Every recommendation uses real `{ lat, lng }` coordinates to place it on the selected city's map.
- Add a real `directionsUrl` to a recommendation to show its external Directions link.
- Add a city center and zoom level when expanding the guide to another city.

The interactive map uses Leaflet and OpenStreetMap tiles with visible attribution. The card list retains all recommendation details for accessibility, and the data structure supports adding more cities over time.

The Photos tab is a daily five-photo country game. A date-seeded shuffle selects five distinct photographs, shared by visitors for each UTC day. Each photo gets one country guess (or a zero-point skip), and the final score is out of five. Country aliases are accepted. Answers and the daily score persist in browser storage; a new game starts at midnight UTC. Future photos stay locked until the current round is answered. Revealing and browsing skips all remaining rounds. Five credited demo photographs currently make the game playable; the sources are recorded in [public/photos/demo/CREDITS.md](public/photos/demo/CREDITS.md). Replace the demo entries with your own photographs and omit `demo: true`; keep `credit` when attribution is needed. At least five photos are required. A larger library lets each day select a different subset.

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
