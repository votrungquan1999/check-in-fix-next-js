import { Form, Input, Modal, Result } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ModalContentContainerStyled } from '../styles/Components/CustomerDetailModal';
import firebase from 'firebase';
import { PhoneOutlined, EditOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Customer, updateCustomer } from '../services/customers';
import { CustomResult, CustomSpinner } from '../styles/commons';
import { get, isUndefined, omit, omitBy } from 'lodash/fp';
import { useRouter } from 'next/router';

interface CustomerDetailModalProps {
  // visibility: boolean;
  customer?: Customer;
  user: firebase.User;
  setCustomer: React.Dispatch<React.SetStateAction<Customer | undefined>>;
  finishUpdateCustomer: () => any;
}

export function EditCustomerModal(props: CustomerDetailModalProps) {
  const { customer, setCustomer, user, finishUpdateCustomer } = props;
  const [form] = Form.useForm();
  const [validationStatuses, setValidationStatuses] = useState({});
  const [isCustomerEdited, setIsCustomerEdited] = useState<boolean>(false);
  const [updating, setUpdating] = useState(false);
  const [isUpdatedSuccessfully, setIsUpdatedSuccessfully] = useState<boolean>();

  useEffect(() => {
    if (!customer) {
      return;
    }

    form.setFieldsValue({
      phone_number: customer.phone_number,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      address_line_1: customer.address_line_1,
      city: customer.city,
      state: customer.state,
      country: customer.country,
    });
  }, []);

  const handleOneFieldChanges = useCallback(
    (key: keyof Customer, value: string) => {
      console.log(key);
      if (!customer) {
        return;
      }

      const formValue = value ?? '';
      const initValue = customer[key] ?? '';

      console.log(formValue, initValue);

      const newValidationStatuses = {
        ...validationStatuses,
        [key]: formValue === initValue ? undefined : 'warning',
      };

      // console.log(newValidationStatuses);
      let isEdited = false;
      for (const currentValue of Object.values(newValidationStatuses)) {
        if (currentValue) {
          isEdited = true;
          break;
        }
      }

      setIsCustomerEdited(isEdited);
      setValidationStatuses(newValidationStatuses);
    },
    [validationStatuses, form, customer],
  );

  const modalContent = useMemo(() => {
    if (isUpdatedSuccessfully) {
      return (
        <ModalContentContainerStyled>
          <CustomResult status="success" title="Update Customer Successfully" />;
        </ModalContentContainerStyled>
      );
      return <Result status="success" title="Update Customer Successfully" />;
    }

    if (!customer || updating) {
      return (
        <ModalContentContainerStyled>
          <CustomSpinner />;
        </ModalContentContainerStyled>
      );
      return <CustomSpinner />;
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };

    return (
      <div>
        <Form
          {...formItemLayout}
          form={form}
          onValuesChange={(changedValues: any, values: any) => {
            handleOneFieldChanges(
              Object.keys(changedValues)[0] as keyof Customer,
              changedValues[Object.keys(changedValues)[0]],
            );
          }}
        >
          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[{ required: true, message: 'Input Phone Number' }]}
            validateStatus={get('phone_number')(validationStatuses) as 'warning' | undefined}
          >
            <Input
              placeholder="Phone Number"
              defaultValue={customer.phone_number}
              prefix={<PhoneOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item
            validateStatus={get('first_name')(validationStatuses) as 'warning' | undefined}
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: 'Input First Name' }]}
          >
            <Input
              placeholder="First Name"
              defaultValue={customer.first_name}
              prefix={<EditOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item
            validateStatus={get('last_name')(validationStatuses) as 'warning' | undefined}
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: 'Input Last Name' }]}
          >
            <Input
              placeholder="Last Name"
              defaultValue={customer.last_name}
              prefix={<EditOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item
            validateStatus={get('email')(validationStatuses) as 'warning' | undefined}
            label="Email"
            name="email"
          >
            <Input
              defaultValue={customer.email}
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            validateStatus={get('address_line_1')(validationStatuses) as 'warning' | undefined}
            label="Address Line 1"
            name="address_line_1"
          >
            <Input
              defaultValue={customer.address_line_1}
              prefix={<EnvironmentOutlined className="site-form-item-icon" />}
              placeholder="Address Line 1"
            />
          </Form.Item>

          <Form.Item validateStatus={get('city')(validationStatuses) as 'warning' | undefined} label="City" name="city">
            <Input
              placeholder="City"
              defaultValue={customer.city}
              prefix={<EnvironmentOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item
            validateStatus={get('state')(validationStatuses) as 'warning' | undefined}
            label="State"
            name="state"
          >
            <Input
              placeholder="State"
              defaultValue={customer.state}
              prefix={<EnvironmentOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item
            validateStatus={get('country')(validationStatuses) as 'warning' | undefined}
            label="Country"
            name="country"
          >
            <Input
              placeholder="Country"
              defaultValue={customer.country}
              prefix={<EnvironmentOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
        </Form>
      </div>
    );
  }, [customer, validationStatuses, updating, isUpdatedSuccessfully]);

  const resetModal = useCallback(() => {
    // setCustomer(undefined);
    form.resetFields();
    setIsCustomerEdited(false);
    setValidationStatuses({});
    setUpdating(false);
    setIsUpdatedSuccessfully(false);
    finishUpdateCustomer();
  }, []);

  const handleOK = useCallback(() => {
    console.log(isUpdatedSuccessfully);
    if (isUpdatedSuccessfully) {
      console.log('here');
      resetModal();
      return;
    }

    async function handleOkAsync() {
      console.log(customer);
      if (!customer) {
        return;
      }

      setUpdating(true);
      console.log(form.getFieldsValue());
      const updateCustomerInput = form.getFieldsValue();
      const { token } = await user.getIdTokenResult();
      const newCustomer = await updateCustomer(customer.id, updateCustomerInput, token);

      setUpdating(false);
      if (!newCustomer) {
        return;
      }

      setIsUpdatedSuccessfully(true);
    }

    handleOkAsync();
  }, [form, isUpdatedSuccessfully, user, customer]);

  return (
    <Modal
      title="Edit Customer"
      visible={!!customer}
      onOk={handleOK}
      okButtonProps={{ disabled: !isCustomerEdited }}
      onCancel={resetModal}
      width={'80%'}
    >
      {/* <ModalContentContainerStyled style={{ position: 'relative' }}> */}
      {modalContent}
      {/* </ModalContentContainerStyled> */}
    </Modal>
  );
}

// function
