import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';
import withAuth from '../../../src/firebase/withAuth';
import {
  CreateTicketSuccessfullyMessage,
  CreateTicketSuccessfullyPage,
  SuccessIconStyles,
} from '../../../src/styles/create-tickets';

export default withAuth(function CreateTicketSuccessfully({ user }) {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    alert(`internal server error can not get id or id has invalid type, id = ${id}`);
    return <Spin></Spin>;
  }

  const handleCreateNewTicket = async () => {
    router.push(`/customers/${id}/create-ticket`);
  };

  return (
    <CreateTicketSuccessfullyPage>
      <CheckCircleOutlined style={SuccessIconStyles} />
      <CreateTicketSuccessfullyMessage>Your ticket has been created successfully!</CreateTicketSuccessfullyMessage>
      <Button onClick={handleCreateNewTicket} type="primary">
        Create a new Ticket
      </Button>
    </CreateTicketSuccessfullyPage>
  );
});
