import { Vcat2Error } from "./Vcat2Error";

export class Result<T, E, S extends boolean = boolean>{
  private constructor(public s: S, private t: T, private e: E,) { };

  static success<T, E>(t: T): Result<T, E, true> {
    return new Result(true, t, undefined as unknown as E);
  }
  static error<T, E>(e: E): Result<T, E, false> {
    return new Result(false, undefined as unknown as T, e);
  }
  _() {
    if (this.s) return this.t;
    throw this.e;
  }
  on<P, Q>(handler: { onSuccess: (t: T) => P, onError: (e: E) => Q }): P | Q {
    const { onSuccess, onError } = handler;
    if (this.s) {
      return onSuccess(this.t);
    } else {
      return onError(this.e);
    }
  }
  isSuccess(): this is Result<T, E, true> {
    return this.s;
  }
  isError(): this is Result<T, E, false> {
    return !this.s;
  }
  getSuccess(): [S] extends [true] ? T : never {
    return this.t as any;
  }
  getError(): [S] extends [false] ? E : never {
    return this.e as any;
  }
};

export const e = <T extends (...args: any) => any>(filename: string, f: T): Result<ReturnType<T>, Vcat2Error> => {
  try {
    const result = f();
    return Result.success(result);
  } catch (e) {
    if (Vcat2Error.is(e)) return Result.error(e);
    return Result.error(new Vcat2Error(filename, e));
  }
};

export const ea = async <T extends (...args: any) => PromiseLike<any>>(filename: string, f: T): Promise<Result<Awaited<ReturnType<T>>, Vcat2Error>> => {
  try {
    const result = await f();
    return Result.success(result);
  } catch (e) {
    if (Vcat2Error.is(e)) return Result.error(e);
    return Result.error(new Vcat2Error(filename, e));
  }
};
