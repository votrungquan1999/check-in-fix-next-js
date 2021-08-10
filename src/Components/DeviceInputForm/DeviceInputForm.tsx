import { MobileOutlined, SettingOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { get } from 'lodash/fp';
import React from 'react';

interface DevicesInputFormProps {
  validationStatuses?: object;
  validationHelpers?: object;
}

export function DevicesInputForm(props: DevicesInputFormProps) {
  const { validationHelpers, validationStatuses } = props;

  return (
    <div className="w-full">
      <Typography.Title level={4}>Devices</Typography.Title>
      <Form.List name="devices">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => {
              return (
                <div key={key} className="flex flex-grow w-full gap-x-5">
                  <Form.Item
                    name={[name, 'service']}
                    label="Service"
                    className="w-full"
                    help={get(['devices', 'service'])(validationHelpers)}
                    validateStatus={get(['devices', name, 'service'])(validationStatuses)}
                  >
                    <Input prefix={<MobileOutlined className="site-form-item-icon" />} placeholder="Service" />
                  </Form.Item>

                  <Form.Item
                    name={[name, 'device_model']}
                    label="Device Model"
                    className="w-full"
                    help={get(['devices', 'device_model'])(validationHelpers)}
                    validateStatus={get(['devices', name, 'device_model'])(validationStatuses)}
                  >
                    <Input prefix={<SettingOutlined className="site-form-item-icon" />} placeholder="Device Model" />
                  </Form.Item>

                  <Form.Item
                    name={[name, 'imei']}
                    label="IMEI"
                    className="w-full"
                    help={get(['devices', 'imei'])(validationHelpers)}
                    validateStatus={get(['devices', name, 'imei'])(validationStatuses)}
                  >
                    <Input prefix={<SettingOutlined className="site-form-item-icon" />} placeholder="IMEI" />
                  </Form.Item>

                  <Form.Item
                    name={[name, 'is_device_power_on']}
                    valuePropName="checked"
                    help={get(['devices', 'is_device_power_on'])(validationHelpers)}
                    validateStatus={get(['devices', name, 'is_device_power_on'])(validationStatuses)}
                  >
                    <Checkbox>Device Still Power On</Checkbox>
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
