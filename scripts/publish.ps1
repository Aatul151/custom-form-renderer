# PowerShell Publish script for Custom Form Renderer package

$ErrorActionPreference = "Stop"

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check if user is logged in to npm
Write-Info "Checking npm login status..."
try {
    $npmUser = npm whoami 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Not logged in"
    }
    Write-Info "Logged in as: $npmUser"
} catch {
    Write-Error "You are not logged in to npm. Please run 'npm login' first."
    exit 1
}

# Get current version
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$currentVersion = $packageJson.version
Write-Info "Current version: $currentVersion"

# Ask for version bump type
Write-Host ""
Write-Host "Select version bump type:"
Write-Host "1) patch (1.0.0 -> 1.0.1)"
Write-Host "2) minor (1.0.0 -> 1.1.0)"
Write-Host "3) major (1.0.0 -> 2.0.0)"
Write-Host "4) Skip version bump (use current version)"
$versionChoice = Read-Host "Enter choice [1-4]"

$newVersion = $currentVersion
switch ($versionChoice) {
    "1" {
        npm run version:patch
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        $newVersion = $packageJson.version
        Write-Info "Version bumped to: $newVersion"
    }
    "2" {
        npm run version:minor
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        $newVersion = $packageJson.version
        Write-Info "Version bumped to: $newVersion"
    }
    "3" {
        npm run version:major
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        $newVersion = $packageJson.version
        Write-Info "Version bumped to: $newVersion"
    }
    "4" {
        Write-Info "Using current version: $currentVersion"
    }
    default {
        Write-Error "Invalid choice. Exiting."
        exit 1
    }
}

# Ask for publish tag
Write-Host ""
Write-Host "Select publish tag:"
Write-Host "1) latest (default)"
Write-Host "2) beta"
Write-Host "3) next"
$tagChoice = Read-Host "Enter choice [1-3] (default: 1)"
if ([string]::IsNullOrWhiteSpace($tagChoice)) { $tagChoice = "1" }

$publishTag = switch ($tagChoice) {
    "1" { "latest" }
    "2" { "beta" }
    "3" { "next" }
    default { "latest" }
}

# Build the package
Write-Info "Building package..."
npm run build

# Dry run first
Write-Warning "Running dry-run to check package contents..."
npm publish --dry-run

# Confirm before publishing
Write-Host ""
$confirm = Read-Host "Do you want to publish version $newVersion with tag '$publishTag'? (y/N)"

if ($confirm -notmatch "^[Yy]$") {
    Write-Warning "Publish cancelled."
    exit 0
}

# Publish
Write-Info "Publishing package..."
if ($publishTag -ne "latest") {
    npm publish --tag $publishTag
} else {
    npm publish
}

Write-Info "✅ Package published successfully!"
Write-Info "Version: $newVersion"
Write-Info "Tag: $publishTag"
Write-Info "Package: @custom-form/renderer@$newVersion"
