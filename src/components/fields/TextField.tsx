import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormLabel, TextField as MuiTextField } from '@mui/material';
import { FieldRendererProps } from '../../types';

export const TextField = ({ field, control, defaultValue, rules, errors }: FieldRendererProps) => {
  return (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: formField }) => (
        <FormControl
          fullWidth
          required={field.required}
          error={!!errors[field.name]}
        >
          <FormLabel> {field.label}</FormLabel>
          <MuiTextField
            {...formField}
            type={field.type === 'number' ? 'number' : field.type}
            placeholder={field.placeholder || 'Enter value'}
            fullWidth
            size="small"
            required={field.required}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message as string}
            inputProps={
              field.type === 'number'
                ? {
                    min: field.validation?.min,
                    max: field.validation?.max,
                  }
                : undefined
            }
          />
        </FormControl>
      )}
    />
  );
};
