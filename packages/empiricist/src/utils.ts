export function constNull() {
  return null;
}

export function omit<T, U extends string>(val: T, propName: U): Omit<T, U> {
  const { [propName]: _, ...rest } = val;
  return rest;
}
