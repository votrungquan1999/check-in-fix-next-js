import { Form, Typography, Input, Button, Select, Checkbox, Spin } from 'antd';
import withAuth from '../../../src/firebase/withAuth';
import {
  CreateTicketColumn,
  CreateTicketContainer,
  CreateTicketInputFields,
  CreateTicketPage,
} from '../../../src/styles/create-tickets';
import { PhoneOutlined, EditOutlined, MailOutlined } from '@ant-design/icons';
import { createTicket, CreateTicketInput } from '../../../src/services/tickets';
import { useRouter } from 'next/router';

export default withAuth(function CreateTicket({ user, employee }) {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    alert(`internal server error can not get id or id has invalid type, id = ${id}`);
    return <Spin></Spin>;
  }

  const onFinish = async (value: any) => {
    console.log(value);
    const createTicketInput: CreateTicketInput = {
      customer_id: id,
      service_id: value.service_id,
      description: value.description,
      phone_type: value.phone_type,
      contact_phone_number: value.contact_phone_number,
      sms_notification_enable: value.sms_notification_enable ?? false,
    };

    const { token } = await user.getIdTokenResult();

    const ticket = await createTicket(createTicketInput, token);

    if (ticket) {
      // console.log(ticket);
      router.push(`/customers/${id}/create-ticket-successfully`);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <CreateTicketPage>
        <Typography.Title level={1}>Create New Ticket</Typography.Title>
        <CreateTicketContainer>
          <CreateTicketInputFields>
            <CreateTicketColumn>
              <Form.Item
                label="Service"
                name="service_id"
                rules={[{ required: true, message: 'Please pick a service' }]}
              >
                <Select>
                  <Select.Option value="1">Repair phone</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="phone_type" label="Phone Type">
                <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Type" />
              </Form.Item>

              <Form.Item
                name="contact_phone_number"
                label="Contact Phone Number"
                rules={[{ required: true, message: 'Input your contact number' }]}
              >
                <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Number" />
              </Form.Item>

              <Form.Item name="sms_notification_enable" valuePropName="checked">
                <Checkbox>SMS Notification</Checkbox>
              </Form.Item>
            </CreateTicketColumn>

            <CreateTicketColumn>
              <Form.Item name="description" label="Customer Notes">
                <Input.TextArea placeholder="Add note" autoSize={{ minRows: 8, maxRows: 8 }} />
              </Form.Item>
            </CreateTicketColumn>
          </CreateTicketInputFields>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </CreateTicketContainer>
      </CreateTicketPage>
    </Form>
  );
});
