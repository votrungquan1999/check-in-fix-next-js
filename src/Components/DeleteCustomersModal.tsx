import { Modal } from 'antd';
import React from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { WithAuthProps } from '../firebase/withAuth';
import { Customer, deleteCustomersByIDs } from '../services/customers';

interface DeleteCustomerModalProps extends WithAuthProps {
  toBeDeletedCustomers: Customer[];
  finishDeleteCustomers: () => any;
}

export function DeleteCustomerModal(props: DeleteCustomerModalProps) {
  const { toBeDeletedCustomers, finishDeleteCustomers, user } = props;
  const [deleting, setDeleting] = useState(false);

  const resetModal = useCallback(() => {
    finishDeleteCustomers();
  }, [finishDeleteCustomers]);

  const handleDeleteCustomers = useCallback(async () => {
    setDeleting(true);
    if (!toBeDeletedCustomers.length) {
      setDeleting(false);
      return;
    }
    const customerIDs = toBeDeletedCustomers.map((customer) => customer.id);
    const { token } = await user.getIdTokenResult();

    const deletedCustomers = await deleteCustomersByIDs(customerIDs, token);
    if (deletedCustomers) {
      resetModal();
    }

    setDeleting(false);
  }, [toBeDeletedCustomers]);

  return (
    <Modal
      title="Delete Customers"
      visible={!!toBeDeletedCustomers.length}
      onOk={handleDeleteCustomers}
      onCancel={resetModal}
      confirmLoading={deleting}
    >
      <div>
        Your are going to delete {toBeDeletedCustomers.length} customer{toBeDeletedCustomers.length > 1 ? 's' : ''}
      </div>
    </Modal>
  );
}
