import { isEmpty } from 'lodash/fp';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { createCustomer, CreateCustomerInput, Customer } from '../../../services/customers';
import { trimExtraCharacterPhoneNumber } from '../../../utils/phoneNumber';
import { validateInputCustomerForm } from './enhanced';
import { CustomerInputData, InputCustomerForm } from './InputCustomerForm';

interface CreateCustomerFormProps extends WithAuthProps {
  initPhoneNumber?: string;
  onCreateCustomerSuccessfully?: (customer: Customer) => any;
}

export function CreateCustomerForm(props: CreateCustomerFormProps) {
  const { employee, user, initPhoneNumber, onCreateCustomerSuccessfully } = props;
  const [validationStatuses, setValidationStatuses] = useState({});
  const [validationHelpers, setValidationHelpers] = useState({});

  const initCustomerData = initPhoneNumber
    ? {
        phone_number: initPhoneNumber,
      }
    : undefined;

  const handleCreateCustomerSuccessfully = useCallback(
    (customer: Customer) => {
      if (onCreateCustomerSuccessfully) {
        onCreateCustomerSuccessfully(customer);
      }
    },
    [onCreateCustomerSuccessfully],
  );

  const handleSubmit = useCallback(
    async (value: CustomerInputData) => {
      const [newValidationHelpers, newValidationStatuses] = await validateInputCustomerForm(value);
      setValidationStatuses(newValidationStatuses);
      setValidationHelpers(newValidationHelpers);

      if (!isEmpty(newValidationHelpers) || !isEmpty(newValidationStatuses)) {
        return;
      }

      const createCustomerInput: CreateCustomerInput = {
        first_name: value.first_name!,
        last_name: value.last_name!,
        phone_number: trimExtraCharacterPhoneNumber(value.phone_number)!,
        subscriber_id: employee.subscriber_id,
        email: value.email,
      };

      const token = await user.getIdToken();
      const customer = await createCustomer(createCustomerInput, token);
      if (!customer) {
        return;
      }

      handleCreateCustomerSuccessfully(customer);
    },
    [user, employee, handleCreateCustomerSuccessfully],
  );

  const handleFieldChange = useCallback(() => {
    setValidationStatuses({});
    setValidationHelpers({});
  }, []);

  return (
    <InputCustomerForm
      title="Create New Customer"
      customer={initCustomerData}
      handleSubmit={handleSubmit}
      handleFieldChanged={handleFieldChange}
      validationHelpers={validationHelpers}
      validationStatuses={validationStatuses}
    />
  );
}
