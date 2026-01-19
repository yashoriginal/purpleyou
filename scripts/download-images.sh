#!/bin/bash

# Script to download random jewelry product images from Unsplash
# Usage: ./scripts/download-images.sh

set -e

IMAGES_DIR="public/images/products"
mkdir -p "$IMAGES_DIR"

echo "🎨 Downloading jewelry images..."
echo ""

# Function to download image
download_image() {
  local query=$1
  local filename=$2
  local filepath="$IMAGES_DIR/$filename"
  
  # Using Unsplash's source endpoint (no auth required)
  local url="https://source.unsplash.com/600x600/?${query}&$(date +%s)"
  
  echo "📥 Downloading $filename..."
  if curl -s -L -o "$filepath" "$url"; then
    echo "✓ Saved: $filename"
  else
    echo "✗ Failed to download: $filename"
  fi
}

# Download necklace images
echo "---"
echo "Necklaces:"
download_image "necklace" "necklace-1.jpg"
download_image "pendant" "necklace-2.jpg"
download_image "choker" "necklace-3.jpg"

# Download ring images
echo ""
echo "Rings:"
download_image "ring" "ring-1.jpg"
download_image "engagement+ring" "ring-2.jpg"
download_image "gold+ring" "ring-3.jpg"

# Download bracelet images
echo ""
echo "Bracelets:"
download_image "bracelet" "bracelet-1.jpg"
download_image "bangle" "bracelet-2.jpg"
download_image "gold+bracelet" "bracelet-3.jpg"

# Download earring images
echo ""
echo "Earrings:"
download_image "earring" "earring-1.jpg"
download_image "drop+earring" "earring-2.jpg"
download_image "gold+earring" "earring-3.jpg"

echo ""
echo "✅ Complete!"
echo "📁 Images saved to: $IMAGES_DIR"
echo ""
echo "💡 Next steps:"
echo "   1. Review images in public/images/products/"
echo "   2. Rename as needed for your products"
echo "   3. Update your backend API to reference these local images"
echo ""
echo "📌 Image paths: /images/products/[filename]"
