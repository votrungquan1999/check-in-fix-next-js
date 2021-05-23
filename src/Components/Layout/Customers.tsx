import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, Modal, Select, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { Customer, getCustomers } from '../../services/customers';
import { Subscriber } from '../../services/subscribers';
import { SpinningContainer } from '../../styles/commons';
import { transformDataForSelection } from '../../utils/TableHelper';
import { SendSMSToCustomerModal } from '../SendSMSModal';
import { TableContainerStyled } from './styles';

export interface CustomerProps extends WithAuthProps {
  subscriber: Subscriber | undefined;
}

const { Option } = Select;

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
  },
];

export function Customers(props: WithAuthProps) {
  const { employee, user } = props;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sendMessageModalVisibility, setSendMessageModalVisibility] = useState<boolean>(false);

  useEffect(() => {
    const getAndSetCustomers = async () => {
      const { token } = await user.getIdTokenResult();
      const customers = await getCustomers(employee.subscriber_id, token);
      if (customers !== undefined) {
        setCustomers(customers);
      }
    };

    getAndSetCustomers();
  }, [employee, user]);

  const actionDropdown = useMemo(() => {
    type actionKeys = '1';

    const actions = {
      1: () => {
        setSendMessageModalVisibility(true);
      },
    };

    const handleClickMenu = ({ key }: any) => {
      actions[key as actionKeys]();
    };

    const menu = (
      <Menu onClick={handleClickMenu}>
        <Menu.Item key="1">Send SMS</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} disabled={!selectedRows.length}>
        <Button>
          Actions <DownOutlined />
        </Button>
      </Dropdown>
    );
  }, [selectedRows]);

  const tableData = useMemo(() => {
    if (customers) {
      return transformDataForSelection(customers);
    }

    return;
  }, [customers]);

  const rowSelection = useMemo<TableRowSelection<any>>(() => {
    const onSelectedRowChanges = (selectedRowKeys: React.Key[]) => {
      setSelectedRows(selectedRowKeys as string[]);
    };

    return {
      selectedRowKeys: selectedRows,
      onChange: onSelectedRowChanges,
    };
  }, [selectedRows]);

  return !tableData?.length ? (
    <SpinningContainer>
      <Spin size="large" />
    </SpinningContainer>
  ) : (
    <div>
      {actionDropdown}
      <TableContainerStyled>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData}
          pagination={{ pageSize: 50 }}
          // scroll={{ y: window.innerHeight - 240 }}
        />
      </TableContainerStyled>
      <SendSMSToCustomerModal
        sendMessageModalVisibility={sendMessageModalVisibility}
        setSendMessageModalVisibility={setSendMessageModalVisibility}
        customerIDs={selectedRows}
        user={user}
      />
    </div>
  );
}
