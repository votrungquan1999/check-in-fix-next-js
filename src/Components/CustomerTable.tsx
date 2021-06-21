import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../firebase/withAuth';
import { Customer, searchCustomers } from '../services/customers';
import { transformPhoneNumberToDisplay } from '../utils/phoneNumber';
import { transformDataForSelection } from '../utils/table';
import { CustomerDetailModal } from './CustomerDetailModal';
import { TableContainerStyled } from './Layout/styles';
import { SendSMSToCustomerModal } from './SendSMSModal';

interface CustomerTableProps extends WithAuthProps {
  customers: Customer[];
  setSelectedRows?: (rows: string[]) => any;
}

export function CustomerTable(props: CustomerTableProps) {
  const { customers, user, employee, setSelectedRows } = props;
  const [detailCustomerID, setDetailCustomerID] = useState<string>();

  const rowSelection = useMemo<TableRowSelection<any>>(() => {
    if (!setSelectedRows) {
      return {};
    }

    const onSelectedRowChanges = (selectedRowKeys: React.Key[]) => {
      setSelectedRows(selectedRowKeys as string[]);
    };

    return {
      onChange: onSelectedRowChanges,
    };
  }, [setSelectedRows]);

  const tableData = useMemo(() => {
    if (customers) {
      return transformDataForSelection(customers);
    }

    return;
  }, [customers]);

  return (
    <div>
      <TableContainerStyled>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData}
          onRow={(record: Customer, index) => {
            return {
              onClick: () => setDetailCustomerID(record.id),
            };
          }}
          pagination={{ pageSize: 50 }}
        />
      </TableContainerStyled>

      <CustomerDetailModal
        customerID={detailCustomerID}
        subscriber_id={employee.subscriber_id}
        user={user}
        setDetailCustomerID={setDetailCustomerID}
      />
    </div>
  );
}

const columns: ColumnsType<any> = [
  {
    title: 'Name',
    key: 'name',
    render: (value: Customer) => {
      return value.first_name + ' ' + value.last_name;
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone_number',
    render: (value: string | undefined) => {
      return transformPhoneNumberToDisplay(value);
    },
  },
];
