import { createVar, fallbackVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

import { sprinkles } from './sprinkles.css';
import { vars } from './vars.css';

export const root = style([
  sprinkles({
    background: 'primary500',
    padding: {
      xs: 5,
      sm: 7,
    },
  }),
  style({
    color: 'blue',
    transition: 'opacity .1s ease', // Testing autoprefixer
    ':hover': {
      opacity: 0.8,
    },
    selectors: {
      '&[data-orientation=horizontal]': { height: '1px', width: '100%' },
      '&[data-orientation=vertical]': {
        width: '1px',
      },
    },
  }),
]);

export const title = style({
  selectors: {
    [`${root}:hover &`]: {
      color: 'green',
    },
  },
});

export const colorVar = createVar();

export const button = recipe({
  base: {
    border: '0',
    userSelect: 'none',
    transition:
      'background-color 0.18s ease-in-out, border-color 0.18s ease-in-out, color 0.18s ease-in-out, opacity 0.18s ease-in-out, box-shadow 0.18s, width 0.18s ease-in-out, padding 0.18s ease-in-out',
    selectors: {
      '&:disabled': {
        cursor: 'not-allowed',
      },
      '&[aria-busy="true"]': {
        cursor: 'wait',
        color: 'transparent',
      },
    },
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: vars.color.primary500,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: vars.color.primary500,
        color: fallbackVar(colorVar, vars.color.white),

        selectors: {
          '&:hover:not([disabled])': {
            backgroundColor: vars.color.primary700,
            borderColor: vars.color.primary700,
          },

          '&:focus:not([disabled])': {
            boxShadow: `0px 0px 0px 4px ${vars.color.primary200}`,
          },

          '&:disabled': {
            backgroundColor: vars.color.primary200,
            borderColor: vars.color.primary200,
          },
        },
      },

      secondary: {
        backgroundColor: vars.color.primary100,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: vars.color.primary100,
        color: fallbackVar(colorVar, vars.color.primary600),

        selectors: {
          '&:hover:not([disabled])': {
            backgroundColor: vars.color.primary200,
            borderColor: vars.color.primary200,
          },

          '&:focus:not([disabled])': {
            boxShadow: `0px 0px 0px 4px ${vars.color.primary200}`,
          },

          '&:disabled': {
            backgroundColor: vars.color.primary50,
            borderColor: vars.color.primary50,
            color: vars.color.primary200,
          },
        },
      },

      grey: {
        backgroundColor: vars.color.white,
        color: fallbackVar(colorVar, vars.color.grey700),
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: vars.color.grey300,
        boxShadow: vars.shadows.xs,

        selectors: {
          '&:hover:not([disabled])': {
            backgroundColor: vars.color.grey50,
            boxShadow: 'none',
          },

          '&:focus:not([disabled])': {
            boxShadow: `${vars.shadows.xs}, 0px 0px 0px 4px ${vars.color.grey100}`,
          },

          '&:disabled': {
            borderColor: vars.color.grey200,
            color: vars.color.grey200,
            boxShadow: 'none',
          },
        },
      },

      link: {
        color: fallbackVar(colorVar, vars.color.grey700),

        selectors: {
          '&:hover:not([disabled])': {
            color: vars.color.grey500,
          },

          '&:focus:not([disabled])': {
            color: vars.color.grey500,
          },

          '&:disabled': {
            color: vars.color.grey300,
          },
        },
      },

      linkPrimary: {
        color: fallbackVar(colorVar, vars.color.primary600),

        selectors: {
          '&:hover:not([disabled])': {
            color: vars.color.primary700,
          },

          '&:focus:not([disabled])': {
            color: vars.color.primary700,
          },

          '&:disabled': {
            color: vars.color.grey300,
          },
        },
      },

      linkInverted: {
        color: fallbackVar(colorVar, vars.color.white),

        selectors: {
          '&:hover:not([disabled])': {
            color: vars.color.grey200,
          },

          '&:focus:not([disabled])': {
            color: vars.color.grey200,
          },

          '&:disabled': {
            color: vars.color.grey200,
          },
        },
      },

      unstyled: {
        color: fallbackVar(colorVar, 'inherit'),

        ':disabled': {
          opacity: 0.2,
        },
      },

      danger: {
        backgroundColor: vars.color.error500,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: vars.color.error500,
        color: fallbackVar(colorVar, vars.color.white),

        selectors: {
          '&:hover:not([disabled])': {
            backgroundColor: vars.color.error700,
            borderColor: vars.color.error700,
          },

          '&:focus:not([disabled])': {
            boxShadow: `0px 0px 0px 4px ${vars.color.error200}`,
          },

          '&:disabled': {
            backgroundColor: vars.color.error200,
            borderColor: vars.color.error200,
          },
        },
      },
    },

    iconOnly: {
      true: {},
      false: {},
    },

    link: {
      true: {},
      false: {},
    },

    size: {
      sm: {},
      md: {},
      lg: {},
      xl: {},
      '2xl': {},
    },
  },

  compoundVariants: [
    {
      variants: {
        iconOnly: false,
        link: false,
        size: 'sm',
      },
      style: [
        {
          minHeight: '36px',
        },
        sprinkles({
          fontSize: 1.75,
          px: 1.75,
        }),
      ],
    },
    {
      variants: {
        iconOnly: false,
        link: false,
        size: 'md',
      },
      style: [
        {
          minHeight: '40px',
        },
        sprinkles({
          fontSize: 1.75,
          px: 2,
        }),
      ],
    },
    {
      variants: {
        iconOnly: false,
        link: false,
        size: 'lg',
      },
      style: [
        {
          minHeight: '48px',
        },
        sprinkles({
          fontSize: 2,
          px: 2.5,
        }),
      ],
    },
    {
      variants: {
        iconOnly: false,
        link: false,
        size: 'xl',
      },
      style: [
        {
          minHeight: '52px',
        },
        sprinkles({
          fontSize: 2,
          px: 3,
        }),
      ],
    },
    {
      variants: {
        iconOnly: false,
        link: false,
        size: '2xl',
      },
      style: [
        {
          minHeight: '56px',
        },
        sprinkles({
          fontSize: 2,
          px: 4,
        }),
      ],
    },

    {
      variants: {
        iconOnly: true,
        link: false,
        size: 'sm',
      },
      style: [
        {
          minHeight: '36px',
          width: '36px',
        },
        sprinkles({
          fontSize: 2.5,
        }),
      ],
    },
    {
      variants: {
        iconOnly: true,
        link: false,
        size: 'md',
      },
      style: [
        {
          minHeight: '40px',
          width: '40px',
        },
        sprinkles({
          fontSize: 2.5,
        }),
      ],
    },
    {
      variants: {
        iconOnly: true,
        link: false,
        size: 'lg',
      },
      style: [
        {
          minHeight: '48px',
          width: '48px',
        },
        sprinkles({
          fontSize: 3,
        }),
      ],
    },
    {
      variants: {
        iconOnly: true,
        link: false,
        size: 'xl',
      },
      style: [
        {
          minHeight: '60px',
          width: '60px',
        },
        sprinkles({
          fontSize: 2.5,
        }),
      ],
    },
    {
      variants: {
        iconOnly: true,
        link: false,
        size: '2xl',
      },
      style: [
        {
          minHeight: '68px',
        },
        sprinkles({
          fontSize: 2.5,
          px: 3,
        }),
      ],
    },

    {
      variants: {
        link: true,
        size: 'sm',
      },
      style: sprinkles({
        fontSize: 1.75,
        lineHeight: '140%',
      }),
    },
    /** @todo fix, this causes ssr mismatch (vanilla extract bug? generates an extra classname on server side) */
    // {
    //   variants: {
    //     link: true,
    //     size: 'md',
    //   },
    //   style: sprinkles({
    //     fontSize: 2,
    //     lineHeight: '150%',
    //   }),
    // },
    {
      variants: {
        link: true,
        size: 'lg',
      },
      style: sprinkles({
        fontSize: 2.25,
        lineHeight: '155%',
      }),
    },
    {
      variants: {
        link: true,
        size: 'xl',
      },
      style: sprinkles({
        fontSize: 2.5,
        lineHeight: '140%',
        letterSpacing: '-1%',
      }),
    },
  ],

  defaultVariants: {
    variant: 'primary',
  },
});
