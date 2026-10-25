# StaffSync GitHub Push Helper Script
param(
    [string]$RepoUrl
)

$gitExe = "$PSScriptRoot\.tools\git\cmd\git.exe"

if (-not (Test-Path $gitExe)) {
    $gitExe = "git"
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   StaffSync — Push Local Repository to GitHub            " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

if (-not $RepoUrl) {
    Write-Host "Steps to create your GitHub repository:" -ForegroundColor Green
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "2. Set Repository name to: StaffSync" -ForegroundColor White
    Write-Host "3. Leave 'Add a README file' UNCHECKED" -ForegroundColor White
    Write-Host "4. Click 'Create repository'" -ForegroundColor White
    Write-Host "5. Copy the HTTPS repository URL (e.g. https://github.com/username/StaffSync.git)" -ForegroundColor White
    Write-Host ""
    $RepoUrl = Read-Host "Paste your GitHub Repository URL here"
}

if (-not $RepoUrl) {
    Write-Host "Error: No repository URL provided." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Linking remote origin: $RepoUrl ..." -ForegroundColor Cyan
& $gitExe remote remove origin 2>$null
& $gitExe remote add origin $RepoUrl

Write-Host "Pushing main branch to GitHub..." -ForegroundColor Cyan
& $gitExe push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Your StaffSync project has been pushed to GitHub." -ForegroundColor Green
    Write-Host "Repository URL: $RepoUrl" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "If prompted for authentication, enter your GitHub Username and Personal Access Token (PAT)." -ForegroundColor Yellow
}
