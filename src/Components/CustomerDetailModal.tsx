import { Button, Dropdown, Input, Menu, Modal, Spin, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { sendSMSToCustomers } from '../services/sendSMS';
import firebase from 'firebase';
import { Customer, getCustomersByIDs } from '../services/customers';
import { getTicketsByCustomerID, Ticket } from '../services/tickets';
import { CustomSpinner, CenterContainner } from '../styles/commons';
import { TicketTable } from './TicketTable';
import { ModalContentContainerStyled } from '../styles/Components/CustomerDetailModal';
import { DetailTable } from './DetailTable';
import { EditCustomerModal } from './EditCustomerModal';
import { DownOutlined } from '@ant-design/icons';

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
  const [editCustomer, setEditCustomer] = useState<Customer>();

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
        return;
      }
      setCustomer(customer);

      const tickets = await getTicketsByCustomerID(customerID, token);

      setTickets(tickets);
    }

    getCustomerAndTickets();
  }, [customerID, user, subscriber_id]);

  const handleFinishUpdateCustomer = useCallback(async () => {
    setEditCustomer(undefined);
    setCustomer(undefined);
    if (!customerID) {
      return;
    }

    const { token } = await user.getIdTokenResult();

    const [customer] = await getCustomersByIDs(token, [customerID]);
    if (!customer) {
      alert('get customer detail error, please try again or contact tech support!');
      return;
    }
    setCustomer(customer);
  }, [customerID, user, subscriber_id]);

  const resetModal = useCallback(() => {
    setDetailCustomerID(undefined);
  }, []);

  const onCancel = useCallback(() => {
    resetModal();
  }, []);

  const customerDetailActions = useMemo(() => {
    type actionKeys = '1';

    const actions = {
      1: () => {
        console.log(customer);
        setEditCustomer(customer);
      },
    };

    const handleClickMenu = ({ key }: any) => {
      actions[key as actionKeys]();
    };

    const menu = (
      <Menu onClick={handleClickMenu}>
        <Menu.Item key="1">Edit Customer</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu}>
        <Button>
          Actions <DownOutlined />
        </Button>
      </Dropdown>
    );
  }, [customer]);

  const modalContent = useMemo(() => {
    return customer && tickets ? (
      <div>
        {customerDetailActions}
        <div>
          <DetailTable
            data={customer}
            fields={['id', 'first_name', 'phone_number', 'last_name', 'email', 'contact_phone_number']}
          />
        </div>
        <TicketTable tickets={tickets} customers={[customer]} />
      </div>
    ) : (
      <ModalContentContainerStyled>
        <CustomSpinner />
      </ModalContentContainerStyled>
    );
  }, [customer, tickets]);

  return (
    <Modal title="Customer Detail" visible={!!customerID} onOk={resetModal} onCancel={resetModal} width={'80%'}>
      {/* <ModalContentContainerStyled style={{ position: 'relative' }}> */}
      {modalContent}
      {/* </ModalContentContainerStyled> */}
      <EditCustomerModal
        finishUpdateCustomer={handleFinishUpdateCustomer}
        setCustomer={setEditCustomer}
        customer={editCustomer}
        user={user}
      />
    </Modal>
  );
}
