import { Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { Subscriber } from '../../services/subscribers';
import { getTickets, Ticket } from '../../services/tickets';

export interface TicketProps extends WithAuthProps {
  subscriber: Subscriber | undefined;
}

const columns: ColumnsType<any> = [
  {
    title: 'Ticket ID',
    dataIndex: 'id',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Customer Name',
    dataIndex: ['customer', 'name'],
  },
  {
    title: 'Phone Number',

    dataIndex: ['customer', 'phone_number'],
  },
  {
    title: 'Service',
    dataIndex: 'service',
  },
  {
    title: 'Device Model',

    dataIndex: 'device_model',
  },
];

export function Tickets(props: TicketProps) {
  const { user, employee } = props;
  const [tickets, setTickets] = useState<Ticket[]>();

  useEffect(() => {
    const getAndSetTickets = async () => {
      const { token } = await user.getIdTokenResult();
      const tickets = await getTickets(employee.subscriber_id, token);
      setTickets(tickets);
    };

    getAndSetTickets();
  }, [employee, user]);

  return !tickets ? (
    <Spin />
  ) : (
    <div>
      <Table columns={columns} />
    </div>
  );
}
