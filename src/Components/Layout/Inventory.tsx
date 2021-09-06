import { FileAddOutlined } from '@ant-design/icons';
import { Button, message, Typography } from 'antd';
import { isNil } from 'lodash/fp';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { getProductsBySubscriberID, Product } from '../../services/product';
import { CustomSpinner, MainContainerLoadingStyled } from '../../styles/commons';
import { ProductTable } from '../Inventories/Table/ProductTable';
import { CreateProductModal } from '../Inventories/Modals/CreateProductModal';
import { EditProductModal } from '../Inventories/Modals/EditProductModal';
import { DeleteProductModal } from '../Inventories/Modals/DeleteProductModal';

interface InventoriesProps extends WithAuthProps {}

export function Inventories(props: InventoriesProps) {
  const { employee, user } = props;
  const [products, setProducts] = useState<Product[]>();
  const [isAddProductVisible, setIsAddProductVisible] = useState(false);
  const [editProduct, setEditProduct] = useState<Product>();
  const [deleteProduct, setDeleteProduct] = useState<Product>();

  const getAndSetProducts = useCallback(async () => {
    const { token } = await user.getIdTokenResult();

    const productList = await getProductsBySubscriberID(employee.subscriber_id, token);
    setProducts(productList);
  }, [employee, user]);

  useEffect(() => {
    getAndSetProducts();
  }, [getAndSetProducts]);

  const handleClickCreateProduct = useCallback(() => {
    setIsAddProductVisible(true);
  }, []);

  const handleClickEditProduct = useCallback((product: Product) => {
    setEditProduct(product);
  }, []);

  const handleClickDeleteProduct = useCallback((product: Product) => {
    setDeleteProduct(product);
  }, []);

  const addProductButton = useMemo(() => {
    return (
      <Button type="primary" className="flex items-center" onClick={handleClickCreateProduct}>
        <FileAddOutlined />
        Add New Product
      </Button>
    );
  }, [handleClickCreateProduct]);

  const handleFinishCreateProduct = useCallback(
    (product?: Product) => {
      if (!isNil(product)) {
        message.success('product created successfully');
        setProducts(undefined);
        getAndSetProducts();
      }

      setIsAddProductVisible(false);
    },
    [getAndSetProducts],
  );

  const handleFinishEditProduct = useCallback((product?: Product) => {
    if (!isNil(product)) {
      message.success('product updated successfully');
      setProducts(undefined);
      getAndSetProducts();
    }

    setEditProduct(undefined);
  }, []);

  const handleFinishDeleteProduct = useCallback((deleted: boolean) => {
    if (deleted) {
      message.success('delete product successfully');
      setProducts(undefined);
      getAndSetProducts();
    }

    setDeleteProduct(undefined);
  }, []);

  if (isNil(products)) {
    return <MainContainerLoadingStyled />;
  }

  return (
    <div className="p-5">
      <div className="bg-white rounded-md ">
        <div className="p-2 w-full flex">
          <Typography.Title level={4} className="mb-0">
            Inventories
          </Typography.Title>
          <div className="ml-auto">{addProductButton}</div>
        </div>
        <div className="px-2">
          <ProductTable
            products={products}
            onClickEdit={handleClickEditProduct}
            onClickDelete={handleClickDeleteProduct}
          />
        </div>
      </div>
      <CreateProductModal
        modalVisible={isAddProductVisible}
        employee={employee}
        user={user}
        onFinishCreateProduct={handleFinishCreateProduct}
      />
      <EditProductModal
        employee={employee}
        onFinishEditProduct={handleFinishEditProduct}
        product={editProduct}
        user={user}
      />
      <DeleteProductModal
        employee={employee}
        user={user}
        onFinishDeleteProduct={handleFinishDeleteProduct}
        product={deleteProduct}
      />
    </div>
  );
}
