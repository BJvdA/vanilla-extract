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

        if ('conditions' in options) {
          styles[key] = {
            conditions: {},
          };

          const defaultConditions = options.defaultCondition
            ? Array.isArray(options.defaultCondition)
              ? options.defaultCondition
              : [options.defaultCondition]
            : [];

          const defaultClasses = [];

          if ('responsiveArray' in options) {
            styles[key].responsiveArray = options.responsiveArray;
          }

          for (const conditionName in options.conditions) {
            let styleValue: StyleRule =
              typeof styleRule === 'string' ? [styleRule] : styleRule;

            const condition =
              options.conditions[
                conditionName as keyof typeof options.conditions
              ];

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

            const className = style(
              styleValue,
              `${variantGroupName}_${key}_${conditionName}`,
            );

            styles[key].conditions[conditionName] = className;

            if (defaultConditions.indexOf(conditionName as any) > -1) {
              defaultClasses.push(className);
            }
          }

          if (defaultClasses.length > 0) {
            styles[key].defaultClass = defaultClasses.join(' ');
          }
        } else {
          styles[key] = style(
            typeof styleRule === 'string' ? [styleRule] : styleRule,
            debugId
              ? `${debugId}_${variantGroupName}_${key}`
              : `${variantGroupName}_${key}`,
          );
        }
      }

      return styles;
    });

  const compounds: Array<[VariantSelection<Variants>, string]> = [];

  for (const { style: theStyle, variants } of compoundVariants) {
    compounds.push([
      variants,
      typeof theStyle === 'string'
        ? theStyle
        : style(theStyle, `${debugId}_compound_${compounds.length}`),
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
