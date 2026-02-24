import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { FormField, OptionItem, FormServices, FormColors } from '../../types';
import { normalizeOptions } from '../../utils/fieldHelpers';
import { defaultDateFormatterService, defaultFormReferenceService, defaultApiReferenceService } from '../../services/defaultServices';
import { useFormColors } from '../../utils/useFormColors';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { getSafeCssColor } from '../../utils/isValidCssColor';
import {
  getCachedOptions,
  setCachedOptions,
  getFormReferenceCacheKey,
  getApiReferenceCacheKey,
} from '../../utils/referenceOptionsCache';

interface FieldViewProps {
  field: FormField;
  value: any;
  services?: FormServices;
}

export const FieldView = ({ field, value, services }: FieldViewProps) => {
  const fieldLabelColor = "text.secondary";
  const fieldValueColor = "text.primary";
  const dateFormatter = services?.dateFormatter || defaultDateFormatterService;
  const FileDisplayComponent = services?.FileDisplayComponent;
  const CKEditorDisplayComponent = services?.CKEditorDisplayComponent;
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
          <Typography variant="body2" sx={{ fontWeight: 500, color: fieldLabelColor }}>
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
        <Typography variant="body2" sx={{ fontWeight: 500, color: fieldLabelColor }}>
          {field.label}
        </Typography>
        <Typography variant="body1" sx={{ color: fieldValueColor }}>
          {value ? (Array.isArray(value) ? `${value.length} file(s)` : '1 file') : '—'}
        </Typography>
      </Box>
    );
  }

  // Special handling for formReference and apiReference - fetch labels async
  if (field.type === 'formReference' || field.type === 'apiReference') {
    return (
      <ReferenceFieldView
        field={field}
        value={value}
        services={services}
        fieldLabelColor={fieldLabelColor}
        fieldValueColor={fieldValueColor}
      />
    );
  }

  // Special handling for color fields - display 30x30 color box
  if (field.type === 'color') {
    const colorValue = getSafeCssColor(value && typeof value === 'string' ? value : undefined, '#000000');
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
        <Typography variant="body2" sx={{ fontWeight: 500, color: fieldLabelColor }}>
          {field.label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {value ? (
            <Box
              sx={{
                width: 30,
                height: 30,
                backgroundColor: colorValue,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ color: fieldValueColor, fontStyle: 'italic' }}>
              —
            </Typography>
          )}
        </Box>
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
        <Typography variant="body2" sx={{ fontWeight: 500, color: fieldLabelColor }}>
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
        <Typography variant="body2" sx={{ fontWeight: 500, color: fieldLabelColor }}>
          {field.label}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: fieldValueColor,
            fontStyle: formattedValue === '—' ? 'italic' : 'normal',
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(value || '') }}
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
      <Typography variant="body2" sx={{ fontWeight: 500, color: fieldLabelColor }}>
        {field.label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: fieldValueColor,
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

/** Fetches and displays labels for formReference and apiReference fields */
const ReferenceFieldView = ({
  field,
  value,
  services,
  fieldLabelColor,
  fieldValueColor,
}: {
  field: FormField;
  value: any;
  services?: FormServices;
  fieldLabelColor: string;
  fieldValueColor: string;
}) => {
  const [displayLabels, setDisplayLabels] = useState<string[] | null>(null);

  useEffect(() => {
    if (value === null || value === undefined || value === '') {
      setDisplayLabels([]);
      return;
    }

    let values: any[];
    if (field.allowMultiple) {
      values = Array.isArray(value) ? value : (value ? [value] : []);
    } else {
      values = Array.isArray(value) && value.length > 0 ? [value[0]] : value ? [value] : [];
    }

    if (values.length === 0) {
      setDisplayLabels([]);
      return;
    }

    const fetchLabels = async () => {
      try {
        let cacheKey: string | null = null;
        let options: OptionItem[] | null = null;

        if (field.type === 'formReference' && field.referenceFormName && field.referenceFieldName) {
          cacheKey = getFormReferenceCacheKey(field.referenceFormName, field.referenceFieldName);
          options = getCachedOptions(cacheKey);
          if (!options) {
            const formRefService = services?.formReference || defaultFormReferenceService;
            options = await formRefService.fetchOptions(field.referenceFormName, field.referenceFieldName);
            setCachedOptions(cacheKey, options);
          }
        } else if (field.type === 'apiReference' && field.apiEndpoint && field.apiLabelField) {
          const valueField = field.apiValueField || '_id';
          cacheKey = getApiReferenceCacheKey(field.apiEndpoint, field.apiLabelField, valueField);
          options = getCachedOptions(cacheKey);
          if (!options) {
            const apiRefService = services?.apiReference || defaultApiReferenceService;
            options = await apiRefService.fetchOptions(field.apiEndpoint, field.apiLabelField, valueField);
            setCachedOptions(cacheKey, options);
          }
        }

        const labels = values.map((val: any) => {
          const option = (options || []).find((opt) => opt.value === val || String(opt.value) === String(val));
          return option ? option.label : String(val);
        });
        setDisplayLabels(labels);
      } catch {
        setDisplayLabels(values.map((v: any) => String(v)));
      }
    };

    fetchLabels();
  }, [field, value, services]);

  const displayText =
    displayLabels === null
      ? '...'
      : displayLabels.length === 0
        ? '—'
        : displayLabels.join(', ');

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
      <Typography variant="body2" sx={{ fontWeight: 500, color: fieldLabelColor }}>
        {field.label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: fieldValueColor,
          fontStyle: displayText === '—' ? 'italic' : 'normal',
          fontWeight: 400,
          fontSize: '0.875rem',
          lineHeight: 1.5,
        }}
      >
        {displayText}
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
        return String(val);
      };

      if (values.length > 1 || field.allowMultiple) {
        const labels = values.map(val => getLabelForValue(val));
        return labels.join(', ');
      }

      return getLabelForValue(values[0]);

    case 'color':
      return value ? String(value) : '—';

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
