# Icon System Update Script
# Updates all icon imports and adds strokeWidth={2} to icon instances

Write-Host "`n=== Carbon Depict Icon System Update ===" -ForegroundColor Cyan
Write-Host "This script will update icon imports and styling across the application`n" -ForegroundColor Yellow

$rootPath = "c:\Users\dbmos\OneDrive\Documents\Carbon Depict\src"
$filesUpdated = 0
$iconsUpdated = 0

# Step 1: Update import statements
Write-Host "Step 1: Updating import statements..." -ForegroundColor Green

$files = Get-ChildItem -Path $rootPath -Recurse -Filter "*.jsx" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    if ($content -match "from 'lucide-react'") {
        Write-Host "  Updating: $($file.Name)" -ForegroundColor Yellow
        $content = $content -replace "from 'lucide-react'", "from '@atoms/Icon'"
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $filesUpdated++
    }
}

Write-Host "`nStep 1 Complete: Updated $filesUpdated files`n" -ForegroundColor Green

# Step 2: Report files that need manual strokeWidth additions
Write-Host "Step 2: Identifying files with icon instances..." -ForegroundColor Green

$filesWithIcons = @()
$iconPatterns = @(
    'className="[^"]*h-\d',  # Icons with height classes
    '<[A-Z]\w+\s+className=.*?>',  # React components with className
    '<(ArrowLeft|Plus|Minus|Edit|Trash|Save|Download|Upload|Search|Filter|Check|Alert|Info|Settings|User|Bell|Mail|File|Calendar|Target|TrendingUp|TrendingDown|Factory|Zap|Globe|Leaf|Heart|Shield|Building|Scale)'
)

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    foreach ($pattern in $iconPatterns) {
        if ($content -match $pattern) {
            $iconsFound = ([regex]::Matches($content, $pattern)).Count
            if ($iconsFound -gt 0) {
                $filesWithIcons += @{
                    File = $file.FullName
                    Name = $file.Name
                    IconCount = $iconsFound
                }
                $iconsUpdated += $iconsFound
                break
            }
        }
    }
}

Write-Host "`nFiles with icon instances that need strokeWidth={2}:" -ForegroundColor Cyan
$filesWithIcons | ForEach-Object {
    Write-Host "  - $($_['Name']) ($($_['IconCount']) icons)" -ForegroundColor Yellow
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Import statements updated: $filesUpdated files" -ForegroundColor Green
Write-Host "Files with icons found: $($filesWithIcons.Count) files" -ForegroundColor Yellow
Write-Host "Approximate icon instances: ~$iconsUpdated" -ForegroundColor Yellow
Write-Host "`nNext step: Add strokeWidth={2} to icon instances" -ForegroundColor Magenta
Write-Host "This should be done with VS Code Find & Replace for precision`n" -ForegroundColor White
