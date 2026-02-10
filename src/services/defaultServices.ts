/**
 * Default service implementations
 * These are fallback implementations that can be overridden
 */

import {
  FileUploadService,
  FormReferenceService,
  ApiReferenceService,
  DateFormatterService,
  OptionItem,
  UploadedFile,
} from '../types';
import dayjs from 'dayjs';

/**
 * Default file upload service - throws error, must be provided
 */
export const defaultFileUploadService: FileUploadService = {
  uploadFiles: async () => {
    throw new Error('File upload service not provided. Please provide a fileUpload service in FormServices.');
  },
};

/**
 * Default form reference service - throws error, must be provided
 */
export const defaultFormReferenceService: FormReferenceService = {
  fetchOptions: async () => {
    throw new Error('Form reference service not provided. Please provide a formReference service in FormServices.');
  },
};

/**
 * Default API reference service - throws error, must be provided
 */
export const defaultApiReferenceService: ApiReferenceService = {
  fetchOptions: async () => {
    throw new Error('API reference service not provided. Please provide an apiReference service in FormServices.');
  },
};

/**
 * Default date formatter service
 */
export const defaultDateFormatterService: DateFormatterService = {
  format: (value: any, options?: { datePickerMode?: 'date' | 'datetime' | 'time' }) => {
    if (!value) return '—';
    
    const mode = options?.datePickerMode || 'date';
    const date = dayjs(value);
    
    if (!date.isValid()) return String(value);
    
    switch (mode) {
      case 'date':
        return date.format('DD/MM/YYYY');
      case 'time':
        return date.format('hh:mm A');
      case 'datetime':
        return date.format('DD/MM/YYYY hh:mm A');
      default:
        return date.format('DD/MM/YYYY');
    }
  },
};
