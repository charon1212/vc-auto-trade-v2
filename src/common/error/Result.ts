import { Vcat2Error } from "./Vcat2Error";

export class Result<T, E, S extends boolean = boolean>{
  private constructor(private s: S, private t: T, private e: E,) { };

  static ok<T, E>(t: T): Result<T, E, true> {
    return new Result(true, t, undefined as unknown as E);
  };
  static er<T, E>(e: E): Result<T, E, false> {
    return new Result(false, undefined as unknown as T, e);
  };
  unwrap() {
    if (this.s) return this.t;
    throw this.e;
  };
  match<P, Q>(handler: { ok: (t: T) => P, er: (e: E) => Q }): P | Q {
    const { ok, er } = handler;
    if (this.s) {
      return ok(this.t);
    } else {
      return er(this.e);
    }
  };
  handleOk<P>(handler: (t: T) => P): Result<P, E, S> {
    if (this.s) {
      return Result.ok(handler(this.t)) as Result<P, E, S>;
    } else {
      return Result.er(this.e) as Result<P, E, S>;
    }
  };
  handleEr<P>(handler: (e: E) => P): Result<T, P, S> {
    if (this.s) {
      return Result.ok(this.t) as Result<T, P, S>;
    } else {
      return Result.er(handler(this.e)) as Result<T, P, S>;
    }
  };
  isOk(): this is Result<T, E, true> { return this.s; };
  isEr(): this is Result<T, E, false> { return !this.s; };
  ok(): [S] extends [true] ? T : never { return this.t as any; };
  er(): [S] extends [false] ? E : never { return this.e as any; };
};

export const e = <A extends unknown[], R>(filename: string, f: (...args: A) => R): ((...args: A) => Result<R, Vcat2Error>) => {
  return (...args: A) => {
    try {
      const result = f(...args);
      return Result.ok(result);
    } catch (e) {
      if (Vcat2Error.is(e)) return Result.er(e);
      return Result.er(new Vcat2Error(filename, e));
    }
  };
};

export const ea = <A extends unknown[], R>(filename: string, f: (...args: A) => PromiseLike<R>): ((...args: A) => Promise<Result<Awaited<R>, Vcat2Error>>) => {
  return async (...args: A) => {
    try {
      const result = await f(...args);
      return Result.ok(result);
    } catch (e) {
      if (Vcat2Error.is(e)) return Result.er(e);
      return Result.er(new Vcat2Error(filename, e));
    }
  };
};
