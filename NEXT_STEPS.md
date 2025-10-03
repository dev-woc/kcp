# Next Steps - Keep Pedaling Foundation App

## ✅ What's Already Done

- ✅ Complete Next.js application built
- ✅ Database schema created and pushed to PostgreSQL
- ✅ Authentication system configured (NextAuth)
- ✅ Application form with 15 fields + video upload + therapist preference
- ✅ User dashboard
- ✅ Admin portal
- ✅ Git repository initialized
- ✅ All documentation created

## 🚀 What You Need To Do Next

### 1. Set Up UploadThing (for video uploads)

**This is REQUIRED for video uploads to work!**

1. Go to https://uploadthing.com
2. Sign up for a free account
3. Create a new app
4. Copy your credentials:
   - `UPLOADTHING_SECRET`
   - `UPLOADTHING_APP_ID`
5. Update your `.env` file with these values

**Without UploadThing, video uploads won't work, but the rest of the app will function normally.**

### 2. Test Locally

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

**Test the full flow:**
1. Go to `/signup` and create an account
2. Login at `/login`
3. Go to `/apply` and fill out the form
4. Submit your application
5. Check your dashboard at `/dashboard`

### 3. Create Your First Admin User

Since you can't access the admin portal without an admin account, you need to create one:

**Option A: Using Prisma Studio (Easiest)**
```bash
# Open Prisma Studio
npx prisma studio

# This will open http://localhost:5555
# 1. Click on "User" table
# 2. Find your user (the one you just created)
# 3. Click "Edit" on your user
# 4. Change "role" from "user" to "admin"
# 5. Click "Save"
```

**Option B: Using Direct SQL**
If you have access to your database directly:
```sql
UPDATE "User"
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

**Then:**
- Go to http://localhost:3000/admin
- You should now see the admin portal!

### 4. Deploy to Vercel

**Prerequisites:**
- GitHub account
- Vercel account (free)
- Your UploadThing credentials ready

**Steps:**

1. **Push to GitHub:**
```bash
# Create a new repository on GitHub (don't initialize with README)
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     ```
     DATABASE_URL=postgresql://kcp_user:21HO7uaTXF6RMbldcULvdoshFaSbg3Qj@dpg-d3g5ktj3fgac738nfl30-a.oregon-postgres.render.com/kcp?sslmode=require

     NEXTAUTH_SECRET=+j8KGk9K0xjzRU7TrDQImncur/R8SAvsqeQPBbOEpks=

     NEXTAUTH_URL=https://your-app-name.vercel.app
     (Update this after deployment with your actual Vercel URL)

     UPLOADTHING_SECRET=your_uploadthing_secret_here
     UPLOADTHING_APP_ID=your_uploadthing_app_id_here
     ```
   - Click "Deploy"

3. **After Deployment:**
   - Note your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Go to Vercel Settings → Environment Variables
   - Update `NEXTAUTH_URL` to your actual Vercel URL
   - Redeploy

4. **Create Admin User in Production:**
   - Sign up on your production site
   - Use Prisma Studio with production database:
     ```bash
     # In your .env, temporarily set DATABASE_URL to production
     npx prisma studio
     # Change your user role to "admin"
     # Change .env back to local database
     ```

### 5. Customize (Optional)

**Branding & Colors:**
- Edit `app/page.tsx` for landing page content
- Edit `tailwind.config.ts` to change color scheme
- Update `app/layout.tsx` metadata for SEO

**Form Fields:**
- The form matches the Google Form you provided
- If you need to change fields, edit:
  - `lib/validations/application.ts` (validation)
  - `prisma/schema.prisma` (database)
  - `app/apply/page.tsx` (UI)

**Deadline:**
- Current deadline: January 25, 2025, 11:59 PM
- To change: Edit `app/api/applications/route.ts` (line ~25)

### 6. Instagram Integration (Optional)

You mentioned this is for the Instagram page @keeppedalingfoundation. You can:
- Add the application link to your Instagram bio
- Create Instagram stories/posts promoting the program
- Use the landing page URL in your link tree

## 📋 Quick Reference

### Important URLs (Local)
- Landing Page: http://localhost:3000
- Signup: http://localhost:3000/signup
- Login: http://localhost:3000/login
- Apply: http://localhost:3000/apply
- Dashboard: http://localhost:3000/dashboard
- Admin Portal: http://localhost:3000/admin

### Environment Variables
```bash
# Database (already configured)
DATABASE_URL=postgresql://kcp_user:...

# Auth (already configured)
NEXTAUTH_SECRET=+j8KGk9K0xjz...
NEXTAUTH_URL=http://localhost:3000

# You need to add these:
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

### Common Commands
```bash
# Start development server
npm run dev

# Open database viewer
npx prisma studio

# Push database changes
npx prisma db push

# Generate Prisma client
npx prisma generate

# Build for production
npm run build

# Start production server
npm start
```

## ⚠️ Important Notes

1. **Video Upload Requirement**: Without UploadThing credentials, the video upload feature won't work. Get these first!

2. **Database**: Your database is already set up and connected. The schema has been pushed successfully.

3. **Security**: The `.env` file should NEVER be committed to Git. It's already in `.gitignore`.

4. **Admin Access**: You MUST manually change a user's role to "admin" in the database. There's no signup page for admins (for security reasons).

5. **Application Deadline**: The app will automatically prevent submissions after January 25, 2025, 11:59 PM.

## 📞 Need Help?

- **Setup Issues**: See SETUP.md
- **Deployment Issues**: See DEPLOYMENT.md
- **General Info**: See README.md
- **Project Overview**: See PROJECT_SUMMARY.md

## 🎯 Success Checklist

- [ ] UploadThing account created and credentials added to `.env`
- [ ] Tested signup/login locally
- [ ] Tested application submission locally
- [ ] Created admin user locally
- [ ] Tested admin portal locally
- [ ] Pushed code to GitHub
- [ ] Deployed to Vercel
- [ ] Updated `NEXTAUTH_URL` in Vercel
- [ ] Created admin user in production
- [ ] Tested full flow in production
- [ ] Updated Instagram bio with application link

---

**You're almost done! Just complete the steps above and your application will be live! 🚀**
