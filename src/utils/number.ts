import { isNil } from 'lodash/fp';

export function undefinableParseInt(input: string | undefined) {
  if (isNil(input)) {
    return input;
  }

  return parseInt(input);
}
