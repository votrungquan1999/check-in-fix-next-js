import { isNil } from 'lodash';
import React from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { Ticket } from '../../../services/tickets';
import { CreateTicketForm } from '../TicketForms/CreateTicketForm';
import { SearchAndCreateCustomerForm } from '../../SearchAndCreateCustomer/SearchAndCreateCustomerForm';
import { TicketUploadFilesView } from '../TicketUploadFilesView/TicketUploadFilesView';

interface CreateTicketFlowProps extends WithAuthProps {
  onCreateSuccessfully?: (ticket: Ticket) => any;
  onCreateFailed?: () => any;
  onPickCustomer?: (customerID: string) => any;
  customerID?: string;
  ticket?: Ticket;
}

export function CreateTicketFlow(props: CreateTicketFlowProps) {
  const { user, onCreateFailed, employee, customerID, ticket, onCreateSuccessfully, onPickCustomer } = props;

  if (isNil(customerID)) {
    return <SearchAndCreateCustomerForm employee={employee} user={user} setSelectedCustomer={onPickCustomer} />;
  }

  if (isNil(ticket)) {
    return (
      <CreateTicketForm
        customerID={customerID}
        employee={employee}
        user={user}
        onCreateSuccessfully={onCreateSuccessfully}
        onCreateFailed={onCreateFailed}
      />
    );
  }

  return <TicketUploadFilesView ticket={ticket} />;
}
