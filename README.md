# Skinstric Internship Project

A polished Next.js 16 app built as a skincare analysis experience for the Skinstric internship.

The app includes an onboarding flow, camera/gallery capture, A.I. analysis cards, and interactive results detail pages.

## Key Features

- Animated landing experience with directional navigation.
- Onboarding flow that collects user name and location.
- Camera and gallery capture step for image-based analysis.
- Results dashboard with A.I. analysis categories:
  - Demographics
  - Skin type details
  - Cosmetic concerns
  - Weather context
- Detailed demographic review page with confidence ranking and editable selections.
- Local storage persistence for user name, location, and phase two analysis results.

## Tech Stack

- Next.js 16.2.3
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- AOS for scroll animations
- `motion` for animated transitions

## Project Structure

- `src/app/`
  - `page.tsx` — main landing page
  - `testing/page.tsx` — onboarding prompt flow
  - `capture/page.tsx` — user image capture and confirmation
  - `results/page.tsx` — analysis dashboard
  - `results/[category]/page.tsx` — detail views for category insights
- `src/components/`
  - `site-header.tsx` — top navigation and branding
  - `aos-provider.tsx` — AOS initialization wrapper
- `src/lib/analysis-content.ts` — analysis data modeling, storage helpers, and fallback AI content

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Lint the code

```bash
npm run lint
```

## Notes

- The app is built using client-side React for interactive flows.
- The testing flow uses an external API endpoint for phase 1 submission.
- Image capture uses browser camera and file input support.
- Local storage keys are defined in `src/lib/analysis-content.ts`.

## Customization

To adjust analysis content or fallback data, update `src/lib/analysis-content.ts`.

To change visual styling, modify `src/app/globals.css` and Tailwind utility classes in component files.
