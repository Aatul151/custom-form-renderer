import { FormSchema, FormField, OptionItem } from '../types';
import { getAllFields } from './formHelpers';
import {
  getCachedOptions,
  getFormReferenceCacheKey,
  getApiReferenceCacheKey,
} from './referenceOptionsCache';

const getReferenceOptions = (field: FormField): OptionItem[] | null => {
  if (field.type === 'formReference') {
    if (!field.referenceFormName || !field.referenceFieldName) return null;
    return getCachedOptions(
      getFormReferenceCacheKey(field.referenceFormName, field.referenceFieldName)
    );
  }

  if (field.type === 'apiReference') {
    if (!field.apiEndpoint || !field.apiLabelField) return null;
    const valueField = field.apiValueField || '_id';
    return getCachedOptions(
      getApiReferenceCacheKey(field.apiEndpoint, field.apiLabelField, valueField)
    );
  }

  return null;
};

const resolveReferenceValue = (
  value: unknown,
  options: OptionItem[],
  allowMultiple: boolean
): OptionItem | OptionItem[] | null => {
  if (value === null || value === undefined || value === '') {
    return allowMultiple ? [] : null;
  }

  const ids = Array.isArray(value) ? value : [value];
  const resolved = ids
    .map((id) => options.find((opt) => String(opt.value) === String(id)))
    .filter((opt): opt is OptionItem => opt !== undefined);

  return allowMultiple ? resolved : (resolved[0] ?? null);
};

/**
 * Resolves formReference / apiReference field IDs to full OptionItem objects
 * using the reference options cache. Does not modify submit payload values.
 */
export const populateFieldValues = (
  data: Record<string, any>,
  formSchema: FormSchema
): Record<string, OptionItem | OptionItem[] | null> => {
  const populateField: Record<string, OptionItem | OptionItem[] | null> = {};

  getAllFields(formSchema).forEach((field) => {
    if (field.type !== 'formReference' && field.type !== 'apiReference') return;
    if (!(field.name in data)) return;

    const options = getReferenceOptions(field);
    if (!options?.length) return;

    populateField[field.name] = resolveReferenceValue(
      data[field.name],
      options,
      !!field.allowMultiple
    );
  });

  return populateField;
};
