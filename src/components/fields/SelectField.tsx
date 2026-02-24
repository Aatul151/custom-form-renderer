import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { FieldRendererProps } from '../../types';
import { normalizeOptions } from '../../utils/fieldHelpers';
import { SimpleSelect, SimpleSelectOption } from '../common/SimpleSelect';

export const SelectField = ({ field, control, defaultValue, rules, errors }: FieldRendererProps) => {
  const isMultiple = field.allowMultiple || false;
  const normalizedOptions = normalizeOptions(field.options);

  // Convert to SimpleSelectOption format
  const selectOptions: SimpleSelectOption[] = useMemo(() => {
    return normalizedOptions.map((opt) => ({
      value: String(opt.value),
      label: opt.label,
    }));
  }, [normalizedOptions]);

  return (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: formField }) => {
        return (
          <SimpleSelect
            label={field.label}
            value={formField.value}
            onChange={(value: string | string[] | null) => {
              formField.onChange(value);
            }}
            options={selectOptions}
            placeholder={field.placeholder || 'Select...'}
            helperText={errors[field.name]?.message as string}
            fullWidth={true}
            size="small"
            required={field.required}
            error={!!errors[field.name]}
            disabled={false}
            multiple={isMultiple}
          />
        );
      }}
    />
  );
};
