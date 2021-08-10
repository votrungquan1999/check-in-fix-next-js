import { PhoneOutlined } from '@ant-design/icons';
import { Spin, Typography, DatePicker, Checkbox, Input, Form, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { filter, get, isNil } from 'lodash/fp';
import React, { useCallback, useEffect, useState } from 'react';
import { DevicesInputForm } from '../../DeviceInputForm/DeviceInputForm';
import { PhoneNumberInput } from '../../input';
import { InputTicketFormData, InputTicketDeviceForm } from './commons';
import { CreateTicketFormStyled } from './styles';
import { FieldData } from 'rc-field-form/lib/interface';

export interface InputTicketDataProps {
  onSubmit: (data: InputTicketFormData) => any;
  initData?: InputTicketFormData;
  title: string;
  validationStatuses?: object;
  validationHelpers?: object;
  handleFieldChange?: (changedFields: FieldData[], allFields: FieldData[]) => any;
}

export function InputTicketData(props: InputTicketDataProps) {
  const { onSubmit, initData, title, validationStatuses, validationHelpers, handleFieldChange } = props;
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  useEffect(() => {
    if (isNil(initData)) {
      return;
    }

    const initFieldValue: InputTicketFormData = {
      contact_phone_number: initData.contact_phone_number,
      description: initData.description,
      devices: initData.devices,
      dropped_off_at: initData.dropped_off_at,
      pick_up_at: initData.pick_up_at,
      sms_notification_enable: initData.sms_notification_enable,
    };

    form.setFieldsValue(initFieldValue);
  }, [initData]);

  const handleSubmit = useCallback(
    async function handleSubmit() {
      const fieldValues = form.getFieldsValue() as InputTicketFormData;

      fieldValues.devices = filter<InputTicketDeviceForm>((device) => {
        return !(
          isNil(device.device_model) &&
          isNil(device.imei) &&
          isNil(device.is_device_power_on) &&
          isNil(device.service)
        );
      })(fieldValues.devices);

      await onSubmit(fieldValues);
    },
    [form],
  );

  const handleSubmitForm = useCallback(async () => {
    setLoading(true);
    await handleSubmit();
    setLoading(false);
  }, [form]);

  return (
    <Spin spinning={loading} size="large">
      <div className="h-full flex items-center justify-center">
        <Form form={form} onFieldsChange={handleFieldChange} layout="vertical" className="w-11/12">
          <Typography.Title level={1}>{title}</Typography.Title>
          <CreateTicketFormStyled>
            <Form.Item
              name="dropped_off_at"
              label="Dropped off At"
              help={get('dropped_off_at')(validationHelpers)}
              validateStatus={get('dropped_off_at')(validationStatuses)}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="pick_up_at"
              label="Pick up At"
              help={get('pick_up_at')(validationHelpers)}
              validateStatus={get('pick_up_at')(validationStatuses)}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              help={get('contact_phone_number')(validationHelpers)}
              validateStatus={get('contact_phone_number')(validationStatuses)}
              name="contact_phone_number"
              label="Contact Phone Number"
            >
              <PhoneNumberInput
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                placeholder="Contact Phone Number"
              />
            </Form.Item>

            <Form.Item
              name="sms_notification_enable"
              valuePropName="checked"
              help={get('sms_notification_enable')(validationHelpers)}
              validateStatus={get('sms_notification_enable')(validationStatuses)}
            >
              <Checkbox>SMS Notification</Checkbox>
            </Form.Item>
          </CreateTicketFormStyled>
          <Form.Item
            name="description"
            label="Customer Notes"
            help={get('description')(validationHelpers)}
            validateStatus={get('description')(validationStatuses)}
          >
            <Input.TextArea placeholder="Add note" autoSize={{ minRows: 8, maxRows: 8 }} />
          </Form.Item>
          <DevicesInputForm validationHelpers={validationHelpers} validationStatuses={validationStatuses} />
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
