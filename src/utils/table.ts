export function transformDataSourceToHaveKey<T extends {}>(arr: T[]): (T & { key: string })[] {
  return arr.map((data, index) => ({ ...data, key: index.toString() }));
}
