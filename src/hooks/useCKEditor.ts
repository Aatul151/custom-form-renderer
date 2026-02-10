import { useState, useEffect } from 'react';
import { isCKEditorAvailable, waitForCKEditor, loadCKEditor } from '../utils/ckeditorLoader';

interface UseCKEditorOptions {
  /**
   * Path to CKEditor script (default: '/lib/ckeditor/ckeditor.js')
   */
  scriptPath?: string;
  /**
   * Auto-load CKEditor if not available (default: true)
   */
  autoLoad?: boolean;
  /**
   * Timeout for waiting for CKEditor (default: 10000ms)
   */
  timeout?: number;
}

interface UseCKEditorReturn {
  /**
   * Whether CKEditor is ready
   */
  isReady: boolean;
  /**
   * Loading state
   */
  isLoading: boolean;
  /**
   * Error if loading failed
   */
  error: Error | null;
  /**
   * Manually trigger loading
   */
  load: () => Promise<void>;
}

/**
 * React hook for loading and checking CKEditor availability
 * 
 * @example
 * ```tsx
 * const { isReady, isLoading, error } = useCKEditor();
 * 
 * if (!isReady) {
 *   return <div>Loading CKEditor...</div>;
 * }
 * ```
 */
export const useCKEditor = (options: UseCKEditorOptions = {}): UseCKEditorReturn => {
  const {
    scriptPath = '/lib/ckeditor/ckeditor.js',
    autoLoad = true,
    timeout = 10000,
  } = options;

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = async () => {
    if (isCKEditorAvailable()) {
      setIsReady(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await loadCKEditor(scriptPath);
      setIsReady(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load CKEditor');
      setError(error);
      setIsReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if already available
    if (isCKEditorAvailable()) {
      setIsReady(true);
      return;
    }

    // Auto-load if enabled
    if (autoLoad) {
      load();
    } else {
      // Just wait for it to become available
      waitForCKEditor(timeout)
        .then(() => setIsReady(true))
        .catch((err) => setError(err instanceof Error ? err : new Error('CKEditor not available')));
    }
  }, [scriptPath, autoLoad, timeout]);

  return {
    isReady,
    isLoading,
    error,
    load,
  };
};
