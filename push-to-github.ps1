# StaffSync GitHub Push Script
# Secure interactive push script for Windows PowerShell

$ErrorActionPreference = 'Stop'

$RepoUrl = 'https://github.com/sakshiverma100805/StaffSync.git'
$Username = 'sakshiverma100805'
$GitExe = Join-Path $PSScriptRoot '.tools\git\cmd\git.exe'

if (-not (Test-Path $GitExe)) {
    $GitExe = 'git'
}

Write-Host '======================================================' -ForegroundColor Cyan
Write-Host '   StaffSync - Push Local Repository to GitHub        ' -ForegroundColor Yellow
Write-Host '======================================================' -ForegroundColor Cyan
Write-Host ''
Write-Host "Target Repository: $RepoUrl" -ForegroundColor Green
Write-Host "Account: $Username" -ForegroundColor Green
Write-Host ''

# 1. Ensure clean origin remote URL is configured
try {
    & $GitExe remote remove origin 2>$null
} catch {}

& $GitExe remote add origin $RepoUrl

# 2. Prompt for Personal Access Token securely (masked with asterisks)
Write-Host 'GitHub requires a Personal Access Token (PAT) with repo scope.' -ForegroundColor Yellow
Write-Host 'Your token is masked and will NEVER be saved or printed.' -ForegroundColor DarkGray
Write-Host ''

$SecureToken = Read-Host -Prompt 'Enter your GitHub Personal Access Token (PAT)' -AsSecureString

if (-not $SecureToken) {
    Write-Host 'Error: No token entered. Push cancelled.' -ForegroundColor Red
    exit 1
}

# Convert secure string to in-memory plain string for the push
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureToken)
$PlainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

$PushExitCode = 1

try {
    Write-Host ''
    Write-Host 'Authenticating and pushing main branch to GitHub...' -ForegroundColor Cyan
    
    # Configure temporary authenticated URL in memory
    $AuthRemoteUrl = "https://${Username}:${PlainToken}@github.com/${Username}/StaffSync.git"
    & $GitExe remote set-url origin $AuthRemoteUrl
    
    # Execute push
    & $GitExe push -u origin main
    $PushExitCode = $LASTEXITCODE
}
catch {
    Write-Host "Error during push: $($_.Exception.Message)" -ForegroundColor Red
    $PushExitCode = 1
}
finally {
    # CRITICAL SECURITY CLEANUP:
    # Always reset the remote URL back to the clean public URL so no token remains in .git/config
    & $GitExe remote set-url origin $RepoUrl
    
    # Wipe the token variables from memory
    $PlainToken = $null
    $SecureToken = $null
    $AuthRemoteUrl = $null
    [System.GC]::Collect()
}

Write-Host ''
if ($PushExitCode -eq 0) {
    Write-Host '======================================================' -ForegroundColor Green
    Write-Host ' SUCCESS: StaffSync successfully pushed to GitHub!    ' -ForegroundColor Green
    Write-Host '======================================================' -ForegroundColor Green
    Write-Host "Repository URL: $RepoUrl" -ForegroundColor White
} else {
    Write-Host '======================================================' -ForegroundColor Red
    Write-Host ' Push failed. Please check token permissions (repo).  ' -ForegroundColor Red
    Write-Host '======================================================' -ForegroundColor Red
}

exit $PushExitCode
