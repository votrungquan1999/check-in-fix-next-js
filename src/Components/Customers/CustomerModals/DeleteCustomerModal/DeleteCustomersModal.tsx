import { Input, Modal } from 'antd';
import React from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { WithAuthProps } from '../../../../firebase/withAuth';
import { Customer, deleteCustomersByIDs } from '../../../../services/customers';

interface DeleteCustomerModalProps extends WithAuthProps {
  toBeDeletedCustomers: Customer[];
  finishDeleteCustomers: () => any;
}

export function DeleteCustomerModal(props: DeleteCustomerModalProps) {
  const { toBeDeletedCustomers, finishDeleteCustomers, user } = props;
  const [deleting, setDeleting] = useState(false);
  const [stage, setStage] = useState<0 | 1>(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const resetModal = useCallback(() => {
    setStage(0);
    setDeleting(false);
    setConfirmDelete(false);
    finishDeleteCustomers();
  }, [finishDeleteCustomers]);

  const mapStageContent = useMemo(() => {
    return {
      0: (
        <div>
          Your are going to delete {toBeDeletedCustomers.length} customer{toBeDeletedCustomers.length > 1 ? 's' : ''}
        </div>
      ),
      1: <DoubleConfirmDeleteCustomer setConfirmDelete={setConfirmDelete} />,
    };
  }, [toBeDeletedCustomers, setConfirmDelete]);

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
  }, [toBeDeletedCustomers, user, resetModal]);

  const handleOK = useCallback(async () => {
    if (stage === 0) {
      setStage(1);
      return;
    }

    await handleDeleteCustomers();
  }, [stage, handleDeleteCustomers]);

  return (
    <Modal
      title="Delete Customers"
      visible={!!toBeDeletedCustomers.length}
      onOk={handleOK}
      okButtonProps={{ disabled: stage === 1 && !confirmDelete }}
      onCancel={resetModal}
      confirmLoading={deleting}
    >
      {mapStageContent[stage]}
    </Modal>
  );
}

interface DoubleConfirmDeleteCustomerProps {
  setConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DoubleConfirmDeleteCustomer(props: DoubleConfirmDeleteCustomerProps) {
  const { setConfirmDelete } = props;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.target.value === 'delete') {
        setConfirmDelete(true);
        return;
      }

      setConfirmDelete(false);
    },
    [setConfirmDelete],
  );

  return (
    <div>
      <div className="mb-5">
        This action is not revertable, please enter "<p className="font-bold inline">delete</p>" in the box below
      </div>
      <Input onChange={handleChange} />
    </div>
  );
}
