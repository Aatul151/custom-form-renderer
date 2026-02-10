import { FormSchema, FormField } from '../types';

/**
 * Get all fields from form schema (sections or legacy fields)
 */
export const getAllFields = (formSchema: FormSchema): FormField[] => {
  return formSchema.sections
    ? formSchema.sections.flatMap(section => section.fields)
    : (formSchema.fields || []);
};

/**
 * Normalize initial values to handle backward compatibility
 * - Single value -> array for multiple fields
 * - Array -> first element for single fields
 */
export const normalizeInitialValues = (
  values: Record<string, any>,
  formSchema: FormSchema
): Record<string, any> => {
  if (!values) return values;

  const normalized: Record<string, any> = { ...values };
  const allFields = getAllFields(formSchema);

  allFields.forEach(field => {
    const fieldValue = normalized[field.name];

    // Handle select, formReference, and apiReference fields
    if (field.type === 'select' || field.type === 'formReference' || field.type === 'apiReference') {
      if (field.allowMultiple) {
        // Multiple selection: convert single value to array
        if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
          if (!Array.isArray(fieldValue)) {
            normalized[field.name] = [fieldValue];
          }
        } else {
          normalized[field.name] = [];
        }
      } else {
        // Single selection: convert array to first element
        if (Array.isArray(fieldValue) && fieldValue.length > 0) {
          normalized[field.name] = fieldValue[0];
        } else if (Array.isArray(fieldValue) && fieldValue.length === 0) {
          normalized[field.name] = '';
        }
      }
    }

    // Normalize file fields: convert single file to array if field allows multiple
    if (field.type === 'file') {
      if (field.allowMultiple) {
        if (fieldValue !== null && fieldValue !== undefined) {
          if (!Array.isArray(fieldValue)) {
            normalized[field.name] = [fieldValue];
          }
        } else {
          normalized[field.name] = [];
        }
      } else {
        // Single file: convert array to first element
        if (Array.isArray(fieldValue) && fieldValue.length > 0) {
          normalized[field.name] = fieldValue[0];
        } else if (Array.isArray(fieldValue) && fieldValue.length === 0) {
          normalized[field.name] = null;
        }
      }
    }
  });

  return normalized;
};

/**
 * Get default value for a field based on its type
 */
export const getDefaultValue = (field: FormField): any => {
  switch (field.type) {
    case 'checkbox':
    case 'toggle':
      return false;
    case 'datepicker':
      return null;
    case 'file':
      return field.allowMultiple ? [] : null;
    case 'select':
    case 'formReference':
    case 'apiReference':
      return field.allowMultiple ? [] : '';
    case 'text':
    case 'email':
    case 'number':
    case 'radio':
    case 'ckeditor':
    default:
      return '';
  }
};

/**
 * Transform form values based on field types.
 */
export const transformFormValues = (
  data: Record<string, any>,
  formSchema: FormSchema
): Record<string, any> => {
  const allFields = getAllFields(formSchema);
  const fieldTypeMap = new Map<string, string>();
  allFields.forEach(field => {
    fieldTypeMap.set(field.name, field.type);
  });

  const transformedData: Record<string, any> = {};

  Object.keys(data).forEach(key => {
    const fieldType = fieldTypeMap.get(key);
    const value = data[key];

    if (value === null || value === undefined) {
      transformedData[key] = value;
      return;
    }

    switch (fieldType) {
      case 'number':
        if (value === '' || value === null || value === undefined) {
          transformedData[key] = null;
        } else {
          const numValue = Number(value);
          transformedData[key] = isNaN(numValue) ? value : numValue;
        }
        break;
      case 'checkbox':
      case 'toggle':
        transformedData[key] = Boolean(value);
        break;
      case 'datepicker':
      case 'file':
      default:
        transformedData[key] = value;
    }
  });

  return transformedData;
};
