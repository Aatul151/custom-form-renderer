# @aatulwork/customform-renderer

A powerful, reusable form renderer component for React with Material-UI support. This package provides a dynamic form rendering system that can generate forms from JSON schemas with support for multiple field types, validation, file uploads, and more.

## Features

- 🎨 **Material-UI Integration** - Built with Material-UI components
- 📝 **13 Field Types** - Text, Email, Number, Select, Checkbox, Radio, DatePicker, File, CKEditor, Toggle, Color, FormReference, ApiReference
- ✅ **Form Validation** - Built-in validation with react-hook-form
- 📱 **Responsive Design** - Mobile-friendly layouts
- 🎯 **Multiple Layouts** - Accordion panels, stepper, and grid layouts
- 👁️ **View Mode** - Read-only view mode for displaying form data
- 🔌 **Service Injection** - Extensible architecture with injectable services
- 📦 **TypeScript** - Fully typed with TypeScript

## Installation

```bash
npm install @aatulwork/customform-renderer
```

### Peer Dependencies

Make sure you have these peer dependencies installed:

```bash
npm install react react-dom @mui/material @mui/icons-material @mui/x-date-pickers react-hook-form @tanstack/react-query dayjs @ckeditor/ckeditor5-react
```

Peer versions: React ^18, MUI ^6, @mui/x-date-pickers ^7, react-hook-form ^7, @tanstack/react-query ^5, dayjs ^1.11, @ckeditor/ckeditor5-react ^11.

### CKEditor Setup

The package includes CKEditor in the `lib/ckeditor/` directory. You need to load it before using CKEditor fields. **If the CKEditor field shows "CKEditor failed to load" or stays on "Loading editor...",** the script URL is not reachable—copy `lib/ckeditor/ckeditor.js` to your app’s `public/lib/ckeditor/` or set `services.ckEditorScriptPath`. See [CKEDITOR_SETUP.md](./CKEDITOR_SETUP.md) for details and troubleshooting.

**Option 1: Include in HTML (Recommended)**
```html
<script src="/lib/ckeditor/ckeditor.js"></script>
```

**Option 2: Copy to your public directory**
```bash
cp node_modules/@aatulwork/customform-renderer/lib/ckeditor/ckeditor.js public/lib/ckeditor/
```

**Option 3: Use dynamic loading**
```tsx
import { useCKEditor } from '@aatulwork/customform-renderer';

const { isReady } = useCKEditor({ autoLoad: true });
```

See [CKEditor Setup Guide](#ckeditor-setup) for more details.

### Using with Vite

**You do not need any Vite config** to use this package. The package ships correct `module` and `exports` so Vite resolves it without aliases.

- **Dependencies:** The package installs `@emotion/react`, `@emotion/styled`, and `@mui/system`; you only need to install the [peer dependencies](#peer-dependencies) (React, MUI, react-hook-form, etc.).

If you use **SSR** or see module resolution / pre-bundling issues, add the optional plugin (one line):

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { customformRendererVite } from '@aatulwork/customform-renderer/vite';

export default defineConfig({
  plugins: [react(), customformRendererVite()],
});
```

The plugin applies `optimizeDeps.include`, `ssr.noExternal`, and excludes the package’s CKEditor script from pre-bundling. You can pass options: `customformRendererVite({ excludeCkeditorFromOptimize: false })` if you load CKEditor only via a script tag.

## Package Exports

The package exports the following:

- **Components:** `FormRenderer`, `FieldRenderer`, `FormViewMode`, `FieldView`
- **Field components:** `TextField`, `SelectField`, `CheckboxField`, `RadioField`, `ToggleField`, `ColorField`, `DateTimePickerField`, `CKEditorField`, `FileField`, `FormReferenceField`, `ApiReferenceField`
- **Common:** `SimpleSelect` (and types `SimpleSelectProps`, `SimpleSelectOption`)
- **Types:** `FormSchema`, `FormField`, `FormSection`, `FormRendererProps`, `FieldRendererProps`, `FormServices`, `FileUploadService`, `FormReferenceService`, `ApiReferenceService`, `DateFormatterService`, `OptionItem`, `FieldType`, `FieldValidation`, `UploadedFile`, `FormColors`
- **Utils:** `getAllFields`, `normalizeInitialValues`, `transformFormValues`, `getDefaultValue`, `formatFileSize`, `validateFile`, `buildFieldRules`, `normalizeOptions`
- **CKEditor:** `loadCKEditor`, `isCKEditorAvailable`, `waitForCKEditor`, `useCKEditor`
- **Default services:** `defaultFileUploadService`, `defaultFormReferenceService`, `defaultApiReferenceService`, `defaultDateFormatterService` (throw if used without override; provide your own via `services`)
- **Vite:** `customformRendererVite` from `@aatulwork/customform-renderer/vite` (optional plugin for SSR / optimizeDeps)

## Quick Start

```tsx
import { FormRenderer, FormSchema } from '@aatulwork/customform-renderer';

const formSchema: FormSchema = {
  title: 'User Registration',
  name: 'user-registration',
  sections: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      fields: [
        {
          type: 'text',
          name: 'firstName',
          label: 'First Name',
          required: true,
        },
        {
          type: 'email',
          name: 'email',
          label: 'Email',
          required: true,
        },
      ],
    },
  ],
};

function App() {
  const handleSubmit = async (data: Record<string, any>) => {
    console.log('Form data:', data);
    // Handle form submission
  };

  return (
    <FormRenderer
      formSchema={formSchema}
      onSubmit={handleSubmit}
      onSuccess={() => console.log('Form submitted successfully!')}
    />
  );
}
```

## Form Schema Structure

### Basic Schema

```typescript
interface FormSchema {
  _id?: string;
  id?: string;        // Legacy support
  title: string;
  name: string;       // Unique identifier (lowercase)
  module?: string | null;
  formType?: 'system' | 'custom';
  collectionName?: string;
  sections?: FormSection[];
  fields?: FormField[]; // Legacy support
  settings?: {
    sectionDisplayMode?: 'panel' | 'stepper';
    fieldsPerRow?: number; // 1, 2, or 3
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
}
```

### Form Section

```typescript
interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}
```

### Form Field

```typescript
interface FormField {
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'radio' |
        'datepicker' | 'file' | 'ckeditor' | 'toggle' | 'color' |
        'formReference' | 'apiReference';
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  allowFilter?: boolean;
  options?: OptionItem[] | string[]; // For select/radio
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    maxFileSize?: number;   // For file fields (bytes)
    allowedFileTypes?: string[]; // For file fields
  };
  // Reference fields
  referenceFormName?: string;
  referenceFieldName?: string;
  apiEndpoint?: string;
  referenceModel?: string;
  apiLabelField?: string;
  apiValueField?: string;
  allowMultiple?: boolean;  // For select/file fields
  datePickerMode?: 'date' | 'datetime' | 'time'; // For datepicker
  displayTime?: boolean;   // @deprecated Use datePickerMode instead
}
```

## Field Types

### Text Fields

```typescript
{
  type: 'text' | 'email' | 'number',
  name: 'fieldName',
  label: 'Field Label',
  required: true,
  placeholder: 'Enter value',
  validation: {
    min: 0,
    max: 100,
    pattern: '^[A-Za-z]+$'
  }
}
```

### Select Field

```typescript
{
  type: 'select',
  name: 'country',
  label: 'Country',
  required: true,
  allowMultiple: false,
  options: [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
  ]
}
```

### Date Picker

Field type is `datepicker`; the exported component is `DateTimePickerField`.

```typescript
{
  type: 'datepicker',
  name: 'birthDate',
  label: 'Birth Date',
  datePickerMode: 'date', // 'date' | 'datetime' | 'time'
}
```

### File Upload

```typescript
{
  type: 'file',
  name: 'documents',
  label: 'Upload Documents',
  allowMultiple: true,
  validation: {
    maxFileSize: 5242880, // 5MB in bytes
    allowedFileTypes: ['pdf', 'doc', 'docx']
  }
}
```

### CKEditor (Rich Text)

```typescript
{
  type: 'ckeditor',
  name: 'description',
  label: 'Description',
  required: true
}
```

### Reference Fields

Reference fields allow you to create dropdown selects that fetch options from other forms or external APIs. There are two types: **Form Reference** and **API Reference**.

#### Form Reference (`formReference`)

Form Reference fields fetch options from entries of another form in your system. This is useful for creating relationships between forms (e.g., selecting a user, product, or category).

**Field Configuration:**
```typescript
{
  type: 'formReference',
  name: 'userId',
  label: 'Select User',
  required: true,
  referenceFormName: 'users',        // Name of the form to reference
  referenceFieldName: 'fullName',   // Field name to display as label
  allowMultiple: false,             // Allow selecting multiple items
  placeholder: 'Select a user...'
}
```

**Required Service Setup:**

You must provide a `formReference` service that fetches options from your form entries:

```tsx
import { FormRenderer, FormServices } from '@aatulwork/customform-renderer';

const services: FormServices = {
  formReference: {
    fetchOptions: async (formName: string, fieldName: string) => {
      // Fetch entries from the referenced form
      const response = await fetch(`/api/forms/${formName}/entries`);
      const data = await response.json();
      
      // Transform entries into OptionItem format
      return data.map((entry: any) => ({
        label: entry.payload[fieldName] || entry[fieldName] || entry._id,
        value: entry._id,
      }));
    },
  },
};

<FormRenderer
  formSchema={formSchema}
  services={services}
  onSubmit={handleSubmit}
/>
```

**Example: Complete Form Reference Setup**

```tsx
import { FormRenderer, FormServices, FormSchema } from '@aatulwork/customform-renderer';

// Define your form schema with formReference field
const formSchema: FormSchema = {
  title: 'Task Assignment',
  name: 'task-assignment',
  sections: [
    {
      id: 'assignment',
      title: 'Assignment Details',
      fields: [
        {
          type: 'formReference',
          name: 'assignedTo',
          label: 'Assign To',
          required: true,
          referenceFormName: 'users',        // References the 'users' form
          referenceFieldName: 'fullName',   // Displays the 'fullName' field
          placeholder: 'Select a user...',
        },
        {
          type: 'formReference',
          name: 'project',
          label: 'Project',
          required: true,
          referenceFormName: 'projects',
          referenceFieldName: 'title',
          allowMultiple: false,
        },
      ],
    },
  ],
};

// Provide the formReference service
const services: FormServices = {
  formReference: {
    fetchOptions: async (formName: string, fieldName: string) => {
      try {
        // Example: Fetch from your API
        const response = await fetch(`/api/forms/${formName}/entries?status=active`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${formName} entries`);
        }
        
        const entries = await response.json();
        
        // Transform to OptionItem format
        return entries.map((entry: any) => ({
          label: entry.payload?.[fieldName] || entry[fieldName] || `Entry ${entry._id}`,
          value: entry._id,
        }));
      } catch (error) {
        console.error(`Error fetching ${formName} options:`, error);
        return [];
      }
    },
  },
};

function TaskForm() {
  const handleSubmit = async (data: Record<string, any>) => {
    console.log('Assigned to:', data.assignedTo); // Will be the _id of selected user
    console.log('Project:', data.project);       // Will be the _id of selected project
    // Submit to your API...
  };

  return (
    <FormRenderer
      formSchema={formSchema}
      services={services}
      onSubmit={handleSubmit}
    />
  );
}
```

#### API Reference (`apiReference`)

API Reference fields fetch options from any external API endpoint. This is useful for integrating with third-party APIs or your own REST endpoints.

**Field Configuration:**
```typescript
{
  type: 'apiReference',
  name: 'role',
  label: 'Select Role',
  required: true,
  apiEndpoint: '/api/roles',         // API endpoint to fetch from
  apiLabelField: 'name',             // Field name to display as label
  apiValueField: '_id',              // Field name to use as value (default: '_id')
  allowMultiple: false,              // Allow selecting multiple items
  placeholder: 'Select a role...'
}
```

**Required Service Setup:**

You must provide an `apiReference` service that fetches options from your API:

```tsx
import { FormRenderer, FormServices } from '@aatulwork/customform-renderer';

const services: FormServices = {
  apiReference: {
    fetchOptions: async (endpoint: string, labelField: string, valueField = '_id') => {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      // Handle both array responses and object responses
      const items = Array.isArray(data) ? data : data.items || data.data || [];
      
      return items.map((item: any) => ({
        label: item[labelField],
        value: item[valueField],
      }));
    },
  },
};

<FormRenderer
  formSchema={formSchema}
  services={services}
  onSubmit={handleSubmit}
/>
```

**Example: Complete API Reference Setup**

```tsx
import { FormRenderer, FormServices, FormSchema } from '@aatulwork/customform-renderer';

// Define your form schema with apiReference field
const formSchema: FormSchema = {
  title: 'User Registration',
  name: 'user-registration',
  sections: [
    {
      id: 'user-info',
      title: 'User Information',
      fields: [
        {
          type: 'text',
          name: 'firstName',
          label: 'First Name',
          required: true,
        },
        {
          type: 'apiReference',
          name: 'country',
          label: 'Country',
          required: true,
          apiEndpoint: '/api/countries',
          apiLabelField: 'name',
          apiValueField: 'code',
        },
        {
          type: 'apiReference',
          name: 'role',
          label: 'Role',
          required: true,
          apiEndpoint: '/api/roles',
          apiLabelField: 'name',
          apiValueField: '_id',  // Default, can be omitted
        },
      ],
    },
  ],
};

// Provide the apiReference service
const services: FormServices = {
  apiReference: {
    fetchOptions: async (endpoint: string, labelField: string, valueField = '_id') => {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${yourAuthToken}`, // Add auth if needed
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch from ${endpoint}`);
        }
        
        const data = await response.json();
        
        // Handle different response formats
        const items = Array.isArray(data) 
          ? data 
          : data.items || data.data || data.results || [];
        
        // Transform to OptionItem format
        return items.map((item: any) => ({
          label: item[labelField] || String(item[valueField]),
          value: item[valueField],
        }));
      } catch (error) {
        console.error(`Error fetching options from ${endpoint}:`, error);
        return [];
      }
    },
  },
};

function RegistrationForm() {
  const handleSubmit = async (data: Record<string, any>) => {
    console.log('Country code:', data.country); // Will be the country code
    console.log('Role ID:', data.role);         // Will be the role _id
    // Submit to your API...
  };

  return (
    <FormRenderer
      formSchema={formSchema}
      services={services}
      onSubmit={handleSubmit}
    />
  );
}
```

#### Multiple Selection Support

Both reference field types support multiple selections:

```typescript
{
  type: 'formReference',
  name: 'tags',
  label: 'Tags',
  referenceFormName: 'tags',
  referenceFieldName: 'name',
  allowMultiple: true,  // Enable multiple selection
}
```

When `allowMultiple: true`, the field will return an array of selected values.

#### Advanced: Custom API with Query Parameters

You can create dynamic endpoints by modifying the service:

```tsx
const services: FormServices = {
  apiReference: {
    fetchOptions: async (endpoint: string, labelField: string, valueField = '_id') => {
      // Add query parameters
      const url = new URL(endpoint, window.location.origin);
      url.searchParams.append('status', 'active');
      url.searchParams.append('limit', '100');
      
      const response = await fetch(url.toString());
      const data = await response.json();
      
      return data.map((item: any) => ({
        label: item[labelField],
        value: item[valueField],
      }));
    },
  },
};
```

#### Error Handling

Both services should handle errors gracefully:

```tsx
const services: FormServices = {
  formReference: {
    fetchOptions: async (formName: string, fieldName: string) => {
      try {
        const response = await fetch(`/api/forms/${formName}/entries`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        return data.map((entry: any) => ({
          label: entry.payload?.[fieldName] || entry._id,
          value: entry._id,
        }));
      } catch (error) {
        console.error('Form reference error:', error);
        return []; // Return empty array on error
      }
    },
  },
  apiReference: {
    fetchOptions: async (endpoint: string, labelField: string, valueField = '_id') => {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        const items = Array.isArray(data) ? data : data.items || [];
        return items.map((item: any) => ({
          label: item[labelField],
          value: item[valueField],
        }));
      } catch (error) {
        console.error('API reference error:', error);
        return []; // Return empty array on error
      }
    },
  },
};
```

#### Notes

- **Loading State**: Reference fields automatically show a loading indicator while fetching options
- **Disabled State**: Fields are disabled if required configuration is missing (e.g., `referenceFormName` or `apiEndpoint`)
- **Error Handling**: If the service throws an error or returns empty array, the field will be disabled
- **Caching**: Options are fetched once when the component mounts and when dependencies change
- **Custom Select Component**: You can provide a custom `SelectComponent` in services to use your own select component

## Service Injection

The package uses a service injection pattern to handle external dependencies. You can provide custom services for file uploads, form references, API references, and more.

### Providing Services

```tsx
import { FormRenderer, FormServices } from '@aatulwork/customform-renderer';

const services: FormServices = {
  // File upload service
  fileUpload: {
    uploadFiles: async (formName, fieldName, files) => {
      // Your upload implementation
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      return response.json();
    },
  },
  
  // Form reference service
  formReference: {
    fetchOptions: async (formName, fieldName) => {
      const response = await fetch(`/api/forms/${formName}/entries`);
      const data = await response.json();
      return data.map(entry => ({
        label: entry.payload[fieldName],
        value: entry._id,
      }));
    },
  },
  
  // API reference service
  apiReference: {
    fetchOptions: async (endpoint, labelField, valueField = '_id') => {
      const response = await fetch(endpoint);
      const data = await response.json();
      return data.map(item => ({
        label: item[labelField],
        value: item[valueField],
      }));
    },
  },
  
  // Date formatter
  dateFormatter: {
    format: (value, options) => {
      // Your date formatting logic
      return new Date(value).toLocaleDateString();
    },
  },
  
  // File base URL for displaying uploaded files
  fileBaseUrl: 'https://your-cdn.com/uploads/',
  
  // CKEditor license key
  ckEditorLicenseKey: 'your-license-key',
};

function App() {
  return (
    <FormRenderer
      formSchema={formSchema}
      onSubmit={handleSubmit}
      services={services}
    />
  );
}
```

## Props

### FormRenderer Props

```typescript
interface FormRendererProps {
  formSchema: FormSchema;
  onSubmit?: (data: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  onSuccess?: () => void;
  initialValues?: Record<string, any>;
  hideTitle?: boolean;
  allowResetOnValuesChange?: boolean;
  mode?: 'edit' | 'view';
  services?: FormServices;
  colors?: FormColors;  // Override theme colors (primary, secondary, error, etc.)
}

// FormColors: primary?, secondary?, error?, success?, warning?, info?,
// textPrimary?, textSecondary?, divider?, background?, backgroundPaper?
```

## View Mode

You can render forms in read-only view mode:

```tsx
<FormRenderer
  formSchema={formSchema}
  initialValues={{
    firstName: 'John',
    email: 'john@example.com',
  }}
  mode="view"
  services={services}
/>
```

## Custom Components

You can provide custom components for specific use cases:

```typescript
const services: FormServices = {
  // Custom select component (e.g., searchable select)
  SelectComponent: MyCustomSelectComponent,
  
  // Custom file display component
  FileDisplayComponent: MyFileDisplayComponent,
  
  // Custom CKEditor display component
  CKEditorDisplayComponent: MyCKEditorDisplayComponent,
};
```

## Examples

### Basic Form

```tsx
const schema: FormSchema = {
  title: 'Contact Form',
  name: 'contact',
  sections: [
    {
      id: 'contact-info',
      title: 'Contact Information',
      fields: [
        { type: 'text', name: 'name', label: 'Name', required: true },
        { type: 'email', name: 'email', label: 'Email', required: true },
        { type: 'text', name: 'phone', label: 'Phone' },
      ],
    },
  ],
};
```

### Form with Stepper

```tsx
const schema: FormSchema = {
  title: 'Multi-Step Form',
  name: 'multistep',
  settings: {
    sectionDisplayMode: 'stepper',
  },
  sections: [
    {
      id: 'step1',
      title: 'Step 1',
      fields: [/* fields */],
    },
    {
      id: 'step2',
      title: 'Step 2',
      fields: [/* fields */],
    },
  ],
};
```

### Form with Grid Layout

```tsx
const schema: FormSchema = {
  title: 'Grid Form',
  name: 'grid-form',
  settings: {
    fieldsPerRow: 2, // 1, 2, or 3 columns
  },
  sections: [
    {
      id: 'grid-section',
      title: 'Grid Section',
      fields: [/* fields will be displayed in 2 columns */],
    },
  ],
};
```

## Building

To build the package:

```bash
npm run build
```

This will generate:
- `dist/index.js` - CommonJS build
- `dist/index.esm.js` - ES Module build
- `dist/index.d.ts` - TypeScript definitions

### Build Commands

```bash
# Standard build
npm run build

# Clean build (removes dist first)
npm run build:clean

# Watch mode (development)
npm run dev
# or
npm run build:watch

# Type check only
npm run lint:check
```

## Publishing

### Quick Publish

```bash
# Patch version (1.0.0 -> 1.0.1) + build + publish
npm run publish:patch

# Minor version (1.0.0 -> 1.1.0) + build + publish
npm run publish:minor

# Major version (1.0.0 -> 2.0.0) + build + publish
npm run publish:major
```

### Publish with Tags

```bash
# Publish as beta
npm run publish:beta

# Publish as next
npm run publish:next

# Publish as public (for scoped packages)
npm run publish:public
```

### Dry Run (Test)

```bash
npm run publish:dry-run
```

### Interactive Publish Scripts

**Linux/Mac:**
```bash
chmod +x scripts/publish.sh
./scripts/publish.sh
```

**Windows:**
```powershell
.\scripts\publish.ps1
```

### Manual Publish Steps

1. **Bump version** (if needed):
   ```bash
   npm run version:patch  # or :minor or :major
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Publish**:
   ```bash
   npm publish --access public
   ```

For detailed publishing instructions, see [PUBLISH_GUIDE.md](./PUBLISH_GUIDE.md).

## Development

```bash
# Install dependencies
npm install

# Build in watch mode
npm run dev

# Build for production
npm run build

# Type check
npm run lint:check
```

## CKEditor Setup

CKEditor is required for the `ckeditor` field type. The package includes the CKEditor build file.

### Setup Methods

#### Method 1: HTML Script Tag (Recommended)

Add to your `index.html` or main HTML file:

```html
<script src="/lib/ckeditor/ckeditor.js"></script>
```

Make sure the file is accessible at `/lib/ckeditor/ckeditor.js` (or copy it to your public directory).

#### Method 2: Copy to Public Directory

If using Vite, Create React App, or similar:

```bash
# Copy CKEditor to your public directory
cp node_modules/@aatulwork/customform-renderer/lib/ckeditor/ckeditor.js public/lib/ckeditor/ckeditor.js
```

Then include in HTML:
```html
<script src="/lib/ckeditor/ckeditor.js"></script>
```

#### Method 3: Dynamic Loading

Use the provided hook to load CKEditor dynamically:

```tsx
import { useCKEditor } from '@aatulwork/customform-renderer';

function App() {
  const { isReady, isLoading, error } = useCKEditor({
    scriptPath: '/lib/ckeditor/ckeditor.js',
    autoLoad: true,
  });

  if (isLoading) {
    return <div>Loading editor...</div>;
  }

  if (error) {
    return <div>Error loading editor: {error.message}</div>;
  }

  return <FormRenderer formSchema={schema} />;
}
```

#### Method 4: Custom Script Path

If CKEditor is hosted elsewhere:

```tsx
const services: FormServices = {
  ckEditorScriptPath: 'https://cdn.example.com/ckeditor.js',
  // ... other services
};
```

### CKEditor Utilities

```tsx
import {
  loadCKEditor,
  isCKEditorAvailable,
  waitForCKEditor,
  useCKEditor,
} from '@aatulwork/customform-renderer';

// Check if available
if (isCKEditorAvailable()) {
  // CKEditor is ready
}

// Load manually
await loadCKEditor('/lib/ckeditor/ckeditor.js');

// Wait for it to become available
await waitForCKEditor(10000); // 10 second timeout

// React hook
const { isReady, isLoading, error, load } = useCKEditor();
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
