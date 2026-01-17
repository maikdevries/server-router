export type Empty = Record<never, never>;

export type Override<T, S> = Omit<T, keyof S> & S;
