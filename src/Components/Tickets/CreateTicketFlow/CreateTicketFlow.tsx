import { isNil } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { Ticket } from '../../../services/tickets';
import { CreateTicketForm } from '../TicketForms/CreateTicketForm';
import { SearchAndCreateCustomerForm } from '../../Customers/CustomerForms/SearchAndCreateCustomerForm';
import { TicketUploadFilesView } from '../TicketUploadFilesView/TicketUploadFilesView';
import { Customer, searchCustomers } from '../../../services/customers';
import { Spin } from 'antd';
import { CustomSpinner } from '../../../styles/commons';

interface CreateTicketFlowProps extends WithAuthProps {
  onCreateSuccessfully?: (ticket: Ticket) => any;
  onCreateFailed?: () => any;
  onPickCustomer?: (customerID: string) => any;
  customerID?: string;
  ticket?: Ticket;
}

export function CreateTicketFlow(props: CreateTicketFlowProps) {
  const { user, onCreateFailed, employee, customerID, ticket, onCreateSuccessfully, onPickCustomer } = props;
  const [customers, setCustomers] = useState<Customer[]>();

  const getCustomers = useCallback(async () => {
    const { token } = await user.getIdTokenResult();
    const customerList = await searchCustomers(employee.subscriber_id, token, '');

    setCustomers(customerList);
  }, []);

  useEffect(() => {
    // const newReqID = continuousReq.getNewestID();
    // const CancelToken = axios.CancelToken;
    // const source = CancelToken.source();
    // continuousReq.addReq(newReqID, source);
    // const isLatestData = continuousReq.processReqResponse(newReqID);
    // if (isLatestData) {
    //   setCustomers(customerList);
    // }
    getCustomers();
  }, [getCustomers]);

  if (isNil(customers)) {
    return (
      <div>
        <CustomSpinner />
      </div>
    );
  }

  if (isNil(customerID)) {
    return (
      <SearchAndCreateCustomerForm
        employee={employee}
        user={user}
        setSelectedCustomer={onPickCustomer}
        customers={customers}
      />
    );
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
