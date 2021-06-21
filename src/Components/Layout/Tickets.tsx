import { Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { Subscriber } from '../../services/subscribers';
import { getTicketsBySubcriberID, Ticket } from '../../services/tickets';
import { uniq } from 'lodash/fp';
import { TicketTable } from '../TicketTable';
import { Customer, getCustomersByIDs } from '../../services/customers';
import { CustomSpinner } from '../../styles/commons';

export interface TicketProps extends WithAuthProps {
  subscriber: Subscriber | undefined;
}

export function Tickets(props: TicketProps) {
  const { user, employee } = props;
  const [tickets, setTickets] = useState<Ticket[]>();
  const [customers, setCustomers] = useState<Customer[]>();

  useEffect(() => {
    const getTicketsAndCustomers = async () => {
      const { token } = await user.getIdTokenResult();
      const tickets = await getTicketsBySubcriberID(employee.subscriber_id, token);
      setTickets(tickets);

      const customerIDs = uniq(tickets.map((ticket) => ticket.customer_id));

      const customers = await getCustomersByIDs(token, customerIDs);

      setCustomers(customers);
    };

    getTicketsAndCustomers();
  }, [employee, user]);

  // return <CustomSpinner />;

  return !tickets || !customers ? <CustomSpinner /> : <TicketTable tickets={tickets} customers={customers} />;
}
