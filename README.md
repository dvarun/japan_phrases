# Japan Phrasebook 🇯🇵

A beautiful, mobile-first static phrasebook for tourists visiting Japan who cannot read Japanese. Quick, practical phrases with romaji pronunciation for daily travel situations.

## Features

- **75+ travel phrases** across 8 categories (greetings, restaurants, transport, emergency, etc.)
- **Tourist Survival Mode** — the top 10 must-know phrases at a glance
- **Search** by English, romaji, or Japanese
- **Favorites** saved in localStorage
- **Copy to clipboard** with one tap
- **Category navigation** with sticky tabs
- **Offline support** via service worker
- **Mobile-first** design, works great with one hand
- **No backend** — fully static, deploys anywhere

## Tech Stack

- [Astro](https://astro.build/) v4 — static site generator
- Vanilla JavaScript — no framework dependencies
- CSS custom properties — clean design system
- Google Fonts — Inter + Noto Sans JP

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:4321`.

## Project Structure

```
src/
├── data/phrases.json      # All phrase data (single source of truth)
├── layouts/Layout.astro   # Base HTML with meta, fonts, SW registration
├── components/
│   ├── Hero.astro         # Welcome banner
│   ├── CategoryNav.astro  # Sticky category tabs
│   ├── SearchBar.astro    # Search input + favorites toggle
│   ├── PhraseCard.astro   # Individual phrase card
│   ├── SurvivalMode.astro # Top 10 phrases carousel
│   └── EmptyState.astro   # No-results message
├── pages/index.astro      # Main page + client-side JS
└── styles/global.css      # Full design system
public/
├── favicon.svg
├── manifest.json          # PWA manifest
└── sw.js                  # Service worker for offline support
```

## Deployment

The site builds to a `dist/` folder with pure static HTML/CSS/JS. Deploy it anywhere:

### Netlify
1. Connect your repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel
1. Connect your repo
2. Framework preset: Astro
3. It auto-detects the rest

### Cloudflare Pages
1. Connect your repo
2. Set build command: `npm run build`
3. Set build output directory: `dist`

### GitHub Pages
Add to `astro.config.mjs`:
```js
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/your-repo-name',
});
```
Then push and enable GitHub Pages from Settings > Pages.

## Adding or Editing Phrases

All phrases live in `src/data/phrases.json`. Each entry:

```json
{
  "id": "greet-01",
  "category": "greetings",
  "english": "Hello",
  "japanese": "こんにちは",
  "romaji": "Konnichiwa",
  "note": "The most common greeting.",
  "survival": true
}
```

- `category` must match one of: `greetings`, `apologies`, `restaurants`, `shopping`, `transport`, `hotel`, `emergency`, `numbers`
- Set `survival: true` for phrases to appear in the Tourist Survival Mode section
- `note` is optional — leave as `""` to hide

## License

MIT
