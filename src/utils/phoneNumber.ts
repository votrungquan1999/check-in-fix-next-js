import { isNil } from 'lodash/fp';

export function transformPhoneNumberToDisplay(phoneNumber: string | undefined) {
  if (isNil(phoneNumber)) {
    return;
  }
  let rawPhoneNumber = trimExtraCharacterPhoneNumber(phoneNumber) as string;

  if (rawPhoneNumber.length > 3) {
    rawPhoneNumber = `(${rawPhoneNumber.slice(0, 3)}) ${rawPhoneNumber.slice(3)}`;
  }

  if (rawPhoneNumber.length > 9) {
    rawPhoneNumber = `${rawPhoneNumber.slice(0, 9)}-${rawPhoneNumber.slice(9)}`;
  }

  return rawPhoneNumber;
}

export function trimExtraCharacterPhoneNumber(phoneNumber: string | undefined) {
  if (isNil(phoneNumber)) {
    return;
  }

  let rawPhoneNumber = phoneNumber.replaceAll(/[()-\s]/g, '');

  return rawPhoneNumber;
}

export function validatePhoneNumber(phoneNumber: string | undefined) {
  if (isNil(phoneNumber)) {
    return;
  }

  if (phoneNumber.length !== 10) {
    return 'error';
  }

  if (!/[0-9]{10}/.test(phoneNumber)) {
    return 'error';
  }
}
