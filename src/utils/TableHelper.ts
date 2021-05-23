export function transformDataForSelection<T extends { id: string }>(arr: T[]): (T & { key: string })[] {
  return arr.map((data) => ({ ...data, key: data.id }));
}
