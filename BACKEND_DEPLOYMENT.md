# Backend Deployment Guide

Since Firebase Hosting only supports static files, you need to deploy your backend separately.

## Recommended: Deploy Backend to Render.com (Free Tier Available)

### Step 1: Prepare Backend for Deployment

1. The backend code is already ready in the `backend` folder
2. Make sure `backend/package.json` has start script (✅ already configured)

### Step 2: Create Account on Render.com

1. Go to https://render.com
2. Sign up with GitHub or email
3. Verify your email

### Step 3: Deploy Backend

1. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or use manual deploy)

2. **Configure Service**:
   - **Name**: halalbazar-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

3. **Add Environment Variables**:
   Go to "Environment" tab and add:
   ```
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=halalbazar_db
   PORT=5000
   ```

4. Click **Create Web Service**

### Step 4: Setup MySQL Database

**Option A: Use Render.com PostgreSQL (Free)**
- Note: Would require changing from MySQL to PostgreSQL

**Option B: Use Railway.app MySQL (Recommended)**
1. Go to https://railway.app
2. Create new project → Add MySQL
3. Copy connection details
4. Update environment variables in Render.com

**Option C: Use PlanetScale (Free MySQL)**
1. Go to https://planetscale.com
2. Create free database
3. Get connection string
4. Update environment variables

### Step 5: Update Frontend with Backend URL

1. Get your Render backend URL (e.g., `https://halalbazar-backend.onrender.com`)

2. Create `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

3. Rebuild frontend:
   ```powershell
   cd frontend
   npm run build
   cd ..
   ```

4. Redeploy to Firebase:
   ```powershell
   firebase deploy
   ```

## Alternative: Deploy to Railway.app (Easier with Database)

Railway.app provides both backend hosting and MySQL database:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Add MySQL database from "New" button
6. Configure environment variables
7. Deploy!

Railway gives you both backend and database in one place.

## Alternative: Deploy to Google Cloud Run (Best with Firebase)

Since you're using Firebase, Google Cloud Run integrates perfectly:

1. Enable Google Cloud Run in your Firebase project
2. Containerize your backend (create Dockerfile)
3. Deploy with: `gcloud run deploy`

## Quick Backend Deploy to Railway.app

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Add MySQL
railway add

# Deploy
railway up
```

## After Backend Deployment

1. Test backend API: `https://your-backend-url.com/api/health`
2. Update frontend environment variable
3. Rebuild and redeploy frontend
4. Test full application

## Database Migration

Don't forget to run your database schema on the production database:

```sql
-- Copy contents of backend/database.sql and run on production DB
```
