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
      borderRadius: {
        xs: '4x',
        sm: '5x',
      },
      padding: {
        xs: '7x',
        sm: '8x',
      },
    }),
    {
      transition: 'transform 4s ease-in-out',
      ':hover': {
        cursor: 'default',
        transform: 'scale(2) rotate(720deg)',
      },
    },
  ],
  variants: {
    bg: {
      light: {
        backgroundColor: vars.color['green-50'],
      },
      dark: {
        backgroundColor: vars.color['gray-800'],
      },
    },
    size: {
      big: {
        width: '200px',
      },
    },
  },
});
