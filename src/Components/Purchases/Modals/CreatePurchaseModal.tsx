import { Modal } from 'antd';
import React from 'react';
import { useCallback } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { Purchases } from '../../../services/purchases';
import { CreatePurchaseForm } from '../Forms/CreatePurchaseForm';

interface CreatePurchaseModalProps extends WithAuthProps {
  modalVisible: boolean;
  onFinishCreatePurchase: (purchase?: Purchases) => any;
}

export function CreatePurchaseModal(props: CreatePurchaseModalProps) {
  const { modalVisible, employee, user, onFinishCreatePurchase } = props;

  const resetModal = useCallback(() => {
    onFinishCreatePurchase();
  }, [onFinishCreatePurchase]);

  const handleCreatePurchaseSuccessfully = useCallback(
    (purchase: Purchases) => {
      onFinishCreatePurchase(purchase);
    },
    [onFinishCreatePurchase],
  );

  return (
    <Modal
      visible={modalVisible}
      title="Create Purchase"
      onCancel={resetModal}
      width={'80%'}
      footer={null}
      destroyOnClose
    >
      <div>
        <CreatePurchaseForm
          employee={employee}
          user={user}
          onCreatePurchaseSuccessfully={handleCreatePurchaseSuccessfully}
        />
      </div>
    </Modal>
  );
}
