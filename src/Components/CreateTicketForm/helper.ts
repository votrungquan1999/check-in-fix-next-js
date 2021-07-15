import { trimExtraCharacterPhoneNumber, validatePhoneNumber } from '../../utils/phoneNumber';
import { CreateTicketForm } from './CreateTicketForm';

const REQUIRED_FIELDS = ['service_id'] as const;

export function validateForm(input: CreateTicketForm): [object, boolean] {
  let validationError = {};
  let hasError = false;

  for (const field of REQUIRED_FIELDS) {
    const value = input[field];

    if (!value) {
      hasError = true;
      validationError = {
        ...validationError,
        [field]: 'this field is required',
      };
    }
  }

  const phoneNumber = trimExtraCharacterPhoneNumber(input['contact_phone_number']);
  const phoneNumberError = validatePhoneNumber(phoneNumber);
  if (phoneNumberError) {
    hasError = true;
    validationError = {
      ...validationError,
      contact_phone_number: 'phone number invalid',
    };
  }

  return [validationError, hasError];
}
