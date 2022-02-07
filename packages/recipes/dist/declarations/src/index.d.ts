import type { AtomicProperties, BaseConditions, PatternOptions, RuntimeFn, VariantGroups } from './types';
export type { RecipeVariants } from './types';
export declare function recipe<Variants extends VariantGroups, Properties extends AtomicProperties, Conditions extends BaseConditions, ResponsiveLength extends number, DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false>(options: PatternOptions<Variants, Properties, Conditions, ResponsiveLength, DefaultCondition>, debugId?: string): RuntimeFn<Variants>;
