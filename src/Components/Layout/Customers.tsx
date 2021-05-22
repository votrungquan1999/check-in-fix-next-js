import { Select, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { Customer, getCustomers } from '../../services/customers';
import { Subscriber } from '../../services/subscribers';
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
      return <p>{value.first_name + ' ' + value.last_name}</p>;
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
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 200,
    render: () => {
      return (
        <Select placeholder="Actions" style={{ width: 150 }}>
          <Option value="send_sms">Send SMS</Option>
        </Select>
      );
    },
  },
];

export function Customers(props: WithAuthProps) {
  const { employee, user } = props;
  const [customers, setCustomers] = useState<Customer[]>();

  useEffect(() => {
    const getAndSetCustomers = async () => {
      const { token } = await user.getIdTokenResult();
      const customers = await getCustomers(employee.subscriber_id, token);
      setCustomers(customers);
    };

    getAndSetCustomers();
  }, [employee, user]);

  return !customers ? (
    <Spin />
  ) : (
    <TableContainerStyled>
      <Table columns={columns} dataSource={customers} scroll={{ x: '100%' }} />
    </TableContainerStyled>
  );
}
