import React, { useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { Subscriber } from '../../services/subscribers';
import {
  getTicketsBySubcriberID,
  getTicketStatusesBySubscriberID,
  Ticket,
  TicketStatuses,
  TicketStatusesType,
} from '../../services/tickets';
import { filter, find, flow, isNil, uniq } from 'lodash/fp';
import { TicketTable } from '../TicketTable';
import { Customer, getCustomersByIDs } from '../../services/customers';
import { MainContainerLoadingStyled } from '../../styles/commons';
import { Button, Tabs, Tooltip } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { CreateTicketModal } from '../CreateTicketModal';
import { useCallback } from 'react';

export interface TicketProps extends WithAuthProps {
  subscriber: Subscriber | undefined;
}

export function Tickets(props: TicketProps) {
  const { user, employee } = props;
  const [customers, setCustomers] = useState<Customer[]>();
  const [ticketStatuses, setTicketStatuses] = useState<TicketStatuses[]>();
  const [pendingTickets, setPendingTickets] = useState<Ticket[]>();
  const [completedTickets, setCompletedTickets] = useState<Ticket[]>();
  const [createTicketModalVisibility, setCreateTicketModalVisibility] = useState(false);

  const getTicketsAndCustomers = useCallback(async () => {
    const { token } = await user.getIdTokenResult();
    const tickets = await getTicketsBySubcriberID(employee.subscriber_id, token);

    const customerIDs = uniq(tickets.map((ticket) => ticket.customer_id));

    const customers = await getCustomersByIDs(token, customerIDs);

    if (customers.length !== customerIDs.length) {
      alert('get customer failed!');
      return;
    }

    setCustomers(customers);

    const subscriberTicketStatuses = await getTicketStatusesBySubscriberID(employee.subscriber_id, token);
    setTicketStatuses(subscriberTicketStatuses);

    if (isNil(subscriberTicketStatuses)) {
      return;
    }

    setPendingTickets(getTicketWithType(subscriberTicketStatuses, tickets, TicketStatusesType.Pending));
    setCompletedTickets(getTicketWithType(subscriberTicketStatuses, tickets, TicketStatusesType.Completed));
  }, []);

  useEffect(() => {
    getTicketsAndCustomers();
  }, [employee, user]);

  const addTicketButton = useMemo(() => {
    return (
      <Button type="primary" className="flex items-center" onClick={() => handleClickCreateTicket()}>
        <FileAddOutlined />
        Add New Ticket
      </Button>
    );
  }, []);

  const verticalScroll = useMemo(() => {
    if (typeof window === 'undefined') {
      return;
    }

    return window.innerHeight - 271;
  }, [window]);

  const handleClickCreateTicket = useCallback(() => {
    setCreateTicketModalVisibility(true);
  }, [setCreateTicketModalVisibility]);

  const handleFinishCreateTicket = useCallback(() => {
    setCreateTicketModalVisibility(false);
    setCustomers(undefined);
    getTicketsAndCustomers();
  }, []);

  return !pendingTickets || !customers || !ticketStatuses || !completedTickets ? (
    <MainContainerLoadingStyled />
  ) : (
    <div className="p-5">
      <div className="bg-white rounded-md">
        <Tabs defaultActiveKey="1" type="card" tabBarExtraContent={addTicketButton} className="p-2 pb-0">
          <Tabs.TabPane tab="Pending Tickets" key="1" className="-mt-4">
            <TicketTable
              tickets={[...pendingTickets, ...pendingTickets]}
              customers={customers}
              ticketStatuses={ticketStatuses}
              verticalScroll={verticalScroll}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Completed Tickets" key="2" className="-mt-4">
            <TicketTable
              tickets={completedTickets}
              customers={customers}
              ticketStatuses={ticketStatuses}
              verticalScroll={verticalScroll}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <CreateTicketModal
        createTicketModalVisibility={createTicketModalVisibility}
        employee={employee}
        user={user}
        handleFinishCreateTicket={handleFinishCreateTicket}
      />
    </div>
  );
}

function getTicketWithType(ticketStatuses: TicketStatuses[], tickets: Ticket[], type: TicketStatusesType) {
  return tickets.filter((ticket) => {
    const currentStatus = find<TicketStatuses>((ticketStatus) => ticketStatus.order === ticket.status)(ticketStatuses);

    if (isNil(currentStatus)) {
      return false;
    }

    return currentStatus.type === type;
  });
}
