import type {
  PatternResult,
  RuntimeFn,
  VariantGroups,
  VariantSelection,
} from './types';

const getApplicableCompounds = <Variants extends VariantGroups>(
  compoundClassNames: any,
  compoundCheck: VariantSelection<Variants>,
  selections: any,
  defaultVariants: VariantSelection<Variants>,
) => {
  let responsiveSize;

  for (const key of Object.keys(compoundCheck)) {
    if (Array.isArray(selections[key])) {
      const responsiveIndex = selections[key].indexOf(compoundCheck[key]);

      if (responsiveIndex === -1) {
        return false;
      }

      if (!responsiveSize) {
        responsiveSize = compoundClassNames?.responsiveArray?.[responsiveIndex];
      }
    } else if (typeof selections[key] === 'object') {
      if (!Object.values(selections[key]).includes(compoundCheck[key])) {
        return false;
      }
    } else if (
      compoundCheck[key] !== (selections[key] ?? defaultVariants[key])
    ) {
      return false;
    }
  }

  if (responsiveSize) {
    if (process.env.NODE_ENV !== 'production') {
      if (!compoundClassNames?.conditions?.[responsiveSize]) {
        throw new Error();
      }
    }

    return compoundClassNames.conditions[responsiveSize];
  }

  return compoundClassNames?.defaultClass || compoundClassNames;
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

        const selectionClassName =
          // @ts-expect-error
          config.variantClassNames[variantName][selection]?.defaultClass ??
          config.variantClassNames[variantName][selection];

        if (selectionClassName) {
          className += ' ' + selectionClassName;
        }
      }
    }

    for (const [compoundCheck, compoundClassNames] of config.compoundVariants) {
      const compoundClassName = getApplicableCompounds(
        compoundClassNames,
        compoundCheck,
        selections,
        config.defaultVariants,
      );

      if (compoundClassName) {
        className += ' ' + compoundClassName;
      }
    }

    return className;
  };
