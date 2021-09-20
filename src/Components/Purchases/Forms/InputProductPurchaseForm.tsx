import { Button, Form, Input, Select, SelectProps } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useCallback, useEffect } from 'react';
import { ResponsiveFormStyled } from '../../../styles/commons';
// import { ProductPurchaseFormOutput } from '../Modals/AddPurchaseProductModal';

interface InputPurchaseProductFormProps {
  onSubmitProduct: (data: PurchaseProductFormOutput) => any;
}

interface ProductPurchaseFormData {
  unit_cost?: string;
  quantity?: string;
  discount?: string;
  tax_type: string;
}

export interface PurchaseProductFormOutput {
  unit_cost: number;
  quantity: number;
  discount: number;
  tax_type: string;
}

export function InputPurchaseProductForm(props: InputPurchaseProductFormProps) {
  const { onSubmitProduct } = props;
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      discount: 0,
      quantity: 0,
      tax_type: 'no_tax',
      unit_cost: 0,
    });
  }, []);

  const handleSubmitForm = useCallback(() => {
    const formData = form.getFieldsValue() as ProductPurchaseFormData;

    const output: PurchaseProductFormOutput = {
      discount: formData.discount ? parseFloat(formData.discount) : 0,
      quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
      tax_type: formData.tax_type,
      unit_cost: formData.unit_cost ? parseFloat(formData.unit_cost) : 0,
    };

    onSubmitProduct(output);
  }, [onSubmitProduct]);

  return (
    <div>
      <Form form={form}>
        <ResponsiveFormStyled>
          {/* <Form.Item name={'product_code'} label="Product Code">
              <Input />
            </Form.Item> */}
          <Form.Item name={'unit_cost'} label="Unit Cost">
            <Input />
          </Form.Item>
          <Form.Item name={'quantity'} label="Quantity">
            <Input />
          </Form.Item>
          <Form.Item name={'discount'} label="Discount">
            <Input />
          </Form.Item>
          <Form.Item name={'tax_type'} label="Tax Type">
            <SelectTaxInput />
          </Form.Item>
          {/* <Form.Item name={'sub_total'} label="Sub Total">
              <Input disabled />
            </Form.Item> */}
        </ResponsiveFormStyled>
        <Form.Item>
          <Button onClick={handleSubmitForm}>Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

function SelectTaxInput(props: SelectProps<any>) {
  return (
    <Select {...props}>
      <Select.Option value="sale_tax">Sales Tax</Select.Option>
      <Select.Option value="no_tax">No Tax</Select.Option>
    </Select>
  );
}
