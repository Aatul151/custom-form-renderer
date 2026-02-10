import { useTheme } from '@mui/material';
import { FormColors } from '../types';

/**
 * Hook to get form colors - uses custom colors if provided, otherwise falls back to Material-UI theme
 */
export const useFormColors = (customColors?: FormColors) => {
  const theme = useTheme();

  return {
    primary: customColors?.primary || theme.palette.primary.main,
    secondary: customColors?.secondary || theme.palette.secondary.main,
    error: customColors?.error || theme.palette.error.main,
    success: customColors?.success || theme.palette.success.main,
    warning: customColors?.warning || theme.palette.warning.main,
    info: customColors?.info || theme.palette.info.main,
    textPrimary: customColors?.textPrimary || theme.palette.text.primary,
    textSecondary: customColors?.textSecondary || theme.palette.text.secondary,
    divider: customColors?.divider || theme.palette.divider,
    background: customColors?.background || theme.palette.background.default,
    backgroundPaper: customColors?.backgroundPaper || theme.palette.background.paper,
  };
};
