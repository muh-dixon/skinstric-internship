# Skinstric AI Skincare Analysis

Skinstric AI Skincare Analysis is an interactive skincare assessment app for users who want a guided way to submit basic profile details, capture or upload an image, and review AI-inspired analysis results. It solves the problem of turning a static skincare concept into a responsive multi-step product flow using Next.js, React, TypeScript, Tailwind CSS, browser media APIs, and external API integration.

Live Demo: https://skinstric-internship-nu.vercel.app/

GitHub: https://github.com/muh-dixon/skinstric-internship

## Demo

![Skinstric demo](docs/assets/demo/skincare-demo.gif)

## Short Description

Skinstric guides users through onboarding, image capture or gallery upload, API-backed analysis submission, and a results experience with demographic confidence rankings. The app focuses on polished interaction design, responsive layouts, client-side validation, browser media handling, and clear result presentation.

## Screenshots

### Home

![Skinstric homepage](docs/assets/screenshots/skinstric_AI_hompage.png)

### Hover State

![Skinstric homepage hover state](docs/assets/screenshots/skinstric_AI_hover.png)

### Name Step

![Name onboarding step](docs/assets/screenshots/skinstric_AI_name.png)

### Location Step

![Location onboarding step](docs/assets/screenshots/skinstric_AI_location.png)

### Capture Options

![Camera and gallery options](docs/assets/screenshots/skinstric_AI_camera.png)

### Results Overview

![Analysis category results](docs/assets/screenshots/skinstric_AI_options.png)

### Demographics Detail

![Demographics result detail](docs/assets/screenshots/skinstric_AI_results.png)

## Features

- Animated landing page with directional navigation and hover-driven transitions
- Multi-step onboarding flow for name and location input
- Client-side validation for user-provided onboarding details
- Camera and gallery upload flow using browser media and file APIs
- External API integration for Skinstric phase one and phase two submissions
- Results dashboard with demographics, skin type, cosmetic concerns, and weather categories
- Demographics detail view with confidence rankings and selectable corrections
- Local storage persistence for submitted profile data and analysis results
- Responsive layouts for desktop and mobile viewports

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Motion
- AOS
- Browser MediaDevices API
- Browser FileReader API
- Local Storage
- Vercel

## Architecture / How It Works

The app uses the Next.js App Router for route-level product flows. The landing page routes users into onboarding, the testing route collects profile details, the capture route manages camera or gallery input, and the results routes display stored analysis output.

```text
User starts the app
-> User enters name and location
-> App submits phase one profile data
-> User captures or uploads an image
-> App submits the image to phase two analysis
-> Analysis data is saved in local storage
-> Results dashboard renders category summaries
-> Demographics detail page renders confidence rankings
```

Main routes:

- `/` renders the animated landing page and entry navigation.
- `/testing` handles the onboarding flow and phase one API submission.
- `/capture` manages camera access, gallery upload, preview, and phase two API submission.
- `/results` displays the analysis category dashboard.
- `/results/demographics` displays demographic confidence rankings and selectable corrections.

Supporting code:

- `src/lib/analysis-content.ts` centralizes result parsing, category data, ranking helpers, storage keys, and fallback content.
- `src/components/site-header.tsx` renders shared top navigation and branding.
- `src/components/aos-provider.tsx` initializes AOS animation behavior across route changes.

## Environment Variables

No environment variables are required for the current implementation. The external Skinstric API endpoints are referenced directly in the client flow.

If the project grows, the API URLs should be moved into environment variables:

```env
NEXT_PUBLIC_PHASE_ONE_ENDPOINT=your_phase_one_endpoint
NEXT_PUBLIC_PHASE_TWO_ENDPOINT=your_phase_two_endpoint
```

Notes:

- `NEXT_PUBLIC_PHASE_ONE_ENDPOINT` would point to the profile submission endpoint.
- `NEXT_PUBLIC_PHASE_TWO_ENDPOINT` would point to the image analysis endpoint.
- Client-exposed variables should not contain private secrets.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the local app:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

## What I Learned

- Translating a polished design reference into reusable route-level UI with Next.js
- Managing multi-step client flows with validation, loading states, and navigation
- Working with camera access, file uploads, and base64 image normalization in the browser
- Integrating external API responses into a frontend experience
- Handling client-only browser APIs safely in a Next.js App Router project
- Structuring result data so dashboard and detail pages can share parsing and ranking logic

## Future Improvements

- Move external API endpoint URLs into environment variables
- Add automated tests for validation, result parsing, and route behavior
- Add more focused automated coverage around the camera and upload flow
- Improve error states for unavailable camera permissions and failed API responses
- Expand the result detail pages for skin type, cosmetic concerns, and weather
- Add accessibility passes for keyboard focus order and screen reader labels
