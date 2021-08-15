import { Modal } from 'antd';
import React from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { WithAuthProps } from '../../../../firebase/withAuth';
import { CreateCustomerForm } from '../../CustomerForms/CreateCustomerForm/CreateCustomerForm';

interface CreateCustomerModalProps extends WithAuthProps {
  isCreateCustomerModalVisible: boolean;
  finishCreateCustomer: () => any;
}

export function CreateCustomerModal(props: CreateCustomerModalProps) {
  const { isCreateCustomerModalVisible, finishCreateCustomer, employee, user } = props;
  const [createdCustomerSucessfully, setCreatedCustomerSuccessfully] = useState(false);
  const [triggerResetForm, setTriggerResetForm] = useState(false);

  const resetModal = useCallback(() => {
    finishCreateCustomer();
    setCreatedCustomerSuccessfully(false);
    setTriggerResetForm(!triggerResetForm);
  }, [triggerResetForm]);

  const handleCreateCustomerSuccessfully = useCallback(() => {
    setCreatedCustomerSuccessfully(true);
  }, []);

  const isOkButtonDisable = useMemo(() => {
    if (createdCustomerSucessfully) {
      return false;
    }

    return true;
  }, [createdCustomerSucessfully]);

  return (
    <Modal
      title="Customer Detail"
      visible={isCreateCustomerModalVisible}
      onOk={resetModal}
      okText={'Done'}
      okButtonProps={{
        disabled: isOkButtonDisable,
      }}
      onCancel={resetModal}
      width={'80%'}
    >
      <CreateCustomerForm
        employee={employee}
        user={user}
        onCreateCustomerSuccessfully={handleCreateCustomerSuccessfully}
        triggerResetForm={triggerResetForm}
      />
    </Modal>
  );
}
