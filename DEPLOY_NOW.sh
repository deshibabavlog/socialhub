#!/bin/bash
# SocialHub Deployment Script
# This script automates the deployment process to Railway + Vercel

set -e

echo "════════════════════════════════════════════════════════════════"
echo "🚀 SOCIALHUB LIVE DEPLOYMENT - START"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Step 1: Check if Git is initialized
echo "✓ Step 1: Preparing Git repository..."
if [ ! -d ".git" ]; then
    git init
    echo "  ✓ Git repository initialized"
else
    echo "  ✓ Git repository already exists"
fi

# Step 2: Check if .env is set up
echo ""
echo "✓ Step 2: Checking environment setup..."
if [ ! -f "apps/api/.env" ]; then
    cp apps/api/.env.example apps/api/.env
    echo "  ⚠ Created apps/api/.env from template"
    echo "  ⚠ IMPORTANT: Update apps/api/.env with your API keys!"
else
    echo "  ✓ apps/api/.env already exists"
fi

# Step 3: Add files to Git
echo ""
echo "✓ Step 3: Staging files for commit..."
git add .
CHANGES=$(git diff --cached --name-only | wc -l)
echo "  ✓ Staged $CHANGES files for commit"

# Step 4: Create commit
echo ""
echo "✓ Step 4: Creating Git commit..."
git commit -m "Initial SocialHub deployment - complete social media SaaS ready for production"
echo "  ✓ Commit created"

# Step 5: Show next steps
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📋 NEXT STEPS - DO THESE NOW:"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  CREATE GITHUB REPOSITORY:"
echo "   → Go to https://github.com/new"
echo "   → Name: socialhub"
echo "   → Click 'Create repository'"
echo ""
echo "2️⃣  PUSH TO GITHUB (Copy & paste this command):"
echo ""
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/socialhub.git"
echo "   git push -u origin main"
echo ""
echo "3️⃣  SETUP RAILWAY (Backend):"
echo "   → Go to https://railway.app"
echo "   → Create new project"
echo "   → Connect GitHub repo"
echo "   → Provision PostgreSQL"
echo "   → Provision Redis"
echo "   → Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "4️⃣  SETUP VERCEL (Frontend):"
echo "   → Go to https://vercel.com"
echo "   → Import GitHub repo"
echo "   → Root directory: apps/web"
echo "   → Set VITE_API_URL environment variable"
echo "   → Deploy"
echo ""
echo "5️⃣  GET YOUR LIVE URLs:"
echo "   Frontend: https://your-app.vercel.app"
echo "   Backend: https://your-api.railway.app"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "⏱️  ESTIMATED TIME: 30 minutes"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "✅ Local setup complete! Ready for GitHub → Railway → Vercel"
echo ""
