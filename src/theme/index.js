import { createTheme } from '@mui/material';

export const colors = {
  purple: '#9155FD',
  lightPurple: 'rgba(145, 85, 253, 0.1)',
  darkPurple: '#804BDF',
  dimPurple: 'rgba(145, 85, 253, 0.5)',
  white: '#FFFFFF',
  dimWhite: '#F4F5FA',
  black: '#000000',
  dimBlack: '#4B465C',
  grey: '#6D6D6D',
  lightGrey: '#DBDADE',
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      light: colors.lightPurple,
      dark: colors.darkPurple,
    },
    text: {
      primary: colors.dimBlack,
      secondary: colors.grey,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: colors.lightPurple,
            '&:hover': {
              backgroundColor: 'rgba(145, 85, 253, 0.15)',
            },
          },
        },
      },
    },
  },
});

export default theme; 