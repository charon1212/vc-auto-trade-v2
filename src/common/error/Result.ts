import { Vcat2Error } from "./Vcat2Error";

export type Result<O, E> = ({ isOk: true, ok: O, er?: never, } | { isOk: false, ok?: never, er: E }) & {
  unwrap: () => O;
  match: <P, Q>(handler: { ok: (ok: O) => P, er: (er: E) => Q }) => P | Q;
  handleOk: <P>(handler: (ok: O) => P) => Result<P, E>;
  handleEr: <P>(handler: (er: E) => P) => Result<O, P>;
};

export const ok = <O>(o: O): Result<O, never> => ({
  isOk: true,
  ok: o,
  unwrap: () => o,
  match: (handler) => handler.ok(o),
  handleOk: (handler) => ok(handler(o)),
  handleEr: () => ok(o),
});
export const er = <E>(e: E): Result<never, E> => ({
  isOk: false,
  er: e,
  unwrap: () => { throw e; },
  match: (handler) => handler.er(e),
  handleOk: () => er(e),
  handleEr: (handler) => er(handler(e)),
});

export const e = <A extends unknown[], R>(filename: string, f: (...args: A) => R): ((...args: A) => Result<R, Vcat2Error>) => {
  return (...args: A) => {
    try {
      const result = f(...args);
      return ok(result);
    } catch (e) {
      if (Vcat2Error.is(e)) return er(e);
      return er(new Vcat2Error(filename, e));
    }
  };
};

export const ea = <A extends unknown[], R>(filename: string, f: (...args: A) => PromiseLike<R>): ((...args: A) => Promise<Result<Awaited<R>, Vcat2Error>>) => {
  return async (...args: A) => {
    try {
      const result = await f(...args);
      return ok(result);
    } catch (e) {
      if (Vcat2Error.is(e)) return er(e);
      return er(new Vcat2Error(filename, e));
    }
  };
};
