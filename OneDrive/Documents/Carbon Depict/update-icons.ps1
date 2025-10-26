# Icon System Update Script
# Updates all icon imports and adds strokeWidth={2} to icon instances

Write-Host "`n=== Carbon Depict Icon System Update ===" -ForegroundColor Cyan
Write-Host "This script will update icon imports and styling across the application`n" -ForegroundColor Yellow

$rootPath = "c:\Users\dbmos\OneDrive\Documents\Carbon Depict\src"
$filesUpdated = 0
$iconsUpdated = 0
$strokeWidthAdded = 0

# Step 1: Update import statements
Write-Host "Step 1: Updating import statements..." -ForegroundColor Green

$files = Get-ChildItem -Path $rootPath -Recurse -Filter "*.jsx" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    if ($content -match "from 'lucide-react'") {
        Write-Host "  Updating: $($file.Name)" -ForegroundColor Yellow
        $content = $content -replace "from 'lucide-react'", "from '@atoms/Icon'"
        $filesUpdated++
    }

    # Step 2: Add strokeWidth={2} to icon instances
    # Regex: Find <IconName ...> or <IconName ... /> and add strokeWidth={2} if not present
    $iconNames = @(
        'ArrowLeft','Plus','Minus','Edit','Trash','Save','Download','Upload','Search','Filter','Check','Alert','Info','Settings','User','Bell','Mail','File','Calendar','Target','TrendingUp','TrendingDown','Factory','Zap','Globe','Leaf','Heart','Shield','Building','Scale'
    )
    foreach ($icon in $iconNames) {
        # Match opening tag for icon, not already containing strokeWidth
        $pattern = "<${icon}([^>]*)(?<!strokeWidth=\{2\})([^>]*)>"
        $replace = "<${icon}$1 strokeWidth={2}$2>"
        $count = ([regex]::Matches($content, $pattern)).Count
        if ($count -gt 0) {
            $content = [regex]::Replace($content, $pattern, $replace)
            $iconsUpdated += $count
            $strokeWidthAdded += $count
        }
    }
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
    }
}

Write-Host "`nStep 1 Complete: Updated $filesUpdated files" -ForegroundColor Green
Write-Host "Step 2 Complete: Added strokeWidth={2} to $strokeWidthAdded icon instances" -ForegroundColor Green

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Import statements updated: $filesUpdated files" -ForegroundColor Green
Write-Host "Icon instances updated: $iconsUpdated" -ForegroundColor Yellow
Write-Host "strokeWidth={2} added: $strokeWidthAdded times" -ForegroundColor Yellow
Write-Host "`nAll icon imports and instances are now fully automated!" -ForegroundColor Magenta
