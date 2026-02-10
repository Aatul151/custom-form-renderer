# CKEditor Setup Guide

This guide explains how to set up CKEditor for use with the Custom Form Renderer package.

## Overview

The package includes CKEditor in the `lib/ckeditor/` directory. CKEditor must be loaded before using `ckeditor` field types. The package provides utilities to help with loading and checking CKEditor availability.

## Quick Start

### Step 1: Copy CKEditor to Your Project

After installing the package, copy the CKEditor file to your public directory:

```bash
# For Vite/CRA projects
cp node_modules/@custom-form/renderer/lib/ckeditor/ckeditor.js public/lib/ckeditor/ckeditor.js

# Or manually copy from:
# node_modules/@custom-form/renderer/lib/ckeditor/ckeditor.js
# to your public/lib/ckeditor/ckeditor.js
```

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

**Pros:**
- Only loads when needed
- Better performance if CKEditor is rarely used
- Provides loading/error states

**Cons:**
- Slight delay when first used
- Requires React component

**Implementation:**

```tsx
import { useCKEditor } from '@custom-form/renderer';

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
import { loadCKEditor, isCKEditorAvailable } from '@custom-form/renderer';

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
import { isCKEditorAvailable } from '@custom-form/renderer';

if (isCKEditorAvailable()) {
  console.log('CKEditor is ready!');
} else {
  console.log('CKEditor not loaded yet');
}
```

## Troubleshooting

### CKEditor Not Loading

1. **Check file path**: Ensure the file is accessible at the specified path
2. **Check browser console**: Look for 404 errors or script loading errors
3. **Check CORS**: If loading from CDN, ensure CORS is enabled
4. **Check file size**: The file is large (~1MB), ensure it's fully downloaded

### ClassicEditor Not Found

If the script loads but `window.ClassicEditor` is undefined:

1. Wait a bit - the script may need time to initialize
2. Check browser console for errors
3. Ensure you're using the correct CKEditor build

### Performance Issues

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
