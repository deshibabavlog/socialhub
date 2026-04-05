# SocialHub Deployment Script for Windows
# Run this from PowerShell in the socialhub folder

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🚀 SOCIALHUB LIVE DEPLOYMENT - START" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Initialize Git
Write-Host "✓ Step 1: Preparing Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    Write-Host "  ✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "  ✓ Git repository already exists" -ForegroundColor Green
}

# Step 2: Check .env
Write-Host ""
Write-Host "✓ Step 2: Checking environment setup..." -ForegroundColor Yellow
if (-not (Test-Path "apps/api/.env")) {
    Copy-Item "apps/api/.env.example" "apps/api/.env"
    Write-Host "  ⚠ Created apps/api/.env from template" -ForegroundColor Yellow
    Write-Host "  ⚠ IMPORTANT: Update apps/api/.env with your API keys!" -ForegroundColor Red
} else {
    Write-Host "  ✓ apps/api/.env already exists" -ForegroundColor Green
}

# Step 3: Stage files
Write-Host ""
Write-Host "✓ Step 3: Staging files for commit..." -ForegroundColor Yellow
git add .
Write-Host "  ✓ Files staged" -ForegroundColor Green

# Step 4: Commit
Write-Host ""
Write-Host "✓ Step 4: Creating Git commit..." -ForegroundColor Yellow
git commit -m "Initial SocialHub deployment - complete social media SaaS ready for production"
Write-Host "  ✓ Commit created" -ForegroundColor Green

# Step 5: Instructions
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📋 NEXT STEPS - DO THESE NOW:" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  CREATE GITHUB REPOSITORY:" -ForegroundColor Green
Write-Host "   → Go to https://github.com/new" -ForegroundColor White
Write-Host "   → Name: socialhub" -ForegroundColor White
Write-Host "   → Click 'Create repository'" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  PUSH TO GITHUB (Copy & paste these commands):" -ForegroundColor Green
Write-Host ""
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/socialhub.git" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""

Write-Host "3️⃣  SETUP RAILWAY (Backend):" -ForegroundColor Green
Write-Host "   → Go to https://railway.app" -ForegroundColor White
Write-Host "   → Create new project" -ForegroundColor White
Write-Host "   → Connect GitHub repo: YOUR_USERNAME/socialhub" -ForegroundColor White
Write-Host "   → Provision PostgreSQL" -ForegroundColor White
Write-Host "   → Provision Redis" -ForegroundColor White
Write-Host "   → Add environment variables (see DEPLOYMENT_GUIDE.md)" -ForegroundColor White
Write-Host ""

Write-Host "4️⃣  SETUP VERCEL (Frontend):" -ForegroundColor Green
Write-Host "   → Go to https://vercel.com" -ForegroundColor White
Write-Host "   → Click 'Import Project'" -ForegroundColor White
Write-Host "   → Paste: https://github.com/YOUR_USERNAME/socialhub" -ForegroundColor White
Write-Host "   → Root directory: apps/web" -ForegroundColor White
Write-Host "   → Add Environment Variable: VITE_API_URL=your-railway-url" -ForegroundColor White
Write-Host "   → Deploy" -ForegroundColor White
Write-Host ""

Write-Host "5️⃣  YOUR LIVE URLS (after deployment):" -ForegroundColor Green
Write-Host "   Frontend: https://socialhub.vercel.app" -ForegroundColor Cyan
Write-Host "   Backend: https://your-api.railway.app" -ForegroundColor Cyan
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "⏱️  ESTIMATED TIME: 30 minutes to LIVE APP" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Local setup complete!" -ForegroundColor Green
Write-Host "Ready for: GitHub → Railway → Vercel → LIVE 🚀" -ForegroundColor Green
Write-Host ""
