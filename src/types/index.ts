/**
 * Core types for Custom Form Renderer
 */

export interface OptionItem {
  label: string;
  value: string | number;
  icon?: string;
  group?: string;
}

export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'datepicker'
  | 'file'
  | 'ckeditor'
  | 'toggle'
  | 'color'
  | 'formReference'
  | 'apiReference';

export interface FieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  maxFileSize?: number; // Max file size in bytes (for file type)
  allowedFileTypes?: string[]; // Allowed file extensions/types (e.g., ['pdf', 'jpg', 'png'])
}

export interface FormField {
  type: FieldType;
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  allowFilter?: boolean;
  options?: OptionItem[] | string[]; // Supports both OptionItem[] and legacy string[]
  validation?: FieldValidation;
  // For formReference type
  referenceFormName?: string;
  referenceFieldName?: string;
  // For apiReference type
  apiEndpoint?: string;
  referenceModel?: string;
  apiLabelField?: string;
  apiValueField?: string;
  // For file type
  allowMultiple?: boolean;
  // For datepicker type
  datePickerMode?: 'date' | 'datetime' | 'time';
  /** @deprecated Use datePickerMode instead */
  displayTime?: boolean;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormSchema {
  _id?: string;
  id?: string; // Legacy support
  title: string;
  name: string; // Unique identifier, lowercase
  module?: string | null;
  formType?: 'system' | 'custom';
  collectionName?: string;
  sections?: FormSection[];
  fields?: FormField[]; // Legacy support - will be migrated to sections
  settings?: {
    sectionDisplayMode?: 'panel' | 'stepper';
    fieldsPerRow?: number; // 1, 2, or 3
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface FormRendererProps {
  formSchema: FormSchema;
  onSubmit?: (data: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  onSuccess?: () => void;
  initialValues?: Record<string, any>;
  hideTitle?: boolean;
  allowResetOnValuesChange?: boolean;
  mode?: 'edit' | 'view';
  // Service providers for external dependencies
  services?: FormServices;
  // Custom color overrides (if provided, will override Material-UI theme colors)
  colors?: FormColors;
}

export interface FormServices {
  // File upload service
  fileUpload?: FileUploadService;
  // Form reference service (for formReference fields)
  formReference?: FormReferenceService;
  // API reference service (for apiReference fields)
  apiReference?: ApiReferenceService;
  // Date formatting utility
  dateFormatter?: DateFormatterService;
  // Select component (for custom select components)
  SelectComponent?: React.ComponentType<any>;
  // File display component (for view mode)
  FileDisplayComponent?: React.ComponentType<{ fieldValue: any }>;
  // CKEditor content display component (for view mode)
  CKEditorDisplayComponent?: React.ComponentType<{ content: string; maxLength?: number; showViewButton?: boolean }>;
  // File base URL for displaying uploaded files
  fileBaseUrl?: string;
  // CKEditor license key
  ckEditorLicenseKey?: string;
  // CKEditor script path (default: '/lib/ckeditor/ckeditor.js')
  ckEditorScriptPath?: string;
}

export interface FileUploadService {
  uploadFiles: (
    formName: string,
    fieldName: string,
    files: File[]
  ) => Promise<UploadedFile[]>;
}

export interface UploadedFile {
  _id?: string;
  fileName: string;
  originalName?: string;
  fileUrl: string;
  size?: number;
  mimeType?: string;
  [key: string]: any;
}

export interface FormReferenceService {
  fetchOptions: (
    formName: string,
    fieldName: string
  ) => Promise<OptionItem[]>;
}

export interface ApiReferenceService {
  fetchOptions: (
    endpoint: string,
    labelField: string,
    valueField?: string
  ) => Promise<OptionItem[]>;
}

export interface DateFormatterService {
  format: (value: any, options?: { datePickerMode?: 'date' | 'datetime' | 'time' }) => string;
}

export interface FormColors {
  primary?: string;
  secondary?: string;
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
  textPrimary?: string;
  textSecondary?: string;
  divider?: string;
  background?: string;
  backgroundPaper?: string;
}

export interface FieldRendererProps {
  field: FormField;
  control: any; // Control from react-hook-form
  defaultValue: any;
  rules: any;
  errors: any; // FieldErrors from react-hook-form
  setValue: any; // UseFormSetValue from react-hook-form
  formSchema?: FormSchema;
  uploadingFiles?: Record<string, boolean>;
  setUploadingFiles?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setError?: (name: string, error: { type: string; message: string }) => void;
  clearErrors?: (name?: string) => void;
  services?: FormServices;
  colors?: FormColors;
}
