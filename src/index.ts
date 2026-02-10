/**
 * Custom Form Renderer - Main Export
 */

export { FormRenderer } from './components/FormRenderer';
export { FieldRenderer } from './components/FieldRenderer';
export { FormViewMode } from './components/view/FormViewMode';
export { FieldView } from './components/view/FieldView';

// Field components
export { TextField } from './components/fields/TextField';
export { SelectField } from './components/fields/SelectField';
export { CheckboxField } from './components/fields/CheckboxField';
export { RadioField } from './components/fields/RadioField';
export { ToggleField } from './components/fields/ToggleField';
export { ColorField } from './components/fields/ColorField';
export { DateTimePickerField } from './components/fields/DatePickerField';
export { CKEditorField } from './components/fields/CKEditorField';
export { FileField } from './components/fields/FileField';
export { FormReferenceField, ApiReferenceField } from './components/fields/ReferenceFields';

// Common components
export { SimpleSelect } from './components/common/SimpleSelect';
export type { SimpleSelectProps, SimpleSelectOption } from './components/common/SimpleSelect';

// Types
export type {
  FormSchema,
  FormField,
  FormSection,
  FormRendererProps,
  FieldRendererProps,
  FormServices,
  FileUploadService,
  FormReferenceService,
  ApiReferenceService,
  DateFormatterService,
  OptionItem,
  FieldType,
  FieldValidation,
  UploadedFile,
  FormColors,
} from './types';

// Utilities
export {
  getAllFields,
  normalizeInitialValues,
  transformFormValues,
  getDefaultValue,
} from './utils/formHelpers';

export {
  formatFileSize,
  validateFile,
  buildFieldRules,
  normalizeOptions,
} from './utils/fieldHelpers';

// CKEditor utilities
export {
  loadCKEditor,
  isCKEditorAvailable,
  waitForCKEditor,
} from './utils/ckeditorLoader';

export { useCKEditor } from './hooks/useCKEditor';

// Services
export {
  defaultFileUploadService,
  defaultFormReferenceService,
  defaultApiReferenceService,
  defaultDateFormatterService,
} from './services/defaultServices';
