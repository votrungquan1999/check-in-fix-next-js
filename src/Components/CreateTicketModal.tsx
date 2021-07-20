import { Form, Input, Modal } from 'antd';
import { FormInstance, useForm } from 'antd/lib/form/Form';
import { get, isNil } from 'lodash/fp';
import React from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { WithAuthProps } from '../firebase/withAuth';
import { getCustomerDetailByID } from '../services/customers';
import { ModalContentContainerStyled } from '../styles/commonModal';
import { CustomResult, CustomSpinner } from '../styles/commons';
import { CreateTicketForm } from './CreateTicketForm/CreateTicketForm';

interface CreateTicketModalProps extends WithAuthProps {
  createTicketModalVisibility: boolean;
  handleFinishCreateTicket: () => any;
}

export function CreateTicketModal(props: CreateTicketModalProps) {
  const { createTicketModalVisibility, handleFinishCreateTicket, user, employee } = props;
  const [customerID, setCustomerID] = useState<string>();
  const [form] = useForm();
  const [inputCustomerIDValidationError, setInputCustomerIDValidationError] = useState({});
  const [loading, setLoading] = useState(false);
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  const setInvalidCustomerID = useCallback(() => {
    setInputCustomerIDValidationError({
      customer_id: 'Invalid Customer ID',
    });
  }, []);

  const handleInputCustomerID = useCallback(async () => {
    setLoading(true);
    const fieldValues = form.getFieldsValue();
    const customerIdInput = fieldValues.customer_id;
    if (isNil(customerIdInput)) {
      setInvalidCustomerID();
      setLoading(false);
      return;
    }

    const { token } = await user.getIdTokenResult();

    const customer = await getCustomerDetailByID(customerIdInput, token, false);
    if (isNil(customer)) {
      setInvalidCustomerID();
      setLoading(false);
      return;
    }

    setCustomerID(customerIdInput);
    setLoading(false);
  }, [setInvalidCustomerID, user]);

  const handleOK = useCallback(() => {
    if (isNil(customerID)) {
      return handleInputCustomerID();
    }

    handleFinishCreateTicket();
  }, [handleFinishCreateTicket, customerID, handleInputCustomerID]);

  const resetModal = useCallback(() => {
    form.resetFields();
    setLoading(false);
    setCustomerID(undefined);
    setInputCustomerIDValidationError({});
    handleFinishCreateTicket();
  }, [handleFinishCreateTicket]);

  const modalContent = useMemo(() => {
    if (isNil(customerID)) {
      return <GetCustomerIDForm form={form} validationError={inputCustomerIDValidationError} loading={loading} />;
    }

    return (
      <CreateTicketFormContent
        customerID={customerID}
        employee={employee}
        user={user}
        createdSuccessfully={createdSuccessfully}
        setCreatedSuccessfully={setCreatedSuccessfully}
      />
    );
  }, [customerID, inputCustomerIDValidationError, loading, form, employee, user, createdSuccessfully]);

  const okButtonText = useMemo(() => {
    if (isNil(customerID)) {
      return 'Next';
    }

    return 'Done';
  }, [customerID]);

  return (
    <div>
      <Modal
        visible={createTicketModalVisibility}
        title="Create Ticket"
        onOk={handleOK}
        okText={okButtonText}
        okButtonProps={{
          disabled: okButtonText === 'Done' && !createdSuccessfully,
        }}
        onCancel={resetModal}
        width={'80%'}
        confirmLoading={loading}
      >
        {modalContent}
      </Modal>
    </div>
  );
}

interface GetCustomerIDFormProps {
  form: FormInstance<any>;
  validationError: object;
  loading: boolean;
}

function GetCustomerIDForm({ form, validationError, loading }: GetCustomerIDFormProps) {
  return (
    <div>
      <Form form={form}>
        <Form.Item
          className="mb-0"
          name={'customer_id'}
          label={'Customer ID'}
          required
          help={get('customer_id')(validationError)}
          validateStatus={isNil(get('customer_id')(validationError)) ? undefined : 'error'}
        >
          <Input disabled={loading} />
        </Form.Item>
      </Form>
    </div>
  );
}

interface CreateTicketModalContentProps extends WithAuthProps {
  customerID: string;
  createdSuccessfully: boolean;
  setCreatedSuccessfully: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateTicketFormContent(props: CreateTicketModalContentProps) {
  const { customerID, employee, user, createdSuccessfully, setCreatedSuccessfully } = props;

  const handleCreateTicketSuccessfully = useCallback(() => {
    setCreatedSuccessfully(true);
  }, []);

  if (createdSuccessfully) {
    return <CustomResult status="success" title="Create Ticket Successfully" />;
  }

  return (
    <CreateTicketForm
      customerID={customerID}
      employee={employee}
      user={user}
      onCreateSuccessfully={handleCreateTicketSuccessfully}
    />
  );
}
