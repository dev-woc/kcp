# Keep Pedaling Foundation - Cycle of Support Application

## 🎯 Project Overview

A complete Next.js web application for managing therapy program applications for the Keep Pedaling Foundation's "Cycle of Support" initiative. The program offers free therapy for one month to three selected individuals.

**Deadline**: January 25th, 2025 at 11:59 PM

## ✨ Features Implemented

### User Features
- ✅ User registration and secure authentication
- ✅ Comprehensive 15-field application form
- ✅ Video upload for introduction message (32MB max)
- ✅ Therapist selection:
  - Option to choose own therapist
  - Option to get help from foundation network
- ✅ Personal dashboard to track application status
- ✅ Automatic deadline enforcement

### Admin Features
- ✅ Admin portal with full application management
- ✅ View all applications with filtering (by status)
- ✅ Detailed application view with all fields
- ✅ Status management (pending → reviewing → approved/rejected)
- ✅ Statistics dashboard (total, pending, reviewing, approved, rejected)
- ✅ Watch applicant intro videos
- ✅ View therapist preferences

## 📋 Application Form Fields

1. **Personal Information**
   - Full Name
   - Email
   - Phone Number
   - Date of Birth
   - City/State

2. **Therapy Background**
   - Previous therapy experience (Yes/No)
   - Active health insurance (Yes/No)
   - Current challenges (multi-select):
     - Anxiety or Stress
     - Depression or Sadness
     - Relationship Challenges
     - Grief or Loss
     - Career or Educational Concerns
     - Other

3. **Mental Health & Goals**
   - Mental/emotional health description
   - Reason for starting therapy
   - Therapy goals
   - Barriers to therapy

4. **Logistics**
   - Weekly session availability (Yes/No)
   - Device access for virtual sessions (Yes/No)
   - Testimonial willingness (Yes/No)

5. **Therapist Preference** ⭐ NEW
   - Choose own therapist
   - Get help from foundation network
   - Preferred therapist name (if applicable)
   - Therapist contact info (if applicable)

6. **Introduction Video** (Optional)
   - Upload video explaining therapy goals

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js v5 |
| Styling | Tailwind CSS |
| File Upload | UploadThing |
| Form Validation | Zod + React Hook Form |
| Deployment | Vercel |

## 📁 Project Structure

```
kpf/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth endpoints
│   │   ├── signup/                  # User registration
│   │   ├── applications/            # Application CRUD
│   │   ├── admin/applications/      # Admin endpoints
│   │   └── uploadthing/             # Video uploads
│   ├── admin/                       # Admin portal
│   │   ├── page.tsx                 # Application list
│   │   └── applications/[id]/       # Application details
│   ├── apply/                       # Application form
│   ├── dashboard/                   # User dashboard
│   ├── login/                       # Login page
│   ├── signup/                      # Signup page
│   └── page.tsx                     # Landing page
├── components/
│   └── providers.tsx                # Session provider
├── lib/
│   ├── auth.ts                      # NextAuth config
│   ├── prisma.ts                    # Prisma client
│   ├── uploadthing.ts               # UploadThing config
│   └── validations/
│       └── application.ts           # Zod schemas
├── prisma/
│   └── schema.prisma                # Database schema
├── types/
│   └── next-auth.d.ts              # NextAuth types
├── middleware.ts                    # Route protection
├── SETUP.md                         # Setup guide
├── DEPLOYMENT.md                    # Deployment guide
└── README.md                        # Documentation
```

## 🗄️ Database Schema

### User Model
- id, email, password (hashed)
- name, phone
- role (user/admin)
- timestamps

### Application Model
- All 15 form fields
- therapistPreference, preferredTherapistName, preferredTherapistContact
- introVideoUrl
- status (pending/reviewing/approved/rejected)
- userId (relation to User)
- timestamps

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Initialize database
npx prisma generate
npx prisma db push

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

**Quick deploy to Vercel:**
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## 🔐 Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your app URL
- `UPLOADTHING_SECRET` - From uploadthing.com
- `UPLOADTHING_APP_ID` - From uploadthing.com

## 📊 User Flow

### Applicant Flow
1. Visit landing page → Learn about program
2. Sign up → Create account
3. Login → Access application
4. Apply → Fill 15-field form + upload video
5. Dashboard → Track application status

### Admin Flow
1. Login as admin
2. View applications → Filter by status
3. Review details → Read full application
4. Watch video → See intro message
5. Update status → Approve/reject

## 🎨 Customization

### Colors & Branding
- Edit `tailwind.config.ts` for color scheme
- Update `app/globals.css` for global styles
- Modify components for custom branding

### Form Fields
- Edit `lib/validations/application.ts` for validation
- Update `prisma/schema.prisma` for database
- Modify `app/apply/page.tsx` for form UI

### Deadline
- Update `app/api/applications/route.ts` line 25

## 📝 Pages

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Landing page | Public |
| `/signup` | User registration | Public |
| `/login` | User login | Public |
| `/apply` | Application form | Authenticated |
| `/dashboard` | User dashboard | Authenticated |
| `/admin` | Admin portal | Admin only |
| `/admin/applications/[id]` | Application details | Admin only |

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based sessions
- ✅ Protected routes with middleware
- ✅ Role-based access control (admin/user)
- ✅ Input validation with Zod
- ✅ CSRF protection
- ✅ Environment variable protection

## 🎯 Next Steps

1. Deploy to production
2. Set up custom domain
3. Create admin account
4. Test all flows
5. Monitor applications
6. Review and approve applicants

## 📞 Support

For setup help, see:
- [SETUP.md](SETUP.md) - Local development
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [README.md](README.md) - Full documentation

---

**Built with ❤️ for Keep Pedaling Foundation**

© 2025 Keep Pedaling Foundation. All rights reserved.
