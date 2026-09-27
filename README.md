# Shuren — website

**Live:** [shuren.fr](https://shuren.fr) · [English version](https://shuren.fr/en/)

Source of the website for **Shuren**, the AI agent agency I run for French small businesses (restaurants, hotels, shops, trades). Shuren sets up custom agents that answer Google reviews, send the owner a daily WhatsApp recap of the business, qualify leads, book appointments and generate staff schedules. The agents themselves are built on the Claude API, Make and n8n; this repo is only the public-facing site.

## What's in it

- A bilingual (FR / EN) marketing site: home, process, FAQ, client case study, contact, legal notice
- SEO landing pages per use case (`agent-ia-avis-google.html`, `agent-ia-restaurant.html`, `planning-equipe-ia.html`)
- Structured data (JSON-LD), `sitemap.xml`, `robots.txt` and an `llms.txt` so AI assistants can describe the business accurately
- Light/dark theme, mobile contact bar (WhatsApp / phone), accessible contrast and touch targets

## Stack

Plain HTML, CSS and JavaScript, no framework and no build step. Hosted on **Cloudflare Pages**, with `_headers` for caching and security headers and `_redirects` for clean URLs.

## Deployment

[`deploy.sh`](deploy.sh) copies an explicit allow-list of public files into a temporary folder, checks that nothing sensitive slipped in, and deploys that folder with Wrangler. Anything not on the list is never published.

```bash
./deploy.sh --dry-run   # build and check only
./deploy.sh             # deploy to production
```

## License

© Victor Bazet-Braun / Shuren. All rights reserved. The code is public for reference; the brand, copy and images are not licensed for reuse.
