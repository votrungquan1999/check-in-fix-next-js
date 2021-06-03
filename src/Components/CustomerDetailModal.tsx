import { Input, Modal, Spin, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { sendSMSToCustomers } from '../services/sendSMS';
import firebase from 'firebase';
import { Customer, getCustomersByIDs } from '../services/customers';
import { getTicketsByCustomerID, Ticket } from '../services/tickets';
import { CustomSpinner, SpinningContainer } from '../styles/commons';
import { TicketTable } from './TicketTable';
import { ModalContentContainerStyled } from '../styles/Components/CustomerDetailModal';
import { DetailTable } from './DetailTable';

interface CustomerDetailModalProps {
  // visibility: boolean;
  customerID?: string;
  subscriber_id: string;
  user: firebase.User;
  setDetailCustomerID: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const { Paragraph } = Typography;

export function CustomerDetailModal(props: CustomerDetailModalProps) {
  const { customerID, user, subscriber_id, setDetailCustomerID } = props;
  const [customer, setCustomer] = useState<Customer>();
  const [tickets, setTickets] = useState<Ticket[]>();

  useEffect(() => {
    async function getCustomerAndTickets() {
      if (!customerID) {
        setCustomer(undefined);
        return;
      }

      const { token } = await user.getIdTokenResult();

      const [customer] = await getCustomersByIDs(token, [customerID]);
      if (!customer) {
        alert('get customer detail error, please try again or contact tech support!');
      }
      setCustomer(customer);

      const tickets = await getTicketsByCustomerID(customerID, token);

      setTickets(tickets);
    }

    getCustomerAndTickets();
  }, [customerID, user, subscriber_id]);

  const resetModal = useCallback(() => {
    setDetailCustomerID(undefined);
  }, []);

  const onCancel = useCallback(() => {
    resetModal();
  }, []);

  const modalContent = useMemo(() => {
    return customer && tickets ? (
      <div>
        <div>
          <DetailTable data={customer} fields={['id', 'first_name', 'phone_number']} />
        </div>
        <TicketTable tickets={tickets} customers={[customer]} />
      </div>
    ) : (
      <CustomSpinner />
    );
  }, [customer, tickets]);

  return (
    <Modal title="Customer Detail" visible={!!customerID} onOk={resetModal} onCancel={resetModal} width={'80%'}>
      <ModalContentContainerStyled style={{ position: 'relative' }}>{modalContent}</ModalContentContainerStyled>
    </Modal>
  );
}
