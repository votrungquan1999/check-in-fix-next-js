import { Form, Input, Typography } from 'antd';
import { FormProps, useForm } from 'antd/lib/form/Form';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import { isNil } from 'lodash/fp';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NumberKeyboard from '../src/Components/NumberKeyboard';
import withAuth from '../src/firebase/withAuth';
import { Customer, getCustomers } from '../src/services/customers';
import { CustomSpinner } from '../src/styles/commons';
import {
  CustomerChosingBox,
  CustomPhoneNumberInputStyled,
  InnerChosingBox,
  PhoneNumberInputPageStyled,
} from '../src/styles/customers';
import {
  transformPhoneNumberToDisplay,
  trimExtraCharacterPhoneNumber,
  validatePhoneNumber,
} from '../src/utils/phoneNumber';

interface PhoneNumberInputFormProps {
  handleSubmitPhoneNumber: (value: string) => void;
}

interface CustomerChosingFormProps {
  customers: Customer[];
}

function PhoneNumberInputForm({ handleSubmitPhoneNumber }: PhoneNumberInputFormProps) {
  const [validationStatus, setValidationStatus] = useState<'error' | undefined>();
  const [isOk, setIsOk] = useState(false);

  const [form] = useForm();

  const checkPhoneNumberOK = useCallback((phoneNumber: string) => {
    setIsOk(!validatePhoneNumber(phoneNumber));
  }, []);

  const handleClickNumber = useCallback(
    (value: number) => {
      const phoneNumber = form.getFieldsValue()['phone'] ?? '';
      const newPhoneNumber = phoneNumber + value.toString();

      checkPhoneNumberOK(newPhoneNumber);

      form.setFieldsValue({ phone: transformPhoneNumberToDisplay(newPhoneNumber) });

      setValidationStatus(undefined);
    },
    [form],
  );

  const handleDeleteOneNumber = useCallback(() => {
    const phoneNumber = form.getFieldsValue()['phone'] ?? '';
    if (!phoneNumber.length) {
      return;
    }

    const newPhoneNumber = phoneNumber.substr(0, phoneNumber.length - 1);

    checkPhoneNumberOK(newPhoneNumber);

    form.setFieldsValue({ phone: transformPhoneNumberToDisplay(newPhoneNumber) });

    setValidationStatus(undefined);
  }, [form]);

  const handleClickSubmit = useCallback(() => {
    const phoneNumber = form.getFieldsValue()['phone'];
    if (isNil(phoneNumber)) {
      setValidationStatus('error');
      return;
    }

    const err = validatePhoneNumber(phoneNumber);
    if (err) {
      setValidationStatus(err);
      return;
    }

    handleSubmitPhoneNumber(trimExtraCharacterPhoneNumber(phoneNumber)!);
  }, [form]);

  const handleInputPhoneNumberByKeyboard: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const phoneNumber = e.target.value;

    checkPhoneNumberOK(phoneNumber);
  }, []);

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
          <CustomPhoneNumberInputStyled
            type={'text'}
            placeholder="Phone Number"
            allowClear
            onChange={handleInputPhoneNumberByKeyboard}
            className="text-center"
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
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="max-w-lg w-6/12 flex flex-col justify-center items-center border border-solid border-black py-7">
        <Title level={3}>Choose an account</Title>
        {customersInfo}
        {createAnotherAccount}
      </div>
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
