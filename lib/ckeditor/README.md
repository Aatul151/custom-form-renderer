# CKEditor Library

This directory contains the CKEditor build file (`ckeditor.js`) that exposes `window.ClassicEditor`.

## Usage

### Option 1: Include in HTML (Recommended)

Add the script tag to your HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Other head content -->
    <script src="/lib/ckeditor/ckeditor.js"></script>
  </head>
  <body>
    <!-- Your app -->
  </body>
</html>
```

### Option 2: Copy to Public Directory

If using a build tool (Vite, Create React App, etc.), copy this file to your `public/lib/ckeditor/` directory:

```bash
# Example for Vite
cp lib/ckeditor/ckeditor.js public/lib/ckeditor/ckeditor.js
```

### Option 3: Use Dynamic Loading

The package includes utilities to dynamically load CKEditor:

```tsx
import { loadCKEditor, useCKEditor } from '@custom-form/renderer';

// In a component
const { isReady, isLoading, error } = useCKEditor({
  scriptPath: '/lib/ckeditor/ckeditor.js',
  autoLoad: true,
});
```

## File Size

The `ckeditor.js` file is large (~1MB+). Make sure to:
- Serve it from a CDN if possible
- Enable gzip compression on your server
- Consider lazy loading if CKEditor is not used on every page

## License

Make sure you have a valid CKEditor license if required. Set the license key via the `ckEditorLicenseKey` option in `FormServices`.
