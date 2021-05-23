import { Input, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { sendSMSToCustomers } from '../services/sendSMS';
import firebase from 'firebase';

interface SendSMSModalProps {
  sendMessageModalVisibility: boolean;
  setSendMessageModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  customerIDs: string[];
  user: firebase.User;
}

export function SendSMSToCustomerModal(props: SendSMSModalProps) {
  const { sendMessageModalVisibility, setSendMessageModalVisibility, customerIDs, user } = props;
  const [SMSBody, setSMSBody] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  const resetModal = useCallback(() => {
    setSMSBody('');
    setSending(false);
    setSendMessageModalVisibility(false);
  }, []);

  const onSubmitSendingSMS = useCallback(async () => {
    const { token } = await user.getIdTokenResult();
    setSending(true);
    const isSuccessful = await sendSMSToCustomers(customerIDs, token, SMSBody);
    if (isSuccessful) {
      alert('send SMS to customer successfully');
    }

    resetModal();
  }, [user, SMSBody]);

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
