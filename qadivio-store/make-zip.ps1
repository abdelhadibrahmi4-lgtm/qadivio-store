$sourceDir = "C:\Users\Tech-Zone\.gemini\antigravity\scratch\qadivio-store"
$desktopDir = "C:\Users\Tech-Zone\Desktop\qadivio-store"
$zipFile = "C:\Users\Tech-Zone\Desktop\qadivio-store.zip"

Write-Host "Syncing files to Desktop folder..."
$exclude = @("node_modules", ".next", ".git")
Get-ChildItem -Path $sourceDir | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $desktopDir -Recurse -Force
}

Write-Host "Creating zip file at $zipFile..."
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

$itemsToZip = Get-ChildItem -Path $sourceDir | Where-Object { $exclude -notcontains $_.Name }
Compress-Archive -Path $itemsToZip.FullName -DestinationPath $zipFile -Force

Write-Host "SUCCESS: Archive created with size $( (Get-Item $zipFile).Length / 1MB ) MB"
