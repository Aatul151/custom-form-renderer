/**
 * Optional Vite plugin for @aatulwork/customform-renderer.
 * Use only if you need SSR or dependency optimization workarounds (e.g. "module not found" in SSR).
 * With the package's fixed exports, most Vite projects work with zero config.
 */
import type { Plugin, UserConfig, ConfigEnv } from 'vite';

const PACKAGE_NAME = '@aatulwork/customform-renderer';

export interface CustomFormRendererVitePluginOptions {
  /** Exclude CKEditor script from pre-bundling (default: true). Set false if you load CKEditor via HTML only. */
  excludeCkeditorFromOptimize?: boolean;
}

/**
 * Vite plugin that applies recommended settings for @aatulwork/customform-renderer:
 * - optimizeDeps.include: pre-bundle the package for faster dev startup
 * - ssr.noExternal: bundle the package in SSR instead of externalizing it
 * - optimizeDeps.exclude: optionally exclude the package's CKEditor build from pre-bundling
 *
 * Usage in vite.config.ts:
 *   import { customformRendererVite } from '@aatulwork/customform-renderer/vite';
 *   export default defineConfig({
 *     plugins: [react(), customformRendererVite()],
 *   });
 */
export function customformRendererVite(options: CustomFormRendererVitePluginOptions = {}): Plugin {
  const { excludeCkeditorFromOptimize = true } = options;

  return {
    name: 'vite-plugin-customform-renderer',
    config(config: UserConfig, _env: ConfigEnv) {
      const optimizeDeps = config.optimizeDeps ?? {};
      const include = Array.isArray(optimizeDeps.include) ? [...optimizeDeps.include] : [];
      if (!include.includes(PACKAGE_NAME)) {
        include.push(PACKAGE_NAME);
      }
      const exclude = Array.isArray(optimizeDeps.exclude) ? [...optimizeDeps.exclude] : [];
      if (excludeCkeditorFromOptimize) {
        const ckEditorPath = `${PACKAGE_NAME}/lib/ckeditor/ckeditor.js`;
        if (!exclude.includes(ckEditorPath)) {
          exclude.push(ckEditorPath);
        }
      }
      const ssr = config.ssr ?? {};
      const noExternal = ssr.noExternal;
      const noExternalList = Array.isArray(noExternal)
        ? [...noExternal]
        : noExternal === true
          ? true
          : [PACKAGE_NAME];
      if (Array.isArray(noExternalList) && !noExternalList.includes(PACKAGE_NAME)) {
        noExternalList.push(PACKAGE_NAME);
      }

      return {
        ...config,
        optimizeDeps: {
          ...optimizeDeps,
          include,
          ...(exclude.length > 0 ? { exclude } : {}),
        },
        ssr: {
          ...ssr,
          noExternal: noExternalList,
        },
      };
    },
  };
}
