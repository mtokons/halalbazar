# 🚀 Complete FREE Deployment Guide

## 🎯 Stack Overview

- **Frontend** → Firebase Hosting (FREE forever)
- **Backend** → Render.com (FREE tier with 750 hours/month)
- **Database** → MongoDB Atlas (FREE 512MB)

All completely FREE! No credit card required to start.

---

## Part 1: MongoDB Atlas Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"**
3. Sign up with Google or email

### Step 2: Create Free Cluster
1. Choose **"M0 Sandbox"** (FREE tier)
2. Select **AWS** as provider
3. Choose region closest to you
4. Cluster name: `halalbazar`
5. Click **"Create"**

### Step 3: Create Database User
1. Security → Database Access
2. Click **"Add New Database User"**
3. Username: `halalbazar_user`
4. Password: (generate or create strong password - **SAVE THIS**)
5. Database User Privileges: **Read and write to any database**
6. Click **"Add User"**

### Step 4: Whitelist IP Addresses
1. Security → Network Access
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string:
```
mongodb+srv://halalbazar_user:<password>@halalbazar.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
4. Replace `<password>` with your actual password
5. **SAVE THIS CONNECTION STRING** - you'll need it!

---

## Part 2: Render.com Backend Deployment (10 minutes)

### Step 1: Create Render Account
1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with GitHub

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
   - If you haven't pushed to GitHub yet, see instructions below
3. Or use **"Public Git repository"** and paste your repo URL

### Step 3: Configure Service
Fill in these settings:

- **Name**: `halalbazar-backend`
- **Region**: Choose closest to you
- **Branch**: `main` (or `master`)
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: **Free**

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add this variable:
- **Key**: `MONGODB_URI`
- **Value**: (paste your MongoDB connection string from Part 1)

Example:
```
mongodb+srv://halalbazar_user:YourPassword123@halalbazar.xxxxx.mongodb.net/halalbazar?retryWrites=true&w=majority
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Your backend will be live at: `https://halalbazar-backend.onrender.com`

### Step 6: Test Your Backend
Visit: `https://halalbazar-backend.onrender.com/api/health`

You should see:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "Connected"
}
```

---

## Part 3: Firebase Frontend Deployment (5 minutes)

### Step 1: Update Frontend API URL
Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://halalbazar-backend.onrender.com
```

### Step 2: Build Frontend
```powershell
cd frontend
npm run build
cd ..
```

### Step 3: Deploy to Firebase
```powershell
# Make sure you're on Node.js v20
nvm use 20

# Deploy
firebase deploy --only hosting
```

### Step 4: Your App is Live!
- **Frontend**: `https://halalbazar.web.app`
- **API**: `https://halalbazar-backend.onrender.com/api/*`

---

## 📝 If You Don't Have GitHub Repository

### Create and Push to GitHub:
```powershell
# Initialize git
git init
git add .
git commit -m "Initial commit with MongoDB"

# Create repository at: https://github.com/new
# Name it: halalbazar

# Push code
git remote add origin https://github.com/YOUR_USERNAME/halalbazar.git
git branch -M main
git push -u origin main
```

---

## 🎯 Summary of URLs

After deployment, you'll have:

1. **Frontend (Firebase)**: `https://halalbazar.web.app`
2. **Backend (Render)**: `https://halalbazar-backend.onrender.com`
3. **Database (MongoDB Atlas)**: Managed in cloud
4. **API Health Check**: `https://halalbazar-backend.onrender.com/api/health`

---

## ⚡ Important Notes

### Render.com Free Tier:
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Spins down after 15 minutes of inactivity
- ⏱️ First request after inactivity takes ~30 seconds (cold start)
- 💡 Keep it awake with a cron job or monitoring service (optional)

### MongoDB Atlas Free Tier:
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Perfect for small apps
- ✅ No credit card required

### Firebase Hosting Free Tier:
- ✅ 10GB storage
- ✅ 360MB/day transfer
- ✅ Custom domain support
- ✅ SSL certificate included

---

## 🔧 Troubleshooting

### Backend deployment fails on Render:
- Check that `backend/package.json` exists
- Verify `Root Directory` is set to `backend`
- Check build logs in Render dashboard

### Database connection error:
- Verify MongoDB connection string is correct
- Check password has no special characters needing encoding
- Ensure IP whitelist includes 0.0.0.0/0

### Frontend can't connect to backend:
- Verify `REACT_APP_API_URL` in `.env.production`
- Rebuild frontend: `npm run build`
- Redeploy to Firebase

---

## 🎉 You're Done!

Your app is now:
- ✅ Fully deployed
- ✅ Using MongoDB (NoSQL)
- ✅ Hosted on Firebase
- ✅ Backend on Render
- ✅ Completely FREE!

**Total cost: $0/month** 🎊
