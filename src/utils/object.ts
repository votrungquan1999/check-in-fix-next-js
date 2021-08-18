import { isNil } from 'lodash';

export function objectContain(obj: object, searchKey: string) {
  if (typeof obj !== 'object' || isNil(obj)) {
    return false;
  }

  for (const value of Object.values(obj)) {
    if (typeof value === 'object') {
      const hasKey = objectContain(value, searchKey);
      if (hasKey) {
        return true;
      }
    }

    if (typeof value === 'string') {
      if (value.toLowerCase().includes(searchKey.toLowerCase())) {
        return true;
      }
    }
  }

  return false;
}
