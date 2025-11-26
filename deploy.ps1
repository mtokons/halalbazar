# Quick Deploy Script
# Run this after switching to Node.js v20

Write-Host "🚀 Firebase Deployment Script for Halal Bazar" -ForegroundColor Cyan
Write-Host ""

# Check Node version
$nodeVersion = node --version
Write-Host "Current Node.js version: $nodeVersion" -ForegroundColor Yellow

if ($nodeVersion -notmatch "v20\." -and $nodeVersion -notmatch "v22\.") {
    Write-Host "⚠️  Warning: Firebase CLI works best with Node.js v20 or v22" -ForegroundColor Red
    Write-Host "Current version: $nodeVersion" -ForegroundColor Red
    Write-Host ""
    Write-Host "To switch Node.js version:" -ForegroundColor Yellow
    Write-Host "  nvm install 20" -ForegroundColor White
    Write-Host "  nvm use 20" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

Write-Host ""
Write-Host "📋 Pre-deployment checklist:" -ForegroundColor Cyan
Write-Host ""

# Check if .firebaserc has project ID
$firebaserc = Get-Content .\.firebaserc -Raw | ConvertFrom-Json
if ($firebaserc.projects.default -eq "YOUR_FIREBASE_PROJECT_ID") {
    Write-Host "❌ Firebase project ID not configured" -ForegroundColor Red
    Write-Host ""
    $projectId = Read-Host "Enter your Firebase Project ID"
    if ($projectId) {
        $firebaserc.projects.default = $projectId
        $firebaserc | ConvertTo-Json | Set-Content .\.firebaserc
        Write-Host "✅ Project ID updated" -ForegroundColor Green
    } else {
        Write-Host "Project ID required. Exiting..." -ForegroundColor Red
        exit
    }
} else {
    Write-Host "✅ Firebase project configured: $($firebaserc.projects.default)" -ForegroundColor Green
}

# Check if build exists
if (Test-Path ".\frontend\build") {
    Write-Host "✅ Build folder exists" -ForegroundColor Green
} else {
    Write-Host "❌ Build folder not found. Building now..." -ForegroundColor Yellow
    Set-Location frontend
    npm run build
    Set-Location ..
    Write-Host "✅ Build completed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔐 Logging into Firebase..." -ForegroundColor Cyan
firebase login

Write-Host ""
Write-Host "🚀 Deploying to Firebase Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your app should be live at:" -ForegroundColor Cyan
Write-Host "   https://$($firebaserc.projects.default).web.app" -ForegroundColor White
Write-Host "   https://$($firebaserc.projects.default).firebaseapp.com" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Remember to:" -ForegroundColor Yellow
Write-Host "   1. Deploy your backend separately" -ForegroundColor White
Write-Host "   2. Update REACT_APP_API_URL in .env.production" -ForegroundColor White
Write-Host "   3. Rebuild and redeploy after backend is live" -ForegroundColor White
