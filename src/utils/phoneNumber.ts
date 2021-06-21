export function transformPhoneNumberToDisplay(phoneNumber: string | undefined) {
  // console.log(rawPhoneNumber);
  if (!phoneNumber) {
    return;
  }
  let rawPhoneNumber = trimExtraCharacterPhoneNumber(phoneNumber) as string;

  if (rawPhoneNumber.length >= 3) {
    rawPhoneNumber = `(${rawPhoneNumber.slice(0, 3)})${rawPhoneNumber.slice(3)}`;
  }

  if (rawPhoneNumber.length >= 8) {
    rawPhoneNumber = `${rawPhoneNumber.slice(0, 8)}-${rawPhoneNumber.slice(8)}`;
  }

  return rawPhoneNumber;
}

export function trimExtraCharacterPhoneNumber(phoneNumber: string | undefined) {
  if (!phoneNumber) {
    return;
  }

  let rawPhoneNumber = phoneNumber.replaceAll(/[()-\s]/g, '');

  return rawPhoneNumber;
}

export function validatePhoneNumber(phoneNumber: string | undefined) {
  if (!phoneNumber) {
    return;
  }

  if (phoneNumber.length !== 10) {
    return 'error';
  }

  // phoneNumber.

  if (!/[0-9]{10}/.test(phoneNumber)) {
    return 'error';
  }
}
