import { useMemo } from 'react';
import { FieldRendererProps } from '../../types';
import { normalizeOptions } from '../../utils/fieldHelpers';
import { SimpleSelectOption } from '../common/SimpleSelect';
import { FormAutocompleteField } from '../common/FormAutocompleteField';

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
    <>
      <FormAutocompleteField
        name={field.name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        field={field}
        errors={errors}
        options={selectOptions}
        isMultiple={isMultiple}
      />
    </>
  );
};
