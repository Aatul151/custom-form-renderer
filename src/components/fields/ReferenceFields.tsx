import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { FieldRendererProps, OptionItem } from '../../types';
import { getDefaultValue } from '../../utils/formHelpers';
import { buildFieldRules } from '../../utils/fieldHelpers';
import { SimpleSelect, SimpleSelectOption } from '../common/SimpleSelect';
import {
  defaultFormReferenceService,
  defaultApiReferenceService,
} from '../../services/defaultServices';
import {
  getCachedOptions,
  setCachedOptions,
  getFormReferenceCacheKey,
  getApiReferenceCacheKey,
} from '../../utils/referenceOptionsCache';

export const FormReferenceField = ({ field, control, defaultValue, rules, errors, services }: FieldRendererProps) => {
  const isMultiple = field.allowMultiple || false;
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formReferenceService = services?.formReference || defaultFormReferenceService;

  const fetchOptions = useCallback((forceRefresh = false) => {
    if (!field.referenceFormName || !field.referenceFieldName) return;
    const cacheKey = getFormReferenceCacheKey(field.referenceFormName, field.referenceFieldName);
    if (!forceRefresh) {
      const cached = getCachedOptions(cacheKey);
      if (cached) {
        setOptions(cached);
        return;
      }
    }
    setIsLoading(true);
    formReferenceService
      .fetchOptions(field.referenceFormName, field.referenceFieldName)
      .then((opts: OptionItem[]) => {
        setCachedOptions(cacheKey, opts);
        setOptions(opts);
      })
      .catch((error: any) => {
        console.error('Failed to fetch form reference options:', error);
        setOptions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [field.referenceFormName, field.referenceFieldName, formReferenceService]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

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
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={fieldDefaultValue}
      rules={fieldRules}
      render={({ field: formField }) => {
        return (
          <SimpleSelect
            label={field.label}
            value={formField.value}
            onChange={(value: string | string[] | null) => {
              formField.onChange(value);
            }}
            options={selectOptions}
            placeholder={field.placeholder || 'Search and select...'}
            helperText={errors[field.name]?.message as string}
            fullWidth={true}
            size="small"
            required={field.required}
            error={!!errors[field.name]}
            disabled={isDisabled || isLoading}
            multiple={isMultiple}
            isLoading={isLoading}
            refreshable={true}
            onRefresh={() => fetchOptions(true)}
          />
        );
      }}
    />
  );
};

export const ApiReferenceField = ({ field, control, defaultValue, rules, errors, services }: FieldRendererProps) => {
  const isMultiple = field.allowMultiple || false;
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiReferenceService = services?.apiReference || defaultApiReferenceService;

  const fetchOptions = useCallback((forceRefresh = false) => {
    if (!field.apiEndpoint || !field.apiLabelField) return;
    const valueField = field.apiValueField || '_id';
    const cacheKey = getApiReferenceCacheKey(field.apiEndpoint, field.apiLabelField, valueField);
    if (!forceRefresh) {
      const cached = getCachedOptions(cacheKey);
      if (cached) {
        setOptions(cached);
        return;
      }
    }
    setIsLoading(true);
    apiReferenceService
      .fetchOptions(field.apiEndpoint, field.apiLabelField, valueField)
      .then((opts: OptionItem[]) => {
        setCachedOptions(cacheKey, opts);
        setOptions(opts);
      })
      .catch((error: any) => {
        console.error('Failed to fetch API reference options:', error);
        setOptions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [field.apiEndpoint, field.apiLabelField, field.apiValueField, apiReferenceService]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

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
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={fieldDefaultValue}
      rules={fieldRules}
      render={({ field: formField }) => {
        return (
          <SimpleSelect
            label={field.label}
            value={formField.value}
            onChange={(value: string | string[] | null) => {
              formField.onChange(value);
            }}
            options={selectOptions}
            placeholder={field.placeholder || 'Search and select...'}
            helperText={errors[field.name]?.message as string}
            fullWidth={true}
            size="small"
            required={field.required}
            error={!!errors[field.name]}
            disabled={isDisabled || isLoading}
            multiple={isMultiple}
            isLoading={isLoading}
            refreshable={true}
            onRefresh={() => fetchOptions(true)}
          />
        );
      }}
    />
  );
};
