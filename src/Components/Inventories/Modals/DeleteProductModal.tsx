import { Button, Modal, Spin, Typography } from 'antd';
import { isNil } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { deleteProduct, Product } from '../../../services/product';
import { CustomSpinner } from '../../../styles/commons';

export interface DeleteProductModalProps extends WithAuthProps {
  product: Product | undefined;
  onFinishDeleteProduct: (deleted: boolean) => any;
}

export function DeleteProductModal(props: DeleteProductModalProps) {
  const { user, product, onFinishDeleteProduct } = props;
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    console.log(deleting);
  }, [deleting]);

  const resetModal = useCallback(() => {
    onFinishDeleteProduct(false);
  }, [onFinishDeleteProduct]);

  const withDeleting = useCallback((cb: () => any) => {
    return async () => {
      setDeleting(true);
      await cb();
      setDeleting(false);
    };
  }, []);

  const handleConfirmDeleteProduct = useCallback(async () => {
    if (isNil(product)) {
      return;
    }
    const { token } = await user.getIdTokenResult();

    const deleted = await deleteProduct(product.id, token);

    if (deleted) {
      onFinishDeleteProduct(true);
    }
  }, [product, onFinishDeleteProduct, user]);

  const modalContent = useMemo(() => {
    if (isNil(product)) {
      return <CustomSpinner />;
    }

    return (
      <Spin spinning={deleting}>
        <div>
          <Typography.Title level={3}>
            You are going to delete 1 product! This action can not be reverted!
          </Typography.Title>
          <Button onClick={withDeleting(handleConfirmDeleteProduct)}>Confirm</Button>
        </div>
      </Spin>
    );
  }, [handleConfirmDeleteProduct, deleting]);

  return (
    <Modal visible={!!product} title="Edit Product" onCancel={resetModal} width={'80%'} footer={null} destroyOnClose>
      {modalContent}
    </Modal>
  );
}
