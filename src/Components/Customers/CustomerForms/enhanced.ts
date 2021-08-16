import { get, isNil } from 'lodash/fp';
import { FieldData } from 'rc-field-form/lib/interface';
import { Customer } from '../../../services/customers';
import { trimExtraCharacterPhoneNumber, validatePhoneNumber } from '../../../utils/phoneNumber';

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

export async function validateInputCustomerForm(fieldsvalue: any) {
  let validationHelpers = {};
  let validationStatuses = {};

  for (const key of requiredFields) {
    const value = get(key)(fieldsvalue);
    const validationResult = validateRequiredField(value);
    if (validationResult) {
      validationHelpers = {
        ...validationHelpers,
        [key]: validationResult,
      };
      validationStatuses = {
        ...validationStatuses,
        [key]: 'error',
      };
    }
  }

  const phoneNumber = trimExtraCharacterPhoneNumber(get('phone_number')(fieldsvalue));
  const validatePhoneNumberResult = validatePhoneNumber(phoneNumber);

  if (validatePhoneNumberResult) {
    validationHelpers = {
      ...validationHelpers,
      phone_number: 'Invalid Phone Number',
    };
    validationStatuses = {
      ...validationStatuses,
      phone_number: 'error',
    };
  }

  return [validationHelpers, validationStatuses];
}

export function validateChangedFields(allFields: FieldData[], customer: Customer) {
  let validateStatuses = {};
  for (const field of allFields) {
    const path = field.name.toString();
    const newValue = path === 'phone_number' ? trimExtraCharacterPhoneNumber(field.value) : field.value;
    const oldValue = get(path)(customer);

    if (isNil(newValue) && isNil(oldValue)) {
      continue;
    }

    if (newValue !== oldValue) {
      validateStatuses = {
        ...validateStatuses,
        [path]: 'warning',
      };
    }
  }

  return validateStatuses;
}
