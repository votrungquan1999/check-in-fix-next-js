import { PhoneOutlined } from '@ant-design/icons';
import { Form, Input, InputProps } from 'antd';
import React, { Component, ComponentType, useEffect, useState } from 'react';
import { transformPhoneNumberToDisplay } from '../utils/phoneNumber';

export interface FormTextInputProps {
  name: string;
  requireMessage?: string;
  prefixIcon: ComponentType<{ className: string }>;
  label: string;
}

export function FormTextInput(props: FormTextInputProps) {
  return (
    <Form.Item name="phone_number" rules={[{ required: true, message: 'Input Phone Number' }]} label={props.label}>
      <Input prefix={<props.prefixIcon className="site-form-item-icon" />} placeholder="Phone Number" />
    </Form.Item>
  );
}

export function PhoneNumberInput(props: InputProps) {
  const { value } = props;
  const [displayValue, setDisplayValue] = useState<string>();

  useEffect(() => {
    if (!value || typeof value !== 'string') {
      return;
    }

    const formatedValue = transformPhoneNumberToDisplay(value);
    setDisplayValue(formatedValue);
  }, [value]);

  return <Input {...props} value={displayValue} />;
}
