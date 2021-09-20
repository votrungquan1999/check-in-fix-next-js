import { MinusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Select, SelectProps } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { isNil } from 'lodash/fp';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { getProductsBySubscriberID, Product } from '../../../services/product';
import { PurchaseProduct } from '../../../services/purchases';
import { CustomSpinner, ResponsiveFormStyled } from '../../../styles/commons';
import { SelectProductForm } from '../../Inventories/Forms/SelectProductForm';
import { InputPurchaseProductForm, PurchaseProductFormOutput } from '../Forms/InputProductPurchaseForm';

interface AddPurchaseProductsModalProps extends WithAuthProps {
  modalVisible: boolean;
  onFinishAddingPurchaseProduct: (data?: PurchaseProduct) => any;
}

export function AddPurchaseProductsModal(props: AddPurchaseProductsModalProps) {
  const { modalVisible, onFinishAddingPurchaseProduct, employee, user } = props;
  const [product, setProduct] = useState<Product>();
  const [allProducts, setAllProducts] = useState<Product[]>();

  const getAllProducts = useCallback(async () => {
    const { token } = await user.getIdTokenResult();

    const productList = await getProductsBySubscriberID(employee.subscriber_id, token);

    setAllProducts(productList);
  }, [employee, user]);

  useEffect(() => {
    if (modalVisible) {
      getAllProducts();
    }

    setProduct(undefined);
    setAllProducts(undefined);
  }, [getAllProducts, modalVisible]);

  const handleSubmitProductForm = useCallback(
    (data: PurchaseProductFormOutput) => {
      if (isNil(product)) {
        return;
      }

      // console.log(data);
      const newPurchaseProduct: PurchaseProduct = {
        unit_cost: data.unit_cost,
        product_id: product.id,
        discount: data.discount,
        product_code: product.product_code,
        product_name: product.product_name,
        quantity: data.quantity,
        tax_type: data.tax_type,
        tax_value: data.tax_type === 'sale_tax' ? data.unit_cost * data.quantity * 0.0825 : 0,
        sub_total: data.unit_cost * data.quantity - data.discount,
      };

      onFinishAddingPurchaseProduct(newPurchaseProduct);
    },
    [product, onFinishAddingPurchaseProduct],
  );

  const resetModal = useCallback(() => {
    onFinishAddingPurchaseProduct();
  }, []);

  const handleSelectProduct = useCallback(
    (productID: string) => {
      if (isNil(allProducts)) {
        return;
      }

      const selectedProduct = allProducts.find((product) => product.id === productID);

      setProduct(selectedProduct);
    },
    [allProducts],
  );

  const modalTitle = useMemo(() => {
    if (isNil(product)) {
      return 'Pick Product';
    }

    return product.product_name;
  }, [product]);

  const modalContent = useMemo(() => {
    if (isNil(allProducts)) {
      return <CustomSpinner />;
    }

    if (isNil(product)) {
      return <SelectProductForm onSelectProduct={handleSelectProduct} products={allProducts} />;
    }

    return (
      <div>
        <InputPurchaseProductForm onSubmitProduct={handleSubmitProductForm} />
      </div>
    );
  }, [allProducts, product, handleSubmitProductForm, handleSelectProduct]);

  return (
    <Modal visible={modalVisible} title={modalTitle} footer={null} destroyOnClose onCancel={resetModal}>
      {modalContent}
    </Modal>
  );
}
