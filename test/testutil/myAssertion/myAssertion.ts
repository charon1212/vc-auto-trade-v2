class AssertObject<T> {
  constructor(
    private object: T,
    private message?: string
  ) { }
  desc(message: string) {
    this.message = message;
    return this;
  }
  toBe(callback: (object: T) => boolean) {
    if (!callback(this.object)) fail(this.message);
    return this;
  }
  isNonNullable() {
    if (this.object === null || this.object === undefined) fail(this.message);
    return new AssertObject<NonNullable<T>>(this.object as NonNullable<T>, this.message);
  }
  isNullable() {
    if (this.object !== null && this.object !== undefined) fail(this.message);
    return new AssertObject<T & (null | undefined)>(this.object as T & (null | undefined), this.message);
  }
};

export const A_obj = <T>(obj: T) => {
  return new AssertObject(obj);
};

export const fail = (message?: any) => { throw new Error(message) };
