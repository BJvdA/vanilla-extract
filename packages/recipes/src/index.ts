import { addRecipe } from '@vanilla-extract/css/recipe';
import { style, StyleRule } from '@vanilla-extract/css';

import { createRuntimeFn } from './createRuntimeFn';
import type {
  BaseConditions,
  PatternOptions,
  PatternResult,
  RuntimeFn,
  VariantGroups,
  VariantSelection,
} from './types';

export type { RecipeVariants } from './types';

function mapValues<Input extends Record<string, any>, OutputValue>(
  input: Input,
  fn: (value: Input[keyof Input], key: keyof Input) => OutputValue,
): Record<keyof Input, OutputValue> {
  const result: any = {};

  for (const key in input) {
    result[key] = fn(input[key], key);
  }

  return result;
}

function getStyleValues(
  options: any,
  styleRule: StyleRule,
  getId: () => string,
) {
  if ('conditions' in options) {
    const result: any = {
      conditions: {},
    };

    const defaultConditions = options.defaultCondition
      ? Array.isArray(options.defaultCondition)
        ? options.defaultCondition
        : [options.defaultCondition]
      : [];

    const defaultClasses = [];

    if ('responsiveArray' in options) {
      result.responsiveArray = options.responsiveArray;
    }

    for (const conditionName in options.conditions) {
      let styleValue: StyleRule = styleRule;

      const condition =
        options.conditions[conditionName as keyof typeof options.conditions];

      if (condition['@supports']) {
        styleValue = {
          '@supports': {
            [condition['@supports']]: styleValue,
          },
        };
      }

      if (condition['@media']) {
        styleValue = {
          '@media': {
            [condition['@media']]: styleValue,
          },
        };
      }

      if (condition.selector) {
        styleValue = {
          selectors: {
            [condition.selector]: styleValue,
          },
        };
      }

      const className = style(styleValue, `${getId()}_${conditionName}`);

      result.conditions[conditionName] = className;

      if (defaultConditions.indexOf(conditionName as any) > -1) {
        defaultClasses.push(className);
      }
    }

    if (defaultClasses.length > 0) {
      result.defaultClass = defaultClasses.join(' ');
    }

    return result;
  } else {
    return style(styleRule, getId());
  }
}

export function recipe<
  Variants extends VariantGroups,
  Conditions extends BaseConditions,
  ResponsiveLength extends number,
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
>(
  options: PatternOptions<
    Variants,
    Conditions,
    ResponsiveLength,
    DefaultCondition
  >,
  debugId?: string,
): RuntimeFn<Variants> {
  const {
    variants = {},
    defaultVariants = {},
    compoundVariants = [],
    base = '',
  } = options;

  const defaultClassName =
    typeof base === 'string' ? base : style(base, debugId);

  // @ts-expect-error
  const variantClassNames: PatternResult<Variants>['variantClassNames'] =
    mapValues(variants, (variantGroup: any, variantGroupName) => {
      const styles: any = {};

      for (const key in variantGroup) {
        const styleRule = variantGroup[key];

        styles[key] = getStyleValues(
          options,
          typeof styleRule === 'string' ? [styleRule] : styleRule,
          () => {
            const id = `${variantGroupName}_${key}`;
            return debugId ? `${debugId}_${id}` : id;
          },
        );
      }

      return styles;
    });

  const compounds: Array<[VariantSelection<Variants>, string]> = [];

  for (const { style: theStyle, variants } of compoundVariants) {
    compounds.push([
      variants,
      getStyleValues(
        options,
        (typeof theStyle === 'string' ? [theStyle] : theStyle) as StyleRule,
        () => {
          const id = `compound_${compounds.length}`;
          return debugId ? `${debugId}_${id}` : id;
        },
      ),
    ]);
  }

  const config: PatternResult<Variants> = {
    defaultClassName,
    variantClassNames,
    defaultVariants,
    compoundVariants: compounds,
  };

  return addRecipe(createRuntimeFn(config), {
    importPath: '@vanilla-extract/recipes/createRuntimeFn',
    importName: 'createRuntimeFn',
    // @ts-expect-error
    args: [config],
  });
}
