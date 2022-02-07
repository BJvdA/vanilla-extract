import type { BaseConditions, PatternOptions, RuntimeFn, VariantGroups } from './types';
export type { RecipeVariants } from './types';
export declare function recipe<Variants extends VariantGroups, Conditions extends BaseConditions, ResponsiveLength extends number, DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false>(options: PatternOptions<Variants, Conditions, ResponsiveLength, DefaultCondition>, debugId?: string): RuntimeFn<Variants>;
