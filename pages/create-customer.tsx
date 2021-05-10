import { Typography, Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, EditOutlined, MailOutlined } from '@ant-design/icons';
import withAuth from '../src/firebase/withAuth';

export default withAuth(function CreateCustomer(props) {
  const onFinish = () => {
    // create customer here
  };

  // PhoneNumber;
  // FirstName;
  // LastName;
  // Email;

  return (
    <div>
      <Typography.Title level={1}>Login</Typography.Title>
      <Form onFinish={onFinish}>
        <Form.Item name="phone_number" rules={[{ required: true, message: 'Input Phone Number' }]}>
          <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Number" />
        </Form.Item>

        <Form.Item name="first_name" rules={[{ required: true, message: 'Input First Name' }]}>
          <Input prefix={<EditOutlined className="site-form-item-icon" />} placeholder="First Name" />
        </Form.Item>

        <Form.Item name="last_name" rules={[{ required: true, message: 'Input Last Name' }]}>
          <Input prefix={<EditOutlined className="site-form-item-icon" />} placeholder="Last Name" />
        </Form.Item>

        <Form.Item name="email" rules={[{ required: true, message: 'Input Email' }]}>
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});
