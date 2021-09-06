import { Modal } from 'antd';
import { isNil } from 'lodash/fp';
import React, { useCallback, useMemo } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { Product } from '../../../services/product';
import { CustomSpinner } from '../../../styles/commons';
import { EditProductForm } from '../Forms/EditProductForm';

interface EditProductModalProps extends WithAuthProps {
  product: Product | undefined;
  onFinishEditProduct: (product?: Product) => any;
}

export function EditProductModal(props: EditProductModalProps) {
  const { employee, user, product, onFinishEditProduct } = props;

  const resetModal = useCallback(() => {
    onFinishEditProduct();
  }, [onFinishEditProduct]);

  const modalContent = useMemo(() => {
    if (isNil(product)) {
      return <CustomSpinner />;
    }

    return (
      <div>
        <EditProductForm
          user={user}
          employee={employee}
          editProductSuccessfully={onFinishEditProduct}
          product={product}
        />
      </div>
    );
  }, [product, user, employee, onFinishEditProduct]);

  return (
    <Modal visible={!!product} title="Edit Product" onCancel={resetModal} width={'80%'} footer={null} destroyOnClose>
      {modalContent}
    </Modal>
  );
}

// function ModalContent(props: EditProductModalProps)
