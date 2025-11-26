# 🚂 Railway.app Deployment - ALL IN ONE FREE!

## ✅ What Railway.app Offers (FREE):
- **Frontend** hosting (Static React app)
- **Backend** hosting (Node.js/Express)
- **MySQL Database** (500MB free)
- **$5 credit/month** (enough for small apps)

## 🚀 Deploy to Railway.app (5 minutes)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Authorize Railway

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select your repository (or upload via CLI)

### Step 3: Add MySQL Database
1. In your Railway project, click "New"
2. Select "Database" → "Add MySQL"
3. Railway will automatically create the database
4. **Database credentials are auto-injected as environment variables**

### Step 4: Deploy Application
1. Railway will automatically:
   - Install dependencies
   - Build React frontend
   - Start Node.js backend
   - Connect to MySQL database

2. Your app will be live at: `https://your-app.up.railway.app`

## 📝 Alternative: Deploy via Railway CLI

### Install Railway CLI:
```powershell
npm install -g @railway/cli
```

### Deploy:
```powershell
railway login
railway init
railway add
# Select MySQL
railway up
```

## 🔧 Manual Setup (If using Git)

### 1. Initialize Git (if not already):
```powershell
git init
git add .
git commit -m "Initial commit"
```

### 2. Create GitHub Repository:
1. Go to https://github.com/new
2. Create a new repository
3. Push your code:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/halalbazar.git
git branch -M main
git push -u origin main
```

### 3. Deploy from GitHub:
1. Go to Railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Add MySQL database
5. Done!

## 🗄️ Setup Database Tables

After deploying, you need to create the database table:

### Option 1: Via Railway Dashboard
1. In Railway, click on your MySQL service
2. Click "Data" tab
3. Run this SQL:
```sql
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number_of_biryani INT NOT NULL,
  ingredient_cost DECIMAL(10, 2) NOT NULL,
  electricity_bill DECIMAL(10, 2) NOT NULL,
  labour_cost DECIMAL(10, 2) NOT NULL,
  profit_margin DECIMAL(5, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  cost_per_biryani DECIMAL(10, 2) NOT NULL,
  selling_price_per_biryani DECIMAL(10, 2) NOT NULL,
  total_selling_price DECIMAL(10, 2) NOT NULL,
  profit_per_order DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Option 2: Via Railway CLI
```powershell
railway run mysql -u root -p$(railway variables get MYSQLPASSWORD) -h $(railway variables get MYSQLHOST) $(railway variables get MYSQLDATABASE) < backend/database.sql
```

## 🌐 Your Live URLs

After deployment:
- **Application**: `https://your-app.up.railway.app`
- **API**: `https://your-app.up.railway.app/api/orders`
- **Health Check**: `https://your-app.up.railway.app/api/health`

Frontend and backend on the same domain!

## 💰 Pricing

**Free Tier:**
- $5 credit per month
- 500MB MySQL database
- Perfect for small apps
- No credit card required to start!

Your app will use approximately:
- $0.20/day if running 24/7
- $6/month estimated
- First month FREE with $5 credit

## 🔧 Troubleshooting

### Build fails:
- Railway automatically runs `npm run build`
- Check `package.json` has build script

### Database connection error:
- Railway auto-injects: `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`
- Your server.js is already configured for these

### App not loading:
- Check logs in Railway dashboard
- Verify PORT environment variable is used

## 📊 Monitor Your App

Railway Dashboard shows:
- ✅ Deployment logs
- ✅ Build output
- ✅ Runtime logs
- ✅ Database metrics
- ✅ Usage and costs

## 🎯 Next Steps

1. ✅ Your code is ready for Railway
2. ⏳ Create Railway account
3. ⏳ Deploy from GitHub or CLI
4. ⏳ Add MySQL database
5. ⏳ Run database setup SQL
6. ✅ App goes live!

**Everything in one platform, completely FREE!** 🚀
