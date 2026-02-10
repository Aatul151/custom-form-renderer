import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControlLabel, Switch, Box, Typography } from '@mui/material';
import { FieldRendererProps } from '../../types';

export const ToggleField = ({ field, control, defaultValue, rules, errors }: FieldRendererProps) => {
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
            <Switch
              {...formField}
              checked={formField.value || false}
              size="medium"
            />
          }
          label={
            <Box>
              <Typography variant="body2">
                {field.label} {field.required && '*'}
              </Typography>
              {errors[field.name] && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                  {errors[field.name]?.message as string}
                </Typography>
              )}
            </Box>
          }
        />
      )}
    />
  );
};
