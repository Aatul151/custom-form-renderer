import { useMemo, useEffect, useState } from 'react';
import { FieldRendererProps, OptionItem } from '../../types';
import { getDefaultValue } from '../../utils/formHelpers';
import { buildFieldRules } from '../../utils/fieldHelpers';
import { SimpleSelectOption } from '../common/SimpleSelect';
import {
  defaultFormReferenceService,
  defaultApiReferenceService,
} from '../../services/defaultServices';
import { FormAutocompleteField } from '../common/FormAutocompleteField';

export const FormReferenceField = ({ field, control, defaultValue, rules, errors, services }: FieldRendererProps) => {
  const isMultiple = field.allowMultiple || false;
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formReferenceService = services?.formReference || defaultFormReferenceService;

  useEffect(() => {
    refresh()
  }, [field.referenceFormName, field.referenceFieldName, formReferenceService]);

  const refresh = () => {
    if (!field.referenceFormName || !field.referenceFieldName) return;

    setIsLoading(true);
    formReferenceService
      .fetchOptions(field.referenceFormName, field.referenceFieldName)
      .then((opts: OptionItem[]) => {
        setOptions(opts);
      })
      .catch((error: any) => {
        console.error('Failed to fetch form reference options:', error);
        setOptions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Convert OptionItem[] to SimpleSelectOption[]
  const selectOptions: SimpleSelectOption[] = useMemo(() => {
    return options.map((opt: OptionItem) => ({
      value: String(opt.value),
      label: opt.label,
    }));
  }, [options]);

  const fieldDefaultValue = defaultValue ?? getDefaultValue(field);
  const fieldRules = rules ?? buildFieldRules(field);
  const isDisabled = !field.referenceFormName || !field.referenceFieldName;

  return (
    <FormAutocompleteField
      name={field.name}
      control={control}
      defaultValue={fieldDefaultValue}
      rules={fieldRules}
      field={field}
      errors={errors}
      options={selectOptions}
      isMultiple={isMultiple}
      isDisabled={isDisabled}
      isLoading={isLoading}
      refresh={refresh}
    />
  );
};

export const ApiReferenceField = ({ field, control, defaultValue, rules, errors, services }: FieldRendererProps) => {
  const isMultiple = field.allowMultiple || false;
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiReferenceService = services?.apiReference || defaultApiReferenceService;

  useEffect(() => {
    refreshApi()
  }, [field.apiEndpoint, field.apiLabelField, field.apiValueField, apiReferenceService]);

  const refreshApi = () => {
    if (!field.apiEndpoint || !field.apiLabelField) return;

    setIsLoading(true);
    apiReferenceService
      .fetchOptions(field.apiEndpoint, field.apiLabelField, field.apiValueField || '_id')
      .then((opts: OptionItem[]) => {
        setOptions(opts);
      })
      .catch((error: any) => {
        console.error('Failed to fetch API reference options:', error);
        setOptions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Convert OptionItem[] to SimpleSelectOption[]
  const selectOptions: SimpleSelectOption[] = useMemo(() => {
    return options.map((opt: OptionItem) => ({
      value: String(opt.value),
      label: opt.label,
    }));
  }, [options]);

  const fieldDefaultValue = defaultValue ?? getDefaultValue(field);
  const fieldRules = rules ?? buildFieldRules(field);
  const isDisabled = !field.apiEndpoint || !field.apiLabelField;

  return (
    <FormAutocompleteField
      name={field?.name}
      control={control}
      defaultValue={fieldDefaultValue}
      rules={fieldRules}
      field={field}
      errors={errors}
      options={selectOptions}
      isMultiple={isMultiple}
      isDisabled={isDisabled}
      isLoading={isLoading}
      placeholder="Search and select..."
      refresh={refreshApi}
    />
  );
};
