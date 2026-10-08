# LeaAnne's WoW Companion - PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "        LEAANNE'S WORLD OF WARCRAFT COMPANION" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please download and install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Pause
    Exit 1
}

Write-Host "[1/3] Node.js detected: $(node -v)" -ForegroundColor Green

# Install dependencies if missing
if (-not (Test-Path "node_modules")) {
    Write-Host "[2/3] First-time setup: Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "[2/3] Dependencies already installed." -ForegroundColor Green
}

# Open browser and run
Write-Host "[3/3] Launching companion at http://localhost:3000 ..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"
npm run dev
