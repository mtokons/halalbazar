# 🔥 Full Firebase Deployment Guide

## ✅ What's Been Converted

Your app is now a **100% Firebase application**:

1. **Frontend**: React app → Firebase Hosting
2. **Backend**: Node.js/Express → Firebase Cloud Functions
3. **Database**: MySQL → Firestore (NoSQL)

## 📁 New Project Structure

```
HalalBazar/
├── frontend/              # React app (unchanged)
├── functions/             # NEW: Cloud Functions (backend)
│   ├── index.js          # Express app wrapped in Cloud Function
│   └── package.json      # Functions dependencies
├── firestore.rules       # NEW: Database security rules
├── firestore.indexes.json # NEW: Database indexes
├── firebase.json         # Updated with functions config
└── .firebaserc           # Firebase project settings
```

## 🚀 Deployment Steps

### Step 1: Switch to Node.js v20 (Required)

```powershell
nvm install 20
nvm use 20
```

### Step 2: Install Firebase CLI

```powershell
npm install -g firebase-tools
```

### Step 3: Login to Firebase

```powershell
firebase login
```

### Step 4: Update Firebase Project ID

Open `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` with your actual project ID.

### Step 5: Enable Required Services in Firebase Console

1. Go to https://console.firebase.google.com
2. Select your project
3. Enable these services:
   - **Firestore Database**: 
     - Go to Firestore Database → Create Database
     - Choose "Start in production mode"
     - Select a location (choose closest to your users)
   - **Cloud Functions**: 
     - Go to Functions (it will auto-enable when you deploy)
   - **Hosting**: Already enabled

### Step 6: Install Functions Dependencies

```powershell
cd functions
npm install
cd ..
```

### Step 7: Build React Frontend

```powershell
cd frontend
npm run build
cd ..
```

### Step 8: Deploy Everything to Firebase

```powershell
# Deploy everything at once
firebase deploy

# Or deploy individually:
firebase deploy --only firestore      # Deploy database rules
firebase deploy --only functions      # Deploy backend
firebase deploy --only hosting        # Deploy frontend
```

## 🌐 Your Live URLs

After deployment:

- **Frontend**: `https://YOUR-PROJECT-ID.web.app`
- **Backend API**: `https://YOUR-PROJECT-ID.web.app/api/*`
  - Example: `https://YOUR-PROJECT-ID.web.app/api/orders`
  - Example: `https://YOUR-PROJECT-ID.web.app/api/health`

The backend is accessible through the same domain as the frontend!

## 🧪 Local Development with Firebase Emulator

To test locally before deploying:

```powershell
# Install emulators
firebase init emulators

# Start all emulators
firebase emulators:start

# Frontend will be at: http://localhost:5000
# Functions will be at: http://localhost:5001
# Firestore UI at: http://localhost:4000
```

## 📊 Firestore Database Structure

Your data will be stored in Firestore like this:

```
orders (collection)
  └── {orderId} (document)
      ├── numberOfBiryani: 100
      ├── ingredientCost: 5000
      ├── electricityBill: 500
      ├── labourCost: 2000
      ├── profitMargin: 20
      ├── totalCost: 7500
      ├── costPerBiryani: 75
      ├── sellingPricePerBiryani: 90
      ├── totalSellingPrice: 9000
      ├── profitPerOrder: 1500
      └── createdAt: timestamp
```

## 💰 Firebase Pricing

**Free Tier (Spark Plan):**
- ✅ Hosting: 10 GB storage, 360 MB/day transfer
- ✅ Firestore: 1 GB storage, 50K reads/day, 20K writes/day
- ✅ Cloud Functions: 2M invocations/month, 400K GB-seconds

Your app should stay **FREE** for small to medium usage!

**Blaze Plan (Pay as you go):**
- Only charged when you exceed free tier
- Very affordable for most apps

## 🔧 Troubleshooting

### Functions deployment fails
```powershell
# Remove predeploy lint check temporarily
# Edit firebase.json and remove the predeploy line
```

### "Cannot find module" errors
```powershell
cd functions
npm install
cd ..
```

### Firestore permission denied
- Check that Firestore is enabled in Firebase Console
- Verify `firestore.rules` is deployed

### CORS errors
- Cloud Functions automatically handle CORS
- Make sure you're using the same domain for frontend and API

## 📝 Useful Commands

```powershell
# View logs
firebase functions:log

# Delete a function
firebase functions:delete api

# View Firestore data
firebase firestore:delete --all-collections  # ⚠️ Danger!

# List projects
firebase projects:list

# Switch project
firebase use YOUR-PROJECT-ID
```

## 🎯 Differences from MySQL Version

### Data Storage:
- **Before**: MySQL tables with rows
- **After**: Firestore collections with documents

### Queries:
- **Before**: SQL queries
- **After**: Firestore queries (similar to MongoDB)

### Timestamps:
- **Before**: `created_at` MySQL timestamp
- **After**: Firestore ServerTimestamp

### IDs:
- **Before**: Auto-increment integers (1, 2, 3...)
- **After**: Random strings (abc123def456...)

## 🚀 Deploy Now!

Run this single command to deploy everything:

```powershell
firebase deploy
```

That's it! Your full-stack app is now live on Firebase! 🎉

## 📈 Monitoring

- **Functions**: https://console.firebase.google.com → Functions
- **Firestore**: https://console.firebase.google.com → Firestore Database
- **Hosting**: https://console.firebase.google.com → Hosting
- **Usage & Billing**: https://console.firebase.google.com → Usage
