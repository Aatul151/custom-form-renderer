# Usage Guide

## Installation

```bash
npm install @custom-form/renderer
```

## Basic Example

```tsx
import { FormRenderer, FormSchema } from '@custom-form/renderer';

const formSchema: FormSchema = {
  title: 'User Registration',
  name: 'user-registration',
  sections: [
    {
      id: 'personal',
      title: 'Personal Information',
      fields: [
        {
          type: 'text',
          name: 'firstName',
          label: 'First Name',
          required: true,
        },
        {
          type: 'text',
          name: 'lastName',
          label: 'Last Name',
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

function MyForm() {
  const handleSubmit = async (data: Record<string, any>) => {
    console.log('Submitted:', data);
    // Send to your API
  };

  return (
    <FormRenderer
      formSchema={formSchema}
      onSubmit={handleSubmit}
      onSuccess={() => alert('Form submitted!')}
    />
  );
}
```

## With Services

```tsx
import { FormRenderer, FormServices } from '@custom-form/renderer';

const services: FormServices = {
  fileUpload: {
    uploadFiles: async (formName, fieldName, files) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      return data.files; // Should return UploadedFile[]
    },
  },
  
  formReference: {
    fetchOptions: async (formName, fieldName) => {
      const response = await fetch(`/api/forms/${formName}/entries`);
      const data = await response.json();
      return data.map(entry => ({
        label: entry.payload[fieldName] || entry[fieldName],
        value: entry._id,
      }));
    },
  },
  
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
  
  fileBaseUrl: 'https://your-cdn.com/uploads/',
  ckEditorLicenseKey: 'your-license-key',
};

function MyForm() {
  return (
    <FormRenderer
      formSchema={formSchema}
      onSubmit={handleSubmit}
      services={services}
    />
  );
}
```

## View Mode

```tsx
<FormRenderer
  formSchema={formSchema}
  initialValues={{
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  }}
  mode="view"
/>
```

## Form with Initial Values (Edit Mode)

```tsx
<FormRenderer
  formSchema={formSchema}
  initialValues={{
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  }}
  onSubmit={handleSubmit}
  allowResetOnValuesChange={true}
/>
```

## Complete Example with All Field Types

```tsx
const completeSchema: FormSchema = {
  title: 'Complete Form Example',
  name: 'complete-form',
  settings: {
    sectionDisplayMode: 'panel',
    fieldsPerRow: 2,
  },
  sections: [
    {
      id: 'basic',
      title: 'Basic Fields',
      fields: [
        { type: 'text', name: 'text', label: 'Text Field', required: true },
        { type: 'email', name: 'email', label: 'Email', required: true },
        { type: 'number', name: 'age', label: 'Age', validation: { min: 0, max: 120 } },
        {
          type: 'select',
          name: 'country',
          label: 'Country',
          options: [
            { label: 'USA', value: 'us' },
            { label: 'Canada', value: 'ca' },
          ],
        },
        { type: 'checkbox', name: 'agree', label: 'I agree to terms' },
        { type: 'toggle', name: 'notifications', label: 'Enable notifications' },
        { type: 'color', name: 'favoriteColor', label: 'Favorite Color' },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced Fields',
      fields: [
        {
          type: 'datepicker',
          name: 'birthDate',
          label: 'Birth Date',
          datePickerMode: 'date',
        },
        {
          type: 'file',
          name: 'documents',
          label: 'Upload Documents',
          allowMultiple: true,
          validation: {
            maxFileSize: 5242880, // 5MB
            allowedFileTypes: ['pdf', 'doc', 'docx'],
          },
        },
        {
          type: 'ckeditor',
          name: 'description',
          label: 'Description',
        },
        {
          type: 'formReference',
          name: 'relatedUser',
          label: 'Related User',
          referenceFormName: 'users',
          referenceFieldName: 'name',
        },
        {
          type: 'apiReference',
          name: 'role',
          label: 'Role',
          apiEndpoint: '/api/roles',
          apiLabelField: 'name',
          apiValueField: '_id',
        },
      ],
    },
  ],
};
```
