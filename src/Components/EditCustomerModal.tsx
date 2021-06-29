import { Form, FormInstance, Input, Modal } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ModalContentContainerStyled } from '../styles/Components/CustomerDetailModal';
import firebase from 'firebase';
import { PhoneOutlined, EditOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Customer, updateCustomer } from '../services/customers';
import { CustomResult, CustomSpinner } from '../styles/commons';
import { get, isNil } from 'lodash/fp';
import { PhoneNumberInput } from './input';
import { trimExtraCharacterPhoneNumber, validatePhoneNumber } from '../utils/phoneNumber';

interface CustomerDetailModalProps {
  // visibility: boolean;
  customer?: Customer;
  user: firebase.User;
  finishUpdateCustomer: () => any;
}

export function EditCustomerModal(props: CustomerDetailModalProps) {
  const { customer, user, finishUpdateCustomer } = props;
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
      phone_number: trimExtraCharacterPhoneNumber(customer.phone_number),
      contact_phone_number: trimExtraCharacterPhoneNumber(customer.contact_phone_number),
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      address_line_1: customer.address_line_1,
      city: customer.city,
      state: customer.state,
      country: customer.country,
    });
  }, [customer]);

  const handleOneFieldChanges = useCallback(
    (key: keyof Customer, value: string) => {
      if (!customer) {
        return;
      }
      console.log(key, typeof value, value.length);

      let [formValue, initValue] = getInitValueAndFormValue(customer, value, key);

      const newValidationStatuses = validateFormValues(formValue, initValue, key, validationStatuses);

      let isEdited = false;
      for (const currentValue of Object.values(newValidationStatuses)) {
        if (currentValue) {
          isEdited = true;
          break;
        }
      }

      console.log('get here');
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
    }

    if (!customer || updating) {
      return (
        <ModalContentContainerStyled>
          <CustomSpinner />;
        </ModalContentContainerStyled>
      );
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
        lg: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
        lg: { span: 19 },
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
            help={get('phone_number')(validationStatuses) === 'error' ? 'Invalid Phone Number' : undefined}
            validateStatus={get('phone_number')(validationStatuses) as 'warning' | undefined}
          >
            <PhoneNumberInput
              placeholder="Phone Number"
              defaultValue={customer.phone_number}
              prefix={<PhoneOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item
            name="contact_phone_number"
            label="Contact Phone Number"
            help={get('phone_number')(validationStatuses) ? 'Invalid Phone Number' : undefined}
            validateStatus={get('contact_phone_number')(validationStatuses) as 'warning' | undefined}
          >
            <PhoneNumberInput
              placeholder="Phone Number"
              defaultValue={customer.contact_phone_number}
              prefix={<PhoneOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item
            validateStatus={get('first_name')(validationStatuses) as 'warning' | undefined}
            name="first_name"
            label="First Name"
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
  }, [customer, validationStatuses, updating, isUpdatedSuccessfully, form]);

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
    async function handleOkAsync() {
      if (!customer) {
        return;
      }

      if (Object.values(validationStatuses).includes('error')) {
        return;
      }

      setUpdating(true);

      const updateCustomerInput = getUpdateCustomerInput(form);

      const { token } = await user.getIdTokenResult();
      const newCustomer = await updateCustomer(customer.id, updateCustomerInput, token);

      if (!newCustomer) {
        setUpdating(false);
        return;
      }

      resetModal();
    }

    handleOkAsync();
  }, [form, user, customer, validationStatuses]);

  return (
    <Modal
      title="Edit Customer"
      visible={!!customer}
      onOk={handleOK}
      okButtonProps={{ disabled: !isCustomerEdited }}
      onCancel={resetModal}
      width={'80%'}
    >
      {modalContent}
    </Modal>
  );
}

function getInitValueAndFormValue(customerData: Customer, value: string, key: keyof Customer) {
  let formValue = isNil(value) ? '' : value;

  if (key === 'phone_number' || key === 'contact_phone_number') {
    formValue = trimExtraCharacterPhoneNumber(formValue) as string;
  }

  const initValue = customerData[key] ?? '';
  return [formValue, initValue];
}

function validateFormValues(formValue: string, initValue: string, key: keyof Customer, validationStatuses: object) {
  let validationStatus = formValue === initValue ? undefined : 'warning';

  if (key === 'phone_number' || key === 'contact_phone_number') {
    const validatePhoneNumberResult = validatePhoneNumber(formValue);
    if (validatePhoneNumberResult) {
      validationStatus = validatePhoneNumberResult;
    }
  }

  const newValidationStatuses = {
    ...validationStatuses,
    [key]: validationStatus,
  };

  return newValidationStatuses;
}

function getUpdateCustomerInput(form: FormInstance) {
  const updateCustomerInput = form.getFieldsValue() as Partial<Customer>;

  updateCustomerInput.phone_number = updateCustomerInput.phone_number
    ? trimExtraCharacterPhoneNumber(updateCustomerInput.phone_number)
    : updateCustomerInput.phone_number;

  updateCustomerInput.contact_phone_number = updateCustomerInput.contact_phone_number
    ? trimExtraCharacterPhoneNumber(updateCustomerInput.contact_phone_number)
    : updateCustomerInput.contact_phone_number;

  return updateCustomerInput;
}
