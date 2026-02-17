import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { Box, FormHelperText, useTheme, alpha, FormLabel } from '@mui/material';
import { useFormColors } from '../../utils/useFormColors';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { FieldRendererProps } from './../../types';
import {
  defaultFileUploadService,
} from '../../services/defaultServices';
import { useCKEditor } from '../../hooks/useCKEditor';

// Declare ClassicEditor on window
declare global {
  interface Window {
    ClassicEditor: any;
  }
}

export const CKEditorField = ({ field, control, defaultValue, rules, errors, setValue, formSchema, services, colors }: FieldRendererProps) => {
  const theme = useTheme();
  const formColors = useFormColors(colors);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
  const fileUploadService = services?.fileUpload || defaultFileUploadService;
  const fileBaseUrl = services?.fileBaseUrl || '';
  const licenseKey = services?.ckEditorLicenseKey || '';
  const ckEditorScriptPath = services?.ckEditorScriptPath || '/lib/ckeditor/ckeditor.js';

  // Use CKEditor hook to load and check availability
  const { isReady: isCKEditorReady, isLoading: isCKEditorLoading, error: ckEditorError } = useCKEditor({
    scriptPath: ckEditorScriptPath,
    autoLoad: true,
  });

  // Custom upload adapter that uses fileUploadService
  const createCustomUploadAdapter = useCallback((loader: any) => {
    return {
      upload: async () => {
        if (!formSchema?.name) {
          throw new Error('Form schema name is required for image uploads');
        }

        try {
          const file = await loader.file;

          if (!file) {
            throw new Error('No file provided');
          }

          // Validate file type (images only)
          if (!file.type.startsWith('image/')) {
            throw new Error('Only image files are allowed');
          }

          const uploadedFiles = await fileUploadService.uploadFiles(
            formSchema.name,
            field.name,
            [file]
          );

          if (uploadedFiles && uploadedFiles.length > 0 && uploadedFiles[0].fileUrl) {
            const fileUrl = uploadedFiles[0].fileUrl;
            const isFullUrl = fileUrl.startsWith('http://') || fileUrl.startsWith('https://');
            const url = isFullUrl ? fileUrl : fileBaseUrl + fileUrl;
            return {
              default: url
            };
          }

          throw new Error('Upload failed: No file URL returned');
        } catch (error: any) {
          console.error('Upload error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
          throw new Error(errorMessage);
        }
      },
      abort: () => {
        console.log('Upload aborted');
      }
    };
  }, [formSchema?.name, field.name, fileUploadService, fileBaseUrl]);

  // Show loading or error state
  if (isCKEditorLoading) {
    return (
      <Box>
        <FormLabel required={field.required} error={!!errors[field.name]}>
          {field.label}
        </FormLabel>
        <Box sx={{ p: 2, textAlign: 'center', color: formColors.textSecondary }}>
          Loading editor...
        </Box>
      </Box>
    );
  }

  if (ckEditorError || !isCKEditorReady) {
    const message =
      ckEditorError?.message ||
      `CKEditor failed to load. Script path: ${ckEditorScriptPath}. Copy ckeditor.js to public/lib/ckeditor/ or set services.ckEditorScriptPath. See CKEDITOR_SETUP.md.`;
    return (
      <Box>
        <FormLabel required={field.required} error={!!errors[field.name]}>
          {field.label}
        </FormLabel>
        <Box sx={{ p: 2, border: '1px solid', borderColor: formColors.error, borderRadius: 1 }}>
          <FormHelperText error>{message}</FormHelperText>
        </Box>
      </Box>
    );
  }

  return (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={defaultValue || ''}
      rules={rules}
      render={({ field: formField }) => (
        <Box>
          <FormLabel
            required={field.required}
            error={!!errors[field.name]}
          >
            {field.label}
          </FormLabel>
          <Box
            ref={editorContainerRef}
            sx={{
              '& .ck-editor': {
                borderRadius: '4px',
                '& .ck-toolbar': {
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'visible',
                  display: 'flex',
                  flexWrap: 'wrap',
                  '& .ck-toolbar__items': {
                    display: 'flex',
                    flexWrap: 'wrap !important',
                    width: '100%',
                    maxWidth: '100%',
                    '& > *': {
                      flexShrink: 0,
                    },
                  },
                },
                '& .ck-editor__editable': {
                  minHeight: '100px'
                },
                '&:hover': {
                  borderColor: errors[field.name]
                    ? formColors.error
                    : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : formColors.primary
                },
                '& .ck-focused': {
                  border: errors[field.name]
                    ? `1px solid ${formColors.error} !important`
                    : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : formColors.primary} !important`,
                  boxShadow: errors[field.name]
                    ? `0 0 0 1px ${formColors.error}`
                    : `0 0 0 1px ${alpha(formColors.primary, 0.5)} !important`
                }
              }
            }}
          >
            {window.ClassicEditor && isCKEditorReady && (
              <CKEditor
                editor={window.ClassicEditor}
                config={{
                  licenseKey: licenseKey,
                  initialData: formField.value || '',
                } as any}
                data={formField.value || ''}
                onReady={(editor) => {
                  // Set up custom upload adapter via FileRepository
                  if (formSchema?.name) {
                    try {
                      const fileRepository = editor.plugins.get('FileRepository');
                      if (fileRepository) {
                        fileRepository.createUploadAdapter = (loader: any) => {
                          return createCustomUploadAdapter(loader);
                        };
                      } else {
                        console.warn('FileRepository plugin not found');
                      }
                    } catch (error) {
                      console.error('Error setting up upload adapter:', error);
                    }
                  } else {
                    console.warn('Form schema name not available, upload adapter not set');
                  }

                  // Set initial value if provided
                  if (defaultValue && !formField.value) {
                    editor.setData(defaultValue);
                    setValue?.(field.name, defaultValue);
                  }
                }}
                onChange={(_event, editor) => {
                  const data = editor.getData();
                  formField.onChange(data);
                }}
                onBlur={() => {
                  formField.onBlur();
                }}
              />
            )}
          </Box>
          {errors[field.name] && (
            <FormHelperText error sx={{ mt: 0.5, mx: 0 }}>
              {errors[field.name]?.message as string}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
};
