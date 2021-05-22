import { Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { Customer, getCustomers } from '../../services/customers';
import { Subscriber } from '../../services/subscribers';

export interface CustomerProps extends WithAuthProps {
  subscriber: Subscriber | undefined;
}

const columns: ColumnsType<any> = [
  {
    title: 'Ticket ID',
    dataIndex: 'id',
  },
];

export function Customers(props: WithAuthProps) {
  const { employee, user } = props;
  const [customers, setCustomers] = useState<Customer[]>();

  useEffect(() => {
    const getAndSetCustomers = async () => {
      const { token } = await user.getIdTokenResult();
      const customers = await getCustomers(employee.subscriber_id, token);
      console.log(customers);
      setCustomers(customers);
    };

    getAndSetCustomers();
  }, [employee, user]);

  return !customers ? (
    <Spin />
  ) : (
    <div>
      <Table columns={columns} />
    </div>
  );
}
