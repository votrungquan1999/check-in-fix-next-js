import { Button, Dropdown, Menu, Modal } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import firebase from 'firebase';
import { Customer, getCustomerDetailByID } from '../../services/customers';
import {
  getTicketsByCustomerID,
  getTicketStatusesBySubscriberID,
  Ticket,
  TicketStatuses,
} from '../../services/tickets';
import { CustomSpinner } from '../../styles/commons';
import { TicketTable } from '../TicketTable/TicketTable';
import { DetailTable } from '../DetailTable';
import { EditCustomerModal } from '../EditCustomerModal';
import { DownOutlined } from '@ant-design/icons';
import { transformPhoneNumberToDisplay } from '../../utils/phoneNumber';
import { WithAuthProps } from '../../firebase/withAuth';
import { isNil } from 'lodash/fp';

interface CustomerDetailModalProps extends WithAuthProps {
  customerID?: string;
  subscriberID: string;
  setDetailCustomerID: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export function CustomerDetailModal(props: CustomerDetailModalProps) {
  const { customerID, user, setDetailCustomerID, employee } = props;
  const [customer, setCustomer] = useState<Customer>();
  const [tickets, setTickets] = useState<Ticket[]>();
  const [editCustomer, setEditCustomer] = useState<Customer>();
  const [ticketStatuses, setTicketStatuses] = useState<TicketStatuses[]>();

  useEffect(() => {
    async function getCustomerAndTickets() {
      if (!customerID) {
        setCustomer(undefined);
        return;
      }

      const { token } = await user.getIdTokenResult();

      const customer = await getCustomerDetailByID(customerID, token);
      if (!customer) {
        alert('get customer detail error, please try again or contact tech support!');
        return;
      }
      setCustomer(customer);

      const tickets = await getTicketsByCustomerID(customerID, token);

      setTickets(tickets);

      const subscriberTicketStatuses = await getTicketStatusesBySubscriberID(employee.subscriber_id, token);
      setTicketStatuses(subscriberTicketStatuses);
      console.log(subscriberTicketStatuses);
    }

    getCustomerAndTickets();
  }, [customerID, user, setTickets, setCustomer, employee]);

  const handleFinishUpdateCustomer = useCallback(async () => {
    setEditCustomer(undefined);
    setCustomer(undefined);

    if (!customerID) {
      return;
    }

    const { token } = await user.getIdTokenResult();

    const customer = await getCustomerDetailByID(customerID, token);
    if (!customer) {
      alert('get customer detail error, please try again or contact tech support!');
      return;
    }
    setCustomer(customer);
  }, [customerID, user, setEditCustomer, setCustomer]);

  const resetModal = useCallback(() => {
    setDetailCustomerID(undefined);
  }, []);

  const customerDetailActions = useMemo(() => {
    type actionKeys = '1';

    const actions = {
      1: () => {
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
    if (!customer || !tickets || !ticketStatuses) {
      return (
        <div className="w-6">
          <CustomSpinner />
        </div>
      );
    }

    const detailCustomer: Customer = {
      ...customer,
      phone_number: transformPhoneNumberToDisplay(customer.phone_number) as string,
      contact_phone_number: transformPhoneNumberToDisplay(customer.contact_phone_number),
    };

    return (
      <div>
        {customerDetailActions}
        <div>
          <DetailTable
            data={detailCustomer}
            fields={['id', 'first_name', 'phone_number', 'last_name', 'email', 'contact_phone_number']}
          />
        </div>
        <TicketTable tickets={tickets} customers={[customer]} ticketStatuses={ticketStatuses} />
      </div>
    );
  }, [customer, tickets, ticketStatuses]);

  return (
    <Modal title="Customer Detail" visible={!!customerID} onOk={resetModal} onCancel={resetModal} width={'80%'}>
      {modalContent}
      <EditCustomerModal finishUpdateCustomer={handleFinishUpdateCustomer} customer={editCustomer} user={user} />
    </Modal>
  );
}
