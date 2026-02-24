import { FormField } from '../types';

/** MIME types that indicate executable/script content - reject when expecting documents/images */
const DANGEROUS_MIME_PREFIXES = [
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-sh',
  'application/x-bat',
  'application/vnd.microsoft.portable-executable',
  'application/x-mach-binary',
];

/** Extensions that suggest document/image content (for MIME mismatch detection) */
const DOCUMENT_IMAGE_EXTENSIONS = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico',
  'txt', 'csv', 'rtf', 'odt', 'ods', 'odp',
]);

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file based on field configuration.
 * Note: Server-side validation (MIME, magic bytes) is required for security.
 */
export const validateFile = (file: File, field: FormField): string | true => {
  // Check file type by extension
  if (field.validation?.allowedFileTypes && field.validation.allowedFileTypes.length > 0) {
    const parts = file.name.split('.');
    const fileExtension = parts.pop()?.toLowerCase();
    const allowedTypes = field.validation.allowedFileTypes.map(t => t.toLowerCase().replace('.', ''));
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return `File type not allowed. Allowed types: ${field.validation.allowedFileTypes.join(', ')}`;
    }

    // Defense in depth: reject if extension suggests document/image but MIME indicates executable
    const extSuggestsDocument = DOCUMENT_IMAGE_EXTENSIONS.has(fileExtension);
    const mimeIsDangerous = file.type && DANGEROUS_MIME_PREFIXES.some(p => file.type.startsWith(p));
    if (extSuggestsDocument && mimeIsDangerous) {
      return `File type not allowed. File content does not match extension.`;
    }

    // Reject double-extension bypass: e.g. "file.exe.pdf" when only pdf allowed
    const DANGEROUS_EXTENSIONS = new Set(['exe', 'bat', 'cmd', 'sh', 'ps1', 'msi', 'com']);
    if (parts.length >= 2) {
      const primaryExt = parts[parts.length - 1]?.toLowerCase();
      if (primaryExt && DANGEROUS_EXTENSIONS.has(primaryExt)) {
        return `File type not allowed. Allowed types: ${field.validation.allowedFileTypes.join(', ')}`;
      }
    }
  }

  // Check file size
  if (field.validation?.maxFileSize) {
    if (file.size > field.validation.maxFileSize) {
      const maxSizeFormatted = formatFileSize(field.validation.maxFileSize);
      return `File size exceeds maximum allowed size of ${maxSizeFormatted}`;
    }
  }

  return true;
};

/**
 * Build validation rules for a field
 */
export const buildFieldRules = (field: FormField): any => {
  const rules: any = {};
  
  if (field.required) {
    rules.required = `${field.label} is required`;
  }

  // File validation rules
  if (field.type === 'file') {
    rules.validate = (value: any) => {
      if (field.required) {
        if (field.allowMultiple) {
          const files = Array.isArray(value) ? value : [];
          if (files.length === 0) {
            return `${field.label} is required`;
          }
          const hasValidFiles = files.some((file: any) => 
            file && typeof file === 'object' && ('fileName' in file || 'fileUrl' in file)
          );
          if (!hasValidFiles) {
            return `${field.label} is required`;
          }
        } else {
          if (!value || (typeof value === 'object' && !('fileName' in value || 'fileUrl' in value))) {
            return `${field.label} is required`;
          }
        }
      }
      return true;
    };
  }

  // Multiple select validation
  if ((field.type === 'select' || field.type === 'formReference' || field.type === 'apiReference') && field.allowMultiple) {
    rules.validate = (value: string | string[] | null) => {
      const values = value as string[] | null;
      if (!values || values.length === 0) {
        if (field.required) {
          return `${field.label} is required`;
        }
        return true;
      }
      return true;
    };
  }

  return rules;
};

/**
 * Normalize options to OptionItem format
 */
export const normalizeOptions = (options?: FormField['options']): Array<{ label: string; value: string | number }> => {
  if (!options) return [];
  
  return options.map(opt => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return opt;
  });
};
