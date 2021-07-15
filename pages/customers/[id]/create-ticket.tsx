import withAuth from '../../../src/firebase/withAuth';
import { Ticket } from '../../../src/services/tickets';
import { useRouter } from 'next/router';
import { CreateTicketForm } from '../../../src/Components/CreateTicketForm/CreateTicketForm';
import React, { useCallback, useEffect, useState } from 'react';
import { isNil } from 'lodash/fp';
import { CustomSpinner } from '../../../src/styles/commons';

export default withAuth(function CreateTicket({ user, employee }) {
  const [customerID, setCustomerID] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
    if (id && typeof id !== 'string') {
      return;
    }

    setCustomerID(id);
  }, [router]);

  const onSuccess = useCallback((ticket: Ticket) => {
    router.push(`/customers/${customerID}/create-ticket-successfully`);
  }, []);

  if (isNil(customerID)) {
    return <CustomSpinner />;
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <CreateTicketForm customerID={customerID} employee={employee} user={user} onCreateSuccessfully={onSuccess} />
    </div>
  );
});
