# 🚀 Deploy to Vercel NOW

## Quick Deploy Steps

### 1. Push to GitHub

```bash
# Create a new repo on GitHub (https://github.com/new)
# Name it: kpf or keep-pedaling-foundation
# DO NOT initialize with README

# Then run these commands:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repo
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. **Add Environment Variables** (click "Environment Variables" section):

```env
# Database (your existing Render database)
DATABASE_URL=postgresql://kcp_user:21HO7uaTXF6RMbldcULvdoshFaSbg3Qj@dpg-d3g5ktj3fgac738nfl30-a.oregon-postgres.render.com/kcp?sslmode=require

# NextAuth Secret (already generated)
NEXTAUTH_SECRET=+j8KGk9K0xjzRU7TrDQImncur/R8SAvsqeQPBbOEpks=

# NextAuth URL (update after deployment - see step 3)
NEXTAUTH_URL=https://your-app-name.vercel.app

# UploadThing (get from uploadthing.com)
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here
```

6. Click **Deploy**

### 3. After First Deployment

1. **Copy your Vercel URL** (e.g., `https://kpf-abc123.vercel.app`)

2. **Update NEXTAUTH_URL**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Find `NEXTAUTH_URL`
   - Update it to your actual Vercel URL
   - Example: `https://kpf-abc123.vercel.app`

3. **Redeploy**:
   - Go to Deployments tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

### 4. Get UploadThing Credentials (REQUIRED for video uploads)

1. Go to https://uploadthing.com
2. Sign up for free account
3. Create a new app
4. Copy your credentials:
   - `UPLOADTHING_SECRET`
   - `UPLOADTHING_APP_ID`
5. Add them to Vercel:
   - Settings → Environment Variables
   - Add both variables
   - Redeploy

### 5. Create Admin User

**Option A: Using your local database connection**
```bash
# In your terminal
npx prisma studio

# This opens http://localhost:5555
# 1. Sign up on your production site first
# 2. In Prisma Studio, click "User" table
# 3. Find your user, click Edit
# 4. Change role from "user" to "admin"
# 5. Save
```

**Option B: Using Vercel Postgres dashboard** (if using Vercel Postgres)
- Go to your database dashboard
- Run SQL query:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your-email@example.com';
```

## ⚡ Troubleshooting

### Build Fails on Vercel

**Error: "Can't reach database"**
- Double-check your `DATABASE_URL` in Vercel environment variables
- Make sure it includes `?sslmode=require` at the end

**Error: "NEXTAUTH_URL not set"**
- Make sure `NEXTAUTH_URL` is set to your Vercel URL (not localhost)

**Error: Tailwind/PostCSS issues**
- Already fixed in the latest commit!
- Make sure you pushed the latest code

### Video Upload Not Working

- Check that `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` are set in Vercel
- Verify credentials are correct from uploadthing.com dashboard
- Redeploy after adding the variables

### Can't Access Admin Portal

- Make sure you changed your user role to "admin" in the database
- Clear browser cache and try again
- Check you're logged in with the admin account

## 🎯 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] `NEXTAUTH_URL` updated with Vercel URL
- [ ] Redeployed after updating NEXTAUTH_URL
- [ ] UploadThing credentials added
- [ ] Tested signup/login on production
- [ ] Created admin user
- [ ] Tested admin portal access
- [ ] Tested application submission
- [ ] Video upload working

## 📱 After Deployment

### Add to Instagram

Your production URL will be something like:
`https://kpf-abc123.vercel.app` or `https://your-custom-domain.com`

Add this to:
- Instagram bio link
- Link tree
- Instagram stories
- Posts about the program

### Monitor Applications

- Admin portal: `https://your-url.vercel.app/admin`
- Check applications regularly
- Update status as you review

## 🔧 Custom Domain (Optional)

1. Go to Vercel → Settings → Domains
2. Add your custom domain (e.g., `apply.keeppedalingfoundation.org`)
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to custom domain
5. Redeploy

---

**Your app is ready to deploy! Just follow the steps above. 🚀**

Need help? Check:
- SETUP.md for local issues
- DEPLOYMENT.md for detailed deployment guide
- NEXT_STEPS.md for complete setup guide
