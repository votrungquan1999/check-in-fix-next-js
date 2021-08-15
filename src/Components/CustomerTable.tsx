import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useCallback, useMemo, useState } from 'react';
import { WithAuthProps } from '../firebase/withAuth';
import { Customer } from '../services/customers';
import { transformPhoneNumberToDisplay } from '../utils/phoneNumber';
import { transformDataSourceToHaveKey } from '../utils/table';
import { CustomerDetailModal } from './Customers/CustomerModals/CustomerDetailModal/CustomerDetailModal';
import { EditCustomerModal } from './Customers/CustomerModals/EditCustomerModal/EditCustomerModal';
import { TableContainerStyled } from './Layout/styles';

interface CustomerTableProps extends WithAuthProps {
  customers: Customer[];
  setSelectedRows?: (rows: string[]) => any;
  setToBeDeletedCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  height?: number;
}

export function CustomerTable(props: CustomerTableProps) {
  const { customers, user, employee, setSelectedRows, height, setToBeDeletedCustomers } = props;
  const [detailCustomerID, setDetailCustomerID] = useState<string>();
  const [editCustomer, setEditCustomer] = useState<Customer>();

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
    return getColumns(setEditCustomer, setDetailCustomerID, setToBeDeletedCustomers);
  }, [setEditCustomer, setDetailCustomerID, setToBeDeletedCustomers]);

  const handleFinishUpdateCustomer = useCallback(() => {
    setEditCustomer(undefined);
  }, [setEditCustomer]);

  const handleFinishDeleteCustomers = useCallback(() => {
    setToBeDeletedCustomers([]);
  }, [setToBeDeletedCustomers]);

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

      <CustomerDetailModal
        customerID={detailCustomerID}
        subscriberID={employee.subscriber_id}
        user={user}
        setDetailCustomerID={setDetailCustomerID}
        employee={employee}
      />

      <EditCustomerModal finishUpdateCustomer={handleFinishUpdateCustomer} customer={editCustomer} user={user} />
    </div>
  );
}

function getColumns(
  setEditCustomer: React.Dispatch<React.SetStateAction<Customer | undefined>>,
  setDetailCustomerID: React.Dispatch<React.SetStateAction<string | undefined>>,
  setToBeDeletedCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
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
          onClick: () => setDetailCustomerID(record.id),
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
          onClick: () => setDetailCustomerID(record.id),
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
          onClick: () => setDetailCustomerID(record.id),
        };
      },
    },
    {
      title: 'Actions',
      width: 90,
      render: (value: Customer) => {
        return renderActions(value, setEditCustomer, setToBeDeletedCustomers);
      },
      fixed: 'right',
      align: 'center',
    },
  ];

  return columns;
}

function renderActions(
  value: Customer,
  setEditCustomer: React.Dispatch<React.SetStateAction<Customer | undefined>>,
  setToBeDeletedCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
) {
  const overlayMenu = (
    <Menu>
      <Menu.Item
        onClick={() => {
          setEditCustomer(value);
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setToBeDeletedCustomers([value]);
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
