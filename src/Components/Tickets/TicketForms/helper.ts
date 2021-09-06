import { get, set } from 'lodash/fp';
import moment from 'moment';
import { FieldData } from 'rc-field-form/lib/interface';
// import { FormFieldData } from '../../../commons/formFields';
import { trimExtraCharacterPhoneNumber, validatePhoneNumber } from '../../../utils/phoneNumber';
import { InputTicketFormData } from './commons';

const REQUIRED_FIELDS = [] as const;

export function validateForm(input: InputTicketFormData): [object, object, boolean] {
  let validationStatuses: object = {};
  let validationHelpers: object = {};
  let hasError = false;

  for (const field of REQUIRED_FIELDS) {
    const value = input[field];

    if (!value) {
      hasError = true;
      validationHelpers = {
        ...validationHelpers,
        [field]: 'this field is required',
      };

      validationStatuses = {
        ...validationStatuses,
        [field]: 'error',
      };
    }
  }

  const phoneNumber = trimExtraCharacterPhoneNumber(input['contact_phone_number']);
  const phoneNumberError = validatePhoneNumber(phoneNumber);
  if (phoneNumberError) {
    hasError = true;
    validationHelpers = {
      ...validationHelpers,
      contact_phone_number: 'phone number invalid',
    };

    validationStatuses = {
      ...validationStatuses,
      contact_phone_number: 'error',
    };
  }

  return [validationStatuses, validationHelpers, hasError];
}

export function validateFieldChanged(fieldChanged: FieldData, initialValue: InputTicketFormData) {
  const initFieldValue = get(fieldChanged.name)(initialValue);
  const newValue = fieldChanged.value;

  // console.log(fieldChanged.name);
  // console.log(newValue, initFieldValue);

  if (!initFieldValue && !newValue) {
    return false;
  }

  // console.log(typeof initFieldValue, typeof newValue);

  if (moment.isMoment(initFieldValue) && moment.isMoment(newValue)) {
    console.log(!!initFieldValue.diff(newValue, 'day'));
    // console.log(initFieldValue.toString(), newValue.toString());
    // return !!initFieldValue.diff(newValue, 'day');

    return !initFieldValue.isSame(newValue, 'day');
  }

  return !(initFieldValue === newValue);
}
