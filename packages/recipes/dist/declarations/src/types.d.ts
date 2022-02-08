import type { ComplexStyleRule } from '@vanilla-extract/css';
declare type RecipeStyleRule = ComplexStyleRule | string;
export declare type VariantDefinitions = Record<string, RecipeStyleRule>;
declare type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;
export declare type VariantGroups = Record<string, VariantDefinitions>;
export declare type VariantSelection<Variants extends VariantGroups> = {
    [VariantGroup in keyof Variants]?: BooleanMap<keyof Variants[VariantGroup]>;
};
export declare type PatternResult<Variants extends VariantGroups> = {
    defaultClassName: string;
    variantClassNames: {
        [P in keyof Variants]: {
            [P in keyof Variants[keyof Variants]]: string;
        };
    };
    defaultVariants: VariantSelection<Variants>;
    compoundVariants: Array<[VariantSelection<Variants>, string]>;
};
export interface CompoundVariant<Variants extends VariantGroups> {
    variants: VariantSelection<Variants>;
    style: RecipeStyleRule;
}
export declare type BaseConditions = {
    [conditionName: string]: Condition;
};
interface Condition {
    '@media'?: string;
    '@supports'?: string;
    selector?: string;
}
export interface ResponsiveArray<Length extends number, Value> extends ReadonlyArray<Value> {
    0: Value;
    length: Length;
}
export interface RequiredResponsiveArray<Length extends number, Value> extends ReadonlyArray<Value> {
    0: Exclude<Value, null>;
    length: Length;
}
export declare type ResponsiveArrayConfig<Value> = ResponsiveArray<2 | 3 | 4 | 5 | 6 | 7 | 8, Value>;
declare type ResponsiveArrayOptions<Conditions extends {
    [conditionName: string]: Condition;
}, ResponsiveLength extends number> = {
    responsiveArray: ResponsiveArrayConfig<keyof Conditions> & {
        length: ResponsiveLength;
    };
};
declare type ConditionalAtomicOptions<Conditions extends {
    [conditionName: string]: Condition;
}, DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false> = {
    conditions: Conditions;
    defaultCondition: DefaultCondition;
};
export declare type PatternOptions<Variants extends VariantGroups, Conditions extends BaseConditions, ResponsiveLength extends number, DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false> = {
    base?: RecipeStyleRule;
    variants?: Variants;
    defaultVariants?: VariantSelection<Variants>;
    compoundVariants?: Array<CompoundVariant<Variants>>;
} & Partial<ConditionalAtomicOptions<Conditions, DefaultCondition>> & Partial<ResponsiveArrayOptions<Conditions, ResponsiveLength>>;
export declare type RuntimeFn<Variants extends VariantGroups> = (options?: VariantSelection<Variants>) => string;
export declare type RecipeVariants<RecipeFn extends RuntimeFn<VariantGroups>> = Parameters<RecipeFn>[0];
export {};