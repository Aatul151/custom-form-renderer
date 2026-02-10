import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme, useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import { FormSchema, FormServices, FormColors } from '../../types';
import { useFormColors } from '../../utils/useFormColors';
import { FieldView } from './FieldView';
import { getAllFields } from '../../utils/formHelpers';

interface FormViewModeProps {
  formSchema: FormSchema;
  initialValues?: Record<string, any>;
  hideTitle?: boolean;
  services?: FormServices;
  colors?: FormColors;
}

export const FormViewMode = ({ formSchema, initialValues, hideTitle = false, services, colors }: FormViewModeProps) => {
  const fieldsToRender = getAllFields(formSchema);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const formColors = useFormColors(colors);
  
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
      {!hideTitle && (
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          {formSchema.title}
        </Typography>
      )}

      {formSchema.sections && formSchema.sections.length > 0 ? (
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
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)',
                    gap: 1,
                  }}
                >
                  {section.fields.map((field) => (
                    <FieldView key={field.name} field={field} value={initialValues?.[field.name]} services={services} />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1,
          }}
        >
          {fieldsToRender.map((field) => (
            <FieldView key={field.name} field={field} value={initialValues?.[field.name]} services={services} />
          ))}
        </Box>
      )}
    </Box>
  );
};
