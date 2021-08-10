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
import { TicketTable } from '../Tickets/TicketTable/TicketTable';
import { Customer, getCustomersByIDs } from '../../services/customers';
import { MainContainerLoadingStyled } from '../../styles/commons';
import { Button, Tabs, Tooltip } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import { CreateTicketModal } from '../Tickets/TicketModals/CreateTicketModal';
import { EditTicketModal } from '../Tickets/TicketModals/EditTicketModal';
import { DeleteTicketModal } from '../Tickets/TicketModals/DeleteTicketModal';

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
  const [editTicket, setEditTicket] = useState<Ticket>();
  const [deleteTicket, setDeleteTicket] = useState<Ticket>();

  const getTicketsAndCustomers = useCallback(async () => {
    const { token } = await user.getIdTokenResult();
    const tickets = await getTicketsBySubcriberID(employee.subscriber_id, token);

    const customerIDs = uniq(tickets.map((ticket) => ticket.customer_id));

    const customerList = await getCustomersByIDs(token, customerIDs);

    if (customerList.length !== customerIDs.length) {
      alert('get customer failed!');
      return;
    }

    setCustomers(customerList);

    const subscriberTicketStatuses = await getTicketStatusesBySubscriberID(employee.subscriber_id, token);
    setTicketStatuses(subscriberTicketStatuses);

    if (isNil(subscriberTicketStatuses)) {
      return;
    }

    setPendingTickets(getTicketWithType(subscriberTicketStatuses, tickets, TicketStatusesType.Pending));
    setCompletedTickets(getTicketWithType(subscriberTicketStatuses, tickets, TicketStatusesType.Completed));
  }, [user, employee]);

  useEffect(() => {
    getTicketsAndCustomers();
  }, [getTicketsAndCustomers]);

  const handleClickCreateTicket = useCallback(() => {
    setCreateTicketModalVisibility(true);
  }, [setCreateTicketModalVisibility]);

  const addTicketButton = useMemo(() => {
    return (
      <Button type="primary" className="flex items-center" onClick={() => handleClickCreateTicket()}>
        <FileAddOutlined />
        Add New Ticket
      </Button>
    );
  }, [handleClickCreateTicket]);

  const verticalScroll = useMemo(() => {
    if (typeof window === 'undefined') {
      return;
    }

    return window.innerHeight - 271;
  }, [window]);

  const handleFinishCreateTicket = useCallback(
    (created: boolean) => {
      if (created) {
        setCustomers(undefined);
        getTicketsAndCustomers();
      }
      setCreateTicketModalVisibility(false);
    },
    [getTicketsAndCustomers],
  );

  const handleClickEditTicket = useCallback((ticket: Ticket) => {
    setEditTicket(ticket);
  }, []);

  const handleFinishEditTicket = useCallback(
    (edited: boolean) => {
      if (edited) {
        setCustomers(undefined);
        getTicketsAndCustomers();
      }
      setEditTicket(undefined);
    },
    [getTicketsAndCustomers],
  );

  const handleClickDeleteTicket = useCallback((ticket: Ticket) => {
    setDeleteTicket(ticket);
  }, []);

  const handleFinishDeleteTicket = useCallback(
    (deleted: boolean) => {
      if (deleted) {
        setCustomers(undefined);
        getTicketsAndCustomers();
      }
      setDeleteTicket(undefined);
    },
    [getTicketsAndCustomers],
  );

  return !pendingTickets || !customers || !ticketStatuses || !completedTickets ? (
    <MainContainerLoadingStyled />
  ) : (
    <div className="p-5">
      <div className="bg-white rounded-md">
        <Tabs defaultActiveKey="1" type="card" tabBarExtraContent={addTicketButton} className="p-2 pb-0">
          <Tabs.TabPane tab="Pending Tickets" key="1" className="-mt-4">
            <TicketTable
              tickets={[...pendingTickets]}
              customers={customers}
              ticketStatuses={ticketStatuses}
              verticalScroll={verticalScroll}
              onClickEdit={handleClickEditTicket}
              onClickDelete={handleClickDeleteTicket}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Completed Tickets" key="2" className="-mt-4">
            <TicketTable
              tickets={completedTickets}
              customers={customers}
              ticketStatuses={ticketStatuses}
              verticalScroll={verticalScroll}
              onClickEdit={handleClickEditTicket}
              onClickDelete={handleClickDeleteTicket}
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
      <EditTicketModal
        editTicket={editTicket}
        finishEditTicket={handleFinishEditTicket}
        employee={employee}
        user={user}
      />
      <DeleteTicketModal
        employee={employee}
        user={user}
        ticket={deleteTicket}
        finishDeleteTicket={handleFinishDeleteTicket}
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
