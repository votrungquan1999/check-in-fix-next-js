import { get, isNil } from 'lodash/fp';
import { FieldData } from 'rc-field-form/lib/interface';
import { ProductInputFormattedData, ProductInputFormData } from './ProductInputForm';

const numberFields: (keyof ProductInputFormData)[] = [
  'alert_quantity',
  'quantity',
  'product_unit',
  'product_cost',
  'product_price',
];

const requiredFields: (keyof ProductInputFormData)[] = ['product_name'];

export function validateProductInput(inputData: ProductInputFormData): object[] {
  let validationStatuses = {};
  let validationHelpers = {};

  for (const key of numberFields) {
    const value = inputData[key];

    if (isNil(value)) {
      continue;
    }

    if (!value.match(/[0-9]./)) {
      validationStatuses = {
        ...validationStatuses,
        [key]: 'error',
      };

      validationHelpers = {
        ...validationHelpers,
        [key]: 'this field must be a number',
      };
    }
  }

  for (const key of requiredFields) {
    const value = inputData[key];
    if (!isNil(value) && value !== '') {
      continue;
    }

    validationStatuses = {
      ...validationStatuses,
      [key]: 'error',
    };

    validationHelpers = {
      ...validationHelpers,
      [key]: 'this field is required',
    };
  }

  return [validationStatuses, validationHelpers];
}

export function checkDataChanges(initData: ProductInputFormData, allFields: FieldData[]) {
  let validationStatuses = {};
  // console.log(allFields, initData);

  for (const field of allFields) {
    const path = field.name.toString();
    const newValue = field.value;
    const oldValue = get(path)(initData);

    // if (path === 'product_unit') {
    //   console.log(newValue, oldValue);
    // }

    if ((isNil(newValue) || newValue === '') && (isNil(oldValue) || oldValue === '')) {
      continue;
    }

    if (newValue === oldValue) {
      continue;
    }

    // console.log(path, newValue, oldValue);
    validationStatuses = {
      ...validationStatuses,
      [path]: 'warning',
    };
  }

  return validationStatuses;
}
