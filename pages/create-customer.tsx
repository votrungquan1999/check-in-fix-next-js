import { Typography, Form, Input, Button, Spin } from 'antd';
import { PhoneOutlined, EditOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import withAuth from '../src/firebase/withAuth';
import { CreateCustomerFormStyled, CreateCustomerPageStyled } from '../src/styles/create-customer';
import { createCustomer, CreateCustomerInput } from '../src/services/customers';
import { useRouter } from 'next/router';
import { PhoneNumberInput } from '../src/Components/input';
import {
  transformPhoneNumberToDisplay,
  trimExtraCharacterPhoneNumber,
  validatePhoneNumber,
} from '../src/utils/phoneNumber';
import React, { useState } from 'react';
import { get, isArray, isEmpty, isNil } from 'lodash/fp';
import { useCallback } from 'react';
import { useMemo } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { CustomSpinner } from '../src/styles/commons';

const requiredFields = ['first_name', 'last_name', 'phone_number'] as const;

export default withAuth(function CreateCustomer(props) {
  const { user } = props;

  const router = useRouter();
  const [form] = useForm();
  const subscriberID = props.employee.subscriber_id;
  const [customValidationErrors, setCustomValidationErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const phoneNumber = useMemo(() => {
    const rawPhoneNumber = router.query['phone_number'];

    if (isArray(rawPhoneNumber)) {
      return;
    }

    return transformPhoneNumberToDisplay(rawPhoneNumber);
  }, []);

  const validateRequiredField = useCallback((value: any) => {
    function isFieldEmpty(value: string | undefined) {
      if (isNil(value)) {
        return true;
      }

      if (!value.length) {
        return true;
      }

      return false;
    }

    return isFieldEmpty(value) ? 'This field is required' : undefined;
  }, []);

  const validateFieldsValue = useCallback(() => {
    const fieldsvalue = form.getFieldsValue();

    let validationErrors = {};

    for (const key of requiredFields) {
      const value = get(key)(fieldsvalue);
      const validationResult = validateRequiredField(value);
      if (validationResult) {
        validationErrors = {
          ...validationErrors,
          [key]: validationResult,
        };
      }
    }

    const phoneNumber = trimExtraCharacterPhoneNumber(get('phone_number')(fieldsvalue));
    const validatePhoneNumberResult = validatePhoneNumber(phoneNumber);

    if (validatePhoneNumberResult) {
      validationErrors = {
        ...validationErrors,
        phone_number: 'Invalid Phone Number',
      };
    }

    return validationErrors;
  }, [form, validateRequiredField]);

  const withLoading = useCallback((handler: () => any) => {
    return async () => {
      setSubmitting(true);
      await handler();
      setSubmitting(false);
    };
  }, []);

  const handleClickSubmit = useCallback(async () => {
    setSubmitting(true);
    const value = form.getFieldsValue();

    const validationResult = validateFieldsValue();
    setCustomValidationErrors(validationResult);

    if (!isEmpty(validationResult)) {
      console.log(validationResult);
      return;
    }

    const createCustomerInput: CreateCustomerInput = {
      first_name: value.first_name,
      last_name: value.last_name,
      phone_number: trimExtraCharacterPhoneNumber(value.phone_number) as string,
      subscriber_id: subscriberID,
      email: value.email,
      address_line_1: value.address_line_1,
      city: value.city,
      state: value.state,
      country: value.country,
      zip_code: value.zip_code,
    };

    console.log('here', value);

    const token = await user.getIdToken();
    const customer = await createCustomer(createCustomerInput, token);
    if (!customer) {
      return;
    }

    // router.push(`/customers/${customer.id}/create-ticket`);
    router.push('/create-customer-successfully');
  }, [user, form, setCustomValidationErrors]);

  return (
    <CustomSpinner spinning={submitting}>
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <Typography.Title level={2}>Create New Customer</Typography.Title>
        <Form
          form={form}
          style={{
            width: '70%',
          }}
          onValuesChange={() => {
            setCustomValidationErrors({});
          }}
        >
          <CreateCustomerFormStyled className="gap-x-10">
            <Form.Item
              name="phone_number"
              help={get('phone_number')(customValidationErrors)}
              validateStatus={get('phone_number')(customValidationErrors) ? 'error' : undefined}
              initialValue={phoneNumber}
            >
              <PhoneNumberInput prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Number" />
            </Form.Item>

            <Form.Item
              name="first_name"
              help={get('first_name')(customValidationErrors)}
              validateStatus={get('first_name')(customValidationErrors) ? 'error' : undefined}
            >
              <Input prefix={<EditOutlined className="site-form-item-icon" />} placeholder="First Name" />
            </Form.Item>

            <Form.Item
              name="last_name"
              help={get('last_name')(customValidationErrors)}
              validateStatus={get('last_name')(customValidationErrors) ? 'error' : undefined}
            >
              <Input prefix={<EditOutlined className="site-form-item-icon" />} placeholder="Last Name" />
            </Form.Item>

            <Form.Item name="email">
              <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>
            <Form.Item name="address_line_1">
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
            </Form.Item>
            <Form.Item>
              <Button className="w-full" type="primary" onClick={withLoading(handleClickSubmit)}>
                Submit
              </Button>
            </Form.Item>
          </CreateCustomerFormStyled>
        </Form>
      </div>
    </CustomSpinner>
  );
});
