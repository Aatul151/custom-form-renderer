/**
 * Shared in-memory cache for reference field options (formReference, apiReference).
 * Used by both view mode (FieldView) and edit mode (FormReferenceField, ApiReferenceField)
 * to avoid redundant API calls when switching between modes.
 */

import type { OptionItem } from '../types';

const REFERENCE_OPTIONS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { options: OptionItem[]; timestamp: number }>();

export function getCachedOptions(key: string): OptionItem[] | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > REFERENCE_OPTIONS_CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return cached.options;
}

export function setCachedOptions(key: string, options: OptionItem[]): void {
  cache.set(key, { options, timestamp: Date.now() });
}

export function getFormReferenceCacheKey(formName: string, fieldName: string): string {
  return `formRef:${formName}:${fieldName}`;
}

export function getApiReferenceCacheKey(
  endpoint: string,
  labelField: string,
  valueField: string
): string {
  return `apiRef:${endpoint}:${labelField}:${valueField}`;
}
