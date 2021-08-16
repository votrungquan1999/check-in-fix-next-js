import { isEmpty } from 'lodash/fp';
import { FieldData } from 'rc-field-form/lib/interface';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { createCustomer, CreateCustomerInput, Customer, updateCustomer } from '../../../services/customers';
import { trimExtraCharacterPhoneNumber } from '../../../utils/phoneNumber';
import { validateChangedFields, validateInputCustomerForm } from './enhanced';
import { CustomerInputData, InputCustomerForm } from './InputCustomerForm';

interface EditCustomerFormProps extends WithAuthProps {
  // initPhoneNumber?: string;
  customer: Customer;
  onEditSuccessfully?: (customer: Customer) => any;
}

export function EditCustomerForm(props: EditCustomerFormProps) {
  const { employee, user, customer, onEditSuccessfully } = props;
  const [validationStatuses, setValidationStatuses] = useState({});
  const [validationHelpers, setValidationHelpers] = useState({});

  const handleUpdateCustomerSuccessfully = useCallback(
    (customer: Customer) => {
      if (onEditSuccessfully) {
        onEditSuccessfully(customer);
      }
    },
    [onEditSuccessfully],
  );

  const handleSubmit = useCallback(
    async (value: CustomerInputData) => {
      const [newValidationHelpers, newValidationStatuses] = await validateInputCustomerForm(value);
      setValidationStatuses(newValidationStatuses);
      setValidationHelpers(newValidationHelpers);

      if (!isEmpty(newValidationHelpers) || !isEmpty(newValidationStatuses)) {
        return;
      }

      const updateCustomerInput: Partial<Customer> = {
        first_name: value.first_name,
        last_name: value.last_name,
        phone_number: trimExtraCharacterPhoneNumber(value.phone_number),
        email: value.email,
      };

      const token = await user.getIdToken();

      const updatedCustomer = await updateCustomer(customer.id, updateCustomerInput, token);
      if (!updatedCustomer) {
        return;
      }

      handleUpdateCustomerSuccessfully(updatedCustomer);
    },
    [user, employee, handleUpdateCustomerSuccessfully, customer],
  );

  const handleFieldChanges = useCallback(
    (changedFields: FieldData[], allFields: FieldData[]) => {
      // if (!customer) {
      //   return;
      // }
      // console.log(key, typeof value, value.length);
      // let [formValue, initValue] = getInitValueAndFormValue(customer, value, key);
      // const newValidationStatuses = validateFormValues(formValue, initValue, key, validationStatuses);
      // let isEdited = false;
      // for (const currentValue of Object.values(newValidationStatuses)) {
      //   if (currentValue) {
      //     isEdited = true;
      //     break;
      //   }
      // }
      // console.log('get here');
      // setIsCustomerEdited(isEdited);
      // setValidationStatuses(newValidationStatuses);
      const newValidationStatuses = validateChangedFields(allFields, customer);
      setValidationStatuses(newValidationStatuses);
      setValidationHelpers({});
    },
    [customer],
  );

  // const handleFieldChange = useCallback(() => {
  //   setValidationStatuses({});
  //   setValidationHelpers({});
  // }, []);

  return (
    <InputCustomerForm
      title={'Edit Customer'}
      customer={customer}
      handleSubmit={handleSubmit}
      handleFieldChanged={handleFieldChanges}
      validationHelpers={validationHelpers}
      validationStatuses={validationStatuses}
    />
  );
}
