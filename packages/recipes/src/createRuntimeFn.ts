import type {
  PatternResult,
  RuntimeFn,
  VariantGroups,
  VariantSelection,
} from './types';

const shouldApplyCompound = <Variants extends VariantGroups>(
  compoundCheck: VariantSelection<Variants>,
  selections: VariantSelection<Variants>,
) => {
  for (const key of Object.keys(compoundCheck)) {
    if (compoundCheck[key] !== selections[key]) {
      return false;
    }
  }

  return true;
};

export const createRuntimeFn =
  <Variants extends VariantGroups>(
    config: PatternResult<Variants>,
  ): RuntimeFn<Variants> =>
  (options) => {
    let className = config.defaultClassName;

    const selections: VariantSelection<Variants> = {
      ...config.defaultVariants,
      ...options,
    };

    for (const variantName in selections) {
      const variantSelection =
        selections[variantName] ?? config.defaultVariants[variantName];

      if (variantSelection != null) {
        let selection: any = variantSelection;

        if (typeof selection === 'boolean') {
          selection = selection === true ? 'true' : 'false';
        } else if (Array.isArray(selection)) {
          for (const responsiveIndex in selection) {
            const responsiveValue = selection[responsiveIndex];

            if (responsiveValue != null) {
              const sprinkle: any =
                config.variantClassNames[variantName][responsiveValue];
              const conditionName = sprinkle.responsiveArray[responsiveIndex];

              if (process.env.NODE_ENV !== 'production') {
                if (!sprinkle.conditions[conditionName]) {
                  throw new Error();
                }
              }

              className += ' ' + sprinkle.conditions[conditionName];
            }
          }
        } else if (typeof selection === 'object') {
          for (const conditionName in selection) {
            // Conditional style
            const value = selection[conditionName];

            if (value != null) {
              const sprinkle: any =
                config.variantClassNames[variantName][value];

              if (process.env.NODE_ENV !== 'production') {
                if (!sprinkle.conditions[conditionName]) {
                  throw new Error();
                }
              }

              className += ' ' + sprinkle.conditions[conditionName];
            }
          }
        }

        className +=
          ' ' + // @ts-expect-error
          (config.variantClassNames[variantName][selection]?.defaultClass ??
            config.variantClassNames[variantName][selection]);
      }
    }

    for (const [compoundCheck, compoundClassName] of config.compoundVariants) {
      if (shouldApplyCompound(compoundCheck, selections)) {
        className += ' ' + compoundClassName;
      }
    }

    return className;
  };
