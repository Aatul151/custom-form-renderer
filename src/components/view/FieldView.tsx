import React from 'react';
import { Box, Typography } from '@mui/material';
import { FormField, OptionItem, FormServices } from '../../types';
import { normalizeOptions } from '../../utils/fieldHelpers';
import { defaultDateFormatterService } from '../../services/defaultServices';

interface FieldViewProps {
  field: FormField;
  value: any;
  services?: FormServices;
}

export const FieldView = ({ field, value, services }: FieldViewProps) => {
  const dateFormatter = services?.dateFormatter || defaultDateFormatterService;
  const FileDisplayComponent = services?.FileDisplayComponent;
  const CKEditorDisplayComponent = services?.CKEditorDisplayComponent;

  // Format field value
  const formattedValue = formatFieldValue(field, value, dateFormatter, services);

  // Special handling for file fields
  if (field.type === 'file') {
    if (FileDisplayComponent) {
      return (
        <Box
          key={field.name}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            py: 1.5,
            px: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {field.label}
          </Typography>
          <FileDisplayComponent fieldValue={value} />
        </Box>
      );
    }
    // Fallback if no FileDisplayComponent provided
    return (
      <Box
        key={field.name}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          py: 1.5,
          px: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {field.label}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {value ? (Array.isArray(value) ? `${value.length} file(s)` : '1 file') : '—'}
        </Typography>
      </Box>
    );
  }

  // Special handling for CKEditor fields
  if (field.type === 'ckeditor') {
    if (CKEditorDisplayComponent) {
      return (
        <Box
          key={field.name}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            py: 1.5,
            px: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {field.label}
          </Typography>
          <CKEditorDisplayComponent
            content={value || ''}
            maxLength={150}
            showViewButton={true}
          />
        </Box>
      );
    }
    // Fallback if no CKEditorDisplayComponent provided
    return (
      <Box
        key={field.name}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          py: 1.5,
          px: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {field.label}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: formattedValue === '—' ? 'text.disabled' : 'text.primary',
            fontStyle: formattedValue === '—' ? 'italic' : 'normal',
          }}
          dangerouslySetInnerHTML={{ __html: value || '' }}
        />
      </Box>
    );
  }

  return (
    <Box
      key={field.name}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        py: 1.5,
        px: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {field.label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: formattedValue === '—' ? 'text.disabled' : 'text.primary',
          fontStyle: formattedValue === '—' ? 'italic' : 'normal',
          fontWeight: 400,
          fontSize: '0.875rem',
          lineHeight: 1.5,
        }}
      >
        {formattedValue}
      </Typography>
    </Box>
  );
};

const formatFieldValue = (
  field: FormField,
  value: any,
  dateFormatter: FormServices['dateFormatter'],
  services?: FormServices
): string => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  switch (field.type) {
    case 'checkbox':
    case 'toggle':
      return value ? 'Yes' : 'No';

    case 'datepicker':
      return dateFormatter?.format(value, { datePickerMode: field.datePickerMode }) || String(value);

    case 'select':
    case 'formReference':
    case 'apiReference':
      let values: any[];
      if (field.allowMultiple) {
        values = Array.isArray(value) ? value : (value ? [value] : []);
      } else {
        if (Array.isArray(value)) {
          values = value.length > 0 ? [value[0]] : [];
        } else {
          values = value ? [value] : [];
        }
      }

      if (values.length === 0) {
        return '—';
      }

      const getLabelForValue = (val: any): string => {
        if (field.options) {
          const normalizedOptions = normalizeOptions(field.options);
          const option = normalizedOptions.find((opt) => {
            return opt.value === val || String(opt.value) === String(val);
          });
          if (option) {
            return option.label;
          }
        }
        // For reference fields, we can't resolve labels in view mode without services
        // This would require query client access which we don't have in view mode
        // Users should provide a custom FieldView component if they need this
        return String(val);
      };

      if (values.length > 1 || field.allowMultiple) {
        const labels = values.map(val => getLabelForValue(val));
        return labels.join(', ');
      }

      return getLabelForValue(values[0]);

    case 'radio':
      if (field.options) {
        const normalizedOptions = normalizeOptions(field.options);
        const option = normalizedOptions.find((opt) => {
          return opt.value === value;
        });
        if (option) {
          return option.label;
        }
      }
      return String(value);

    default:
      return String(value);
  }
};
