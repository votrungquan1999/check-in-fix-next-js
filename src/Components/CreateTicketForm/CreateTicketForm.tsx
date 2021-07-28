import { MinusCircleOutlined, MobileOutlined, PhoneOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Form, Input, Select, Spin, Typography } from 'antd';
import { FormProps, useForm } from 'antd/lib/form/Form';
// import { isEmpty, isUndefined } from 'lodash';
import { filter, get, isEmpty, isNil, isUndefined, negate } from 'lodash/fp';
import { Moment } from 'moment-timezone';
import React, { useCallback, useMemo, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { createTicket, CreateTicketInput, serviceMapping, Ticket } from '../../services/tickets';
import { PhoneNumberInput } from '../input';
import { validateForm } from './helper';
import { CreateTicketFormStyled } from './styles';

export interface CreateTicketForm {
  contact_phone_number?: string;
  description?: string;
  dropped_off_at?: Moment;
  pick_up_at?: Moment;
  sms_notification_enable?: boolean;
  devices?: CreateTicketFormDevice[];
}

interface CreateTicketFormDevice {
  is_device_power_on?: boolean;
  imei?: string;
  device_model?: string;
  service?: string;
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

      const devices = filter<CreateTicketFormDevice>((device) => {
        return !(
          isNil(device.device_model) &&
          isNil(device.imei) &&
          isNil(device.is_device_power_on) &&
          isNil(device.service)
        );
      })(fieldValues.devices);

      const createTicketInput: CreateTicketInput = {
        customer_id: customerID,
        description: fieldValues.description,
        contact_phone_number: fieldValues.contact_phone_number,
        sms_notification_enable: fieldValues.sms_notification_enable ?? false,
        dropped_off_at: fieldValues.dropped_off_at?.toISOString(),
        pick_up_at: fieldValues.pick_up_at?.toISOString(),
        devices: devices,
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

  const handleFieldChange = useCallback(() => {
    setValidationError({});
  }, []);

  return (
    <Spin spinning={loading} size="large">
      <div className="h-full flex items-center justify-center">
        <Form form={form} onFieldsChange={handleFieldChange} layout="vertical" className="w-11/12">
          <Typography.Title level={1}>Create New Ticket</Typography.Title>
          <CreateTicketFormStyled>
            <Form.Item name="dropped_off_at" label="Dropped off At">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item name="pick_up_at" label="Pick up At">
              <DatePicker className="w-full" />
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

            <Form.Item name="is_device_power_on" valuePropName="checked">
              <Checkbox>Device Still Power On</Checkbox>
            </Form.Item>
          </CreateTicketFormStyled>
          <Form.Item name="description" label="Customer Notes">
            <Input.TextArea placeholder="Add note" autoSize={{ minRows: 8, maxRows: 8 }} />
          </Form.Item>
          <DevicesInputForm />
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

function DevicesInputForm() {
  return (
    <div className="w-full">
      <Typography.Title level={4}>Devices</Typography.Title>
      <Form.List name="devices">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => {
              return (
                <div key={key} className="flex flex-grow w-full gap-x-5">
                  <Form.Item name={[name, 'service']} label="Service" className="w-full">
                    <Input prefix={<MobileOutlined className="site-form-item-icon" />} placeholder="Service" />
                  </Form.Item>

                  <Form.Item name={[name, 'device_model']} label="Device Model" className="w-full">
                    <Input prefix={<SettingOutlined className="site-form-item-icon" />} placeholder="Device Model" />
                  </Form.Item>

                  <Form.Item name={[name, 'imei']} label="IMEI" className="w-full">
                    <Input prefix={<SettingOutlined className="site-form-item-icon" />} placeholder="IMEI" />
                  </Form.Item>

                  <div className="flex items-center">
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                </div>
              );
            })}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
}
