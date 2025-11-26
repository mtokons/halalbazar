# Firebase Deployment Guide for Halal Bazar

## Current Issue
Firebase CLI has compatibility issues with Node.js v25.2.0. We need to use Node.js v20 LTS or v22 for Firebase deployment.

## Solution: Use Node Version Manager (nvm)

### Option 1: Install and Use Node.js v20 LTS

1. **Install nvm for Windows** (if not already installed):
   - Download from: https://github.com/coreybutler/nvm-windows/releases
   - Install `nvm-setup.exe`

2. **Install Node.js v20 LTS**:
   ```powershell
   nvm install 20
   nvm use 20
   node --version  # Should show v20.x.x
   ```

3. **Install Firebase CLI**:
   ```powershell
   npm install -g firebase-tools
   ```

4. **Login to Firebase**:
   ```powershell
   cd "c:\Users\md.hasnain\OneDrive - mtokons\HalalBazar"
   firebase login
   ```
   - This will open a browser window
   - Login with your Google account
   - Authorize Firebase CLI

5. **Update Firebase Project ID**:
   - Open `.firebaserc` file
   - Replace `YOUR_FIREBASE_PROJECT_ID` with your actual Firebase project ID
   - You can find this in Firebase Console -> Project Settings

6. **Deploy to Firebase**:
   ```powershell
   firebase deploy
   ```

### Option 2: Manual Deployment via Firebase Console

If you can't use Firebase CLI:

1. **Go to Firebase Console**: https://console.firebase.google.com
2. Select your project
3. Go to **Hosting** in the left sidebar
4. Click **Get Started** (if first time)
5. Click **Deploy** button
6. Choose **Drag and drop** method
7. Drag the entire `frontend/build` folder to the upload area
8. Wait for upload to complete
9. Your site will be live at: `https://YOUR-PROJECT-ID.web.app`

### Option 3: Use Firebase GitHub Actions (Automated)

Create `.github/workflows/firebase-hosting.yml`:
```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install frontend dependencies
        run: cd frontend && npm ci
      - name: Build frontend
        run: cd frontend && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: YOUR_FIREBASE_PROJECT_ID
```

## Current Status

✅ **Completed:**
- React app built successfully
- Production build created in `frontend/build` directory
- Firebase configuration files created (`firebase.json`, `.firebaserc`)
- API configuration updated to support environment variables

📝 **Build Location:**
- `frontend/build` - Ready to deploy

## Backend Deployment Note

⚠️ **Important:** Firebase Hosting only hosts static files (your React frontend). Your Node.js backend needs to be deployed separately.

### Backend Deployment Options:

1. **Heroku** (Recommended for beginners)
2. **Google Cloud Run** (Integrates well with Firebase)
3. **AWS EC2**
4. **DigitalOcean**
5. **Railway.app**
6. **Render.com**

### After Backend Deployment:

1. Create `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

2. Rebuild frontend:
   ```powershell
   cd frontend
   npm run build
   ```

3. Redeploy to Firebase

## Quick Commands Reference

```powershell
# Switch to Node.js v20
nvm use 20

# Login to Firebase
firebase login

# Deploy
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# View your deployed site
firebase open hosting:site
```

## Troubleshooting

### Error: "Cannot read properties of undefined"
- You're using Node.js v25
- Solution: Switch to Node.js v20 with `nvm use 20`

### Error: "Firebase project not found"
- Update `.firebaserc` with correct project ID
- Run `firebase use --add` to select project

### Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm run build` again

## Next Steps

1. ✅ Build completed - `frontend/build` is ready
2. ⏳ Switch to Node.js v20 using nvm
3. ⏳ Login to Firebase
4. ⏳ Update `.firebaserc` with your project ID
5. ⏳ Deploy: `firebase deploy`
6. ⏳ Deploy backend separately
7. ⏳ Update API URL in production build
