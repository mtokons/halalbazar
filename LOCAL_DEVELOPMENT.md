# 🛠️ Local Development Guide

## ✅ Setup Complete!

Your development environment is configured and running!

### 🚀 What's Running:

1. **Backend Server** (MongoDB)
   - 📍 URL: http://localhost:5000
   - 🍃 Database: MongoDB Atlas (Cloud)
   - 📊 Health Check: http://localhost:5000/api/health

2. **Frontend React App**
   - 📍 URL: http://localhost:3000
   - ⚛️ Framework: React
   - 🔗 Connected to: http://localhost:5000

---

## 📝 Manual Start Commands

If you need to start the servers manually:

### Start Backend:
```powershell
cd backend
node server-mongodb.js
```

### Start Frontend (in a new terminal):
```powershell
cd frontend
npm start
```

---

## 🔧 Configuration Files

### Local Development:
- `frontend/.env.local` → Points to `http://localhost:5000`
- `backend/.env` → Contains MongoDB connection string

### Production:
- `frontend/.env.production` → Points to `https://halalbazar.onrender.com`

---

## 💻 Development Workflow

### 1. Make Changes
- **Frontend**: Edit files in `frontend/src/`
- **Backend**: Edit files in `backend/`

### 2. See Changes Live
- **Frontend**: Auto-reloads on save
- **Backend**: Restart server (Ctrl+C, then `node server-mongodb.js`)

### 3. Test Locally
- Open http://localhost:3000
- Test all features

### 4. Deploy to Production
```powershell
# Build frontend
cd frontend
npm run build
cd ..

# Deploy to Firebase
firebase deploy --only hosting
```

Backend updates automatically deploy from GitHub to Render.com!

---

## 📁 Project Structure

```
HalalBazar/
├── backend/
│   ├── server-mongodb.js    # Main server (MongoDB)
│   ├── server-local.js      # Local dev (in-memory)
│   ├── package.json
│   └── .env                 # MongoDB connection
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js           # Main app
│   │   └── config.js        # API configuration
│   ├── .env.local           # Local API URL
│   ├── .env.production      # Production API URL
│   └── package.json
│
├── firebase.json
└── .firebaserc
```

---

## 🐛 Debugging

### Backend Not Working?
```powershell
# Check if backend is running
curl http://localhost:5000/api/health

# Check backend logs in the PowerShell window
```

### Frontend Can't Connect?
1. Check `frontend/.env.local` exists
2. Restart frontend: Ctrl+C, then `npm start`
3. Clear browser cache

### Database Issues?
1. Check MongoDB connection string in `backend/.env`
2. Verify MongoDB Atlas is accessible
3. Check IP whitelist (should be 0.0.0.0/0)

---

## 🔄 Common Commands

### Install New Package:
```powershell
# Backend
cd backend
npm install package-name

# Frontend
cd frontend
npm install package-name
```

### Update Dependencies:
```powershell
npm update
```

### Run Tests:
```powershell
cd frontend
npm test
```

---

## 🚀 Deploy Changes

### Frontend Only:
```powershell
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

### Backend Changes:
Just push to GitHub:
```powershell
git add .
git commit -m "Your changes"
git push
```
Render.com auto-deploys from GitHub!

---

## 📊 Environment Variables

### Backend (.env):
```
PORT=5000
MONGODB_URI=mongodb+srv://...
```

### Frontend (.env.local):
```
REACT_APP_API_URL=http://localhost:5000
```

### Frontend (.env.production):
```
REACT_APP_API_URL=https://halalbazar.onrender.com
```

---

## 🎯 Quick Tips

1. **Keep backend running** while developing frontend
2. **Frontend auto-reloads** on file save
3. **Backend needs manual restart** after changes
4. **Use browser DevTools** (F12) to debug
5. **Check Network tab** for API calls
6. **Console tab** shows errors

---

## 🌐 URLs Summary

### Local Development:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:5000/api/*

### Production:
- Frontend: https://halalbazar.web.app
- Backend: https://halalbazar.onrender.com
- API: https://halalbazar.onrender.com/api/*

---

## 🎉 You're Ready to Develop!

Both servers should be running in separate PowerShell windows.
Open http://localhost:3000 to start developing! 🚀
