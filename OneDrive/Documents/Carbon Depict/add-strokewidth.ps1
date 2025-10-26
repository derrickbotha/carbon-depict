# Add strokeWidth={2} to all icon instances
# This script updates all Lucide React icon components

Write-Host "`n=== Adding strokeWidth={2} to Icon Instances ===" -ForegroundColor Cyan

$rootPath = "c:\Users\dbmos\OneDrive\Documents\Carbon Depict\src"
$filesUpdated = 0
$iconsUpdated = 0
$backupPath = "c:\Users\dbmos\OneDrive\Documents\Carbon Depict\icon-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Create backup
Write-Host "Creating backup at: $backupPath" -ForegroundColor Yellow
New-Item -Path $backupPath -ItemType Directory -Force | Out-Null
Copy-Item -Path "$rootPath\*" -Destination $backupPath -Recurse -Force

$files = Get-ChildItem -Path $rootPath -Recurse -Filter "*.jsx" | Where-Object { $_.FullName -notmatch "node_modules" }

# Common Lucide icon names
$iconNames = @(
    'Menu', 'X', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight', 'ArrowRight', 'ArrowLeft',
    'Plus', 'Minus', 'Edit', 'Edit2', 'Edit3', 'Trash', 'Trash2', 'Save', 'Download', 'Upload',
    'Search', 'Filter', 'RefreshCw', 'MoreVertical', 'MoreHorizontal',
    'Check', 'CheckCircle', 'CheckCircle2', 'AlertCircle', 'AlertTriangle', 'AlertOctagon',
    'Info', 'XCircle', 'Circle',
    'LayoutDashboard', 'BarChart', 'BarChart2', 'BarChart3', 'PieChart', 'LineChart',
    'TrendingUp', 'TrendingDown', 'Activity', 'Target', 'Award', 'Shield',
    'Truck', 'Zap', 'Droplet', 'Droplets', 'Wind', 'Flame', 'Factory',
    'Leaf', 'Trash', 'Snowflake', 'TreePine', 'Recycle',
    'User', 'Users', 'Users2', 'UserPlus', 'Settings', 'LogOut', 'LogIn', 'Bell', 'Mail',
    'File', 'FileText', 'FolderOpen', 'Folder', 'FileSpreadsheet', 'FileImage', 'FileDown', 'FilePlus',
    'Heart', 'GraduationCap', 'Building', 'Building2', 'Scale', 'Briefcase',
    'Calendar', 'Clock', 'MapPin', 'Globe', 'Globe2', 'Eye', 'EyeOff',
    'HelpCircle', 'ExternalLink', 'Copy', 'BookOpen', 'List', 'Grid', 'Grid3X3',
    'Sliders', 'DollarSign', 'Percent'
)

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $fileUpdated = $false
    
    foreach ($iconName in $iconNames) {
        # Pattern 1: Icon with className but NO strokeWidth
        $pattern1 = "(<$iconName\s+className=""[^""]*"")(\s*/?>)"
        if ($content -match $pattern1 -and $content -notmatch "<$iconName[^>]*strokeWidth") {
            $content = $content -replace $pattern1, "`$1 strokeWidth={2}`$2"
            $fileUpdated = $true
        }
        
        # Pattern 2: Icon with props before className
        $pattern2 = "(<$iconName\s+)([^>]*)(className=""[^""]*"")(\s*/?>)"
        if ($content -match $pattern2 -and $content -notmatch "<$iconName[^>]*strokeWidth") {
            # Only add if strokeWidth not already present
            $regexMatches = [regex]::Matches($content, $pattern2)
            foreach ($match in $regexMatches) {
                if ($match.Value -notmatch "strokeWidth") {
                    $replacement = "$($match.Groups[1])$($match.Groups[2])$($match.Groups[3]) strokeWidth={2}$($match.Groups[4])"
                    $content = $content.Replace($match.Value, $replacement)
                    $fileUpdated = $true
                }
            }
        }
        
        # Pattern 3: Icon in JSX with just className
        $pattern3 = "(<$iconName\s+)(className={[^}]+})(\s*/?>)"
        if ($content -match $pattern3 -and $content -notmatch "<$iconName[^>]*strokeWidth") {
            $content = $content -replace $pattern3, "`$1`$2 strokeWidth={2}`$3"
            $fileUpdated = $true
        }
    }
    
    if ($fileUpdated -and $content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $filesUpdated++
        $iconCount = ($content | Select-String -Pattern "strokeWidth={2}" -AllMatches).Matches.Count
        $iconsUpdated += $iconCount
        Write-Host "  ✓ Updated: $($file.Name) ($iconCount icons)" -ForegroundColor Green
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Files updated: $filesUpdated" -ForegroundColor Green
Write-Host "Icons updated: ~$iconsUpdated" -ForegroundColor Green
Write-Host "Backup location: $backupPath" -ForegroundColor Yellow
Write-Host "`nDone! Please test the application to ensure everything works.`n" -ForegroundColor Green
