# Keep Pedaling Foundation - Cycle of Support

A Next.js application for managing therapy program applications for the Keep Pedaling Foundation's "Cycle of Support" initiative.

## Features

- **User Authentication**: Secure signup and login with NextAuth.js
- **Application Form**: Comprehensive 15-field application with video upload
- **User Dashboard**: Track application status and view submission details
- **Admin Portal**: Review, filter, and manage all applications
- **Video Uploads**: Intro video submission using UploadThing
- **Deadline Management**: Automatic enforcement of application deadline (Jan 25, 2025)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **File Uploads**: UploadThing
- **Form Validation**: Zod + React Hook Form
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- PostgreSQL database
- UploadThing account (for video uploads)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd kpf
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and fill in your values:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)
- `UPLOADTHING_SECRET`: Get from uploadthing.com
- `UPLOADTHING_APP_ID`: Get from uploadthing.com

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. (Optional) Create an admin user:
```bash
# First, create a regular user through the signup page
# Then, manually update the user's role in the database:
# UPDATE "User" SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
kpf/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── signup/       # User registration
│   │   ├── applications/ # Application submission
│   │   ├── uploadthing/  # File upload handling
│   │   └── admin/        # Admin API endpoints
│   ├── admin/            # Admin portal pages
│   ├── apply/            # Application form page
│   ├── dashboard/        # User dashboard
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── page.tsx          # Landing page
├── components/           # React components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── validations/      # Zod schemas
├── prisma/
│   └── schema.prisma     # Database schema
└── types/                # TypeScript type definitions
```

## Database Schema

### User Model
- id, email, password (hashed), name, phone, role
- Role can be "user" or "admin"

### Application Model
- All 15 form fields from Google Form
- Video URL for intro video
- Status: pending, reviewing, approved, rejected
- Linked to User via userId

## Deployment

### Vercel Deployment

1. Push your code to GitHub

2. Connect your repository to Vercel

3. Set up environment variables in Vercel dashboard

4. Deploy!

### Database Setup

You can use:
- **Vercel Postgres**: Integrated PostgreSQL database
- **Supabase**: Free PostgreSQL with GUI
- **Railway**: Easy PostgreSQL deployment
- **Neon**: Serverless PostgreSQL

### UploadThing Setup

1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Create a new app
3. Copy your API keys to environment variables

## Usage

### For Users

1. **Sign Up**: Create an account with your email and password
2. **Apply**: Fill out the comprehensive application form
3. **Upload Video**: Submit an intro video explaining therapy goals
4. **Track Status**: View application status in your dashboard

### For Admins

1. **Access Admin Portal**: Navigate to `/admin` (admin role required)
2. **View Applications**: See all submissions with filtering options
3. **Review Details**: Click on any application to view full details
4. **Update Status**: Change application status (pending → reviewing → approved/rejected)
5. **Watch Videos**: View applicant intro videos

## Creating an Admin User

After deploying, you'll need to create at least one admin user:

1. Sign up normally through the UI
2. Connect to your database
3. Run this SQL:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Application Deadline

The application deadline is set to **January 25, 2025 at 11:59 PM**. After this date, users cannot submit new applications. You can modify this in:
- [app/api/applications/route.ts](app/api/applications/route.ts)

## Support

For issues or questions, please contact the Keep Pedaling Foundation.

## License

© 2025 Keep Pedaling Foundation. All rights reserved.
