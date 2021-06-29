import { PhoneOutlined } from '@ant-design/icons';
import { Form, Input, Spin, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import { isNil } from 'lodash/fp';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NumberKeyboard from '../src/Components/NumberKeyboard';
import withAuth, { WithAuthProps } from '../src/firebase/withAuth';
import { Customer, getCustomers } from '../src/services/customers';
import { CenterContainner, CustomSpinner } from '../src/styles/commons';
import {
  CustomerChosingBox,
  customerChosingPageStyles,
  InnerChosingBox,
  phoneNumberFormStyles,
  PhoneNumberInputPageStyled,
  StyledCustomerChosingForm,
} from '../src/styles/customers';
import { transformPhoneNumberToDisplay } from '../src/utils/phoneNumber';

interface PhoneNumberInputFormProps {
  handleSubmitPhoneNumber: (value: string) => void;
}

interface CustomerChosingFormProps {
  customers: Customer[];
}

function PhoneNumberInputForm({ handleSubmitPhoneNumber }: PhoneNumberInputFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationStatus, setValidationStatus] = useState<'error' | undefined>();
  const [isOk, setIsOk] = useState(false);

  const [form] = useForm();

  const handleClickNumber = useCallback(
    (value: number) => {
      const newPhoneNumber = phoneNumber + value.toString();
      setPhoneNumber(newPhoneNumber);

      if (newPhoneNumber.length !== 10) {
        setIsOk(false);
      } else {
        setIsOk(true);
      }

      form.setFieldsValue({ phone: transformPhoneNumberToDisplay(newPhoneNumber) });

      setValidationStatus(undefined);
    },
    [phoneNumber],
  );

  const handleDeleteOneNumber = useCallback(() => {
    if (!phoneNumber.length) {
      return;
    }

    const newPhoneNumber = phoneNumber.substr(0, phoneNumber.length - 1);
    setPhoneNumber(newPhoneNumber);

    if (newPhoneNumber.length !== 10) {
      setIsOk(false);
    } else {
      setIsOk(true);
    }

    form.setFieldsValue({ phone: transformPhoneNumberToDisplay(newPhoneNumber) });

    setValidationStatus(undefined);
  }, [phoneNumber]);

  const handleClickSubmit = useCallback(() => {
    if (phoneNumber.length !== 10) {
      setValidationStatus('error');
      return;
    }

    handleSubmitPhoneNumber(phoneNumber);
  }, [phoneNumber]);

  return (
    <PhoneNumberInputPageStyled className="h-screen w-screen flex items-center justify-center">
      <Form className="flex flex-col" form={form}>
        <Typography.Title level={3} type={'secondary'}>
          Please enter your phone number
        </Typography.Title>

        <Form.Item
          name="phone"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
          validateStatus={validationStatus}
          help={validationStatus ? 'Phone Number is invalid' : undefined}
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

        <NumberKeyboard
          handleClickNumber={handleClickNumber}
          handleOK={handleClickSubmit}
          isOK={isOk}
          handleDelete={handleDeleteOneNumber}
        />
      </Form>
    </PhoneNumberInputPageStyled>
  );
}

function CustomerChosingForm({ customers }: CustomerChosingFormProps) {
  const router = useRouter();

  const customersInfo = useMemo(() => {
    return customers.map((customer) => {
      const handleClick = () => {
        // router.push(`/customers/${customer.id}/create-ticket`);
        router.push(`/pick-customer-successfully`);
      };

      return (
        <CustomerChosingBox onClick={handleClick}>
          <InnerChosingBox>
            <Title level={5}>
              {customer.first_name.toUpperCase()} {customer.last_name.toUpperCase()}
            </Title>
            <Text type={'secondary'}>{customer.email}</Text>
          </InnerChosingBox>
        </CustomerChosingBox>
      );
    });
  }, [customers]);

  const createAnotherAccount = useMemo(() => {
    const handleClick = () => {
      const phoneNumber = router.query['phone_number'];

      if (isNil(phoneNumber) || typeof phoneNumber !== 'string') {
        return;
      }

      router.push(`/create-customer&phone_number=${phoneNumber}`);
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
  }, [router]);

  return (
    <div style={customerChosingPageStyles}>
      <StyledCustomerChosingForm>
        <Title level={3}>Choose an account</Title>
        {customersInfo}
        {createAnotherAccount}
      </StyledCustomerChosingForm>
    </div>
  );
}

export default withAuth(function Customers(props) {
  const router = useRouter();
  const { user, employee } = props;
  const [customers, setCustomers] = useState<Customer[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const phoneNumber = router.query['phone_number'];
    const getAndSetCustomers = async () => {
      if (!phoneNumber || typeof phoneNumber !== 'string') {
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();
      const customers = await getCustomers(employee.subscriber_id, token, phoneNumber);

      if (customers === undefined) {
        return;
      }

      if (!customers.length) {
        router.push(`/create-customer?phone_number=${phoneNumber}`);
        return;
      }

      setCustomers(customers);
      setLoading(false);
    };

    getAndSetCustomers();
  }, [router]);

  const handleSubmitPhoneNumber = useCallback(async (phoneNumber: string) => {
    setLoading(true);
    router.push('?phone_number=' + phoneNumber);
  }, []);

  return loading ? (
    <div className="h-screen w-screen">
      <CustomSpinner />
    </div>
  ) : !customers ? (
    <PhoneNumberInputForm handleSubmitPhoneNumber={handleSubmitPhoneNumber} />
  ) : (
    <CustomerChosingForm customers={customers} />
  );
});
