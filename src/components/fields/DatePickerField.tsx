import React from 'react';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { FieldRendererProps } from '../../types';
import { FormLabel } from '@mui/material';

const textFieldSlotProps = (field: FieldRendererProps['field'], errors: FieldRendererProps['errors']) => ({
  fullWidth: true,
  size: 'small' as const,
  required: field.required,
  error: !!errors[field.name],
  helperText: errors[field.name]?.message as string,
});

function resolveDatePickerMode(field: FieldRendererProps['field']): 'date' | 'datetime' | 'time' {
  if (field.datePickerMode) return field.datePickerMode;
  return field?.displayTime ? 'datetime' : 'date';
}

export const DateTimePickerField = ({ field, control, defaultValue, rules, errors }: FieldRendererProps) => {
  const mode = resolveDatePickerMode(field);

  return (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: formField }) => (
        <>
          <FormLabel
            required={field.required}
            error={!!errors[field.name]}
          >
            {field.label}
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {mode === 'date' && (
              <DatePicker
                format="DD-MM-YYYY"
                value={formField.value ? dayjs(formField.value) : null}
                onChange={(date: Dayjs | null) => formField.onChange(date?.toISOString() ?? null)}
                slotProps={{ textField: textFieldSlotProps(field, errors) }}
              />
            )}
            {mode === 'datetime' && (
              <DateTimePicker
                format="DD-MM-YYYY  hh:mm A"
                value={formField.value ? dayjs(formField.value) : null}
                onChange={(date: Dayjs | null) => formField.onChange(date?.toISOString() ?? null)}
                slotProps={{ textField: textFieldSlotProps(field, errors) }}
              />
            )}
            {mode === 'time' && (
              <TimePicker
                format="hh:mm A"
                value={formField.value ? dayjs(formField.value) : null}
                onChange={(date: Dayjs | null) => formField.onChange(date?.toISOString() ?? null)}
                slotProps={{ textField: textFieldSlotProps(field, errors) }}
              />
            )}
          </LocalizationProvider>
        </>
      )}
    />
  );
};
