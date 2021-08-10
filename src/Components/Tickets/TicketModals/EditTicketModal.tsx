import { Modal, Spin } from 'antd';
import React, { useCallback } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { Ticket } from '../../../services/tickets';
import { EditTicketForm } from '../TicketForms/EditTicketForm';

interface EditTicketModalProps extends WithAuthProps {
  editTicket?: Ticket;
  finishEditTicket: (edited: boolean) => any;
}

export function EditTicketModal(props: EditTicketModalProps) {
  const { editTicket, finishEditTicket } = props;

  const resetModal = useCallback(() => {
    finishEditTicket(false);
  }, [finishEditTicket]);

  return (
    <div>
      <Modal
        visible={!!editTicket}
        title="Edit Ticket"
        onCancel={resetModal}
        width={'80%'}
        destroyOnClose
        footer={null}
      >
        <EditTicketModalContent {...props} />
      </Modal>
    </div>
  );
}

function EditTicketModalContent(props: EditTicketModalProps) {
  const { editTicket, finishEditTicket, employee, user } = props;
  if (!editTicket) {
    return (
      <div>
        <Spin />
      </div>
    );
  }

  const handleUpdatedSucessfully = useCallback(() => {
    finishEditTicket(true);
  }, [finishEditTicket]);

  return (
    <EditTicketForm
      ticket={editTicket}
      employee={employee}
      user={user}
      onUpdateSucessfully={handleUpdatedSucessfully}
    />
  );
}
