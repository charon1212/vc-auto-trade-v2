export type DR<T> = {
  readonly [P in keyof T]: keyof T[P] extends never ? T[P] : DR<T[P]>
}
