import type {
  ComplexStyleRule,
  CSSProperties,
  StyleRule,
} from '@vanilla-extract/css';

type RecipeStyleRule = ComplexStyleRule | string;

export type VariantDefinitions = Record<string, RecipeStyleRule>;

type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;

export type VariantGroups = Record<string, VariantDefinitions>;
export type VariantSelection<Variants extends VariantGroups> = {
  [VariantGroup in keyof Variants]?: BooleanMap<keyof Variants[VariantGroup]>;
};

export type PatternResult<Variants extends VariantGroups> = {
  defaultClassName: string;
  variantClassNames: {
    [P in keyof Variants]: { [P in keyof Variants[keyof Variants]]: string };
  };
  defaultVariants: VariantSelection<Variants>;
  compoundVariants: Array<[VariantSelection<Variants>, string]>;
};

export interface CompoundVariant<Variants extends VariantGroups> {
  variants: VariantSelection<Variants>;
  style: RecipeStyleRule;
}

export type BaseConditions = { [conditionName: string]: Condition };

interface Condition {
  '@media'?: string;
  '@supports'?: string;
  selector?: string;
}

export type AtomicProperties = {
  [Property in keyof CSSProperties]?:
    | Record<
        string,
        | CSSProperties[Property]
        | Omit<StyleRule, 'selectors' | '@media' | '@supports'>
      >
    | ReadonlyArray<CSSProperties[Property]>;
};

type UnconditionalAtomicOptions<Properties extends AtomicProperties> = {
  properties: Properties;
};

export interface ResponsiveArray<Length extends number, Value>
  extends ReadonlyArray<Value> {
  0: Value;
  length: Length;
}

export interface RequiredResponsiveArray<Length extends number, Value>
  extends ReadonlyArray<Value> {
  0: Exclude<Value, null>;
  length: Length;
}

export type ResponsiveArrayConfig<Value> = ResponsiveArray<
  2 | 3 | 4 | 5 | 6 | 7 | 8,
  Value
>;

type ResponsiveArrayOptions<
  Conditions extends { [conditionName: string]: Condition },
  ResponsiveLength extends number,
> = {
  responsiveArray: ResponsiveArrayConfig<keyof Conditions> & {
    length: ResponsiveLength;
  };
};

type ConditionalAtomicOptions<
  Properties extends AtomicProperties,
  Conditions extends { [conditionName: string]: Condition },
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
> = UnconditionalAtomicOptions<Properties> & {
  conditions: Conditions;
  defaultCondition: DefaultCondition;
};

export type PatternOptions<
  Variants extends VariantGroups,
  Properties extends AtomicProperties,
  Conditions extends BaseConditions,
  ResponsiveLength extends number,
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
> = {
  base?: RecipeStyleRule;
  variants?: Variants;
  defaultVariants?: VariantSelection<Variants>;
  compoundVariants?: Array<CompoundVariant<Variants>>;
} & ConditionalAtomicOptions<Properties, Conditions, DefaultCondition> &
  ResponsiveArrayOptions<Conditions, ResponsiveLength>;

export type RuntimeFn<Variants extends VariantGroups> = (
  options?: VariantSelection<Variants>,
) => string;

export type RecipeVariants<RecipeFn extends RuntimeFn<VariantGroups>> =
  Parameters<RecipeFn>[0];
