/**
 * CKEditor Loader Utility
 * 
 * This utility helps load CKEditor from the lib/ckeditor/ckeditor.js file
 * and provides a way to check if CKEditor is available.
 */

/** Rejects javascript:, data:, and paths that could enable script injection */
function validateScriptPath(path: string): string {
  const trimmed = path?.trim() || '';
  if (trimmed.length === 0) return '/lib/ckeditor/ckeditor.js';

  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:')) {
    throw new Error('Invalid CKEditor script path: javascript: and data: URLs are not allowed');
  }
  if (/["'<>]|\s/.test(trimmed)) {
    throw new Error('Invalid CKEditor script path: path contains invalid characters');
  }
  return trimmed;
}

/**
 * Find existing script by src without selector injection (avoids querySelector with user input)
 */
function findScriptBySrc(src: string): HTMLScriptElement | null {
  const scripts = document.querySelectorAll('script[src]');
  for (let i = 0; i < scripts.length; i++) {
    const s = scripts[i];
    if (s.getAttribute('src') === src) return s as HTMLScriptElement;
  }
  return null;
}

/**
 * Load CKEditor script dynamically
 * @param scriptPath - Path to ckeditor.js file (default: '/lib/ckeditor/ckeditor.js')
 * @returns Promise that resolves when CKEditor is loaded
 */
export const loadCKEditor = (scriptPath: string = '/lib/ckeditor/ckeditor.js'): Promise<void> => {
  return new Promise((resolve, reject) => {
    let path: string;
    try {
      path = validateScriptPath(scriptPath);
    } catch (err) {
      reject(err);
      return;
    }

    // Check if already loaded
    if (window.ClassicEditor) {
      resolve();
      return;
    }

    // Check if script is already being loaded (safe lookup, no selector injection)
    const existingScript = findScriptBySrc(path);
    if (existingScript) {
      // Wait for it to load
      existingScript.addEventListener('load', () => {
        if (window.ClassicEditor) {
          resolve();
        } else {
          reject(new Error('CKEditor script loaded but ClassicEditor not found on window'));
        }
      });
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load CKEditor script'));
      });
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = path;
    script.async = true;
    
    script.onload = () => {
      // Wait a bit for ClassicEditor to be available
      const checkInterval = setInterval(() => {
        if (window.ClassicEditor) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.ClassicEditor) {
          reject(
            new Error(
              'CKEditor script loaded but ClassicEditor was not found on window. ' +
                'Ensure you are using the package-provided build from lib/ckeditor/ckeditor.js (see CKEDITOR_SETUP.md).'
            )
          );
        }
      }, 10000);
    };

    script.onerror = () => {
        reject(
          new Error(
            `Failed to load CKEditor from ${path}. ` +
            'Ensure the file exists at that URL (e.g. copy from node_modules/@aatulwork/customform-renderer/lib/ckeditor/ckeditor.js to public/lib/ckeditor/ckeditor.js) or set services.ckEditorScriptPath to a working URL.'
        )
      );
    };

    document.head.appendChild(script);
  });
};

/**
 * Check if CKEditor is available
 * @returns true if ClassicEditor is available on window
 */
export const isCKEditorAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ClassicEditor !== 'undefined';
};

/**
 * Wait for CKEditor to be available
 * @param timeout - Maximum time to wait in milliseconds (default: 10000)
 * @returns Promise that resolves when CKEditor is available
 */
export const waitForCKEditor = (timeout: number = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isCKEditorAvailable()) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isCKEditorAvailable()) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('CKEditor not available after timeout'));
      }
    }, 100);
  });
};
