# Build and Publish Scripts

This directory contains helper scripts for building and publishing the package.

## Scripts

### `build.sh` (Linux/Mac)
Builds the package with type checking and cleanup.

```bash
chmod +x scripts/build.sh
./scripts/build.sh
```

### `publish.sh` (Linux/Mac)
Interactive script for publishing the package.

```bash
chmod +x scripts/publish.sh
./scripts/publish.sh
```

### `publish.ps1` (Windows PowerShell)
Interactive script for publishing the package on Windows.

```powershell
.\scripts\publish.ps1
```

### `version-bump.js` (Node.js)
Version bumping utility.

```bash
node scripts/version-bump.js [patch|minor|major]
```

## Making Scripts Executable (Linux/Mac)

```bash
chmod +x scripts/*.sh
```

## Usage

For most cases, use the npm scripts defined in `package.json`:

```bash
npm run build          # Build package
npm run publish:patch  # Bump patch version and publish
npm run publish:minor  # Bump minor version and publish
npm run publish:major  # Bump major version and publish
```

See `PUBLISH_GUIDE.md` in the root directory for detailed instructions.
