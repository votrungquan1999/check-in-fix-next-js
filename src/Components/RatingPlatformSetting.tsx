import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, Menu, Modal, Select, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { WithAuthProps } from '../firebase/withAuth';
import { RatingPlatforms } from '../services/settings/ratingPlatforms';
import { RatingPlatformContainerStyled } from '../styles/Components/Layout/Settings';

interface RatingPlatformSettingProps extends WithAuthProps {
  ratingPlatforms: RatingPlatforms[];
}

export function RatingPlatformSetting(props: RatingPlatformSettingProps) {
  const { ratingPlatforms } = props;
  const [addModalVisible, setModalVisible] = useState(false);

  const RatingPlatformRows = useMemo(() => {
    const optionAfter = (
      <Menu>
        <Menu.Item key={1}>Edit</Menu.Item>
        <Menu.Item key={2}>Delete</Menu.Item>
      </Menu>
    );

    const optionDropdown = (
      <Dropdown overlay={optionAfter}>
        <div className="hover:cursor-pointer">Actions</div>
      </Dropdown>
    );

    return ratingPlatforms.map((platform) => {
      return (
        <>
          <div className="px-3 flex items-center border bg-white">{platform.name.toUpperCase()}</div>
          <Input size="large" disabled addonAfter={optionDropdown} value={platform.url} />
        </>
      );
    });
  }, [ratingPlatforms]);

  const handleClickAdd = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleFinishAdding = useCallback(() => {
    setModalVisible(false);
  }, []);

  return (
    <div className="h-full border border-black">
      <div className="border-b border-black flex items-center justify-between">
        <Typography.Title level={2} className="ml-3 mb-0">
          Rating Platforms
        </Typography.Title>

        <Button
          onClick={handleClickAdd}
          type="primary"
          icon={<PlusOutlined />}
          className="flex items-center justify-center mr-3"
        ></Button>
      </div>
      <RatingPlatformContainerStyled>{RatingPlatformRows}</RatingPlatformContainerStyled>
      <AddRatingPlatformModal handleFinishAdding={handleFinishAdding} addModalVisible={addModalVisible} />
    </div>
  );
}

interface AddRatingPlatformProps {
  addModalVisible: boolean;
  handleFinishAdding: () => any;
}

interface AddRatingPlatformInput {
  platform: 0 | 1;
  url?: string;
}

function AddRatingPlatformModal(props: AddRatingPlatformProps) {
  const { addModalVisible, handleFinishAdding } = props;
  const [validationError, setValidationError] = useState<any>({});
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      platform: 0,
    });
  }, []);

  const resetModal = useCallback(() => {
    form.resetFields();
    handleFinishAdding();
  }, [handleFinishAdding]);

  const handleClickOK = useCallback(() => {
    const values = form.getFieldsValue();
    console.log(values);
  }, [form]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
      md: { span: 3 },
      lg: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19 },
      md: { span: 21 },
      lg: { span: 22 },
    },
  };

  return (
    <Modal
      title="Add New Rating Platform"
      visible={addModalVisible}
      onOk={handleClickOK}
      onCancel={resetModal}
      width={'80%'}
    >
      <div>
        <Form {...formItemLayout} form={form}>
          <Form.Item name="platform" label="Platform">
            <Select defaultActiveFirstOption>
              <Select.Option value={0}>Facebook</Select.Option>
              <Select.Option value={1}>Google</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="url" label="URL">
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
