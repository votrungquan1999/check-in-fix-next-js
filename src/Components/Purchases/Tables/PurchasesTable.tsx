import { EllipsisOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { Purchases } from '../../../services/purchases';
import { transformDataSourceToHaveKey } from '../../../utils/table';

interface PurchasesTableProps {
  purchases: Purchases[];
  onClickEdit?: (product: Purchases) => any;
  onClickDelete?: (product: Purchases) => any;
  verticalScroll?: number;
}

export function PurchasesTable(props: PurchasesTableProps) {
  const { purchases, onClickEdit, onClickDelete, verticalScroll } = props;
  const displayData = transformDataSourceToHaveKey(purchases);

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

function getColumns(onClickEdit?: (purchase: Purchases) => any, onClickDelete?: (purchase: Purchases) => any) {
  const columns: ColumnsType<any> = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   width: 50,
    // },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 130,
    },
    {
      title: 'Reference Number',
      dataIndex: 'reference_number',
      width: 160,
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 80,
    },
    {
      title: 'Grand Total',
      dataIndex: 'grand_total',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (value: Purchases) => {
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
