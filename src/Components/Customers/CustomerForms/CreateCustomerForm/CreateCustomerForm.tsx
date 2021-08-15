import { PhoneOutlined, EditOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Typography, Form, Input, Button, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { get, isEmpty } from 'lodash/fp';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { WithAuthProps } from '../../../../firebase/withAuth';
import { createCustomer, CreateCustomerInput, Customer } from '../../../../services/customers';
import { CustomResult, CustomSpinner } from '../../../../styles/commons';
import { CreateCustomerFormStyled } from './styles';
import { trimExtraCharacterPhoneNumber } from '../../../../utils/phoneNumber';
import { PhoneNumberInput } from '../../../input';
import { validateCreateCustomerForm } from './enhanced';
import { useEffect } from 'react';

interface CreateCustomerFormProps extends WithAuthProps {
  initPhoneNumber?: string;
  onCreateCustomerSuccessfully?: (customer: Customer) => any;
  triggerResetForm?: boolean;
}

export function CreateCustomerForm(props: CreateCustomerFormProps) {
  const { employee, user, initPhoneNumber, onCreateCustomerSuccessfully, triggerResetForm } = props;
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [createdCustomerSuccessfully, setCreatedCustomerSuccessfully] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    form.resetFields();
    setSubmitting(false);
    setValidationError({});
    setCreatedCustomerSuccessfully(false);
  }, [triggerResetForm]);

  const withLoading = useCallback((handler: () => any) => {
    return async () => {
      setSubmitting(true);
      await handler();
      setSubmitting(false);
    };
  }, []);

  const handleCreateCustomerSuccessfully = useCallback((customer: Customer) => {
    setCreatedCustomerSuccessfully(true);
    if (onCreateCustomerSuccessfully) {
      onCreateCustomerSuccessfully(customer);
    }
  }, []);

  const handleClickSubmit = useCallback(async () => {
    const value = form.getFieldsValue();

    const validationResult = await validateCreateCustomerForm(value);
    setValidationError(validationResult);

    console.log(validationResult);
    if (!isEmpty(validationResult)) {
      return;
    }

    const createCustomerInput: CreateCustomerInput = {
      first_name: value.first_name,
      last_name: value.last_name,
      phone_number: trimExtraCharacterPhoneNumber(value.phone_number) as string,
      subscriber_id: employee.subscriber_id,
      email: value.email,
    };

    const token = await user.getIdToken();
    const customer = await createCustomer(createCustomerInput, token);
    if (!customer) {
      return;
    }

    handleCreateCustomerSuccessfully(customer);
    // return router.push('/create-customer-successfully');
  }, [user, form, setValidationError, employee, onCreateCustomerSuccessfully, handleCreateCustomerSuccessfully]);

  const handleFieldChange = useCallback(() => {
    setValidationError({});
  }, []);

  if (createdCustomerSuccessfully) {
    return <CustomResult title="Create Customer Successfully" status="success" />;
  }

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Form
        form={form}
        className="flex flex-col items-start w-11/12"
        onValuesChange={handleFieldChange}
        layout="vertical"
      >
        <Typography.Title level={1}>Create New Customer</Typography.Title>

        <CreateCustomerFormStyled className="gap-x-10 w-full">
          <Form.Item
            name="phone_number"
            label="Phone Number"
            help={get('phone_number')(validationError)}
            validateStatus={get('phone_number')(validationError) ? 'error' : undefined}
            initialValue={initPhoneNumber}
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
            help={get('first_name')(validationError)}
            validateStatus={get('first_name')(validationError) ? 'error' : undefined}
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
            help={get('last_name')(validationError)}
            validateStatus={get('last_name')(validationError) ? 'error' : undefined}
            rules={[{ required: true }]}
          >
            <Input
              prefix={<EditOutlined className="site-form-item-icon" />}
              placeholder="Last Name"
              disabled={submitting}
            />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              disabled={submitting}
            />
          </Form.Item>

          {/* <Form.Item name="address_line_1">
              <Input prefix={<EnvironmentOutlined className="site-form-item-icon" />} placeholder="Address Line 1" />
            </Form.Item>
            <Form.Item name="city">
              <Input prefix={<EnvironmentOutlined className="site-form-item-icon" />} placeholder="City" />
            </Form.Item>
            <Form.Item name="state">
              <Input prefix={<EnvironmentOutlined className="site-form-item-icon" />} placeholder="State" />
            </Form.Item>
            <Form.Item name="country">
              <Input prefix={<EnvironmentOutlined className="site-form-item-icon" />} placeholder="Country" />
            </Form.Item>
            <Form.Item name="zip_code">
              <Input prefix={<EnvironmentOutlined className="site-form-item-icon" />} placeholder="Zipcode" />
            </Form.Item> */}
        </CreateCustomerFormStyled>
        <Form.Item>
          <Button className="w-full" type="primary" onClick={withLoading(handleClickSubmit)} loading={submitting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
