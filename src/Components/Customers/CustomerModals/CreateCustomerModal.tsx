import { Modal } from 'antd';
import React from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { CreateCustomerForm } from '../CustomerForms/CreateCustomerForm';

interface CreateCustomerModalProps extends WithAuthProps {
  isCreateCustomerModalVisible: boolean;
  finishCreateCustomer: (createSuccessfully?: boolean) => any;
}

export function CreateCustomerModal(props: CreateCustomerModalProps) {
  const { isCreateCustomerModalVisible, finishCreateCustomer, employee, user } = props;
  // const [createdCustomerSucessfully, setCreatedCustomerSuccessfully] = useState(false);
  // const [triggerResetForm, setTriggerResetForm] = useState(false);

  const resetModal = useCallback(() => {
    finishCreateCustomer(false);
    // setCreatedCustomerSuccessfully(false);
    // setTriggerResetForm(!triggerResetForm);
  }, [finishCreateCustomer]);

  const handleCreateCustomerSuccessfully = useCallback(() => {
    // setCreatedCustomerSuccessfully(true);
    // finishCreateCustomer;

    finishCreateCustomer(true);
  }, [finishCreateCustomer]);

  return (
    <Modal
      title="Create New Customer"
      visible={isCreateCustomerModalVisible}
      footer={null}
      onCancel={resetModal}
      width={'80%'}
      destroyOnClose
    >
      <CreateCustomerForm
        employee={employee}
        user={user}
        onCreateCustomerSuccessfully={handleCreateCustomerSuccessfully}
      />
    </Modal>
  );
}
