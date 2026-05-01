import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControlLabel, Switch, Box, Typography, FormLabel } from '@mui/material';
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
          labelPlacement="start"
          control={
            <Switch
              {...formField}
              checked={formField.value || false}
              size="medium"
            />
          }
          label={
            <Box>
              <FormLabel> {field.label} {field.required && '*'}</FormLabel>
              {errors[field.name] && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                  {errors[field.name]?.message as string}
                </Typography>
              )}
            </Box>
          }
          sx={{ marginLeft: "0 !important" }}
        />
      )}
    />
  );
};
