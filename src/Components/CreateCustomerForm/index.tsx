import { PhoneOutlined, EditOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Typography, Form, Input, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { get, isEmpty } from 'lodash/fp';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { createCustomer, CreateCustomerInput } from '../../services/customers';
import { CustomSpinner } from '../../styles/commons';
import { CreateCustomerFormStyled } from '../../styles/create-customer';
import { trimExtraCharacterPhoneNumber } from '../../utils/phoneNumber';
import { PhoneNumberInput } from '../input';
import { validateCreateCustomerForm } from './enhanced';

interface CreateCustomerFormProps extends WithAuthProps {
  initPhoneNumber?: string;
}

export function CreateCustomerForm(props: CreateCustomerFormProps) {
  const { employee, user, initPhoneNumber } = props;
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [form] = useForm();
  const router = useRouter();

  const withLoading = useCallback((handler: () => any) => {
    return async () => {
      setSubmitting(true);
      await handler();
      setSubmitting(false);
    };
  }, []);

  const handleClickSubmit = useCallback(async () => {
    const value = form.getFieldsValue();

    const validationResult = validateCreateCustomerForm(value);
    setValidationError(validationResult);

    if (!isEmpty(validationResult)) {
      console.log(validationResult);
      return;
    }

    const createCustomerInput: CreateCustomerInput = {
      first_name: value.first_name,
      last_name: value.last_name,
      phone_number: trimExtraCharacterPhoneNumber(value.phone_number) as string,
      subscriber_id: employee.subscriber_id,
      email: value.email,
      // address_line_1: value.address_line_1,
      // city: value.city,
      // state: value.state,
      // country: value.country,
      // zip_code: value.zip_code,
    };

    const token = await user.getIdToken();
    const customer = await createCustomer(createCustomerInput, token);
    if (!customer) {
      return;
    }

    return router.push('/create-customer-successfully');
  }, [user, form, setValidationError, employee]);

  return (
    <CustomSpinner spinning={submitting}>
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <Typography.Title level={2}>Create New Customer</Typography.Title>
        <Form
          form={form}
          className="md:w-9/12 flex flex-col items-center"
          onValuesChange={() => {
            setValidationError({});
          }}
        >
          <CreateCustomerFormStyled className="gap-x-10 w-full">
            <Form.Item
              name="phone_number"
              help={get('phone_number')(validationError)}
              validateStatus={get('phone_number')(validationError) ? 'error' : undefined}
              initialValue={initPhoneNumber}
            >
              <PhoneNumberInput prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Number" />
            </Form.Item>

            <Form.Item
              name="first_name"
              help={get('first_name')(validationError)}
              validateStatus={get('first_name')(validationError) ? 'error' : undefined}
            >
              <Input prefix={<EditOutlined className="site-form-item-icon" />} placeholder="First Name" />
            </Form.Item>

            <Form.Item
              name="last_name"
              help={get('last_name')(validationError)}
              validateStatus={get('last_name')(validationError) ? 'error' : undefined}
            >
              <Input prefix={<EditOutlined className="site-form-item-icon" />} placeholder="Last Name" />
            </Form.Item>

            <Form.Item name="email">
              <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
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
            <Button className="w-full" type="primary" onClick={withLoading(handleClickSubmit)}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </CustomSpinner>
  );
}
