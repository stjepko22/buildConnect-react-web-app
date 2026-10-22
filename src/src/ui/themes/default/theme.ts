import { alpha, createTheme } from '@mui/material/styles';

export const BRAND_COLORS = {
  heroGradient: 'linear-gradient(145deg, #041727 0%, #082339 55%, #0E3049 100%)',
  darkBase: '#041727',
  darkSurface: '#082339',
  darkSurfaceAlt: '#0E3049',
} as const;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1769F5',
      light: '#70ACFF',
      dark: '#0D50D5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D6E3F1',
      light: '#F2F6FC',
      dark: '#9CB5CF',
      contrastText: BRAND_COLORS.darkBase,
    },
    background: {
      default: BRAND_COLORS.darkBase,
      paper: BRAND_COLORS.darkSurface,
    },
    text: {
      primary: '#F2F6FC',
      secondary: '#A9C0D5',
      disabled: '#7992AA',
    },
    divider: '#365B78',
    success: {
      main: '#25BF91',
      light: '#6BE0B7',
      dark: '#087F5B',
      contrastText: BRAND_COLORS.darkBase,
    },
    warning: {
      main: '#FFC45C',
      light: '#FFD88A',
      dark: '#B67D15',
      contrastText: BRAND_COLORS.darkBase,
    },
    error: {
      main: '#FF6E80',
      light: '#FFA1AC',
      dark: '#C84458',
      contrastText: BRAND_COLORS.darkBase,
    },
    info: {
      main: '#70ACFF',
      light: '#A4CAFF',
      dark: '#3673C8',
      contrastText: BRAND_COLORS.darkBase,
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          colorScheme: 'dark',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
        },
        body: {
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          '@media (max-width: 899.95px)': {
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          },
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '#root': {
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          '@media (max-width: 899.95px)': {
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          },
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: ({ theme }) => ({ borderColor: theme.palette.divider }),
      },
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({ color: theme.palette.primary.light }),
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          ...(ownerState.color === 'primary' && {
            '&.Mui-selected': {
              color: theme.palette.primary.light,
              backgroundColor: alpha(theme.palette.primary.main, 0.16),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.24),
              },
            },
          }),
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-selected': { color: theme.palette.primary.light },
        }),
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          '&.Mui-focusVisible': {
            outline: `2px solid ${theme.palette.primary.light}`,
            outlineOffset: 3,
          },
        }),
        textPrimary: ({ theme }) => ({ color: theme.palette.primary.light }),
        outlinedPrimary: ({ theme }) => ({
          color: theme.palette.primary.light,
          borderColor: alpha(theme.palette.primary.light, 0.55),
          '&:hover': {
            borderColor: theme.palette.primary.light,
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
          },
        }),
      },
    },
  },
});

export default theme;
