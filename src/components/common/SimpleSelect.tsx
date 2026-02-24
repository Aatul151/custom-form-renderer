import React, { useState, useId } from 'react';
import {
  FormControl,
  FormLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  Chip,
  Box,
  OutlinedInput,
  CircularProgress,
  TextField,
  ListSubheader,
  InputAdornment,
  IconButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

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
  filterable?: boolean;
  filterPlaceholder?: string;
  refreshable?: boolean;
  onRefresh?: () => void;
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
  filterable = true,
  filterPlaceholder = 'Filter...',
  refreshable = false,
  onRefresh,
}) => {
  const [filterText, setFilterText] = useState('');
  const selectId = useId();

  const handleChange = (event: any) => {
    const val = event.target.value;
    onChange(val);
  };

  const filteredOptions =
    filterable && filterText
      ? options.filter((opt) =>
          String(opt.label).toLowerCase().includes(filterText.toLowerCase())
        )
      : options;

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const handleClose = () => {
    setFilterText('');
  };

  return (
    <FormControl fullWidth={fullWidth} size={size} required={required} error={error} disabled={disabled}>
      <FormLabel
        component="label"
        htmlFor={selectId}
        required={required}
        error={error}
        sx={{ mb: 0.5, display: 'block' }}
      >
        {label}
      </FormLabel>
      <MuiSelect
        id={selectId}
        value={value ?? (multiple ? [] : '')}
        onChange={handleChange}
        onClose={handleClose}
        input={<OutlinedInput />}
        MenuProps={{
          autoFocus: false,
        }}
        multiple={multiple}
        disabled={disabled || isLoading}
        endAdornment={
          isLoading ? (
            <CircularProgress size={20} />
          ) : refreshable && onRefresh ? (
            <InputAdornment position="end" sx={{ mr: 2 }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRefresh();
                }}
                disabled={disabled}
                aria-label="Refresh options"
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined
        }
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
        {filterable && (
          <ListSubheader
            sx={{ py: 1 }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <TextField
              size="small"
              fullWidth
              placeholder={filterPlaceholder}
              value={filterText}
              onChange={handleFilterChange}
              variant="outlined"
              sx={{ mt: -0.5 }}
              autoFocus
            />
          </ListSubheader>
        )}
        {filteredOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
