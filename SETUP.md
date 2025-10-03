# Quick Setup Guide

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and update the following:

#### Database URL
For local development with PostgreSQL:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/kpf_dev"
```

Or use a cloud database:
- **Supabase** (Free): https://supabase.com
- **Neon** (Free): https://neon.tech
- **Railway** (Paid): https://railway.app

#### NextAuth Secret
Generate a secure secret:
```bash
openssl rand -base64 32
```
Copy the output to `NEXTAUTH_SECRET` in `.env`

#### UploadThing (for video uploads)
1. Sign up at https://uploadthing.com
2. Create a new app
3. Copy `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` to `.env`

### 3. Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# (Optional) Open Prisma Studio to view/edit database
npx prisma studio
```

### 4. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

### 5. Create Admin User

1. Go to http://localhost:3000/signup
2. Create an account with your email
3. Connect to your database using Prisma Studio:
   ```bash
   npx prisma studio
   ```
4. Find your user in the `User` table
5. Change `role` from `"user"` to `"admin"`
6. Save and refresh the page
7. Access admin portal at http://localhost:3000/admin

## Database Options

### Option 1: Local PostgreSQL (Mac)
```bash
# Install PostgreSQL using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb kpf_dev

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://postgres@localhost:5432/kpf_dev"
```

### Option 2: Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name kpf-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=kpf_dev \
  -p 5432:5432 \
  -d postgres:15

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kpf_dev"
```

### Option 3: Supabase (Free Cloud)
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Transaction mode)
5. Update `DATABASE_URL` in `.env`

## Common Issues

### "Can't reach database server"
- Make sure PostgreSQL is running
- Check that DATABASE_URL is correct
- For cloud databases, check your internet connection

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Prisma Client not generated"
```bash
npx prisma generate
```

### Video upload not working
- Check that UploadThing credentials are correct in `.env`
- Verify you're signed up at uploadthing.com
- Check the UploadThing dashboard for errors

## Testing the Application

### Test User Flow:
1. ✅ Sign up at `/signup`
2. ✅ Login at `/login`
3. ✅ Go to `/apply` and fill out the form
4. ✅ Upload an intro video (optional)
5. ✅ Submit the application
6. ✅ View dashboard at `/dashboard`

### Test Admin Flow:
1. ✅ Create admin user (see step 5 above)
2. ✅ Go to `/admin`
3. ✅ View all applications
4. ✅ Filter by status
5. ✅ Click on an application to view details
6. ✅ Update application status
7. ✅ View applicant intro videos

## Application Features

### For Applicants:
- ✅ User registration and authentication
- ✅ 15-field comprehensive application form
- ✅ Video upload for intro message
- ✅ Therapist preference (choose own or foundation help)
- ✅ Dashboard to track application status
- ✅ Deadline enforcement (Jan 25, 2025)

### For Admins:
- ✅ View all applications
- ✅ Filter by status (pending/reviewing/approved/rejected)
- ✅ View detailed application information
- ✅ Update application status
- ✅ View applicant videos
- ✅ See therapist preferences
- ✅ Statistics dashboard

## Project Structure
```
kpf/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth
│   │   ├── signup/        # User registration
│   │   ├── applications/  # Application endpoints
│   │   ├── admin/         # Admin endpoints
│   │   └── uploadthing/   # File uploads
│   ├── admin/             # Admin portal
│   ├── apply/             # Application form
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utilities
├── prisma/               # Database schema
│   └── schema.prisma
└── types/                # TypeScript types
```

## Next Steps

1. ✅ Complete local setup
2. ✅ Test all features
3. ⬜ Customize branding/colors (in `tailwind.config.ts` and components)
4. ⬜ Add custom domain
5. ⬜ Deploy to Vercel (see DEPLOYMENT.md)
6. ⬜ Set up production database
7. ⬜ Create admin account in production
8. ⬜ Test production deployment

## Need Help?

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://prisma.io/docs
- **NextAuth**: https://next-auth.js.org
- **Tailwind CSS**: https://tailwindcss.com/docs
- **UploadThing**: https://docs.uploadthing.com

## Support

For issues specific to this application, check:
1. This setup guide
2. DEPLOYMENT.md for deployment issues
3. README.md for overview
