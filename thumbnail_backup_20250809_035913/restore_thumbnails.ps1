# Communication #60.2: Thumbnail Restoration Script
# Generated: 20250809_035913
# Purpose: Restore original thumbnails if needed

Write-Host "🔄 Restoring thumbnails from backup..." -ForegroundColor Yellow

# Restore category thumbnails
aws s3 sync "thumbnail_backup_20250809_035913\cake_categories_images" s3://cakecrafter-media-web-optimized/cake_categories_images/
Write-Host "✅ Category thumbnails restored" -ForegroundColor Green

# Restore generated thumbnails  
aws s3 sync "thumbnail_backup_20250809_035913\generated_images" s3://cakecrafter-media-web-optimized/generated_images/
Write-Host "✅ Generated thumbnails restored" -ForegroundColor Green

Write-Host "🎯 Rollback complete! Original thumbnails restored." -ForegroundColor Green
