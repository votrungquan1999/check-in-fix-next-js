import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { isNil } from 'lodash/fp';
import React from 'react';
import { Product } from '../../../services/product';
import { transformDataSourceToHaveKey } from '../../../utils/table';

interface ProductTableProps {
  products: Product[];
  onClickEdit?: (product: Product) => any;
  onClickDelete?: (product: Product) => any;
  verticalScroll?: number;
}

export function ProductTable(props: ProductTableProps) {
  const { products, onClickEdit, onClickDelete, verticalScroll } = props;
  const displayData = transformDataSourceToHaveKey(products);

  const columns = getColumns(onClickEdit, onClickDelete);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={displayData}
        bordered
        scroll={{
          y: verticalScroll ?? 100000000,
          x: 'max-content',
        }}
      />
    </div>
  );
}

function getColumns(onClickEdit?: (product: Product) => any, onClickDelete?: (product: Product) => any) {
  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50,
    },
    {
      title: 'Product Code',
      dataIndex: 'product_code',
      width: 130,
    },
    {
      title: 'Name',
      dataIndex: 'product_name',
      width: 80,
    },
    {
      title: 'Cost',
      dataIndex: 'product_cost',
      width: 80,
    },
    {
      title: 'Price',
      dataIndex: 'product_price',
      width: 80,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 100,
    },
    {
      title: 'Alert Quantity',
      dataIndex: 'alert_quantity',
      width: 130,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (value: Product) => {
        const menu = (
          <Menu>
            <Menu.Item onClick={() => onClickEdit && onClickEdit(value)} disabled={!onClickEdit}>
              Edit
            </Menu.Item>
            <Menu.Item onClick={() => onClickDelete && onClickDelete(value)} disabled={!onClickDelete}>
              Delete
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
      width: 100,
      align: 'center',
    },
  ];

  return columns;
}
