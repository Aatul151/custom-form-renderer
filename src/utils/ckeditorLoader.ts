/**
 * CKEditor Loader Utility
 * 
 * This utility helps load CKEditor from the lib/ckeditor/ckeditor.js file
 * and provides a way to check if CKEditor is available.
 */

/**
 * Load CKEditor script dynamically
 * @param scriptPath - Path to ckeditor.js file (default: '/lib/ckeditor/ckeditor.js')
 * @returns Promise that resolves when CKEditor is loaded
 */
export const loadCKEditor = (scriptPath: string = '/lib/ckeditor/ckeditor.js'): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.ClassicEditor) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(`script[src="${scriptPath}"]`);
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
    script.src = scriptPath;
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
          reject(new Error('CKEditor script loaded but ClassicEditor not found on window after 10 seconds'));
        }
      }, 10000);
    };

    script.onerror = () => {
      reject(new Error(`Failed to load CKEditor from ${scriptPath}`));
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
