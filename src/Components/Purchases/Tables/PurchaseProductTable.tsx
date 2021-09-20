import { Button, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useMemo, useState } from 'react';
import { PurchaseProduct } from '../../../services/purchases';
import { transformDataSourceToHaveKey } from '../../../utils/table';

interface PurchaseProductTableProps {
  handleClickAddProduct: () => any;
  purchaseProducts: PurchaseProduct[];
}

export function PurchaseProductTable(props: PurchaseProductTableProps) {
  const { handleClickAddProduct, purchaseProducts } = props;

  const columns = getColumns();
  // const [products, setProducts] = useState<object[]>([]);

  const displayData = useMemo(() => {
    return transformDataSourceToHaveKey(purchaseProducts);
  }, [purchaseProducts]);

  // const handleAddProduct = useCallback(() => {
  //   setProducts([...products, {}]);
  // }, [products]);

  return (
    <div>
      <div className="flex justify-between">
        <Typography.Title level={4}>Products</Typography.Title>
        <Button onClick={handleClickAddProduct}>Add Product</Button>
      </div>
      <Table
        columns={columns}
        dataSource={displayData}
        bordered
        scroll={{
          y: 100000000,
          x: 'max-content',
        }}
      />
    </div>
  );
}

function getColumns() {
  const columns: ColumnsType<any> = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      width: 150,
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unit_cost',
      width: 100,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 100,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      width: 100,
    },
    {
      title: 'Tax',
      dataIndex: 'tax_value',
      width: 100,
    },
    {
      title: 'Sub Total',
      dataIndex: 'sub_total',
      width: 100,
    },
  ];

  return columns;
}
