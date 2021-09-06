import { EditOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, Select, SelectProps, Spin, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { get, isEmpty, isNil } from 'lodash/fp';
import { FieldData } from 'rc-field-form/lib/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { undefinableParseInt } from '../../../utils/number';
import { validateProductInput } from './helpers';
import { ProductFormStyled } from './styles';

export interface ProductInputFormProps {
  title: string;
  handleSubmitForm: (input: ProductInputFormData) => any;
  validationStatuses: object;
  validationHelpers: object;
  handleFieldChanges?: (changedFields: FieldData[], allFields: FieldData[]) => any;
  initData?: ProductInputFormData;
}

export interface ProductInputFormData {
  alert_quantity?: string;
  product_code?: string;
  product_cost?: string;
  product_detail?: string;
  product_name?: string;
  product_price?: string;
  product_tax?: string;
  product_type?: string;
  product_unit?: string;
  quantity?: string;
  tax_method?: string;
}

export interface ProductInputFormattedData {
  product_type?: string;
  product_name?: string;
  product_code?: string;
  alert_quantity?: number;
  quantity?: number;
  product_tax?: string;
  tax_method?: string;
  product_unit?: number;
  product_cost?: number;
  product_price?: number;
  product_detail?: string;
}

export function ProductInputForm(props: ProductInputFormProps) {
  const { title, handleSubmitForm, validationHelpers, validationStatuses, handleFieldChanges, initData } = props;
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNil(initData)) {
      return;
    }

    form.setFieldsValue(initData);
  }, []);

  useEffect(() => {
    // console.log(validationStatuses, validationHelpers);
  }, [validationStatuses, validationHelpers]);

  const onFormSubmit = useCallback(async () => {
    const formData = form.getFieldsValue() as ProductInputFormData;

    setLoading(true);
    await handleSubmitForm(formData);
    setLoading(false);
  }, [handleSubmitForm]);

  return (
    <div>
      <Spin spinning={loading} size={'large'}>
        <Form layout="vertical" form={form} onFieldsChange={handleFieldChanges}>
          <Typography.Title level={3}>{title}</Typography.Title>
          <ProductFormStyled>
            <Form.Item
              name="product_type"
              label="Product Type"
              validateStatus={get('product_type')(validationStatuses)}
              help={get('product_type')(validationHelpers)}
            >
              <ProductTypeOptionInput />
              {/* <Select placeholder="Please Choose a Type">
                <Select.Option value="Standard">Standard</Select.Option>
                <Select.Option value="Service">Service</Select.Option>
              </Select> */}
            </Form.Item>

            <Form.Item
              name="product_name"
              label="Product Name"
              validateStatus={get('product_name')(validationStatuses)}
              help={get('product_name')(validationHelpers)}
              rules={[{ required: true, message: '' }]}
            >
              <Input placeholder="Product Name" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              validateStatus={get('category')(validationStatuses)}
              help={get('category')(validationHelpers)}
            >
              <Input placeholder="Product Code" />
            </Form.Item>

            <Form.Item
              name="sub_category"
              label="Sub Category"
              validateStatus={get('sub_category')(validationStatuses)}
              help={get('sub_category')(validationHelpers)}
            >
              <Input placeholder="Product Code" />
            </Form.Item>

            <Form.Item
              name="model"
              label="Model"
              validateStatus={get('model')(validationStatuses)}
              help={get('model')(validationHelpers)}
            >
              <Input placeholder="Product Code" />
            </Form.Item>

            <Form.Item
              name="product_code"
              label="Product Code"
              validateStatus={get('product_code')(validationStatuses)}
              help={get('product_code')(validationHelpers)}
            >
              <Input placeholder="Product Code" />
            </Form.Item>

            <Form.Item
              name="alert_quantity"
              label="Alert Quantity"
              validateStatus={get('alert_quantity')(validationStatuses)}
              help={get('alert_quantity')(validationHelpers)}
            >
              <Input placeholder="Alert Quantity" />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Quantity"
              validateStatus={get('quantity')(validationStatuses)}
              help={get('quantity')(validationHelpers)}
            >
              <Input placeholder="Quantity" />
            </Form.Item>

            <Form.Item
              name="product_tax"
              label="Product Tax"
              validateStatus={get('product_tax')(validationStatuses)}
              help={get('product_tax')(validationHelpers)}
            >
              <Input placeholder="Product Tax" />
            </Form.Item>

            <Form.Item
              name="tax_method"
              label="Tax Method"
              validateStatus={get('tax_method')(validationStatuses)}
              help={get('tax_method')(validationHelpers)}
            >
              <TaxMethodInput />
            </Form.Item>

            <Form.Item
              name="product_unit"
              label="Product Unit"
              validateStatus={get('product_unit')(validationStatuses)}
              help={get('product_unit')(validationHelpers)}
            >
              <Input placeholder="Product Unit" />
            </Form.Item>

            <Form.Item
              name="product_cost"
              label="Product Cost"
              validateStatus={get('product_cost')(validationStatuses)}
              help={get('product_cost')(validationHelpers)}
            >
              <Input placeholder="Product Cost" />
            </Form.Item>

            <Form.Item
              name="product_price"
              label="Product Price"
              validateStatus={get('product_price')(validationStatuses)}
              help={get('product_price')(validationHelpers)}
            >
              <Input placeholder="Product Price" />
            </Form.Item>
          </ProductFormStyled>
          <Form.Item name="product_detail" label="Product Detail">
            <Input.TextArea autoSize={{ minRows: 8, maxRows: 8 }} placeholder="Product Detail" />
          </Form.Item>
          <div className="w-full flex justify-end">
            <Button type="primary" onClick={onFormSubmit}>
              Submit
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
}

export function ProductTypeOptionInput(props: SelectProps<any>) {
  return (
    <Select placeholder="Please Choose a Type" {...props}>
      <Select.Option value="Standard">Standard</Select.Option>
      <Select.Option value="Service">Service</Select.Option>
    </Select>
  );
}

export function TaxMethodInput(props: SelectProps<any>) {
  return (
    <Select placeholder="Please Choose a Method" {...props}>
      <Select.Option value="Inclusive">Inclusive</Select.Option>
      <Select.Option value="Exclusive">Exclusive</Select.Option>
    </Select>
  );
}
