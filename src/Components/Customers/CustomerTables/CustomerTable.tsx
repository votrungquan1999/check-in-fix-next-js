import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useCallback, useMemo, useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { Customer } from '../../../services/customers';
import { transformPhoneNumberToDisplay } from '../../../utils/phoneNumber';
import { transformDataSourceToHaveKey } from '../../../utils/table';
import { CustomerDetailModal } from '../CustomerModals/CustomerDetailModal';
import { EditCustomerModal } from '../CustomerModals/EditCustomerModal';
import { TableContainerStyled } from '../../Layout/styles';

interface CustomerTableProps {
  customers: Customer[];
  setSelectedRows?: (rows: string[]) => any;
  onClickDelete: (customer: Customer) => any;
  onClickEdit: (customer: Customer) => any;
  onClickDetailCustomer: (customer: Customer) => any;
  height?: number;
}

export function CustomerTable(props: CustomerTableProps) {
  const { customers, setSelectedRows, height, onClickDelete, onClickEdit, onClickDetailCustomer } = props;
  // const [detailCustomerID, setDetailCustomerID] = useState<string>();
  // const [editCustomer, setEditCustomer] = useState<Customer>();

  const rowSelection = useMemo<TableRowSelection<any>>(() => {
    if (!setSelectedRows) {
      return {};
    }

    const onSelectedRowChanges = (selectedRowKeys: React.Key[]) => {
      setSelectedRows(selectedRowKeys as string[]);
    };

    return {
      onChange: onSelectedRowChanges,
      fixed: true,
    };
  }, [setSelectedRows]);

  const tableData = useMemo(() => {
    if (customers) {
      return transformDataSourceToHaveKey(customers);
    }

    return;
  }, [customers]);

  const columns = useMemo(() => {
    return getColumns(onClickEdit, onClickDetailCustomer, onClickDelete);
  }, [onClickEdit, onClickDetailCustomer, onClickDelete]);

  // const handleFinishUpdateCustomer = useCallback(() => {
  //   setEditCustomer(undefined);
  // }, [setEditCustomer]);

  // const handleFinishDeleteCustomers = useCallback(() => {
  //   onClickDelete([]);
  // }, [onClickDelete]);

  return (
    <div>
      <TableContainerStyled>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData}
          pagination={{ pageSize: 50 }}
          scroll={{
            y: height,
            x: 'max-content',
          }}
          bordered
        />
      </TableContainerStyled>

      {/* <CustomerDetailModal
        customerID={detailCustomerID}
        subscriberID={employee.subscriber_id}
        user={user}
        setDetailCustomerID={setDetailCustomerID}
        employee={employee}
      /> */}

      {/* <EditCustomerModal
        finishUpdateCustomer={handleFinishUpdateCustomer}
        customer={editCustomer}
        user={user}
        employee={employee}
      /> */}
    </div>
  );
}

function getColumns(
  onClickEdit: (customer: Customer) => any,
  onClickRow: (customer: Customer) => any,
  onClickDelete: (customer: Customer) => any,
) {
  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (value: string) => {
        return {
          children: (
            <Tooltip placement="topLeft" title={value}>
              <div className="overflow-hidden whitespace-nowrap overflow-ellipsis w-full">{value}</div>
            </Tooltip>
          ),
          props: {
            style: {
              maxWidth: 192,
            },
          },
        };
      },
    },
    {
      title: 'Name',
      key: 'name',
      width: 200,
      render: (value: Customer) => {
        return value.first_name + ' ' + value.last_name;
      },
      onCell: (record: Customer) => {
        return {
          onClick: () => onClickRow(record),
        };
      },
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 300,
      onCell: (record: Customer) => {
        return {
          onClick: () => onClickRow(record),
        };
      },
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      width: 200,
      render: (value: string | undefined) => {
        return transformPhoneNumberToDisplay(value);
      },
      onCell: (record: Customer) => {
        return {
          onClick: () => onClickRow(record),
        };
      },
    },
    {
      title: 'Actions',
      width: 90,
      render: (value: Customer) => {
        return renderActions(value, onClickEdit, onClickDelete);
      },
      fixed: 'right',
      align: 'center',
    },
  ];

  return columns;
}

function renderActions(
  value: Customer,
  onClickEdit: (customer: Customer) => any,
  onClickDelete: (customer: Customer) => any,
) {
  const overlayMenu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          onClickEdit(value);
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          onClickDelete(value);
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={overlayMenu} trigger={['click']}>
        <Button type="text" icon={<EllipsisOutlined />} />
      </Dropdown>
    </div>
  );
}
