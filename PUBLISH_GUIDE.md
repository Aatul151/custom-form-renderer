# Publishing Guide

This guide explains how to build and publish the Custom Form Renderer package.

## Prerequisites

1. **NPM Account**: You need an npm account. Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **Login**: Make sure you're logged in:
   ```bash
   npm login
   ```
3. **Install Dependencies**: Install all dependencies:
   ```bash
   npm install
   ```

## Build Commands

### Basic Build
```bash
npm run build
```
Builds the package and outputs to `dist/` directory.

### Clean Build
```bash
npm run build:clean
```
Removes previous build and creates a fresh build.

### Watch Mode (Development)
```bash
npm run dev
# or
npm run build:watch
```
Builds in watch mode for development.

### Type Check Only
```bash
npm run lint:check
```
Runs TypeScript type checking without building.

## Version Management

### Manual Version Bump
```bash
# Patch version (1.0.0 -> 1.0.1)
npm run version:patch

# Minor version (1.0.0 -> 1.1.0)
npm run version:minor

# Major version (1.0.0 -> 2.0.0)
npm run version:major
```

### Using npm version directly
```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

## Publishing

### Quick Publish (with version bump)
```bash
# Patch version bump + build + publish
npm run publish:patch

# Minor version bump + build + publish
npm run publish:minor

# Major version bump + build + publish
npm run publish:major
```

### Publish with Tags
```bash
# Publish as beta
npm run publish:beta

# Publish as next
npm run publish:next

# Publish as public (for scoped packages)
npm run publish:public
```

### Dry Run (Test without publishing)
```bash
npm run publish:dry-run
```
This builds and shows what would be published without actually publishing.

### Interactive Publish Scripts

#### Linux/Mac (Bash)
```bash
chmod +x scripts/publish.sh
./scripts/publish.sh
```

#### Windows (PowerShell)
```powershell
.\scripts\publish.ps1
```

These scripts will:
1. Check npm login status
2. Ask for version bump type
3. Ask for publish tag
4. Build the package
5. Run dry-run
6. Ask for confirmation
7. Publish the package

### Manual Publish Steps

1. **Update version** (if needed):
   ```bash
   npm run version:patch
   ```

2. **Build the package**:
   ```bash
   npm run build
   ```

3. **Test the build**:
   ```bash
   npm run publish:dry-run
   ```

4. **Publish**:
   ```bash
   # Default (latest tag)
   npm publish

   # With specific tag
   npm publish --tag beta
   npm publish --tag next

   # As public (for scoped packages)
   npm publish --access public
   ```

## Publishing Checklist

Before publishing, make sure:

- [ ] All tests pass (if you have tests)
- [ ] TypeScript compiles without errors (`npm run lint:check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Version is updated appropriately
- [ ] README.md is up to date
- [ ] package.json has correct metadata
- [ ] You're logged in to npm (`npm whoami`)
- [ ] You have publish access to the package

## Scoped Package Publishing

Since this is a scoped package (`@custom-form/renderer`), you may need to publish with `--access public`:

```bash
npm publish --access public
```

Or set it in `.npmrc`:
```
access=public
```

## Version Tags

- **latest**: Default tag, used for stable releases
- **beta**: Pre-release versions for testing
- **next**: Next major version preview

Install specific tags:
```bash
npm install @custom-form/renderer@beta
npm install @custom-form/renderer@next
```

## Troubleshooting

### "You do not have permission to publish"
- Make sure you're logged in: `npm login`
- Check if the package name is already taken
- For scoped packages, ensure you have access or use `--access public`

### "Package name already exists"
- The package name might be taken
- Check if you own the package
- Consider using a different scope or name

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run lint:check`
- Verify tsup configuration in `tsup.config.ts`

### Version Already Exists
- Bump the version before publishing
- Use a different tag (beta, next) if testing

## Post-Publish

After publishing:

1. **Verify publication**:
   ```bash
   npm view @custom-form/renderer
   ```

2. **Test installation**:
   ```bash
   npm install @custom-form/renderer@latest
   ```

3. **Update documentation** if needed

4. **Create a git tag** (if using git):
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## Example Workflow

```bash
# 1. Make your changes
# ... edit files ...

# 2. Test locally
npm run build
npm run lint:check

# 3. Bump version
npm run version:patch

# 4. Build
npm run build

# 5. Dry run
npm run publish:dry-run

# 6. Publish
npm publish --access public

# 7. Verify
npm view @custom-form/renderer
```

## CI/CD Integration

For automated publishing, you can use these scripts in your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Build
  run: npm run build

- name: Publish
  run: npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

Make sure to set up NPM_TOKEN secret in your CI/CD platform.
