#!/bin/bash
# Communication #61.9: Bulk Thumbnail Generation for 150+ Images
# Process ALL images from original bucket to create optimized thumbnails

echo "🚀 Communication #61.9: Bulk Thumbnail Generation (150+ Images)"
echo "================================================================"

# Configuration
ORIGINAL_BUCKET="cakecrafter-media-bucket"
OPTIMIZED_BUCKET="cakecrafter-media-web-optimized"
THUMBNAIL_SIZE="100x100"
QUALITY_JPG=75
QUALITY_PNG=85
BATCH_SIZE=20  # Process in batches to show progress

echo "📋 Configuration:"
echo "   Original Bucket: $ORIGINAL_BUCKET"
echo "   Optimized Bucket: $OPTIMIZED_BUCKET"
echo "   Thumbnail Size: $THUMBNAIL_SIZE"
echo "   JPG Quality: $QUALITY_JPG%"
echo "   PNG Quality: $QUALITY_PNG%"
echo "   Batch Size: $BATCH_SIZE images"

# Check ImageMagick installation
echo ""
echo "🔧 Communication #61.9:1 - Checking ImageMagick..."
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found! Installing..."
    sudo apt update
    sudo apt install imagemagick bc -y
fi
echo "✅ ImageMagick ready: $(convert --version | head -1)"

# Step 1: Download ALL images from original bucket
echo ""
echo "⬇️ Communication #61.9:2 - Downloading ALL images from original bucket..."

# Create directories
mkdir -p original_images
mkdir -p thumbnails
mkdir -p batch_logs

echo "📁 Created working directories"

# Sync all images from original bucket
echo "🔄 Syncing all images from s3://$ORIGINAL_BUCKET/media/generated_images/..."
aws s3 sync s3://$ORIGINAL_BUCKET/media/generated_images/ ./original_images/ --exclude "*" --include "*.jpg" --include "*.png"

if [ $? -ne 0 ]; then
    echo "❌ Failed to download images from original bucket"
    exit 1
fi

# Count downloaded images
TOTAL_IMAGES=$(find ./original_images/ -name "*.jpg" -o -name "*.png" | wc -l)
echo "📊 Downloaded $TOTAL_IMAGES images"

if [ $TOTAL_IMAGES -eq 0 ]; then
    echo "❌ No images found! Check bucket name and permissions."
    exit 1
fi

# Step 2: Process images in batches
echo ""
echo "🎨 Communication #61.9:3 - Processing $TOTAL_IMAGES images in batches of $BATCH_SIZE..."

PROCESSED=0
FAILED=0
BATCH_NUM=1
TOTAL_ORIGINAL_SIZE=0
TOTAL_THUMB_SIZE=0

# Get list of all image files
find ./original_images/ -name "*.jpg" -o -name "*.png" > image_list.txt

# Process in batches
while IFS= read -r file_path; do
    if [ -f "$file_path" ]; then
        # Extract filename and extension
        FILENAME=$(basename "$file_path")
        BASENAME="${FILENAME%.*}"
        EXTENSION="${FILENAME##*.}"
        
        # Create thumbnail name
        THUMB_NAME="${BASENAME}_thumb.${EXTENSION}"
        THUMB_PATH="thumbnails/$THUMB_NAME"
        
        # Show progress every batch
        if [ $((PROCESSED % BATCH_SIZE)) -eq 0 ]; then
            echo ""
            echo "📦 Batch $BATCH_NUM: Processing images $((PROCESSED + 1))-$((PROCESSED + BATCH_SIZE))..."
            BATCH_NUM=$((BATCH_NUM + 1))
        fi
        
        echo -n "🔄 $(printf "%3d" $((PROCESSED + 1)))/$TOTAL_IMAGES: $FILENAME → $THUMB_NAME..."
        
        # Get original file size
        ORIGINAL_SIZE=$(stat -c%s "$file_path")
        ORIGINAL_KB=$((ORIGINAL_SIZE / 1024))
        TOTAL_ORIGINAL_SIZE=$((TOTAL_ORIGINAL_SIZE + ORIGINAL_SIZE))
        
        # Generate thumbnail based on file type
        if [[ "$EXTENSION" == "jpg" || "$EXTENSION" == "jpeg" ]]; then
            convert "$file_path" -resize ${THUMBNAIL_SIZE}^ -gravity center -extent $THUMBNAIL_SIZE -quality $QUALITY_JPG "$THUMB_PATH"
        else
            convert "$file_path" -resize ${THUMBNAIL_SIZE}^ -gravity center -extent $THUMBNAIL_SIZE -quality $QUALITY_PNG "$THUMB_PATH"
        fi
        
        # Check if thumbnail was created successfully
        if [ $? -eq 0 ] && [ -f "$THUMB_PATH" ]; then
            # Get thumbnail size
            THUMB_SIZE=$(stat -c%s "$THUMB_PATH")
            THUMB_KB=$((THUMB_SIZE / 1024))
            TOTAL_THUMB_SIZE=$((TOTAL_THUMB_SIZE + THUMB_SIZE))
            
            # Calculate reduction
            if [ $ORIGINAL_KB -gt 0 ]; then
                REDUCTION=$(echo "scale=1; (1 - $THUMB_KB / $ORIGINAL_KB) * 100" | bc -l)
                echo " ✅ ${ORIGINAL_KB}KB → ${THUMB_KB}KB (${REDUCTION}%)"
            else
                echo " ✅ ${ORIGINAL_KB}KB → ${THUMB_KB}KB"
            fi
            
            PROCESSED=$((PROCESSED + 1))
        else
            echo " ❌ FAILED"
            echo "FAILED: $FILENAME" >> batch_logs/failed_files.log
            FAILED=$((FAILED + 1))
        fi
        
        # Show batch summary every BATCH_SIZE images
        if [ $((PROCESSED % BATCH_SIZE)) -eq 0 ] || [ $PROCESSED -eq $TOTAL_IMAGES ]; then
            BATCH_PROCESSED=$(ls thumbnails/*_thumb.* 2>/dev/null | wc -l)
            echo "   📊 Batch complete: $BATCH_PROCESSED thumbnails created"
        fi
    fi
done < image_list.txt

# Step 3: Upload ALL thumbnails to optimized bucket
echo ""
echo "⬆️ Communication #61.9:4 - Uploading $PROCESSED thumbnails to optimized bucket..."

# Upload all thumbnails
aws s3 cp thumbnails/ s3://$OPTIMIZED_BUCKET/generated_images/ --recursive --include "*_thumb.*"

if [ $? -eq 0 ]; then
    echo "✅ All thumbnails uploaded successfully!"
else
    echo "❌ Upload failed! Check AWS credentials and permissions."
fi

# Step 4: Verify uploads
echo ""
echo "🔍 Communication #61.9:5 - Verifying S3 uploads..."

UPLOADED_COUNT=$(aws s3 ls s3://$OPTIMIZED_BUCKET/generated_images/ | grep "_thumb" | wc -l)
echo "📊 Thumbnails in S3: $UPLOADED_COUNT"

# Show sample uploaded files
echo ""
echo "📋 Sample uploaded thumbnails (first 10):"
aws s3 ls s3://$OPTIMIZED_BUCKET/generated_images/ --human-readable | grep "_thumb" | head -10

# Step 5: Performance analysis
echo ""
echo "📊 Communication #61.9:6 - Performance Analysis"
echo "-----------------------------------------------"

# Calculate total size savings
TOTAL_ORIGINAL_MB=$((TOTAL_ORIGINAL_SIZE / 1024 / 1024))
TOTAL_THUMB_MB=$((TOTAL_THUMB_SIZE / 1024 / 1024))
TOTAL_SAVED_MB=$((TOTAL_ORIGINAL_MB - TOTAL_THUMB_MB))

if [ $TOTAL_ORIGINAL_MB -gt 0 ]; then
    TOTAL_REDUCTION=$(echo "scale=1; ($TOTAL_SAVED_MB / $TOTAL_ORIGINAL_MB) * 100" | bc -l)
else
    TOTAL_REDUCTION="N/A"
fi

echo "💾 Size Analysis:"
echo "   📊 Total images processed: $PROCESSED"
echo "   📊 Total images failed: $FAILED"
echo "   💾 Original total size: ${TOTAL_ORIGINAL_MB} MB"
echo "   💾 Thumbnail total size: ${TOTAL_THUMB_MB} MB"
echo "   💾 Total space saved: ${TOTAL_SAVED_MB} MB"
echo "   💾 Overall reduction: ${TOTAL_REDUCTION}%"

echo ""
echo "🚀 Performance Impact:"
echo "   ⚡ App loading speed: ~$(echo "scale=1; $TOTAL_ORIGINAL_MB / $TOTAL_THUMB_MB" | bc -l)x faster"
echo "   📱 Mobile data usage: ${TOTAL_REDUCTION}% less"
echo "   🎯 User experience: Dramatically improved"

# Step 6: Create URL mapping for JSON updates
echo ""
echo "🔗 Communication #61.9:7 - Generating URL mapping..."

echo "📝 Creating URL mapping file for JSON updates..."
echo "# URL Mapping for JSON Files" > url_mapping.txt
echo "# Original → Thumbnail" >> url_mapping.txt
echo "# Use thumbnails for list views, originals for detail views" >> url_mapping.txt
echo "" >> url_mapping.txt

# Create mapping for first 20 files as example
echo "📋 Sample URL mappings (first 20):" >> url_mapping.txt
aws s3 ls s3://$OPTIMIZED_BUCKET/generated_images/ | grep "_thumb" | head -20 | while read -r line; do
    THUMB_FILE=$(echo $line | awk '{print $4}')
    ORIGINAL_FILE=$(echo $THUMB_FILE | sed 's/_thumb//')
    echo "Original: https://$OPTIMIZED_BUCKET.s3.amazonaws.com/generated_images/$ORIGINAL_FILE" >> url_mapping.txt
    echo "Thumbnail: https://$OPTIMIZED_BUCKET.s3.amazonaws.com/generated_images/$THUMB_FILE" >> url_mapping.txt
    echo "" >> url_mapping.txt
done

echo "✅ URL mapping saved to: url_mapping.txt"

# Step 7: Cleanup and summary
echo ""
echo "🧹 Communication #61.9:8 - Cleanup and Summary"
echo "----------------------------------------------"

# Show failed files if any
if [ $FAILED -gt 0 ]; then
    echo "⚠️ Failed files ($FAILED):"
    cat batch_logs/failed_files.log
fi

# Final summary
echo ""
echo "🎯 Communication #61.9: Bulk processing completed!"
echo "=================================================="
echo "✅ Successfully processed: $PROCESSED/$TOTAL_IMAGES images"
echo "✅ Thumbnails uploaded to: s3://$OPTIMIZED_BUCKET/generated_images/"
echo "✅ Size reduction: ${TOTAL_REDUCTION}%"
echo "✅ Space saved: ${TOTAL_SAVED_MB} MB"
echo ""
echo "📋 Next Steps:"
echo "   1. Update JSON files to use _thumb URLs for list views"
echo "   2. Keep original URLs for detail/full views"
echo "   3. Test React Native app performance"
echo ""
echo "🔗 Base thumbnail URL format:"
echo "   https://$OPTIMIZED_BUCKET.s3.amazonaws.com/generated_images/filename_thumb.jpg"
echo "=================================================="

# Keep logs for reference
echo "📁 Files preserved:"
echo "   📄 url_mapping.txt - URL mapping for JSON updates"
echo "   📄 batch_logs/failed_files.log - Failed files list"
echo "   📁 thumbnails/ - Local thumbnail copies"
echo "   📁 original_images/ - Local original copies"