import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  Chip,
  Box,
  OutlinedInput,
  CircularProgress,
} from '@mui/material';

export interface SimpleSelectOption {
  value: string | number;
  label: string;
}

export interface SimpleSelectProps {
  label: string;
  value: string | string[] | number | number[] | null | undefined;
  onChange: (value: string | string[] | null) => void;
  options: SimpleSelectOption[];
  placeholder?: string;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  isLoading?: boolean;
}

export const SimpleSelect: React.FC<SimpleSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  helperText,
  fullWidth = true,
  size = 'small',
  required = false,
  error = false,
  disabled = false,
  multiple = false,
  isLoading = false,
}) => {
  const handleChange = (event: any) => {
    const val = event.target.value;
    onChange(val);
  };

  return (
    <FormControl fullWidth={fullWidth} size={size} required={required} error={error} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        value={value ?? (multiple ? [] : '')}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        multiple={multiple}
        disabled={disabled || isLoading}
        endAdornment={isLoading ? <CircularProgress size={20} /> : undefined}
        renderValue={(selected) => {
          if (multiple) {
            const selectedValues = selected as (string | number)[];
            if (selectedValues.length === 0) {
              return <em>{placeholder || 'Select...'}</em>;
            }
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedValues.map((val) => {
                  const option = options.find((opt) => opt.value === val);
                  return (
                    <Chip
                      key={val}
                      label={option?.label || val}
                      size="small"
                    />
                  );
                })}
              </Box>
            );
          }
          const option = options.find((opt) => opt.value === selected);
          return option?.label || selected || <em>{placeholder || 'Select...'}</em>;
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
