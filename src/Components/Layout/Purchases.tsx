import { FileAddOutlined } from '@ant-design/icons';
import { Button, message, Typography } from 'antd';
import { isNil } from 'lodash/fp';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { getListPurchases, Purchases } from '../../services/purchases';
import { MainContainerLoadingStyled } from '../../styles/commons';
import { CreatePurchaseModal } from '../Purchases/Modals/CreatePurchaseModal';
import { PurchasesTable } from '../Purchases/Tables/PurchasesTable';

interface PurchasesProps extends WithAuthProps {}

export function PurchasesView(props: PurchasesProps) {
  const { employee, user } = props;
  const [createPurchaseVisible, setCreatePurchaseVisible] = useState(false);
  const [purchases, setPurchases] = useState<Purchases[]>();

  const getAndSetPurchases = useCallback(async () => {
    const { token } = await user.getIdTokenResult();

    const purchases = await getListPurchases(employee.subscriber_id, token);

    setPurchases(purchases);
  }, [employee, user]);

  const handleClickCreatePurchase = useCallback(() => {
    setCreatePurchaseVisible(true);
  }, []);

  const handleFinishCreatePurchase = useCallback((purchase?: Purchases) => {
    if (purchase) {
      setPurchases(undefined);
      getAndSetPurchases();
      message.success('create purchase successfully');
    }

    setCreatePurchaseVisible(false);
  }, []);

  const addPurchaseButton = useMemo(() => {
    return (
      <Button type="primary" className="flex items-center" onClick={handleClickCreatePurchase}>
        <FileAddOutlined />
        Add New Product
      </Button>
    );
  }, [handleClickCreatePurchase]);

  useEffect(() => {
    getAndSetPurchases();
  }, [employee, user]);

  if (isNil(purchases)) {
    return <MainContainerLoadingStyled />;
  }

  return (
    <div className="p-5">
      <div className="bg-white rounded-md ">
        <div className="p-2 w-full flex">
          <Typography.Title level={4} className="mb-0">
            Purchases
          </Typography.Title>
          <div className="ml-auto">{addPurchaseButton}</div>
        </div>
        <div className="px-2">
          <PurchasesTable
            purchases={purchases}
            // products={products}
            // onClickEdit={handleClickEditProduct}
            // onClickDelete={handleClickDeleteProduct}
          />
        </div>
        <CreatePurchaseModal
          modalVisible={createPurchaseVisible}
          employee={employee}
          user={user}
          onFinishCreatePurchase={handleFinishCreatePurchase}
        />
      </div>
    </div>
  );
}
