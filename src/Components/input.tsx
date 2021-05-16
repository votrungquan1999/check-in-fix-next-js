import { Form, Input } from 'antd';
import { Component, ComponentType } from 'react';

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
