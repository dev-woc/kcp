# Deployment Guide

## Quick Deployment to Vercel

### 1. Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- PostgreSQL database (Vercel Postgres recommended)
- UploadThing account (uploadthing.com)

### 2. Database Setup

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the `DATABASE_URL` connection string
4. The connection string will be automatically added to your environment variables

#### Option B: Supabase (Free Alternative)
1. Sign up at supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Transaction mode)
5. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

### 3. UploadThing Setup
1. Go to uploadthing.com and sign up
2. Create a new app
3. Copy your `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`

### 4. Deploy to Vercel

#### Step 1: Push to GitHub
```bash
# If not already done
git remote add origin https://github.com/yourusername/kpf.git
git branch -M main
git push -u origin main
```

#### Step 2: Import to Vercel
1. Go to vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

#### Step 3: Add Environment Variables
Add these in Vercel → Settings → Environment Variables:

```
DATABASE_URL=your_postgres_connection_string
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://your-app.vercel.app
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

To generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

#### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete

### 5. Initialize Database

After deployment, you need to set up the database schema:

#### Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run Prisma commands
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

#### Manual Method
1. Install Prisma CLI locally: `npm install -g prisma`
2. Set your `DATABASE_URL` in `.env`
3. Run: `npx prisma db push`

### 6. Create Admin User

After deployment:

1. Visit your deployed app
2. Sign up with your admin email
3. Connect to your database using a database client (e.g., TablePlus, pgAdmin)
4. Run this SQL:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

Or use Prisma Studio:
```bash
npx prisma studio
# Find your user and change role to "admin"
```

### 7. Verify Deployment

Test these URLs:
- `https://your-app.vercel.app/` - Landing page
- `https://your-app.vercel.app/signup` - User signup
- `https://your-app.vercel.app/login` - Login
- `https://your-app.vercel.app/admin` - Admin portal (after creating admin)

## Custom Domain Setup

1. Go to Vercel → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## Troubleshooting

### Build Errors

**"Module not found"**
- Run `npm install` locally
- Commit `package-lock.json`

**"Prisma Client not generated"**
- Add to `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Database Issues

**"Can't reach database server"**
- Check `DATABASE_URL` format
- Ensure database is accessible from Vercel
- For Supabase: Use connection pooling URL

**"Table does not exist"**
- Run `npx prisma db push` to create tables

### Authentication Issues

**"NEXTAUTH_URL missing"**
- Ensure `NEXTAUTH_URL` is set in environment variables
- Should be your full app URL (e.g., `https://your-app.vercel.app`)

### Upload Issues

**"UploadThing error"**
- Verify `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` are correct
- Check UploadThing dashboard for API limits

## Environment Variables Checklist

Before deployment, ensure you have:
- [x] `DATABASE_URL` - PostgreSQL connection string
- [x] `NEXTAUTH_SECRET` - Generated secret (32+ characters)
- [x] `NEXTAUTH_URL` - Your app URL
- [x] `UPLOADTHING_SECRET` - From uploadthing.com
- [x] `UPLOADTHING_APP_ID` - From uploadthing.com

## Post-Deployment

1. Test user signup and login
2. Create admin user
3. Test application submission
4. Test admin portal
5. Test video upload
6. Set up monitoring (Vercel Analytics)
7. Configure email notifications (optional)

## Monitoring

Vercel provides built-in monitoring:
- Analytics: Track page views and performance
- Logs: View runtime logs
- Deployments: Track deployment history

## Backup Strategy

1. Database backups:
   - Vercel Postgres: Automatic backups
   - Supabase: Automatic daily backups

2. Code backups:
   - Stored in GitHub
   - Vercel deployment history

## Support

For deployment issues:
- Vercel: vercel.com/support
- Prisma: prisma.io/docs
- UploadThing: docs.uploadthing.com
