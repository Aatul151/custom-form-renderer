import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { FieldRendererProps, OptionItem } from '../../types';
import { normalizeOptions } from '../../utils/fieldHelpers';

export const RadioField = ({ field, control, defaultValue, rules, errors }: FieldRendererProps) => {
  const normalizedOptions = normalizeOptions(field.options);
  
  return (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: formField }) => (
        <FormControl component="fieldset" required={field.required} error={!!errors[field.name]}>
          <FormLabel required={field.required} error={!!errors[field.name]}>
            {field.label}
          </FormLabel>

          <RadioGroup {...formField} row>
            {normalizedOptions.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option.value}
                control={<Radio size="small" />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    />
  );
};
