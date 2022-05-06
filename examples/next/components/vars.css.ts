import { createGlobalTheme } from '@vanilla-extract/css';

import { colors } from './colors';
import { fontSizes } from './fontSizes';
import { space } from './space';

const systemFont =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

export const vars = createGlobalTheme(':root', {
  space,
  sizes: {
    ...space,
    maxWidth: '1440px',
  },
  color: colors,
  radii: {
    none: '0',
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  fontFamily: {
    display: systemFont,
    heading: systemFont,
    body: systemFont,
  },
  fontSize: fontSizes,
  fontWeights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  lineHeight: {
    '100%': '100%',
    '110%': '110%',
    '115%': '115%',
    '125%': '125%',
    '130%': '130%',
    '140%': '140%',
    '150%': '150%',
    '155%': '155%',
  },
  letterSpacing: {
    '-1%': '-0.01em',
    '-2%': '-0.02em',
    none: '0',
    '1%': '0.01em',
    '2%': '0.02em',
  },
  borders: {
    none: '0',
    '1px': '1px',
    '2px': '2px',
    '4px': '4px',
    full: '9999999px',
  },
  zIndices: {
    hide: '-1',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    skipLink: '1600',
    toast: '1700',
    tooltip: '1800',
  },
  shadows: {
    xs: '0px 1px 2px rgba(16, 24, 40, 0.05)',
    sm: '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
    md: '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
    lg: '0px 12px 16px -4px rgba(16, 24, 40, 0.1), 0px 4px 6px -2px rgba(16, 24, 40, 0.05)',
    xl: '0px 20px 24px -4px rgba(16, 24, 40, 0.1), 0px 8px 8px -4px rgba(16, 24, 40, 0.04)',
    '2xl': '0px 24px 48px -12px rgba(16, 24, 40, 0.25)',
    '3xl': '0px 32px 64px -12px rgba(16, 24, 40, 0.2)',
    none: 'none',
  },
  blurs: {
    sm: 'blur(8px)',
    md: 'blur(16px)',
    lg: 'blur(24px)',
    xl: 'blur(40px)',
  },
});
