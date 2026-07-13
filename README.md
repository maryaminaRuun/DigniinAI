# DigniinAI

**From Early Warning to Verified Early Action**

DigniinAI is a bilingual, low-bandwidth early-warning prototype for the IGAD Hackathon 2026. It transforms trusted hazard information into clear, livelihood-specific actions and records whether communities received, acted on, or need help with an alert.

## Current prototype

- Beledweyne flood-warning scenario
- English and Somali interface
- Community role-specific recommendations
- Alert acknowledgement and assistance request states
- Regional hazard-map visualization
- SMS and voice notification simulations
- Moderated community incident reporting
- Impact metrics dashboard
- Responsive mobile interface
- Installable PWA shell with offline cache fallback

All hazard values and delivery metrics in this prototype are demonstration data. The product does not issue official forecasts.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Public application: `http://localhost:5173/`

Coordinator application: `http://localhost:5173/admin.html`

The coordinator runs safely with local demonstration data by default. Copy `.env.example` to `.env` and add the Supabase project URL and public anonymous key to enable the shared database. Never put a Supabase service-role key in the frontend.

## Responsible design

- Official authorities remain responsible for hazard determination.
- AI is limited to simplifying, translating and adapting approved messages.
- Human approval is required before publishing operational alerts.
- Every alert should display its source, timestamp and confidence.
- Template fallbacks keep critical communication available if AI fails.

## Planned production architecture

Next.js/TypeScript, Supabase PostgreSQL and authentication, Leaflet/OpenStreetMap, PWA caching, documented hazard APIs, and an AI service with rule-based fallback.

The proposed Supabase/PostgreSQL schema is available in `docs/database.sql`. Data-source and responsible-integration rules are documented in `docs/data-sources.md`.

## Attribution

The prototype is inspired by the public climate-information and anticipatory-action resources of ICPAC. Future data integrations will be implemented only through documented, licensed APIs or datasets. UI icons are provided by Lucide under its open-source license.

Created by **Eng. Maryama (Queen Reza)** for the IGAD Hackathon 2026.
