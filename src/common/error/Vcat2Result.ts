import { er, Result } from "./Result";
import { Vcat2Error } from "./Vcat2Error";

export type Vcat2Result<O> = Result<O, Vcat2Error>;

export const e = <A extends unknown[], O>(filename: string, f: (...args: A) => Vcat2Result<O>): ((...args: A) => Vcat2Result<O>) => {
  return (...args: A) => {
    try {
      return f(...args);
    } catch (e) {
      return er(new Vcat2Error(filename, e));
    }
  };
};

export const ea = <A extends unknown[], O>(filename: string, f: (...args: A) => PromiseLike<Vcat2Result<O>>): ((...args: A) => Promise<Vcat2Result<O>>) => {
  return async (...args: A) => {
    try {
      const result = await f(...args);
      return result;
    } catch (e) {
      return er(new Vcat2Error(filename, e));
    }
  };
};
