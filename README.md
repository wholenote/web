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

## Update recommendations from S3 without redeploying

The site can fetch a JSON copy of the recommendations in the browser. The built-in TypeScript list remains the fallback if S3 is unavailable or the JSON is invalid.

1. Export the current data:

   ```bash
   npm run recommendations:export
   ```

2. Upload the generated `recommendations.json` with a short cache lifetime:

   ```bash
   aws s3 cp recommendations.json s3://YOUR_BUCKET/recommendations.json \
     --content-type application/json \
     --cache-control "public,max-age=60"
   ```

3. Add the stable object URL to the hosting environment and deploy once:

   ```text
   PUBLIC_RECOMMENDATIONS_URL=https://YOUR_BUCKET.s3.YOUR_REGION.amazonaws.com/recommendations.json
   ```

After that one deployment, edit `src/data/recommendations.ts`, run the export command, and upload the generated JSON again. The website requests it on each page load, so restaurant changes do not require another site build. Keep the S3 bucket private for writes; the JSON object itself must be publicly readable, or served publicly through CloudFront.

If S3 is on a different origin than the website, add a bucket CORS rule like this, replacing the domain with the production site:

```json
[
  {
    "AllowedOrigins": ["https://your-domain.com"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"]
  }
]
```

Copy `.env.example` to `.env` for local testing. Do not use a presigned S3 URL for this setting because presigned URLs expire; use a stable public S3 or CloudFront URL.

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
