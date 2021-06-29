import { Button, Dropdown, Input, Menu, Modal } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { sendSMSToCustomers } from '../services/sendSMS';
import firebase from 'firebase';
import { DownOutlined } from '@ant-design/icons';
import { createReviewsByCustomerIDs, Review } from '../services/reviews';
import { indexBy } from 'lodash/fp';
import { Customer } from '../services/customers';

interface SendSMSModalProps {
  sendMessageModalVisibility: boolean;
  setSendMessageModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  // customerIDs: string[];
  customers: Customer[];
  user: firebase.User;
}

export function SendSMSToCustomerModal(props: SendSMSModalProps) {
  const { sendMessageModalVisibility, setSendMessageModalVisibility, user, customers } = props;
  const [SMSBody, setSMSBody] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  const resetModal = useCallback(() => {
    setSMSBody('');
    setSending(false);
    setSendMessageModalVisibility(false);
  }, []);

  const choosingSMSTemplateDropdown = useMemo(() => {
    type actionKeys = '1';

    const actions = {
      1: () => {
        setSMSBody('dear {first_name} {last_name}, please review at this url: {review_url}');
      },
    };

    const handleClickMenu = ({ key }: any) => {
      actions[key as actionKeys]();
    };

    const menu = (
      <Menu onClick={handleClickMenu}>
        <Menu.Item key="1">Review Template</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} disabled={sending}>
        <Button>
          Templates <DownOutlined />
        </Button>
      </Dropdown>
    );
  }, [sending]);

  const onSubmitSendingSMS = useCallback(async () => {
    setSending(true);
    const { token } = await user.getIdTokenResult();

    const customerIDs = customers.map((customer) => customer.id);

    const reviews = await createReviewsByCustomerIDs(customerIDs, token);
    console.log(reviews);
    const mapCustomerIDReview = indexBy<Review>('customer_id')(reviews);
    const mapIDCustomer = indexBy<Customer>('id')(customers);

    const failCustomers: Customer[] = [];

    for (const customerID of customerIDs) {
      const review = mapCustomerIDReview[customerID];
      const customer = mapIDCustomer[customerID];
      if (!customer) {
        return;
      }

      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

      let customSMSBody = SMSBody.replace('{review_url}', `${baseURL}/reviews/${review.id}`);
      customSMSBody = customSMSBody.replace('{first_name}', `${customer.first_name}`);
      customSMSBody = customSMSBody.replace('{last_name}', `${customer.last_name}`);
      console.log(customSMSBody);

      const isSuccessful = await sendSMSToCustomers([customerID], token, customSMSBody);
      if (!isSuccessful) {
        failCustomers.push(customer);
      }
    }

    if (!failCustomers.length) {
      alert('send SMS to customer successfully');
    } else {
      alert(`fail customers id: ${failCustomers.map((customer) => customer.id)}`);
    }

    resetModal();
  }, [user, SMSBody, customers]);

  const onCancelSendingSMS = useCallback(() => {
    resetModal();
  }, []);

  const handleSmsTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSMSBody(e.target.value);
  }, []);

  return (
    <Modal
      title="Send SMS"
      visible={sendMessageModalVisibility}
      onOk={onSubmitSendingSMS}
      okText="Send"
      onCancel={onCancelSendingSMS}
      confirmLoading={sending}
    >
      {choosingSMSTemplateDropdown}
      <Input.TextArea
        disabled={sending}
        placeholder="SMS Body"
        autoSize={{ minRows: 8, maxRows: 8 }}
        onChange={handleSmsTextChange}
        value={SMSBody}
      />
    </Modal>
  );
}
