# CKEditor Setup Guide

This guide explains how to set up CKEditor for use with the Custom Form Renderer package.

## Overview

The package includes CKEditor in the `lib/ckeditor/` directory. CKEditor must be loaded before using `ckeditor` field types. The package provides utilities to help with loading and checking CKEditor availability.

## CKEditor not working?

If the CKEditor field shows **"CKEditor failed to load"** or **"Loading editor..."** forever:

1. **The browser must receive the CKEditor script.** The default path is `/lib/ckeditor/ckeditor.js`. Your app must serve the file at that URL (or you set a different URL via `services.ckEditorScriptPath`).
2. **Copy the file into your app’s public assets** (so your dev server or production build can serve it):
   - **Vite / CRA:** Copy to `public/lib/ckeditor/ckeditor.js`
   - **Next.js:** Copy to `public/lib/ckeditor/ckeditor.js`
3. **Or use the Vite import method** (no copy step): see [Method 2b: Vite import](#method-2b-vite-import-without-copying) below.

Then either include the script in your HTML (recommended) or rely on the package’s automatic loading (it will request the same URL). If you use a different base path or host, set `services.ckEditorScriptPath` to the full URL of `ckeditor.js`.

## Quick Start

### Step 1: Copy CKEditor to Your Project

After installing the package, copy the CKEditor file to your public directory:

```bash
# For Vite/CRA projects (Unix/macOS)
cp node_modules/@aatulwork/customform-renderer/lib/ckeditor/ckeditor.js public/lib/ckeditor/ckeditor.js

# Windows (PowerShell)
Copy-Item node_modules\@aatulwork\customform-renderer\lib\ckeditor\ckeditor.js -Destination public\lib\ckeditor\ckeditor.js -Force
```

Or manually copy from `node_modules/@aatulwork/customform-renderer/lib/ckeditor/ckeditor.js` to your `public/lib/ckeditor/ckeditor.js`.

### Step 2: Include in HTML

Add the script tag to your HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="/lib/ckeditor/ckeditor.js"></script>
  </head>
  <body>
    <!-- Your app -->
  </body>
</html>
```

### Step 3: Use CKEditor Fields

Now you can use CKEditor fields in your forms:

```tsx
const schema: FormSchema = {
  sections: [{
    fields: [{
      type: 'ckeditor',
      name: 'content',
      label: 'Content',
    }],
  }],
};
```

## Setup Methods

### Method 1: Static HTML Script Tag (Recommended)

**Pros:**
- Simple and reliable
- Loads early, ready when needed
- Works with all build tools

**Cons:**
- Loads even if not used
- Blocks initial page load slightly

**Implementation:**

1. Copy `ckeditor.js` to your `public/lib/ckeditor/` directory
2. Add to `index.html`:
   ```html
   <script src="/lib/ckeditor/ckeditor.js"></script>
   ```

### Method 2: Dynamic Loading with Hook

The form renderer loads CKEditor automatically when a form contains a `ckeditor` field. You only need to ensure the script URL is correct (copy file to `public/lib/ckeditor/` or set `services.ckEditorScriptPath`). No extra wrapper is required.

If you want to gate your app until CKEditor is ready:

```tsx
import { useCKEditor } from '@aatulwork/customform-renderer';

function App() {
  const { isReady, isLoading, error } = useCKEditor({
    scriptPath: '/lib/ckeditor/ckeditor.js',
    autoLoad: true,
  });

  if (!isReady) {
    return <div>Loading editor...</div>;
  }

  return <FormRenderer formSchema={schema} />;
}
```

### Method 2b: Vite import (without copying)

With Vite you can reference the package’s CKEditor file so the dev server serves it—no manual copy step:

```tsx
import { FormRenderer, FormSchema, FormServices } from '@aatulwork/customform-renderer';
// @ts-ignore - Vite handles ?url
import ckEditorScriptUrl from '@aatulwork/customform-renderer/lib/ckeditor/ckeditor.js?url';

const services: FormServices = {
  ckEditorScriptPath: ckEditorScriptUrl,
};

<FormRenderer formSchema={schema} services={services} />
```

If the `?url` import fails (e.g. in some setups), use the copy-to-public approach instead.

### Method 3: Custom Script Path

If CKEditor is hosted on a CDN or different location:

```tsx
const services: FormServices = {
  ckEditorScriptPath: 'https://cdn.example.com/ckeditor.js',
  // ... other services
};

<FormRenderer formSchema={schema} services={services} />
```

### Method 4: Manual Loading

For more control:

```tsx
import { loadCKEditor, isCKEditorAvailable } from '@aatulwork/customform-renderer';

useEffect(() => {
  if (!isCKEditorAvailable()) {
    loadCKEditor('/lib/ckeditor/ckeditor.js')
      .then(() => {
        console.log('CKEditor loaded');
      })
      .catch((error) => {
        console.error('Failed to load CKEditor:', error);
      });
  }
}, []);
```

## Build Tool Configurations

### Vite

1. Copy file to `public/lib/ckeditor/ckeditor.js`
2. Add to `index.html`:
   ```html
   <script src="/lib/ckeditor/ckeditor.js"></script>
   ```

### Create React App

1. Copy file to `public/lib/ckeditor/ckeditor.js`
2. Add to `public/index.html`:
   ```html
   <script src="%PUBLIC_URL%/lib/ckeditor/ckeditor.js"></script>
   ```

### Next.js

1. Copy file to `public/lib/ckeditor/ckeditor.js`
2. Add to `pages/_document.tsx`:
   ```tsx
   import Script from 'next/script';

   export default function Document() {
     return (
       <Html>
         <Head>
           <Script src="/lib/ckeditor/ckeditor.js" strategy="beforeInteractive" />
         </Head>
         <body>
           {/* ... */}
         </body>
       </Html>
     );
   }
   ```

## Verification

Check if CKEditor is loaded:

```tsx
import { isCKEditorAvailable } from '@aatulwork/customform-renderer';

if (isCKEditorAvailable()) {
  console.log('CKEditor is ready!');
} else {
  console.log('CKEditor not loaded yet');
}
```

## Troubleshooting

### CKEditor not loading / "CKEditor failed to load"

1. **Confirm the script URL is reachable**
   - Open `http://localhost:YOUR_PORT/lib/ckeditor/ckeditor.js` (or your app origin + path) in the browser. You should get the JavaScript file, not a 404 or HTML page.
   - If you get 404: copy the file from `node_modules/@aatulwork/customform-renderer/lib/ckeditor/ckeditor.js` to `public/lib/ckeditor/ckeditor.js` (create the folder if needed), or use the [Vite ?url import](#method-2b-vite-import-without-copying).

2. **Base path / subpath**
   - If your app is served under a subpath (e.g. `https://example.com/myapp/`), `/lib/ckeditor/ckeditor.js` may not be correct. Set the full URL in services:
     ```tsx
     services={{ ckEditorScriptPath: 'https://example.com/myapp/lib/ckeditor/ckeditor.js' }}
     ```
   - Or use a path relative to your app’s public root that your server actually serves.

3. **Browser console**
   - Check for 404, CORS, or other network errors for the CKEditor script URL.
   - The package shows the script path in the error message; use it to verify in Network tab.

### "Loading editor..." never finishes

- Same as above: the script request is likely failing (404 or network error). Fix the script URL and ensure the file is served.

### ClassicEditor not found (script loads but editor doesn’t appear)

If the script loads (no 404) but you still see an error about ClassicEditor:

1. **Use the package’s build**  
   Use the file from `@aatulwork/customform-renderer/lib/ckeditor/ckeditor.js`. Other CKEditor builds may not expose `ClassicEditor` on `window`.

2. **Check the console**  
   Look for JavaScript errors that might prevent the script from running fully.

3. **Timing**  
   The loader waits up to 10 seconds for `window.ClassicEditor`. If your build is very slow, increase the timeout via a wrapper that uses `useCKEditor({ timeout: 15000 })` and only then renders the form.

### Other issues

- **CORS**: If loading from a CDN, ensure the script is served with CORS headers.
- **File size**: The build is large (~1MB); ensure it’s fully downloaded and not truncated.

### Performance

If CKEditor is slow to load:

1. Use a CDN for faster delivery
2. Enable gzip compression on your server
3. Consider lazy loading if CKEditor is not used on every page
4. Preload the script:
   ```html
   <link rel="preload" href="/lib/ckeditor/ckeditor.js" as="script">
   ```

## License Key

If you have a CKEditor license, set it via services:

```tsx
const services: FormServices = {
  ckEditorLicenseKey: 'your-license-key',
  // ... other services
};
```

## Examples

See the main [README.md](./README.md) for complete examples.
