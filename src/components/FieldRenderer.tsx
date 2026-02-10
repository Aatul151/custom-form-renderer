import React from 'react';
import { FieldRendererProps } from '../types';
import { TextField } from './fields/TextField';
import { SelectField } from './fields/SelectField';
import { CheckboxField } from './fields/CheckboxField';
import { RadioField } from './fields/RadioField';
import { ToggleField } from './fields/ToggleField';
import { ColorField } from './fields/ColorField';
import { CKEditorField } from './fields/CKEditorField';
import { FileField } from './fields/FileField';
import { FormReferenceField, ApiReferenceField } from './fields/ReferenceFields';
import { buildFieldRules } from '../utils/fieldHelpers';
import { getDefaultValue } from '../utils/formHelpers';
import { DateTimePickerField } from './fields/DatePickerField';

interface FieldRendererComponentProps extends Omit<FieldRendererProps, 'defaultValue' | 'rules'> {
  formSchema: any;
  uploadingFiles: Record<string, boolean>;
  setUploadingFiles: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setError: (name: string, error: { type: string; message: string }) => void;
  clearErrors: (name?: string) => void;
}

export const FieldRenderer = (props: FieldRendererComponentProps) => {
  const { field, formSchema, uploadingFiles, setUploadingFiles, setError, clearErrors, services } = props;
  const rules = buildFieldRules(field);
  const defaultValue = getDefaultValue(field);

  const commonProps: FieldRendererProps = {
    field,
    control: props.control,
    defaultValue,
    rules,
    errors: props.errors,
    setValue: props.setValue,
    formSchema,
    services,
    colors: props.colors,
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return <TextField {...commonProps} />;

    case 'select':
      return <SelectField {...commonProps} services={services} />;

    case 'checkbox':
      return <CheckboxField {...commonProps} />;

    case 'radio':
      return <RadioField {...commonProps} />;

    case 'datepicker':
      return <DateTimePickerField {...commonProps} />;

    case 'toggle':
      return <ToggleField {...commonProps} />;

    case 'color':
      return <ColorField {...commonProps} />;

    case 'ckeditor':
      return <CKEditorField {...commonProps} formSchema={formSchema} setValue={props.setValue} />;

    case 'file':
      return (
        <FileField
          {...commonProps}
          uploadingFiles={uploadingFiles}
          setUploadingFiles={setUploadingFiles}
          setError={setError}
          clearErrors={clearErrors}
        />
      );

    case 'formReference':
      return <FormReferenceField {...commonProps} services={services} />;

    case 'apiReference':
      return <ApiReferenceField {...commonProps} services={services} />;

    default:
      return null;
  }
};
