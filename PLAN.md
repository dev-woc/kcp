# Keep Pedaling Foundation Website Clone

## Project Overview

A Next.js 16 website clone for the **Keep Pedaling Foundation** - a non-profit organization dedicated to raising mental health awareness through the power of cycling.

**Live Site:** https://keeppedalingfoundation.org
**Tagline:** "Biking for the culture, healing for the soul"

---

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Icons:** Heroicons React
- **Utilities:** clsx, tailwind-merge

---

## Project Structure

```
kpf_clone/
├── app/
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Tailwind + brand colors
│   ├── about/page.tsx      # About Us page
│   ├── cycling-club/page.tsx  # Cycling Club page
│   ├── events/page.tsx     # Events page
│   ├── contact/page.tsx    # Contact page
│   ├── mental-health/page.tsx # Mental Health Resources page
│   └── shop/page.tsx       # Shop page
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx      # Button, LinkButton, ExternalLinkButton
│   │   ├── Card.tsx        # Card components
│   │   ├── Input.tsx       # Form input
│   │   └── index.ts        # Exports
│   ├── layout/             # Layout components
│   │   ├── Header.tsx      # Site header with navigation
│   │   ├── Footer.tsx      # Site footer
│   │   ├── Navigation.tsx  # Navigation menu
│   │   └── index.ts        # Exports
│   └── sections/           # Page sections
│       ├── Hero.tsx        # Hero section
│       ├── MissionStatement.tsx
│       ├── UpcomingEvents.tsx
│       ├── JoinCyclingClub.tsx
│       ├── MentalHealthResources.tsx
│       ├── NewsletterSignup.tsx
│       └── index.ts        # Exports
├── lib/
│   └── utils.ts            # cn() utility function
├── types/                  # TypeScript types
├── data/                   # Static data
└── public/
    └── images/             # Image assets
```

---

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#a90707` | Buttons, accents, links |
| Primary Dark | `#8a0606` | Hover states |
| Secondary | `#32373c` | Headers, dark sections |
| Secondary Dark | `#1a1d20` | Footer |
| Background | `#ffffff` | Main background |
| Background Alt | `#f9fafb` | Alternate sections |
| Foreground | `#171717` | Text |
| Foreground Muted | `#6b7280` | Secondary text |

---

## Pages

### 1. Homepage (`/`)
- Hero section with CTA buttons
- Mission statement
- Upcoming events preview
- Join cycling club CTA
- Mental health resources preview
- Newsletter signup

### 2. About Us (`/about`)
- Mission and story
- Core values (5 principles)
- Meet the founders (3 co-founders)
- CTA to support

### 3. Cycling Club (`/cycling-club`)
- Club benefits
- Email signup form
- Strava and Discord integration links

### 4. Events (`/events`)
- Upcoming events grid
- Past events section
- Event hosting CTA

### 5. Contact (`/contact`)
- Contact information
- Social media links
- Contact form

### 6. Mental Health Resources (`/mental-health`)
- Cycle of Support program info
- Mental health toolkit (4 categories)
- Professional resources (7 organizations)
- Crisis hotlines

### 7. Shop (`/shop`)
- Link to Zeffy store
- Donation CTA

---

## Completed Tasks

- [x] Initialize Next.js 16 with TypeScript and Tailwind CSS
- [x] Install dependencies (@heroicons/react, clsx, tailwind-merge, zod, react-hook-form, framer-motion)
- [x] Set up Git repository
- [x] Configure Tailwind with brand colors
- [x] Create project folder structure
- [x] Build UI components (Button, Card, Input)
- [x] Build layout components (Header, Footer, Navigation)
- [x] Build section components (Hero, MissionStatement, etc.)
- [x] Implement Homepage
- [x] Implement About Us page
- [x] Implement Cycling Club page
- [x] Implement Events page
- [x] Implement Contact page
- [x] Implement Mental Health Resources page
- [x] Implement Shop page

---

## Remaining Tasks

- [ ] Add placeholder images to `/public/images/`
- [ ] Scrape actual images from live site
- [ ] Connect to GitHub remote and push
- [ ] Add integrations (email service, analytics)
- [ ] Test responsive design
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Deploy to Vercel

---

## External Integrations

| Service | Purpose | URL |
|---------|---------|-----|
| Zeffy | Donations & Shop | https://www.zeffy.com/en-US/donation-form/ |
| Strava | Cycling stats | Club page link |
| Discord | Community | Server link |
| Facebook | Social | https://www.facebook.com/profile.php?id=61565706314697 |
| Instagram | Social | https://www.instagram.com/keeppedaling_/ |
| TikTok | Social | https://www.tiktok.com/@keeppedalingfoundation |

---

## Running the Project

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

**Note:** Requires Node.js >= 20.9.0 for Next.js 16

---

## Contact

**Email:** KeepPedalingFoundation@gmail.com
