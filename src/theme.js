import { createTheme } from '@mui/material/styles';

const colors = {
  white: "#FFFFFF",
  dimBlack: "#404B63",
  primary: "#0C93F3",
  yellow: "#FFB849",
  pink: "#ff4ba2",
  orange: "#f75d34",
  green: "#42C88E",
  lightGrey: "#f5f5f5",
  grey: "#8A8D8E",
  fadedBlue: "#D2E6F5",
  fadedRed: "#FFF1EC",
  fadedGreen: "#D4FFEA",
  blue: "#5ECCFA",
  dimPurple: "#B591DB",
  purple: "#974BCE",
  darkPurple: "#4C2668",
  red: "#FF4451",
  dimWhite: "#F6F7FB",
  dimWhite2: "#F6F7FB",
  black: "#000",
  lightPurple: "rgba(181, 145, 219,0.2)"
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      light: colors.dimPurple,
      dark: colors.darkPurple,
      contrastText: colors.white
    },
    secondary: {
      main: colors.blue,
      light: colors.fadedBlue,
      contrastText: colors.white
    },
    error: {
      main: colors.red,
      light: colors.fadedRed,
      contrastText: colors.white
    },
    success: {
      main: colors.green,
      light: colors.fadedGreen,
      contrastText: colors.white
    },
    warning: {
      main: colors.yellow,
      contrastText: colors.dimBlack
    },
    text: {
      primary: colors.dimBlack,
      secondary: colors.grey,
      disabled: colors.lightGrey
    },
    background: {
      default: colors.dimWhite,
      paper: colors.white
    },
    divider: colors.lightGrey
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: {
      fontFamily: "'DM Sans', sans-serif",
    },
    h2: {
      fontFamily: "'DM Sans', sans-serif",
    },
    h3: {
      fontFamily: "'DM Sans', sans-serif",
    },
    h4: {
      fontFamily: "'DM Sans', sans-serif",
    },
    h5: {
      fontFamily: "'DM Sans', sans-serif",
    },
    h6: {
      fontFamily: "'DM Sans', sans-serif",
    },
    subtitle1: {
      fontFamily: "'DM Sans', sans-serif",
    },
    subtitle2: {
      fontFamily: "'DM Sans', sans-serif",
    },
    body1: {
      fontFamily: "'DM Sans', sans-serif",
    },
    body2: {
      fontFamily: "'DM Sans', sans-serif",
    },
    button: {
      fontFamily: "'DM Sans', sans-serif",
      textTransform: 'none',
    },
    caption: {
      fontFamily: "'DM Sans', sans-serif",
    },
    overline: {
      fontFamily: "'DM Sans', sans-serif",
    },
    heading: {
      fontSize: '24px',
      fontWeight: 600,
      color: colors.dimBlack,
      fontFamily: "'DM Sans', sans-serif",
    },
    bottomHeading: {
      fontSize: '16px',
      color: colors.grey,
      fontWeight: 300,
      marginBottom: '16px',
      fontFamily: "'DM Sans', sans-serif",
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 300
        },
        containedPrimary: {
          backgroundColor: colors.primary,
          '&:hover': {
            backgroundColor: colors.darkPurple
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary
            }
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white,
          color: colors.dimBlack
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.white,
          borderRight: `1px solid ${colors.lightGrey}`
        }
      }
    }
  }
});

export { colors };
export default theme; 