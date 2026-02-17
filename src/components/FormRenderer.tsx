import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FormRendererProps } from '../types';
import { normalizeInitialValues, transformFormValues, getAllFields } from '../utils/formHelpers';
import { useFormColors } from '../utils/useFormColors';
import { FieldRenderer } from './FieldRenderer';
import { FormViewMode } from './view/FormViewMode';
import {
  defaultFormReferenceService,
  defaultApiReferenceService,
} from '../services/defaultServices';

export const FormRenderer = ({
  formSchema,
  onSubmit,
  onCancel,
  isLoading = false,
  onSuccess,
  initialValues,
  hideTitle = false,
  allowResetOnValuesChange = false,
  mode = 'edit',
  services,
  colors,
}: FormRendererProps) => {
  const formColors = useFormColors(colors);
  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Record<string, any>>({
    defaultValues: initialValues || {},
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const prevInitialValuesRef = useRef<Record<string, any> | undefined>(initialValues);
  const isFormInitializedRef = useRef<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState(0);

  // Reset active step when form schema changes
  useEffect(() => {
    setActiveStep(0);
  }, [formSchema]);

  // Update form when initialValues change (for edit mode)
  useEffect(() => {
    const wasUndefined = prevInitialValuesRef.current === undefined;
    const isNowDefined = initialValues !== undefined;

    if (initialValues) {
      const normalizedValues = normalizeInitialValues(initialValues, formSchema);

      if (allowResetOnValuesChange) {
        const prevValues = prevInitialValuesRef.current;
        const valuesChanged = !prevValues || JSON.stringify(prevValues) !== JSON.stringify(normalizedValues);
        if (valuesChanged) {
          reset(normalizedValues);
          setSubmitError(null);
          isFormInitializedRef.current = true;
        }
      } else if (wasUndefined && isNowDefined) {
        reset(normalizedValues);
        setSubmitError(null);
        isFormInitializedRef.current = true;
      }
    } else if (initialValues === undefined && prevInitialValuesRef.current !== undefined) {
      setSubmitError(null);
      isFormInitializedRef.current = false;
    }

    prevInitialValuesRef.current = initialValues;
  }, [initialValues, reset, allowResetOnValuesChange, formSchema]);

  // Get all fields to render - memoized to prevent unnecessary recalculations
  const fieldsToRender = useMemo(() => getAllFields(formSchema), [formSchema]);

  // Memoize reference fields to prevent unnecessary filtering
  const formReferenceFields = useMemo(() => {
    return fieldsToRender.filter(
      (field) => field.type === 'formReference' && field.referenceFormName && field.referenceFieldName
    );
  }, [fieldsToRender]);

  const apiReferenceFields = useMemo(() => {
    return fieldsToRender.filter(
      (field) => field.type === 'apiReference' && field.apiEndpoint && field.apiLabelField
    );
  }, [fieldsToRender]);

  const handleFormSubmit = async (data: Record<string, any>) => {
    setSubmitError(null);
    const transformedData = transformFormValues(data, formSchema);

    if (onSubmit) {
      try {
        await onSubmit(transformedData); 
        
        // After successful submit, reset form
        const resetValues = initialValues || {};
        reset(resetValues, {
          keepErrors: false,
          keepDirty: false,
          keepTouched: false,
          keepIsSubmitted: false,
          keepSubmitCount: false,
        });
        
        // Clear errors after reset completes
        // This is needed because CKEditor's onBlur may fire after reset,
        // marking the field as touched and triggering validation
        setTimeout(() => {
          clearErrors();
        }, 0);

        if (onSuccess) onSuccess();
      } catch (error: any) {
        console.error('Form submission error:', error);
        let errorMessage = 'Form submission failed. Please try again.';

        if (error?.response?.data) {
          const errorData = error.response.data;
          errorMessage =
            errorData.message ||
            errorData.error ||
            errorData.errors?.message ||
            (Array.isArray(errorData.errors) ? errorData.errors.join(', ') : null) ||
            errorData.msg ||
            errorMessage;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        setSubmitError(errorMessage);
      }
    } else {
      console.log('Form Data:', transformedData);
    }
  };

  // If view mode, render view component
  if (mode === 'view') {
    return <FormViewMode formSchema={formSchema} initialValues={initialValues} hideTitle={hideTitle} services={services} colors={colors} />;
  }

  // Edit mode - render form fields
  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mx: 'auto', width: '100%' }}>
      {!hideTitle && (
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          {formSchema.title}
        </Typography>
      )}

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      {formSchema.sections && formSchema.sections.length > 0 ? (() => {
        const sectionDisplayMode = formSchema.settings?.sectionDisplayMode || 'panel';
        const fieldsPerRow = formSchema.settings?.fieldsPerRow || 1;
        const gridColumns = Math.min(Math.max(1, fieldsPerRow), 3);
        const fullWidthFieldTypes = ['ckeditor'];

        // Helper function to render fields grid
        const renderFieldsGrid = (section: any) => (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: gridColumns === 1 ? '1fr' : gridColumns === 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              },
              gap: "10px",
            }}
          >
            {section.fields.map((field: any) => {
              const shouldTakeFullWidth = fullWidthFieldTypes.includes(field.type);
              return (
                <Box
                  key={field.name}
                  sx={{
                    gridColumn: shouldTakeFullWidth
                      ? {
                        xs: '1 / -1',
                        sm: '1 / -1',
                      }
                      : 'auto',
                  }}
                >
                  <FieldRenderer
                    field={field}
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    formSchema={formSchema}
                    uploadingFiles={uploadingFiles}
                    setUploadingFiles={setUploadingFiles}
                    setError={setError}
                    clearErrors={clearErrors}
                    services={services}
                    colors={colors}
                  />
                </Box>
              );
            })}
          </Box>
        );

        if (sectionDisplayMode === 'stepper') {
          // Stepper view
          return (
            <Box sx={{ border: '1px solid', borderColor: formColors.divider, p: 5, backgroundColor: formColors.backgroundPaper }}>
              <Stepper activeStep={activeStep} orientation="horizontal">
                {formSchema.sections.map((section) => (
                  <Step key={section.id}>
                    <StepLabel>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {section.title}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ mt: 5 }}>
                {formSchema.sections.map((section, sectionIndex) => {
                  const sectionsLength = formSchema.sections?.length || 0;
                  return (
                    <Box
                      key={section.id}
                      sx={{
                        display: activeStep === sectionIndex ? 'block' : 'none',
                      }}
                    >
                      {section.description && (
                        <Typography variant="caption" sx={{ mb: 1.5, display: 'block', color: formColors.textSecondary }}>
                          {section.description}
                        </Typography>
                      )}
                      {renderFieldsGrid(section)}
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, borderTop: '1px solid', pt: 2, borderColor: formColors.divider, justifyContent: 'center' }}>
                        {sectionIndex > 0 && (
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: formColors.success, color: formColors.success, '&:hover': { borderColor: formColors.success, backgroundColor: `${formColors.success}15` } }}
                            startIcon={<ArrowBackIcon />}
                            onClick={() => setActiveStep(sectionIndex - 1)}
                          >
                            Previous
                          </Button>
                        )}
                        {sectionIndex < sectionsLength - 1 && <Button
                          variant="outlined"
                          size="small"
                          sx={{ borderColor: formColors.warning, color: formColors.warning, '&:hover': { borderColor: formColors.warning, backgroundColor: `${formColors.warning}15` } }}
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => {
                            if (sectionIndex < sectionsLength - 1) {
                              setActiveStep(sectionIndex + 1);
                            }
                          }}
                        >
                          Next
                        </Button>
                        }
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        }

        // Panel view (default)
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {formSchema.sections.map((section, sectionIndex) => (
              <Accordion key={section.id} defaultExpanded={sectionIndex === 0}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${section.id}-content`}
                  id={`panel-${section.id}-header`}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DoubleArrowOutlinedIcon fontSize="small" sx={{ color: formColors.primary }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: formColors.primary }}>
                      {section.title}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {section.description && (
                    <Typography variant="caption" sx={{ mb: 1.5, display: 'block', color: formColors.textSecondary }}>
                      {section.description}
                    </Typography>
                  )}
                  {renderFieldsGrid(section)}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        );
      })() : (() => {
        const fieldsPerRow = formSchema.settings?.fieldsPerRow || 1;
        const gridColumns = Math.min(Math.max(1, fieldsPerRow), 3);

        // Field types that should always take full width
        const fullWidthFieldTypes = ['ckeditor'];

        return (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: gridColumns === 1 ? '1fr' : gridColumns === 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {fieldsToRender.map((field) => {
              const shouldTakeFullWidth = fullWidthFieldTypes.includes(field.type);
              return (
                <Box
                  key={field.name}
                  sx={{
                    gridColumn: shouldTakeFullWidth
                      ? {
                        xs: '1 / -1',
                        sm: '1 / -1',
                      }
                      : 'auto',
                  }}
                >
                  <FieldRenderer
                    field={field}
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    formSchema={formSchema}
                    uploadingFiles={uploadingFiles}
                    setUploadingFiles={setUploadingFiles}
                    setError={setError}
                    clearErrors={clearErrors}
                    services={services}
                    colors={colors}
                  />
                </Box>
              );
            })}
          </Box>
        );
      })()}

      <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="space-between">
        <Button
          type="submit"
          variant="contained"
          size="small"
          sx={{ minWidth: 120, backgroundColor: formColors.primary, '&:hover': { backgroundColor: formColors.primary } }}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              reset();
              clearErrors();
              setSubmitError(null);
              // Reset to first step if in stepper mode
              const sectionDisplayMode = formSchema.settings?.sectionDisplayMode || 'panel';
              if (sectionDisplayMode === 'stepper') {
                setActiveStep(0);
              }
            }}
            disabled={isLoading}
          >
            Reset form
          </Button>
          {onCancel && (
            <Button
              variant="outlined"
              size="small"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
