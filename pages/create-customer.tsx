import { Typography, Form, Input, Button } from 'antd';
import { PhoneOutlined, EditOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import withAuth from '../src/firebase/withAuth';
import {
  CreateCustomerColumn,
  CreateCustomerForm,
  CreateCustomerInputContainer,
  CreateCustomerPage,
} from '../src/styles/create-customer';
import { createCustomer, CreateCustomerInput } from '../src/services/customers';
import { useRouter } from 'next/router';
import { PhoneNumberInput } from '../src/Components/input';
import { trimExtraCharacterPhoneNumber, validatePhoneNumber } from '../src/utils/phoneNumber';
import { useState } from 'react';
import { get } from 'lodash/fp';
import { useCallback } from 'react';

export default withAuth(function CreateCustomer(props) {
  const { user } = props;

  const router = useRouter();
  const subscriberID = props.employee.subscriber_id;
  const phoneNumber = router.query['phone_number'];
  const [customValidationErrors, setCustomValidationErrors] = useState({});
  const [draftValidationErrors, setDraftvalidationErrors] = useState({});

  const onFinish = useCallback(
    async (value: any) => {
      if (Object.values(draftValidationErrors).every((value) => value !== undefined)) {
        setCustomValidationErrors(draftValidationErrors);
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

      try {
        const token = await user.getIdToken();
        const customer = await createCustomer(createCustomerInput, token);
        if (!customer) {
          return;
        }

        router.push(`/customers/${customer.id}/create-ticket`);
      } catch (error) {
        alert(error.message);
      }
    },
    [user, draftValidationErrors],
  );

  const handleOneFieldChange = useCallback(
    (key: keyof CreateCustomerInput, value: string) => {
      // console.log()
      setCustomValidationErrors({});
      if (key !== 'phone_number') {
        return;
      }

      const phoneNumber = trimExtraCharacterPhoneNumber(value);
      const validationResult = validatePhoneNumber(phoneNumber);

      setDraftvalidationErrors({
        ...draftValidationErrors,
        [key]: validationResult,
      });
    },
    [draftValidationErrors],
  );

  return (
    <CreateCustomerPage>
      <Form
        onFinish={onFinish}
        onValuesChange={(changedValues: any) => {
          // console.log(changedValues);
          handleOneFieldChange(
            Object.keys(changedValues)[0] as keyof CreateCustomerInput,
            changedValues[Object.keys(changedValues)[0]],
          );
        }}
      >
        <CreateCustomerForm>
          <CreateCustomerInputContainer>
            <CreateCustomerColumn>
              <Typography.Title level={2}>Create New Customer</Typography.Title>
              <Form.Item
                name="phone_number"
                help={get('phone_number')(customValidationErrors) ? 'Invalid Phone Number' : undefined}
                validateStatus={get('phone_number')(customValidationErrors)}
              >
                <PhoneNumberInput
                  defaultValue={phoneNumber}
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
                  placeholder="Phone Number"
                />
              </Form.Item>

              <Form.Item name="first_name" rules={[{ required: true, message: 'Input First Name' }]}>
                <Input prefix={<EditOutlined className="site-form-item-icon" />} placeholder="First Name" />
              </Form.Item>

              <Form.Item name="last_name" rules={[{ required: true, message: 'Input Last Name' }]}>
                <Input prefix={<EditOutlined className="site-form-item-icon" />} placeholder="Last Name" />
              </Form.Item>

              <Form.Item name="email">
                <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
              </Form.Item>
            </CreateCustomerColumn>

            <CreateCustomerColumn>
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
            </CreateCustomerColumn>
          </CreateCustomerInputContainer>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </CreateCustomerForm>
      </Form>
    </CreateCustomerPage>
  );
});
