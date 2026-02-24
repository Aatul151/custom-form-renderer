/**
 * Validates CSS color values to prevent CSS injection when used in style properties.
 */

/** Regex for valid hex colors: #rgb, #rgba, #rrggbb, #rrggbbaa */
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

/** Regex for rgb/rgba: rgb(r,g,b) or rgba(r,g,b,a) */
const RGB_COLOR_REGEX = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;

/** Regex for hsl/hsla */
const HSL_COLOR_REGEX = /^hsla?\(\s*[\d.]+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*(,\s*[\d.]+\s*)?\)$/;

/** Common safe CSS color keywords */
const SAFE_COLOR_KEYWORDS = new Set([
  'transparent', 'inherit', 'initial', 'unset',
  'currentColor', 'black', 'white', 'silver', 'gray', 'grey',
  'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink',
  'maroon', 'navy', 'teal', 'lime', 'olive', 'aqua', 'fuchsia',
  'cyan', 'magenta', 'brown', 'tan', 'beige', 'ivory', 'gold',
  'coral', 'salmon', 'crimson', 'indigo', 'violet', 'lavender',
]);

/**
 * Returns true if the value is a safe CSS color (hex, rgb, rgba, hsl, hsla, or known keyword).
 * Rejects values that could be used for CSS injection.
 */
export function isValidCssColor(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 100) return false;

  // Reject values that could break out of CSS context
  if (/[;{}()]|url\s*\(|expression\s*\(|javascript:/i.test(trimmed)) {
    return false;
  }

  return (
    HEX_COLOR_REGEX.test(trimmed) ||
    RGB_COLOR_REGEX.test(trimmed) ||
    HSL_COLOR_REGEX.test(trimmed) ||
    SAFE_COLOR_KEYWORDS.has(trimmed.toLowerCase())
  );
}

/**
 * Returns a safe color value, or fallback if invalid.
 */
export function getSafeCssColor(value: string | undefined | null, fallback = '#000000'): string {
  if (!value || typeof value !== 'string') return fallback;
  return isValidCssColor(value) ? value.trim() : fallback;
}
