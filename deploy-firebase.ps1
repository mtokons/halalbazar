# Quick Firebase Deployment Script
# Full Stack Firebase Deployment

Write-Host "🔥 Firebase Full Stack Deployment" -ForegroundColor Cyan
Write-Host ""

# Check Node version
$nodeVersion = node --version
Write-Host "Current Node.js version: $nodeVersion" -ForegroundColor Yellow

if ($nodeVersion -notmatch "v20\." -and $nodeVersion -notmatch "v22\.") {
    Write-Host "⚠️  Firebase requires Node.js v20 or v22" -ForegroundColor Red
    Write-Host "Current version: $nodeVersion" -ForegroundColor Red
    Write-Host ""
    Write-Host "Run these commands first:" -ForegroundColor Yellow
    Write-Host "  nvm install 20" -ForegroundColor White
    Write-Host "  nvm use 20" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Node.js version compatible" -ForegroundColor Green
Write-Host ""

# Check Firebase CLI
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseInstalled) {
    Write-Host "📦 Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
} else {
    Write-Host "✅ Firebase CLI installed" -ForegroundColor Green
}

Write-Host ""

# Check project ID
$firebaserc = Get-Content .\.firebaserc -Raw | ConvertFrom-Json
if ($firebaserc.projects.default -eq "YOUR_FIREBASE_PROJECT_ID") {
    Write-Host "❌ Firebase project ID not set" -ForegroundColor Red
    Write-Host ""
    $projectId = Read-Host "Enter your Firebase Project ID"
    if ($projectId) {
        $firebaserc.projects.default = $projectId
        $firebaserc | ConvertTo-Json | Set-Content .\.firebaserc
        Write-Host "✅ Project ID updated: $projectId" -ForegroundColor Green
    } else {
        Write-Host "Project ID required. Exiting..." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Firebase project: $($firebaserc.projects.default)" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Pre-deployment checklist:" -ForegroundColor Cyan
Write-Host ""

# Install functions dependencies
if (-not (Test-Path "functions\node_modules")) {
    Write-Host "📦 Installing Cloud Functions dependencies..." -ForegroundColor Yellow
    Set-Location functions
    npm install
    Set-Location ..
    Write-Host "✅ Functions dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Functions dependencies already installed" -ForegroundColor Green
}

# Build frontend
Write-Host "🔨 Building React frontend..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path "build") {
    Remove-Item -Recurse -Force build
}
npm run build
Set-Location ..
Write-Host "✅ Frontend built successfully" -ForegroundColor Green

Write-Host ""
Write-Host "🔐 Please login to Firebase..." -ForegroundColor Cyan
firebase login

Write-Host ""
Write-Host "⚠️  IMPORTANT: Make sure you've enabled these in Firebase Console:" -ForegroundColor Yellow
Write-Host "   1. Firestore Database" -ForegroundColor White
Write-Host "   2. Cloud Functions" -ForegroundColor White
Write-Host ""
$continue = Read-Host "Have you enabled Firestore Database? (y/n)"
if ($continue -ne "y") {
    Write-Host ""
    Write-Host "Please enable Firestore first:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://console.firebase.google.com" -ForegroundColor White
    Write-Host "2. Select your project" -ForegroundColor White
    Write-Host "3. Go to 'Firestore Database' → 'Create Database'" -ForegroundColor White
    Write-Host "4. Choose 'Start in production mode'" -ForegroundColor White
    Write-Host "5. Select your location" -ForegroundColor White
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "🚀 Deploying to Firebase..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Deploying Firestore rules..." -ForegroundColor Yellow
firebase deploy --only firestore

Write-Host ""
Write-Host "Deploying Cloud Functions (this may take 2-3 minutes)..." -ForegroundColor Yellow
firebase deploy --only functions

Write-Host ""
Write-Host "Deploying Frontend..." -ForegroundColor Yellow
firebase deploy --only hosting

Write-Host ""
Write-Host "✅ DEPLOYMENT COMPLETE! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your app is live at:" -ForegroundColor Cyan
Write-Host "   Frontend: https://$($firebaserc.projects.default).web.app" -ForegroundColor White
Write-Host "   API: https://$($firebaserc.projects.default).web.app/api/*" -ForegroundColor White
Write-Host ""
Write-Host "📊 Manage your app:" -ForegroundColor Cyan
Write-Host "   Console: https://console.firebase.google.com/project/$($firebaserc.projects.default)" -ForegroundColor White
Write-Host "   Firestore: https://console.firebase.google.com/project/$($firebaserc.projects.default)/firestore" -ForegroundColor White
Write-Host "   Functions: https://console.firebase.google.com/project/$($firebaserc.projects.default)/functions" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Test your app at the live URL" -ForegroundColor White
Write-Host "   2. View Firestore data in Firebase Console" -ForegroundColor White
Write-Host "   3. Monitor function logs: firebase functions:log" -ForegroundColor White
