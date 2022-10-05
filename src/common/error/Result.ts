export type Result<O, E> = ({ isOk: true, ok: O, er?: never, } | { isOk: false, ok?: never, er: E }) & {
  unwrap: () => O;
  match: <P, Q>(handler: { ok: (ok: O) => P, er: (er: E) => Q }) => P | Q;
  handleOk: <P, E2 = never>(handler: (ok: O) => P, onEr?: (e: unknown) => E2) => Result<P, E | E2>;
  handleEr: <P, E2 = never>(handler: (er: E) => P, onEr?: (e: unknown) => E2) => Result<O, P | E2>;
};

export const ok = <O>(o: O): Result<O, never> => ({
  isOk: true,
  ok: o,
  unwrap: () => o,
  match: (handler) => handler.ok(o),
  handleOk: (handler, onEr) => {
    if (!onEr) return ok(handler(o));
    try { return ok(handler(o)); } catch (e2) { return er(onEr(e2)); };
  },
  handleEr: () => ok(o),
});

export const er = <E>(e: E): Result<never, E> => ({
  isOk: false,
  er: e,
  unwrap: () => { throw e; },
  match: (handler) => handler.er(e),
  handleOk: () => er(e),
  handleEr: (handler, onEr) => {
    if (!onEr) return er(handler(e));
    try { return er(handler(e)); } catch (e2) { return er(onEr(e2)); };
  },
});
