/**
 * HTML sanitization for safe rendering of user-supplied content.
 * Prevents XSS when rendering CKEditor/rich text content.
 */

import DOMPurify from 'dompurify';

/**
 * Basic HTML escape for use when DOMPurify is unavailable (e.g. SSR).
 */
function escapeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize HTML string to prevent XSS attacks.
 * Uses DOMPurify in browser; falls back to basic escaping for SSR.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  if (typeof window === 'undefined') {
    return escapeHtml(html);
  }

  try {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'a', 'img',
        'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'span', 'div',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
      ADD_ATTR: ['target'],
    });
  } catch {
    return escapeHtml(html);
  }
}
