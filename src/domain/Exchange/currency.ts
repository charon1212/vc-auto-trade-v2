import { Pair } from "../BaseType";

export type LegalCurrency<Pair> = Pair extends `${infer V}_${infer L}` ? L : '';
export type VirtualCurrency<Pair> = Pair extends `${infer V}_${infer L}` ? V : '';

export const getLegalCurrency = <P extends Pair>(pair: P): LegalCurrency<P> => pair.split('_')[1] as LegalCurrency<P>;
export const getVirtualCurrency = <P extends Pair>(pair: P): VirtualCurrency<P> => pair.split('_')[0] as VirtualCurrency<P>;
