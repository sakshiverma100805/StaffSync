# StaffSync GitHub Push Automation Script
param(
    [string]$RepoUrl = "https://github.com/sakshiverma100805/StaffSync.git",
    [string]$Token = ""
)

$gitExe = "$PSScriptRoot\.tools\git\cmd\git.exe"

if (-not (Test-Path $gitExe)) {
    $gitExe = "git"
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   StaffSync — Push Local Repository to GitHub            " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Target Repository: $RepoUrl" -ForegroundColor Green
Write-Host ""

# Check for local token drop file if present
$tokenFile = "$PSScriptRoot\.github-token.txt"
if (Test-Path $tokenFile) {
    $lines = Get-Content $tokenFile
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed -and -not $trimmed.StartsWith("#")) {
            $Token = $trimmed
            break
        }
    }
}

# If token provided or found, push using authenticated URL
if ($Token) {
    Write-Host "Using secure GitHub access token..." -ForegroundColor Cyan
    $authUrl = $RepoUrl -replace "https://", "https://sakshiverma100805:$Token@"
    & $gitExe remote set-url origin $authUrl
    & $gitExe push -u origin main
    # Reset origin to clean public URL without token
    & $gitExe remote set-url origin $RepoUrl
    exit $LASTEXITCODE
}

# Interactive terminal push
Write-Host "Configuring origin remote..." -ForegroundColor Cyan
& $gitExe remote remove origin 2>$null
& $gitExe remote add origin $RepoUrl

Write-Host "Pushing main branch to GitHub..." -ForegroundColor Cyan
Write-Host "(When prompted for password, paste your GitHub Personal Access Token)" -ForegroundColor Yellow
& $gitExe push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Your StaffSync project is now live on GitHub." -ForegroundColor Green
    Write-Host "Repository: $RepoUrl" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Authentication failed or cancelled." -ForegroundColor Red
    Write-Host "Tip: GitHub requires a Personal Access Token (PAT) instead of your account password." -ForegroundColor Yellow
}
