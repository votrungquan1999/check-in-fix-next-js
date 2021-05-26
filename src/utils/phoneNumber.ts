export function transformPhoneNumberToDisplay(phoneNumber: string) {
  if (phoneNumber.length >= 3) {
    phoneNumber = `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3)}`;
  }

  if (phoneNumber.length >= 8) {
    phoneNumber = `${phoneNumber.slice(0, 8)}-${phoneNumber.slice(8)}`;
  }

  return phoneNumber;
}
