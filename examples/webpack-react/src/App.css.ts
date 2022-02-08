import { recipe } from '@vanilla-extract/recipes';
import { sprinkles } from './sprinkles.css';
import { vars } from './vars.css';

export const mediaQueries = {
  minSm: 'screen and (min-width: 768px)',
  minMd: 'screen and (min-width: 1024px)',
  minLg: 'screen and (min-width: 1280px)',
  minXl: 'screen and (min-width: 1440px)',
};

export const card = recipe({
  conditions: {
    xs: {},
    sm: { '@media': mediaQueries.minSm },
    md: { '@media': mediaQueries.minMd },
    lg: { '@media': mediaQueries.minLg },
    xl: { '@media': mediaQueries.minXl },
  },
  defaultCondition: 'xs',
  responsiveArray: ['xs', 'sm', 'md', 'lg', 'xl'],
  base: [
    sprinkles({
      padding: {
        xs: '7x',
        sm: '8x',
      },
    }),
    {
      borderRadius: '20px',
      transition: 'transform 4s ease-in-out',
      ':hover': {
        cursor: 'default',
        transform: 'scale(2) rotate(720deg)',
      },
    },
  ],
  variants: {
    bg: {
      light: {},
      dark: {},
    },
    size: {
      big: {
        width: '200px',
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        bg: 'light',
        size: 'big',
      },
      style: {
        backgroundColor: vars.color['green-50'],
      },
    },
    {
      variants: {
        bg: 'dark',
        size: 'big',
      },
      style: {
        backgroundColor: vars.color['gray-800'],
      },
    },
  ],
});

export const text = recipe({
  variants: {
    variant: {
      heading: {},
      display: {},
    },
    size: { small: {}, big: {} },
  },
  compoundVariants: [
    {
      variants: { variant: 'heading', size: 'xxl' },
      style: sprinkles({ fontSize: '1x', color: 'green-400' }),
    },
    {
      variants: { variant: 'display', size: 'sm' },
      style: sprinkles({ fontSize: '5x', color: 'green-500' }),
    },
  ],
});
