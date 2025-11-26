# Halal Bazar - Biryani Cost Calculator

A full-stack web application for calculating biryani order costs, selling prices, and profit margins.

## 🔥 **Full Firebase Stack**
- **Frontend**: React → Firebase Hosting
- **Backend**: Node.js/Express → Firebase Cloud Functions
- **Database**: Firestore (NoSQL)

## Features

- 📝 Input order details (number of biryani packets, costs, profit margin)
- 🧮 Automatic calculation of:
  - Total cost
  - Cost per biryani packet
  - Selling price per packet
  - Total selling price
  - Profit/loss per order
- 📊 Real-time results display
- 📜 Order history with all past calculations
- 🗑️ Delete orders from history
- 💾 Persistent storage in MySQL database

## Tech Stack

### Frontend
- React 18
- Axios for API calls
- CSS3 with responsive design
- Firebase Hosting

### Backend
- Firebase Cloud Functions
- Node.js & Express.js
- CORS

### Database
- Cloud Firestore (NoSQL)

## Prerequisites

Before deploying this application, make sure you have:

- Node.js v20 or v22 (required for Firebase)
- Firebase account (free tier available)
- npm package manager
- Firebase CLI (`npm install -g firebase-tools`)

## Quick Deployment (5 minutes)

### 1. Switch to Node.js v20

```powershell
nvm install 20
nvm use 20
```

### 2. Update Firebase Project ID

Edit `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` with your Firebase project ID.

### 3. Enable Firestore in Firebase Console

1. Go to https://console.firebase.google.com
2. Select your project
3. Go to "Firestore Database" → "Create Database"
4. Choose "Start in production mode"
5. Select your location

### 4. Run Deployment Script

```powershell
.\deploy-firebase.ps1
```

That's it! Your app will be live at `https://YOUR-PROJECT-ID.web.app`

## Manual Deployment Steps

### 1. Install Firebase CLI

```powershell
npm install -g firebase-tools
firebase login
```

### 2. Install Dependencies

```powershell
# Functions dependencies
cd functions
npm install
cd ..

# Frontend dependencies (if not already installed)
cd frontend
npm install
cd ..
```

### 3. Build Frontend

```powershell
cd frontend
npm run build
cd ..
```

### 4. Deploy to Firebase

```powershell
# Deploy everything
firebase deploy

# Or deploy individually
firebase deploy --only firestore  # Database rules
firebase deploy --only functions  # Backend API
firebase deploy --only hosting    # Frontend
```

## Local Development with Emulator

```powershell
# Start Firebase emulators
firebase emulators:start

# Your app will be available at:
# - Frontend: http://localhost:5000
# - Functions: http://localhost:5001
# - Firestore UI: http://localhost:4000
```

## Usage

1. **Create a New Calculation**:
   - Enter the number of biryani packets
   - Input ingredient costs
   - Enter electricity bill amount
   - Input labour costs
   - Set desired profit margin (%)
   - Click "Calculate" button

2. **View Results**:
   - See immediate calculation results
   - View total cost, cost per packet, selling price, and profit/loss

3. **Order History**:
   - All calculations are saved automatically
   - View past orders in the history panel
   - Delete orders using the trash icon

## API Endpoints

All endpoints are available at: `https://YOUR-PROJECT-ID.web.app/api/*`

- `GET /api/health` - Health check
- `POST /api/orders` - Create new order calculation
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order
- `DELETE /api/orders/:id` - Delete an order

## Project Structure

```
HalalBazar/
├── functions/                         # 🔥 Cloud Functions (Backend)
│   ├── index.js                      # Express API wrapped in Cloud Function
│   ├── package.json                  # Functions dependencies
│   └── .gitignore
├── frontend/                         # React App
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── OrderForm.js          # Input form component
│   │   │   ├── OrderForm.css
│   │   │   ├── ResultDisplay.js      # Results display component
│   │   │   ├── ResultDisplay.css
│   │   │   ├── OrderHistory.js       # Order history component
│   │   │   └── OrderHistory.css
│   │   ├── App.js                    # Main App component
│   │   ├── App.css
│   │   ├── config.js                 # API configuration
│   │   ├── index.js
│   │   └── index.css
│   └── package.json                  # Frontend dependencies
├── backend/                          # ⚠️ Legacy (not used in Firebase)
├── firebase.json                     # 🔥 Firebase configuration
├── .firebaserc                       # 🔥 Firebase project settings
├── firestore.rules                   # 🔥 Firestore security rules
├── firestore.indexes.json            # 🔥 Firestore indexes
├── deploy-firebase.ps1               # 🚀 Automated deployment script
├── FIREBASE_FULL_STACK.md           # 📖 Complete Firebase guide
└── README.md
```

## Troubleshooting

### Firebase CLI Not Working
- Issue: Node.js v25 incompatibility
- Solution: Switch to Node v20 with `nvm use 20`

### Firestore Permission Denied
- Enable Firestore in Firebase Console
- Deploy firestore rules: `firebase deploy --only firestore`

### Functions Deployment Failed
- Check Node.js version (must be v20)
- Verify functions dependencies: `cd functions && npm install`

### CORS Errors
- Functions automatically handle CORS
- API must be accessed through same domain as frontend

## 🚀 Deployment

This is a **full Firebase application** - everything deploys together!

### Quick Deploy (Recommended)

```powershell
# 1. Switch to Node.js v20
nvm use 20

# 2. Update .firebaserc with your project ID

# 3. Run deployment script
.\deploy-firebase.ps1
```

### Manual Deploy

```powershell
firebase login
firebase deploy
```

### What Gets Deployed:
- ✅ Frontend → Firebase Hosting
- ✅ Backend API → Firebase Cloud Functions
- ✅ Database Rules → Firestore
- ✅ Everything on one domain!

**See `FIREBASE_FULL_STACK.md` for complete documentation.**

## License

ISC

## Author

Halal Bazar Team
