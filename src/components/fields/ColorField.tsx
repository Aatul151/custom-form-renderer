import React from 'react';
import { Controller } from 'react-hook-form';
import { Box, Typography, FormLabel } from '@mui/material';
import { FieldRendererProps } from '../../types';

export const ColorField = ({ field, control, defaultValue, rules, errors }: FieldRendererProps) => {
  return (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: formField }) => {
        const inputId = `color-field-${field.name}`;
        return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <FormLabel
            component="label"
            htmlFor={inputId}
            required={field.required}
            error={!!errors[field.name]}
          >
            {field.label}
          </FormLabel>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 200 }}>
            <Box
              component="input"
              type="color"
              id={inputId}
              ref={formField.ref}
              name={formField.name}
              value={formField.value ?? '#000000'}
              onChange={formField.onChange}
              onBlur={formField.onBlur}
              sx={{
                width: 30,
                height: 30,
                padding: 0,
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                '&::-webkit-color-swatch-wrapper': { padding: 0 },
                '&::-webkit-color-swatch': { border: 'none', borderRadius: '4px' },
                '&::-moz-color-swatch': { border: 'none', borderRadius: '4px' },
              }}
            />
            {errors[field.name] && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors[field.name]?.message as string}
              </Typography>
            )}
          </Box>
        </Box>
        );
      }}
    />
  );
};
