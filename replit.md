# Insurance Form Web Application

## Overview
A Next.js web application for vehicle insurance form processing with Arabic language support. The application uses Firebase Firestore for real-time data synchronization and includes multi-step form functionality.

## Tech Stack
- **Framework**: Next.js 14.2.15
- **Language**: TypeScript
- **Styling**: Tailwind CSS with tailwindcss-animate
- **UI Components**: Radix UI (Dialog, Label, Slot)
- **Database**: Firebase Firestore
- **Icons**: Lucide React

## Project Structure
```
app/
  - page.tsx          # Main insurance form page
  - layout.tsx        # Root layout with metadata
  - globals.css       # Global styles
  - main/page.tsx     # Main section
  - nafad/page.tsx    # Nafad verification page
  - phone-info/page.tsx # Phone info page
components/
  - ui/               # Reusable UI components (button, card, input, etc.)
  - chat-panel.tsx    # Chat functionality
  - pay-form.tsx      # Payment form component
  - otp-dialog.tsx    # OTP verification dialog
  - step-indicator.tsx # Multi-step form indicator
lib/
  - firebase.ts       # Firebase configuration and utilities
  - utils.ts          # Utility functions
  - offer-data.ts     # Insurance offer data
public/
  - companies/        # Company logos
  - Various assets (icons, logos)
```

## Development
The development server runs on port 5000:
```bash
npm run dev
```

## Configuration
- Next.js config: `next.config.js`
- TypeScript: `tsconfig.json`
- Tailwind CSS: `tailwind.config.ts`
- PostCSS: `postcss.config.js`

## Recent Changes
- **December 2024**: Migrated to Replit environment
  - Upgraded Next.js from 13.5.1 to 14.2.15 for Node.js 20 compatibility
  - Configured dev server to run on port 5000 with 0.0.0.0 host
  - Fixed viewport metadata export for Next.js 14
  - Added type annotations for Firebase Firestore callbacks

## Deployment
Configured for autoscale deployment:
- Build: `npm run build`
- Start: `npm run start`
