import { FileAddOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select } from 'antd';
import { FormInstance, useForm } from 'antd/lib/form/Form';
import axios from 'axios';
import { get, isNil } from 'lodash/fp';
import React, { useCallback, useMemo, useState } from 'react';
import { WithAuthProps } from '../firebase/withAuth';
import { Customer, getCustomerDetailByID, searchCustomers } from '../services/customers';
import { CustomResult } from '../styles/commons';
import { useContinuousRequest } from '../utils/asyncReq';
import { transformPhoneNumberToDisplay } from '../utils/phoneNumber';
import { CreateCustomerModal } from './CreateCustomerModal/CreateCustomerModal';
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
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);
  const [isCreateCustomerModalVisible, setIsCreateCustomerModalVisible] = useState(false);

  const resetModal = useCallback(() => {
    form.resetFields();
    setCustomerID(undefined);
    setInputCustomerIDValidationError({});
    handleFinishCreateTicket();
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

  const handleClickCreateCustomer = useCallback(() => {
    setIsCreateCustomerModalVisible(true);
  }, []);

  const handleFinishCreateCustomer = useCallback(() => {
    setIsCreateCustomerModalVisible(false);
  }, []);

  const modalContent = useMemo(() => {
    if (isNil(customerID)) {
      return (
        <div className="flex w-full">
          <Button type="primary" className="flex items-center" onClick={() => handleClickCreateCustomer()}>
            <FileAddOutlined />
            Add New Customer
          </Button>
          <SearchCustomerForm
            setSelectedCustomer={(pickedCustomerID) => setCustomerID(pickedCustomerID)}
            employee={employee}
            user={user}
          />
        </div>
      );
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
  }, [customerID, inputCustomerIDValidationError, form, employee, user, createdSuccessfully]);

  const okButtonText = useMemo(() => {
    if (isNil(customerID)) {
      return 'Next';
    }

    return 'Done';
  }, [customerID]);

  const cancelButtonText = useMemo(() => {
    if (isNil(customerID)) {
      return 'Cancel';
    }

    return 'Back';
  }, [customerID]);

  const footer = useMemo(() => {
    const OkButton = customerID ? (
      <Button onClick={handleOK} type="primary" disabled={!createdSuccessfully}>
        {okButtonText}
      </Button>
    ) : undefined;

    const CancelButton = (
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
        <CreateCustomerModal
          employee={employee}
          user={user}
          isCreateCustomerModalVisible={isCreateCustomerModalVisible}
          finishCreateCustomer={handleFinishCreateCustomer}
        />
      </Modal>
    </div>
  );
}

interface SearchCustomerFormProps extends WithAuthProps {
  setSelectedCustomer: (customerID: string) => any;
}

function SearchCustomerForm(props: SearchCustomerFormProps) {
  const { employee, user, setSelectedCustomer } = props;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const continuousReq = useContinuousRequest();

  const handleSearchKeyChange = useCallback(
    async (value) => {
      const { token } = await user.getIdTokenResult();

      const newReqID = continuousReq.getNewestID();

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      continuousReq.addReq(newReqID, source);

      const customerList = await searchCustomers(employee.subscriber_id, token, value, source);

      const isLatestData = continuousReq.processReqResponse(newReqID);
      if (isLatestData) {
        setCustomers(customerList);
      }
    },
    [user, employee, continuousReq],
  );

  const options = useMemo(() => {
    return customers.map((customer) => {
      const phoneNumber = transformPhoneNumberToDisplay(customer.phone_number);

      return (
        <Select.Option value={customer.id} key={customer.id}>
          <div>
            <div className="text-lg">
              {customer.first_name} {customer.last_name}
            </div>
            <div className="text-sm text-gray-400">{phoneNumber}</div>
          </div>
        </Select.Option>
      );
    });
  }, [customers]);

  const handleSelectCustomer = useCallback((customerID: string) => {
    setSelectedCustomer(customerID);
  }, []);

  return (
    <div className="w-full">
      <Select
        className="w-full"
        placeholder={'Enter Search Key Here'}
        showSearch
        filterOption={false}
        onSearch={handleSearchKeyChange}
        onSelect={handleSelectCustomer}
      >
        {options}
      </Select>
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
  }, [setCreatedSuccessfully]);

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
