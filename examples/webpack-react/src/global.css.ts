import { globalStyle, globalLayer } from '@vanilla-extract/css';

export const base = globalLayer('base');
export const colors = globalLayer('colors');

globalStyle('body', {
  '@layer': {
    [base]: {
      background: 'white',
    },
  },
});

globalStyle('body, body *', {
  '@layer': {
    [base]: {
      all: 'unset',
      boxSizing: 'border-box',
    },
  },
});
