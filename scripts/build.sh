#!/bin/bash

# Build script for Custom Form Renderer package

set -e

echo "🔨 Building Custom Form Renderer package..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist

# Run TypeScript type check
echo "✅ Running TypeScript type check..."
npx tsc --noEmit

# Build the package
echo "📦 Building package..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
  echo "✅ Build successful! Output in ./dist"
  echo ""
  echo "📊 Build output:"
  ls -lh dist/
else
  echo "❌ Build failed!"
  exit 1
fi
