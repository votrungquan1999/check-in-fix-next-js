import { Button, Modal, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { get, isNil } from 'lodash/fp';
import React, { useCallback, useMemo, useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { Ticket } from '../../../services/tickets';
import { CreateTicketFlow } from '../CreateTicketFlow/CreateTicketFlow';

interface CreateTicketModalProps extends WithAuthProps {
  createTicketModalVisibility: boolean;
  handleFinishCreateTicket: (created: boolean) => any;
}

export function CreateTicketModal(props: CreateTicketModalProps) {
  const { createTicketModalVisibility, handleFinishCreateTicket, user, employee } = props;
  const [customerID, setCustomerID] = useState<string>();
  const [ticket, setTicket] = useState<Ticket>();
  const [form] = useForm();
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  const resetModal = useCallback(() => {
    form.resetFields();
    setCustomerID(undefined);
    setTicket(undefined);

    if (createdSuccessfully) {
      handleFinishCreateTicket(true);
    } else {
      handleFinishCreateTicket(false);
    }
  }, [handleFinishCreateTicket]);

  const handleOK = useCallback(() => {
    resetModal();
  }, [resetModal]);

  const handleCancel = useCallback(() => {
    if (isNil(customerID)) {
      resetModal();
    }

    setCustomerID(undefined);
  }, [customerID, resetModal]);

  const onCreateTicketSuccessfully = useCallback((ticket: Ticket) => {
    setCreatedSuccessfully(true);
    setTicket(ticket);
  }, []);

  const modalContent = useMemo(() => {
    return (
      <CreateTicketFlow
        employee={employee}
        user={user}
        onCreateSuccessfully={onCreateTicketSuccessfully}
        customerID={customerID}
        ticket={ticket}
        onPickCustomer={setCustomerID}
      />
    );
  }, [customerID, ticket, form, employee, user, createdSuccessfully]);

  const okButtonText = useMemo(() => {
    return 'Done';
  }, []);

  const cancelButtonText = useMemo(() => {
    if (isNil(customerID)) {
      return 'Cancel';
    }

    return 'Back';
  }, [customerID]);

  const footer = useMemo(() => {
    const OkButton = createdSuccessfully ? (
      <Button onClick={handleOK} type="primary">
        {okButtonText}
      </Button>
    ) : undefined;

    const CancelButton = createdSuccessfully ? undefined : (
      <Button onClick={handleCancel} disabled={createdSuccessfully}>
        {cancelButtonText}
      </Button>
    );

    return [CancelButton, OkButton];
  }, [customerID, okButtonText, cancelButtonText, createdSuccessfully, handleCancel, handleOK]);

  return (
    <div>
      <Modal
        visible={createTicketModalVisibility}
        title="Create Ticket"
        onCancel={resetModal}
        width={'80%'}
        footer={footer}
      >
        {modalContent}
      </Modal>
    </div>
  );
}
