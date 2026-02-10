import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Tooltip,
  FormLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { FieldRendererProps, UploadedFile } from '../../types';
import { validateFile, formatFileSize } from '../../utils/fieldHelpers';
import { useFormColors } from '../../utils/useFormColors';
import {
  defaultFileUploadService,
} from '../../services/defaultServices';

interface FileFieldProps extends FieldRendererProps {
  uploadingFiles?: Record<string, boolean>;
  setUploadingFiles?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setError?: (name: string, error: { type: string; message: string }) => void;
  clearErrors?: (name?: string) => void;
}

export const FileField = ({
  field,
  control,
  defaultValue,
  rules,
  errors,
  formSchema,
  uploadingFiles = {},
  setUploadingFiles,
  setError,
  clearErrors,
  services,
  colors,
}: FileFieldProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const formColors = useFormColors(colors);
  const acceptTypes = field.validation?.allowedFileTypes
    ? field.validation.allowedFileTypes.map((type: string) => `.${type.replace('.', '')}`).join(',')
    : undefined;
  const isMultiple = field.allowMultiple || false;

  const fileUploadService = services?.fileUpload || defaultFileUploadService;

  return (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: formField }) => {
        const isUploading = uploadingFiles[field.name] || false;
        let files: (File | UploadedFile)[] = [];

        if (isMultiple) {
          files = Array.isArray(formField.value) ? formField.value : [];
        } else {
          files = formField.value ? [formField.value] : [];
        }

        const hasFiles = files.length > 0;

        return (
          <Box>
            <FormLabel
              required={field.required}
              error={!!errors[field.name]}
            >
              {field.label}
            </FormLabel>
            <Box
              component="label"
              htmlFor={`file-input-${field.name}`}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed',
                borderColor: errors[field.name] ? formColors.error : (isUploading ? formColors.primary : hasFiles ? formColors.primary : formColors.divider),
                p: 1,
                cursor: isUploading ? 'wait' : 'pointer',
                transition: 'all 0.2s ease-in-out',
                backgroundColor: (isUploading || hasFiles) ? 'action.hover' : formColors.backgroundPaper,
                opacity: isUploading ? 0.7 : 1,
                pointerEvents: isUploading ? 'none' : 'auto',
                '&:hover': {
                  borderColor: isUploading ? formColors.primary : formColors.primary,
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <input
                id={`file-input-${field.name}`}
                type="file"
                hidden
                multiple={isMultiple}
                accept={acceptTypes}
                onChange={async (e) => {
                  const fileList = e.target.files;
                  if (!fileList || fileList.length === 0) return;

                  const newFiles = Array.from(fileList);
                  const isUploading = uploadingFiles[field.name] || false;

                  if (isUploading) {
                    e.target.value = '';
                    return;
                  }

                  for (const file of newFiles) {
                    const validationResult = validateFile(file, field);
                    if (validationResult !== true) {
                      setError?.(field.name, {
                        type: 'manual',
                        message: validationResult as string,
                      });
                      e.target.value = '';
                      return;
                    }
                  }

                  try {
                    setUploadingFiles?.((prev) => ({ ...prev, [field.name]: true }));
                    clearErrors?.(field.name);

                    if (!formSchema?.name) {
                      throw new Error('Form schema name is required for file uploads');
                    }

                    const uploadedFiles = await fileUploadService.uploadFiles(
                      formSchema.name,
                      field.name,
                      newFiles
                    );

                    if (isMultiple) {
                      const currentValue = formField.value;
                      const existingFiles = Array.isArray(currentValue)
                        ? currentValue.filter((item: any) => item && typeof item === 'object' && 'fileName' in item)
                        : [];
                      const allUploadedFiles = [...existingFiles, ...uploadedFiles];
                      formField.onChange(allUploadedFiles);
                    } else {
                      formField.onChange(uploadedFiles[0] || null);
                    }
                  } catch (error: any) {
                    console.error(`Failed to upload files for field ${field.name}:`, error);
                    const errorMessage = error.response?.data?.message || error.message || 'Failed to upload files';
                    setError?.(field.name, {
                      type: 'manual',
                      message: `Failed to upload files: ${errorMessage}`,
                    });
                  } finally {
                    setUploadingFiles?.((prev) => ({ ...prev, [field.name]: false }));
                    e.target.value = '';
                  }
                }}
                disabled={uploadingFiles[field.name] || false}
              />
              {isUploading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 3, width: '100%' }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: formColors.primary }}>
                    Uploading files...
                  </Typography>
                  <Typography variant="caption" sx={{ color: formColors.textSecondary }}>
                    Please wait while files are being uploaded
                  </Typography>
                </Box>
              ) : !hasFiles ? (
                <>
                  <CloudUploadIcon sx={{ fontSize: 40, color: formColors.textSecondary, mb: 1 }} />
                  <Typography variant="caption" sx={{ color: formColors.textSecondary }}>
                    Click to upload or drag and drop
                    {isMultiple && ' (multiple files allowed)'}
                  </Typography>
                  {field.validation?.allowedFileTypes && field.validation.allowedFileTypes.length > 0 && (
                    <Typography variant="caption" sx={{ mt: 0.5, color: formColors.textSecondary }}>
                      Allowed: {field.validation.allowedFileTypes.join(', ')}
                    </Typography>
                  )}
                  {field.validation?.maxFileSize && (
                    <Typography variant="caption" sx={{ mt: 0.5, color: formColors.textSecondary }}>
                      Max size: {formatFileSize(field.validation.maxFileSize)} per file
                    </Typography>
                  )}
                </>
              ) : (
                <Box sx={{ width: '100%' }}>
                  {isMultiple && (
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
                      {files.length} file{files.length !== 1 ? 's' : ''} uploaded
                    </Typography>
                  )}
                  {files.length === 1 && !isMultiple ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <InsertDriveFileIcon sx={{ fontSize: 40, color: formColors.primary }} />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: isMobile ? '200px' : '300px' }}>
                          {files[0] instanceof File
                            ? files[0].name
                            : ((files[0] as UploadedFile).originalName || (files[0] as UploadedFile).fileName)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: formColors.textSecondary }}>
                          {formatFileSize((files[0] as any).size || 0)}
                        </Typography>
                      </Box>
                      <Tooltip title="Remove file" placement="bottom" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            formField.onChange(null);
                            const fileInput = document.getElementById(`file-input-${field.name}`) as HTMLInputElement;
                            if (fileInput) {
                              fileInput.value = '';
                            }
                          }}
                          sx={{ color: formColors.error }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                      {files.map((file, index) => {
                        const fileName = file instanceof File
                          ? file.name
                          : ((file as UploadedFile).originalName || (file as UploadedFile).fileName);
                        return (
                          <Box
                            key={`${fileName}-${index}`}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              p: 1,
                              borderRadius: 1,
                              backgroundColor: formColors.background,
                              border: '1px solid',
                              borderColor: formColors.divider,
                            }}
                          >
                            <InsertDriveFileIcon sx={{ fontSize: 32, color: formColors.primary }} />
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {fileName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: formColors.textSecondary }}>
                                {formatFileSize((file as any).size || 0)}
                              </Typography>
                            </Box>
                            <Tooltip title="Remove file" placement="bottom" arrow>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (isMultiple) {
                                    const updatedFiles = files.filter((_, i) => i !== index);
                                    formField.onChange(updatedFiles.length > 0 ? updatedFiles : []);
                                  } else {
                                    formField.onChange(null);
                                  }
                                }}
                                sx={{ color: formColors.error }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            {errors[field.name] && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: formColors.error }}>
                {errors[field.name]?.message as string}
              </Typography>
            )}
          </Box>
        );
      }}
    />
  );
};
