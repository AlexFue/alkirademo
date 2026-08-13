import { createTheme } from '@mui/material/styles';

// Single source of truth for MUI theming. Palette nudged off the MUI default
// blue so the app doesn't look like an unstyled MUI starter.
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#3457D5',
    },
    secondary: {
      main: '#7C4DFF',
    },
    background: {
      default: '#F4F6FB',
    },
  },
  shape: {
    borderRadius: 10,
  },
});
