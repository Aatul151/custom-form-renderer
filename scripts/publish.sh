#!/bin/bash

# Publish script for Custom Form Renderer package

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
  echo -e "${GREEN}ℹ️  $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

# Check if user is logged in to npm
print_info "Checking npm login status..."
if ! npm whoami &> /dev/null; then
  print_error "You are not logged in to npm. Please run 'npm login' first."
  exit 1
fi

print_info "Logged in as: $(npm whoami)"

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_info "Current version: $CURRENT_VERSION"

# Ask for version bump type
echo ""
echo "Select version bump type:"
echo "1) patch (1.0.0 -> 1.0.1)"
echo "2) minor (1.0.0 -> 1.1.0)"
echo "3) major (1.0.0 -> 2.0.0)"
echo "4) Skip version bump (use current version)"
read -p "Enter choice [1-4]: " VERSION_CHOICE

case $VERSION_CHOICE in
  1)
    npm run version:patch
    NEW_VERSION=$(node -p "require('./package.json').version")
    print_info "Version bumped to: $NEW_VERSION"
    ;;
  2)
    npm run version:minor
    NEW_VERSION=$(node -p "require('./package.json').version")
    print_info "Version bumped to: $NEW_VERSION"
    ;;
  3)
    npm run version:major
    NEW_VERSION=$(node -p "require('./package.json').version")
    print_info "Version bumped to: $NEW_VERSION"
    ;;
  4)
    print_info "Using current version: $CURRENT_VERSION"
    NEW_VERSION=$CURRENT_VERSION
    ;;
  *)
    print_error "Invalid choice. Exiting."
    exit 1
    ;;
esac

# Ask for publish tag
echo ""
echo "Select publish tag:"
echo "1) latest (default)"
echo "2) beta"
echo "3) next"
read -p "Enter choice [1-3] (default: 1): " TAG_CHOICE
TAG_CHOICE=${TAG_CHOICE:-1}

case $TAG_CHOICE in
  1)
    PUBLISH_TAG="latest"
    ;;
  2)
    PUBLISH_TAG="beta"
    ;;
  3)
    PUBLISH_TAG="next"
    ;;
  *)
    PUBLISH_TAG="latest"
    ;;
esac

# Build the package
print_info "Building package..."
npm run build

# Dry run first
print_warning "Running dry-run to check package contents..."
npm publish --dry-run

# Confirm before publishing
echo ""
read -p "Do you want to publish version $NEW_VERSION with tag '$PUBLISH_TAG'? (y/N): " CONFIRM

if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
  print_warning "Publish cancelled."
  exit 0
fi

# Publish
print_info "Publishing package..."
if [ "$PUBLISH_TAG" != "latest" ]; then
  npm publish --tag "$PUBLISH_TAG"
else
  npm publish
fi

print_info "✅ Package published successfully!"
print_info "Version: $NEW_VERSION"
print_info "Tag: $PUBLISH_TAG"
print_info "Package: @custom-form/renderer@$NEW_VERSION"
