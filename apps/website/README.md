# Clippy Marketing Website

## Overview
The official marketing website for Clippy - designed to convert visitors into Chrome extension users. Built with Next.js 14, featuring a modern, animated landing page that showcases the product's capabilities.

## Key Features
- 🎨 Modern, animated hero section
- 📊 Interactive feature showcase
- 💰 Clear pricing tiers comparison
- 🎮 Live demo preview
- 📹 Video testimonials
- 🚀 Chrome extension install CTA
- 📱 Fully responsive design
- ⚡ Optimized for Core Web Vitals

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics + Google Analytics
- **Components**: Radix UI primitives
- **Icons**: Heroicons

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Structure

```
website/
├── app/                  # Next.js App Router
│   ├── page.tsx         # Homepage
│   ├── pricing/         # Pricing page
│   ├── features/        # Features page
│   └── api/             # API routes
├── components/          # React components
│   ├── Hero.tsx        # Hero section
│   ├── Features.tsx    # Features showcase
│   ├── Pricing.tsx     # Pricing cards
│   └── CTA.tsx         # Call-to-action
├── public/             # Static assets
└── styles/             # Global styles
```

## Deployment
Automatically deployed to Vercel on push to main branch.

## Environment Variables
```env
NEXT_PUBLIC_CHROME_EXTENSION_URL=https://chrome.google.com/webstore/detail/clippy/...
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
