import React from 'react';
import { Controller } from 'react-hook-form';
import { Box, Typography, Input, FormLabel } from '@mui/material';
import { FieldRendererProps } from '../../types';

export const ColorField = ({ field, control, defaultValue, rules, errors }: FieldRendererProps) => {
  return (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: formField }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <FormLabel
            required={field.required}
            error={!!errors[field.name]}
          >
            {field.label}
          </FormLabel>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: 200 }}>
            <Input
              {...formField}
              type="color"
              sx={{
                width: '20%',
                height: '40px',
                cursor: 'pointer',
                border: errors[field.name] ? '1px solid red' : '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                padding: '1px',
              }}
              inputProps={{
                style: {
                  height: '100%',
                  cursor: 'pointer',
                },
              }}
            />
            {errors[field.name] && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors[field.name]?.message as string}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    />
  );
};
