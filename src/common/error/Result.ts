abstract class ResultBase<O, E>{
  protected readonly __branc_result_base = '__branc_result_base';
  abstract unwrap(): O;
  abstract else<T>(def: T): O | T;
  abstract handleOk<O2>(handler: (o: O) => O2): Result<O2, E>;
  abstract handleEr<E2>(handler: (e: E) => E2): Result<O, E2>;
  abstract match<O2, E2>(handler: { ok: (o: O) => O2, er: (e: E) => E2 }): O2 | E2;
  abstract await(): Promise<Result<Awaited<O>, Awaited<E>>>;
}

class ResultOk<O> extends ResultBase<O, never>{
  readonly isOk = true;
  readonly isEr = false;
  constructor(public ok: O) { super(); };
  unwrap(): O { return this.ok; };
  else(): O { return this.ok; };
  handleOk<O2>(handler: (o: O) => O2): Result<O2, never> { return ok(handler(this.ok)); };
  handleEr<E2>(): Result<O, E2> { return this; };
  match<O2, E2>(handler: { ok: (o: O) => O2 }): O2 | E2 { return handler.ok(this.ok); };
  async await(): Promise<Result<Awaited<O>, Awaited<never>>> { return ok(await this.ok); };
}

class ResultEr<E> extends ResultBase<never, E>{
  readonly isOk = false;
  readonly isEr = true;
  constructor(public er: E) { super(); };
  unwrap(): never { throw this.er; };
  else<T>(def: T): T { return def; };
  handleOk<O2>(): Result<O2, E> { return this; };
  handleEr<E2>(handler: (e: E) => E2): Result<never, E2> { return er(handler(this.er)); };
  match<O2, E2>(handler: { er: (e: E) => E2 }): O2 | E2 { return handler.er(this.er); };
  async await(): Promise<Result<Awaited<never>, Awaited<E>>> { return er(await this.er); };
}

export type Result<O, E> = ResultOk<O> | ResultEr<E>;

export const ok = <O>(o: O): Result<O, never> => new ResultOk(o);
export const okVoid = (): Result<void, never> => new ResultOk(undefined);
export const er = <E>(e: E): Result<never, E> => new ResultEr(e);
