import { Typography, Form, Input, Button } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  EditOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import withAuth from '../src/firebase/withAuth';
import {
  CreateCustomerColumn,
  CreateCustomerForm,
  CreateCustomerInputContainer,
  CreateCustomerPage,
} from '../src/styles/create-customer';
import { createCustomer } from '../src/services/customers';
import { useRouter } from 'next/router';

export default withAuth(function CreateCustomer(props) {
  const router = useRouter();
  const subscriberID = props.employee.subscriber_id;

  const onFinish = async (value: any) => {
    const token = await props.user.getIdToken();
    // create customer here
    try {
      const customer = await createCustomer(value, subscriberID, token);

      router.push(`/customers/${customer.id}/create-ticket`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <CreateCustomerPage>
      <Form onFinish={onFinish}>
        <CreateCustomerForm>
          <CreateCustomerInputContainer>
            <CreateCustomerColumn>
              <Typography.Title level={2}>Create New Customer</Typography.Title>
              <Form.Item name="phone_number" rules={[{ required: true, message: 'Input Phone Number' }]}>
                <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Number" />
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
