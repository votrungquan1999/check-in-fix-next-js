import { MobileOutlined, PhoneOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Select, Spin, Typography } from 'antd';
import { FormProps, useForm } from 'antd/lib/form/Form';
import { get } from 'lodash/fp';
import React, { useCallback, useMemo, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { createTicket, CreateTicketInput, serviceMapping, Ticket } from '../../services/tickets';
import { PhoneNumberInput } from '../input';
import { validateForm } from './helper';
import { CreateTicketFormStyled } from './styles';

export interface CreateTicketForm {
  contact_phone_number?: string;
  description?: string;
  device_model?: string;
  imei?: string;
  service_id?: string;
  service?: string;
  sms_notification_enable?: boolean;
}

interface CreateTicketFormProps extends WithAuthProps {
  customerID: string;
  onCreateSuccessfully?: (ticket: Ticket) => any;
  onCreateFailed?: () => any;
}

export function CreateTicketForm(props: CreateTicketFormProps) {
  const { user, customerID, onCreateFailed, onCreateSuccessfully } = props;
  const [validationError, setValidationError] = useState<object>();
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  const handleSubmitForm = useCallback(async () => {
    async function handleSubmit() {
      const fieldValues = form.getFieldsValue() as CreateTicketForm;

      const [newValidationError, hasError] = validateForm(fieldValues);

      setValidationError(newValidationError);
      if (hasError) {
        return;
      }

      const createTicketInput: CreateTicketInput = {
        customer_id: customerID,
        // service_id: fieldValues.service_id,
        service: fieldValues.service,
        description: fieldValues.description,
        device_model: fieldValues.device_model,
        contact_phone_number: fieldValues.contact_phone_number,
        sms_notification_enable: fieldValues.sms_notification_enable ?? false,
        imei: fieldValues.imei,
      };

      const { token } = await user.getIdTokenResult();

      const ticket = await createTicket(createTicketInput, token);
      if (!ticket) {
        if (onCreateFailed) {
          onCreateFailed();
        }
        return;
      }

      if (onCreateSuccessfully) {
        onCreateSuccessfully(ticket);
      }
    }

    setLoading(true);

    await handleSubmit();

    setLoading(false);
  }, [form]);

  // const serviceSelectForm = useMemo(() => {
  //   return (
  //     <Select>
  //       {Object.keys(serviceMapping).map((key) => {
  //         const serviceName = get(key)(serviceMapping);

  //         return (
  //           <Select.Option key={key} value={key}>
  //             {serviceName}
  //           </Select.Option>
  //         );
  //       })}
  //     </Select>
  //   );
  // }, []);

  const handleFieldChange = useCallback(() => {
    setValidationError({});
  }, []);

  return (
    <Spin spinning={loading} size="large">
      <div className="h-full flex items-center justify-center">
        <Form form={form} onFieldsChange={handleFieldChange} layout="vertical" className="w-11/12">
          <Typography.Title level={1}>Create New Ticket</Typography.Title>
          <CreateTicketFormStyled>
            {/* <Form.Item
              help={get('service_id')(validationError)}
              validateStatus={get('service_id')(validationError) ? 'error' : undefined}
              label="Service"
              name="service_id"
              rules={[{ required: true }]}
            >
              {serviceSelectForm}
            </Form.Item> */}

            <Form.Item name="service" label="Service">
              <Input prefix={<MobileOutlined className="site-form-item-icon" />} placeholder="Service" />
            </Form.Item>

            <Form.Item name="device_model" label="Device Model">
              <Input prefix={<SettingOutlined className="site-form-item-icon" />} placeholder="Device Model" />
            </Form.Item>

            <Form.Item name="imei" label="IMEI">
              <Input prefix={<SettingOutlined className="site-form-item-icon" />} placeholder="IMEI" />
            </Form.Item>

            <Form.Item
              help={get('contact_phone_number')(validationError)}
              validateStatus={get('contact_phone_number')(validationError) ? 'error' : undefined}
              name="contact_phone_number"
              label="Contact Phone Number"
            >
              <PhoneNumberInput
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                placeholder="Contact Phone Number"
              />
            </Form.Item>

            <Form.Item name="sms_notification_enable" valuePropName="checked">
              <Checkbox>SMS Notification</Checkbox>
            </Form.Item>
          </CreateTicketFormStyled>
          <Form.Item name="description" label="Customer Notes">
            <Input.TextArea placeholder="Add note" autoSize={{ minRows: 8, maxRows: 8 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSubmitForm}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
}
