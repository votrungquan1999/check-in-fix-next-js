import { Button, Modal, Spin, Typography } from 'antd';
import { any, isNil } from 'lodash/fp';
import { useCallback, useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { deleteTicket, Ticket } from '../../../services/tickets';
import { CustomSpinner } from '../../../styles/commons';

interface DeleteTicketModalProps extends WithAuthProps {
  ticket?: Ticket;
  finishDeleteTicket: (deleted: boolean) => any;
}

export function DeleteTicketModal(props: DeleteTicketModalProps) {
  const { ticket, finishDeleteTicket } = props;

  const handledeleteTicket = useCallback(() => {
    finishDeleteTicket(false);
  }, [finishDeleteTicket]);

  return (
    <Modal visible={!!ticket} title={'Delete Ticket'} footer={null} onCancel={handledeleteTicket}>
      <ModalContent {...props} />
    </Modal>
  );
}

function ModalContent(props: DeleteTicketModalProps) {
  const { ticket, user, finishDeleteTicket } = props;
  const [deleting, setDeleting] = useState(false);

  const withDeleting = useCallback((cb: () => any) => {
    return async () => {
      setDeleting(true);
      await cb();
      setDeleting(false);
    };
  }, []);

  const handleConfirmDeleteTicket = useCallback(async () => {
    if (isNil(ticket)) {
      return;
    }
    const { token } = await user.getIdTokenResult();

    const deletedTicket = await deleteTicket(ticket.id, token);
    if (isNil(deletedTicket)) {
      return;
    }

    finishDeleteTicket(true);
  }, [ticket, finishDeleteTicket, user]);

  if (isNil(ticket)) {
    return (
      <div>
        <CustomSpinner />
      </div>
    );
  }

  return (
    <Spin spinning={deleting}>
      <div>
        <Typography.Title level={3}>
          You are going to delete 1 ticket! This action can not be reverted!
        </Typography.Title>
        <Button onClick={withDeleting(handleConfirmDeleteTicket)}>Confirm</Button>
      </div>
    </Spin>
  );
}
