import { style } from '@vanilla-extract/css';
import { sprinkles } from './sprinkles.css';

export const divider = style([
  sprinkles({ width: '100%' }),
  {
    backgroundColor: 'red',
  },
]);
