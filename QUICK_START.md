# Quick Start Guide

## Installation & Setup

```bash
# Install dependencies
npm install

# Build the package
npm run build
```

## Available Scripts

### Build Scripts
- `npm run build` - Build the package
- `npm run build:clean` - Clean and build
- `npm run build:watch` - Build in watch mode
- `npm run dev` - Alias for build:watch
- `npm run lint:check` - Type check only

### Version Scripts
- `npm run version:patch` - Bump patch version (1.0.0 -> 1.0.1)
- `npm run version:minor` - Bump minor version (1.0.0 -> 1.1.0)
- `npm run version:major` - Bump major version (1.0.0 -> 2.0.0)

### Publish Scripts
- `npm run publish:patch` - Bump patch + build + publish
- `npm run publish:minor` - Bump minor + build + publish
- `npm run publish:major` - Bump major + build + publish
- `npm run publish:beta` - Build + publish as beta tag
- `npm run publish:next` - Build + publish as next tag
- `npm run publish:public` - Build + publish as public
- `npm run publish:dry-run` - Test publish without actually publishing

## Quick Publish Workflow

### Option 1: Using npm scripts (Recommended)
```bash
# For patch release
npm run publish:patch

# For minor release
npm run publish:minor

# For major release
npm run publish:major
```

### Option 2: Using interactive scripts

**Linux/Mac:**
```bash
chmod +x scripts/publish.sh
./scripts/publish.sh
```

**Windows:**
```powershell
.\scripts\publish.ps1
```

### Option 3: Manual steps
```bash
# 1. Bump version
npm run version:patch

# 2. Build
npm run build

# 3. Test (optional)
npm run publish:dry-run

# 4. Publish
npm publish --access public
```

## First Time Publishing

1. **Create npm account** at [npmjs.com](https://www.npmjs.com/signup)

2. **Login**:
   ```bash
   npm login
   ```

3. **Verify login**:
   ```bash
   npm whoami
   ```

4. **Build**:
   ```bash
   npm run build
   ```

5. **Test publish** (dry run):
   ```bash
   npm run publish:dry-run
   ```

6. **Publish**:
   ```bash
   npm publish --access public
   ```

   Note: Scoped packages (`@custom-form/renderer`) require `--access public` flag.

## Verify Publication

After publishing, verify:

```bash
# View package info
npm view @custom-form/renderer

# View specific version
npm view @custom-form/renderer@1.0.0

# Test installation
npm install @custom-form/renderer@latest
```

## Common Commands Cheat Sheet

```bash
# Development
npm install              # Install dependencies
npm run dev             # Watch mode
npm run build           # Build package
npm run lint:check      # Type check

# Version Management
npm run version:patch   # 1.0.0 -> 1.0.1
npm run version:minor   # 1.0.0 -> 1.1.0
npm run version:major   # 1.0.0 -> 2.0.0

# Publishing
npm run publish:patch   # Quick patch release
npm run publish:dry-run # Test without publishing
npm publish            # Manual publish
```

For more details, see [PUBLISH_GUIDE.md](./PUBLISH_GUIDE.md).
