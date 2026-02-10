import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControlLabel, Checkbox } from '@mui/material';
import { FieldRendererProps } from '../../types';

export const CheckboxField = ({ field, control, defaultValue, rules }: FieldRendererProps) => {
  return (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: formField }) => (
        <FormControlLabel
          control={
            <Checkbox
              {...formField}
              checked={formField.value || false}
              size="small"
            />
          }
          label={field.label}
        />
      )}
    />
  );
};
