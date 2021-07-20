import { get, isNil } from 'lodash/fp';
import { trimExtraCharacterPhoneNumber, validatePhoneNumber } from '../../utils/phoneNumber';

const requiredFields = ['first_name', 'last_name', 'phone_number'] as const;

function validateRequiredField(value: any) {
  function isFieldEmpty(value: string | undefined) {
    if (isNil(value)) {
      return true;
    }

    if (!value.length) {
      return true;
    }

    return false;
  }

  return isFieldEmpty(value) ? 'This field is required' : undefined;
}

export async function validateCreateCustomerForm(fieldsvalue: any) {
  let validationErrors = {};

  for (const key of requiredFields) {
    const value = get(key)(fieldsvalue);
    const validationResult = validateRequiredField(value);
    if (validationResult) {
      validationErrors = {
        ...validationErrors,
        [key]: validationResult,
      };
    }
  }

  const phoneNumber = trimExtraCharacterPhoneNumber(get('phone_number')(fieldsvalue));
  const validatePhoneNumberResult = validatePhoneNumber(phoneNumber);

  if (validatePhoneNumberResult) {
    validationErrors = {
      ...validationErrors,
      phone_number: 'Invalid Phone Number',
    };
  }

  return validationErrors;
}
