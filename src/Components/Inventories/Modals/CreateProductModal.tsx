import { Modal } from 'antd';
import { useCallback } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { Product } from '../../../services/product';
import { CreateProductForm } from '../Forms/CreateProductForm';

interface CreateProductModalProps extends WithAuthProps {
  modalVisible: boolean;
  onFinishCreateProduct: (product?: Product) => any;
}

export function CreateProductModal(props: CreateProductModalProps) {
  const { employee, user, modalVisible, onFinishCreateProduct } = props;

  const resetModal = useCallback(() => {
    onFinishCreateProduct();
  }, [onFinishCreateProduct]);

  return (
    <Modal
      visible={modalVisible}
      title="Create Product"
      onCancel={resetModal}
      width={'80%'}
      footer={null}
      destroyOnClose
    >
      <div>
        <CreateProductForm user={user} employee={employee} createProductSuccessfully={onFinishCreateProduct} />
      </div>
    </Modal>
  );
}
