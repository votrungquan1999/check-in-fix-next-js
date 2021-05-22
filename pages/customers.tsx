import { PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';

import { useRouter } from 'next/router';
import { useState } from 'react';
import NumberKeyboard from '../src/Components/NumberKeyboard';
import withAuth from '../src/firebase/withAuth';
import { Customer, getCustomers } from '../src/services/customers';
import {
  CustomerChosingBox,
  customerChosingPageStyles,
  InnerChosingBox,
  phoneNumberFormStyles,
  phoneNumberInputPageStyles,
  StyledCustomerChosingForm,
} from '../src/styles/customers';

interface PhoneNumberInputResult {
  phone: string;
}

interface PhoneNumberInputFormProps {
  handleSubmitPhoneNumber: (value: any) => void;
}

interface CustomerChosingFormProps {
  customers: Customer[];
}

function PhoneNumberInputForm({ handleSubmitPhoneNumber }: PhoneNumberInputFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const [form] = useForm();

  const handleClickNumber = (value: number) => {
    const newPhoneNumber = phoneNumber + value.toString();

    setPhoneNumber(newPhoneNumber);

    form.setFieldsValue({ phone: newPhoneNumber });
  };

  console.log(phoneNumber);

  return (
    <div style={phoneNumberInputPageStyles}>
      <Form onFinish={handleSubmitPhoneNumber} style={phoneNumberFormStyles} form={form}>
        <Typography.Title level={3} type={'secondary'}>
          Please enter your phone number
        </Typography.Title>

        <Form.Item
          name="phone"
          style={{ width: '100%' }}
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input
            type={'text'}
            prefix={<PhoneOutlined />}
            placeholder="Phone Number"
            size="large"
            disabled={true}
            allowClear
          />
        </Form.Item>

        <NumberKeyboard handleClickNumber={handleClickNumber} />

        <Form.Item style={{ width: '100%' }}>
          <Button type="primary" size="large" htmlType="submit" style={{ width: '100%' }}>
            Submit
          </Button>
          <Typography.Text style={{ fontSize: 20, float: 'right' }}>
            Or <a href="/create-customer">register now!</a>
          </Typography.Text>
        </Form.Item>
      </Form>
    </div>
  );
}

function CustomerChosingForm({ customers }: CustomerChosingFormProps) {
  const router = useRouter();

  const customersInfo = customers.map((customer) => {
    const handleClick = () => {
      router.push(`/customers/${customer.id}/create-ticket`);
    };

    return (
      // <div style={customerChosingFormStyles}>
      <CustomerChosingBox onClick={handleClick}>
        <InnerChosingBox>
          <Title level={5}>
            {customer.first_name.toUpperCase()} {customer.last_name.toUpperCase()}
          </Title>
          <Text type={'secondary'}>{customer.email}</Text>
        </InnerChosingBox>
      </CustomerChosingBox>
      // </div>
    );
  });

  const CreateAnotherAccount = () => {
    const handleClick = () => {
      router.push(`/create-customer`);
    };

    return (
      <CustomerChosingBox onClick={handleClick}>
        <InnerChosingBox>
          <Title level={5}>Create New Customer</Title>
          <Text type={'secondary'}>
            {`Above customer${customers.length > 1 ? 's' : undefined} ${customers.length > 1 ? 'are' : 'is'} not me`}
          </Text>
        </InnerChosingBox>
      </CustomerChosingBox>
    );
  };

  return (
    <div style={customerChosingPageStyles}>
      <StyledCustomerChosingForm>
        <Title level={3}>Choose an account</Title>
        {customersInfo}
        <CreateAnotherAccount />
      </StyledCustomerChosingForm>
    </div>
  );
}

export default withAuth(function Customers(props) {
  const { user, employee } = props;
  // console.log(props.user, props.employee, '------------');

  const [customers, setCustomers] = useState<Customer[]>();

  const handleSubmitPhoneNumber = async (input: PhoneNumberInputResult) => {
    const token = await user.getIdToken();
    const customers = await getCustomers(employee.subscriber_id, token, input.phone);
    console.log(customers);
    setCustomers(customers);
  };

  return !customers ? (
    <PhoneNumberInputForm handleSubmitPhoneNumber={handleSubmitPhoneNumber} />
  ) : (
    <CustomerChosingForm customers={customers} />
  );
});
