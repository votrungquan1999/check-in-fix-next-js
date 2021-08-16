import { PhoneOutlined, EditOutlined, MailOutlined } from '@ant-design/icons';
import { Typography, Form, Input, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { get, isNil } from 'lodash/fp';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { Customer } from '../../../services/customers';
import { CreateCustomerFormStyled } from './styles';
import { PhoneNumberInput } from '../../input';
import { useEffect } from 'react';
import { FieldData } from 'rc-field-form/lib/interface';

export interface CustomerInputData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
}

interface CreateCustomerFormProps {
  // initPhoneNumber?: string;
  // onCreateCustomerSuccessfully?: (customer: Customer) => any;
  // triggerResetForm?: boolean;
  title: string;
  customer?: Partial<Customer>;
  handleSubmit: (data: CustomerInputData) => any;
  handleFieldChanged?: (changedFields: FieldData[], allFields: FieldData[]) => any;
  validationStatuses?: object;
  validationHelpers?: object;
}

export function InputCustomerForm(props: CreateCustomerFormProps) {
  const { customer, handleSubmit, handleFieldChanged, validationHelpers, validationStatuses, title } = props;
  const [submitting, setSubmitting] = useState(false);
  // const [validationError, setValidationError] = useState({});
  // const [createdCustomerSuccessfully, setCreatedCustomerSuccessfully] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    if (!isNil(customer)) {
      form.setFieldsValue(customer);
    }
  }, [customer]);

  // useEffect(() => {
  //   form.resetFields();
  //   setSubmitting(false);
  //   setValidationError({});
  //   setCreatedCustomerSuccessfully(false);
  // }, [triggerResetForm]);

  // const withLoading = useCallback((handler: () => any) => {
  //   return async () => {
  //     setSubmitting(true);
  //     await handler();
  //     setSubmitting(false);
  //   };
  // }, []);

  // const handleCreateCustomerSuccessfully = useCallback((customer: Customer) => {
  //   // setCreatedCustomerSuccessfully(true);
  //   if (onCreateCustomerSuccessfully) {
  //     onCreateCustomerSuccessfully(customer);
  //   }
  // }, []);

  const handleClickSubmit = useCallback(async () => {
    const value = form.getFieldsValue();

    setSubmitting(true);
    await handleSubmit(value);
    setSubmitting(false);
    // const validationResult = await validateCreateCustomerForm(value);
    // setValidationError(validationResult);
    // console.log(validationResult);
    // if (!isEmpty(validationResult)) {
    //   return;
    // }
    // const createCustomerInput: CreateCustomerInput = {
    //   first_name: value.first_name,
    //   last_name: value.last_name,
    //   phone_number: trimExtraCharacterPhoneNumber(value.phone_number) as string,
    //   subscriber_id: employee.subscriber_id,
    //   email: value.email,
    // };
    // const token = await user.getIdToken();
    // const customer = await createCustomer(createCustomerInput, token);
    // if (!customer) {
    //   return;
    // }
    // handleCreateCustomerSuccessfully(customer);
    // return router.push('/create-customer-successfully');
  }, [form]);

  // const handleFieldChange = useCallback(() => {
  //   setValidationError({});
  // }, []);

  // if (createdCustomerSuccessfully) {
  //   return <CustomResult title="Create Customer Successfully" status="success" />;
  // }

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Form
        form={form}
        className="flex flex-col items-start w-11/12"
        onFieldsChange={handleFieldChanged}
        // onFieldsChange
        layout="vertical"
      >
        <Typography.Title level={1}>{title}</Typography.Title>

        <CreateCustomerFormStyled className="gap-x-10 w-full">
          <Form.Item
            name="phone_number"
            label="Phone Number"
            help={get('phone_number')(validationHelpers)}
            validateStatus={get('phone_number')(validationStatuses)}
            // initialValue={}
            rules={[{ required: true }]}
          >
            <PhoneNumberInput
              prefix={<PhoneOutlined className="site-form-item-icon" />}
              placeholder="Phone Number"
              disabled={submitting}
            />
          </Form.Item>

          <Form.Item
            name="first_name"
            label="First Name"
            help={get('first_name')(validationHelpers)}
            validateStatus={get('first_name')(validationStatuses)}
            rules={[{ required: true }]}
          >
            <Input
              prefix={<EditOutlined className="site-form-item-icon" />}
              placeholder="First Name"
              disabled={submitting}
            />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            help={get('last_name')(validationHelpers)}
            validateStatus={get('last_name')(validationStatuses)}
            rules={[{ required: true }]}
          >
            <Input
              prefix={<EditOutlined className="site-form-item-icon" />}
              placeholder="Last Name"
              disabled={submitting}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            help={get('email')(validationHelpers)}
            validateStatus={get('email')(validationStatuses)}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              disabled={submitting}
            />
          </Form.Item>
        </CreateCustomerFormStyled>
        <Form.Item>
          <Button className="w-full" type="primary" onClick={handleClickSubmit} loading={submitting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
