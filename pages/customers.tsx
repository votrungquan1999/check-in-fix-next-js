import { PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { phoneNumberFormStyles, phoneNumberInputPageStyles } from '../src/styles/customers';

export default function Customers() {
  const handleSubmitPhoneNumber = () => {};

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
