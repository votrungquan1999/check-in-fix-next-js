import { PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
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
  return (
    <div style={phoneNumberInputPageStyles}>
      <Form onFinish={handleSubmitPhoneNumber} style={phoneNumberFormStyles}>
        <Typography.Title level={3} type={'secondary'}>
          Please enter your phone number
        </Typography.Title>

        <Form.Item name="phone" rules={[{ required: true, message: 'Please input your phone number!' }]}>
          <Input
            type={'number'}
            style={{ width: '100%' }}
            prefix={<PhoneOutlined />}
            placeholder="Phone Number"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
            Submit
          </Button>
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
    const customers = await getCustomers(input.phone, employee.subscriber_id, token);
    console.log(customers);
    setCustomers(customers);
  };

  return !customers ? (
    <PhoneNumberInputForm handleSubmitPhoneNumber={handleSubmitPhoneNumber} />
  ) : (
    <CustomerChosingForm customers={customers} />
  );
});
